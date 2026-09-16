import { Transactions } from "@/features/transactions";
import { Suspense } from "react";

const TransactionPage = () => {
    return (
        <Suspense fallback={null}>
            <Transactions />
        </Suspense>
    );
};

export default TransactionPage;
