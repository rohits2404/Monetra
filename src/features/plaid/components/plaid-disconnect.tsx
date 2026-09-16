"use client";

import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteConnectedBank } from "../api/use-delete-connected-bank";
import { Button } from "@/components/ui/button";

export const PlaidDisconnect = () => {
    const [Dialog, confirm] = useConfirm(
        "Are You Sure?",
        "This Will Disconnect Your Bank Account, And Remove All Associated aata.",
    );
    const deleteConnectedBank = useDeleteConnectedBank();

    const onClick = async () => {
        const ok = await confirm();

        if (ok) {
            deleteConnectedBank.mutate();
        }
    };

    return (
        <>
            <Dialog />
            <Button
                onClick={onClick}
                disabled={deleteConnectedBank.isPending}
                size="sm"
                variant="ghost"
            >
                Disconnect
            </Button>
        </>
    );
};
