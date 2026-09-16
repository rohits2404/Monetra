import { db } from "@/drizzle/db";
import { subscriptions } from "@/drizzle/schema";
import { stripe } from "@/lib/stripe";
import { clerkMiddleware, getAuth } from "@clerk/hono";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { Stripe } from "stripe";

const app = new Hono()
    .get("/current", clerkMiddleware(), async (c) => {
        const auth = getAuth(c);

        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const [subscription] = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.userId, auth.userId));

        return c.json({ data: subscription || null });
    })

    .post("/checkout", clerkMiddleware(), async (c) => {
        const auth = getAuth(c);

        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const [existing] = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.userId, auth.userId));

        // User already has a Stripe subscription
        if (existing?.subscriptionId) {
            try {
                const subscription = await stripe.subscriptions.retrieve(
                    existing.subscriptionId,
                );

                const customerId = subscription.customer;

                if (typeof customerId !== "string") {
                    return c.json({ error: "Invalid customer" }, 500);
                }

                const portalSession =
                    await stripe.billingPortal.sessions.create({
                        customer: customerId,
                        return_url: `${process.env.NEXT_PUBLIC_APP_URL!}/`,
                    });

                return c.json({
                    data: portalSession.url,
                });
            } catch (error) {
                console.error("Stripe portal error:", error);

                return c.json(
                    { error: "Failed to create customer portal session" },
                    500,
                );
            }
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",

            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID!,
                    quantity: 1,
                },
            ],

            success_url: `${process.env.NEXT_PUBLIC_APP_URL!}/?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL!}/?canceled=true`,

            metadata: {
                userId: auth.userId,
            },

            subscription_data: {
                metadata: {
                    userId: auth.userId,
                },
            },
        });

        if (!session.url) {
            return c.json({ error: "Failed to create checkout session" }, 500);
        }

        return c.json({
            data: session.url,
        });
    })

    .post("/webhook", async (c) => {
        const signature = c.req.header("stripe-signature");

        if (!signature) {
            return c.json({ error: "Missing Stripe signature" }, 400);
        }

        const text = await c.req.text();

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                text,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!,
            );
        } catch (error) {
            console.error(
                "Stripe webhook signature verification failed:",
                error,
            );

            return c.json({ error: "Invalid webhook signature" }, 401);
        }

        switch (event.type) {
            /**
             * Checkout completed
             */
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                const userId = session.metadata?.userId;
                const subscriptionId =
                    typeof session.subscription === "string"
                        ? session.subscription
                        : session.subscription?.id;

                if (!userId || !subscriptionId) {
                    console.error("Missing userId or subscriptionId");
                    break;
                }

                const subscription =
                    await stripe.subscriptions.retrieve(subscriptionId);

                const status = subscription.status;

                const [existing] = await db
                    .select()
                    .from(subscriptions)
                    .where(eq(subscriptions.subscriptionId, subscriptionId));

                if (existing) {
                    await db
                        .update(subscriptions)
                        .set({
                            status,
                        })
                        .where(
                            eq(subscriptions.subscriptionId, subscriptionId),
                        );
                } else {
                    await db.insert(subscriptions).values({
                        id: createId(),
                        subscriptionId,
                        userId,
                        status,
                    });
                }

                break;
            }

            /**
             * Subscription created
             */
            case "customer.subscription.created": {
                const subscription = event.data.object as Stripe.Subscription;

                const userId = subscription.metadata?.userId;

                if (!userId) {
                    console.error("Missing userId in subscription metadata");
                    break;
                }

                const subscriptionId = subscription.id;
                const status = subscription.status;

                const [existing] = await db
                    .select()
                    .from(subscriptions)
                    .where(eq(subscriptions.subscriptionId, subscriptionId));

                if (existing) {
                    await db
                        .update(subscriptions)
                        .set({
                            status,
                        })
                        .where(
                            eq(subscriptions.subscriptionId, subscriptionId),
                        );
                } else {
                    await db.insert(subscriptions).values({
                        id: createId(),
                        subscriptionId,
                        userId,
                        status,
                    });
                }

                break;
            }

            /**
             * Subscription updated
             */
            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;

                const subscriptionId = subscription.id;
                const status = subscription.status;

                const [existing] = await db
                    .select()
                    .from(subscriptions)
                    .where(eq(subscriptions.subscriptionId, subscriptionId));

                if (existing) {
                    await db
                        .update(subscriptions)
                        .set({
                            status,
                        })
                        .where(
                            eq(subscriptions.subscriptionId, subscriptionId),
                        );
                }

                break;
            }

            /**
             * Subscription deleted/canceled
             */
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;

                await db
                    .update(subscriptions)
                    .set({
                        status: subscription.status,
                    })
                    .where(eq(subscriptions.subscriptionId, subscription.id));

                break;
            }

            default:
                console.log(`Unhandled Stripe event: ${event.type}`);
        }

        return c.json({ received: true }, 200);
    });

export default app;
