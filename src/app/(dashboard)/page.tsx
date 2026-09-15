import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async () => {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    return (
        <div>
            <UserButton />
        </div>
    );
};

export default DashboardPage;
