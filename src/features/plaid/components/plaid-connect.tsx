"use client";

import { useState } from "react";
import { useCreateLinkToken } from "../api/use-create-link-token";
import { useMount } from "react-use";
import { Button } from "@/components/ui/button";
import { useExchangePublicToken } from "../api/use-exchange-public-token";
import { usePlaidLink } from "react-plaid-link";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

export const PlaidConnect = () => {
    const [token, setToken] = useState<string | null>(null);

    const createLinkToken = useCreateLinkToken();
    const exchangePublicToken = useExchangePublicToken();

    const { shouldBlock, triggerPaywall, isLoading } = usePaywall();

    useMount(() => {
        createLinkToken.mutate(undefined, {
            onSuccess: ({ data }) => {
                setToken(data);
            },
        });
    });

    const plaid = usePlaidLink({
        token: token ?? "",
        onSuccess: (publicToken) => {
            if (!publicToken) return;

            exchangePublicToken.mutate({
                publicToken,
            });
        },
        env: "sandbox",
    });

    const onClick = () => {
        if (!token || !plaid.ready) return;

        if (shouldBlock) {
            triggerPaywall();
            return;
        }

        plaid.open();
    };

    const isDisabled =
        !token || !plaid.ready || exchangePublicToken.isPending || isLoading;

    return (
        <Button
            onClick={onClick}
            disabled={isDisabled}
            size="sm"
            variant="ghost"
        >
            Connect
        </Button>
    );
};
