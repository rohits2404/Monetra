"use client";

import { Button } from "@/components/ui/button";
import { useNewAccount } from "../accounts/hooks/use-new-account";

export const HomePage = () => {
    const { onOpen } = useNewAccount();

    return (
        <div>
            <Button onClick={onOpen}>Add an Account</Button>
        </div>
    );
};
