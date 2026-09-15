import { HomePage } from "@/features/home";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async () => {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    return <HomePage />;
};

export default DashboardPage;
