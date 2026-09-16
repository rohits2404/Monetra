"use client";

import { DataCharts } from "@/components/data-charts";
import { DataGrid } from "@/components/data-grid";
import { Suspense } from "react";

export const HomePage = () => {
    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Suspense fallback={null}>
                <DataGrid />
                <DataCharts />
            </Suspense>
        </div>
    );
};
