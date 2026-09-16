import { Accounts } from "@/features/accounts";
import React, { Suspense } from "react";

const AccountsPage = () => {
    return (
        <Suspense fallback={null}>
            <Accounts />
        </Suspense>
    );
};

export default AccountsPage;
