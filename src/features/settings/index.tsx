"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PlaidConnect } from "../plaid/components/plaid-connect";
import { useGetConnectedBank } from "../plaid/api/use-get-connected-bank";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { PlaidDisconnect } from "../plaid/components/plaid-disconnect";
import { useGetSubscription } from "../subscriptions/api/use-get-subscription";
import { SubscriptionCheckout } from "../subscriptions/components/subscription-checkout";

export const SettingsCard = () => {
    const { data: connectedBank, isLoading: isLoadingConnectedBank } =
        useGetConnectedBank();

    const { data: subscription, isLoading: isLoadingSubscription } =
        useGetSubscription();

    if (isLoadingConnectedBank || isLoadingSubscription) {
        return (
            <Card className="border-none drop-shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl line-clamp-1">
                        <Skeleton className="h-6 w-24" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-87.5 w-full flex items-center justify-center">
                        <Loader2 className="size-6 text-slate-300 animate-spin" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl line-clamp-1">Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <Separator />
                <div className="flex flex-col gap-y-2 lg:flex-row items-center py-4">
                    <p className="text-sm font-medium w-full lg:w-66">
                        Bank Account
                    </p>
                    <div className="w-full flex items-center justify-between">
                        <div
                            className={cn(
                                "text-sm truncate flex items-center",
                                !connectedBank && "text-muted-foreground",
                            )}
                        >
                            {connectedBank
                                ? "Bank Account Connected"
                                : "No Bank Account Connected"}
                        </div>
                        {connectedBank ? <PlaidDisconnect /> : <PlaidConnect />}
                    </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-y-2 lg:flex-row items-center py-4">
                    <p className="text-sm font-medium w-full lg:w-66">
                        Subscription
                    </p>
                    <div className="w-full flex items-center justify-between">
                        <div
                            className={cn(
                                "text-sm truncate flex items-center",
                                !subscription && "text-muted-foreground",
                            )}
                        >
                            {subscription
                                ? `Subscription ${subscription.status}`
                                : "No Subscription Active"}
                        </div>
                        <SubscriptionCheckout />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
