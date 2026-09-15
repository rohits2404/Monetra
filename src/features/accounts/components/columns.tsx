"use client";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableFeatures } from "@/components/data-table";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";

export type ResponseType = InferResponseType<
    typeof client.api.accounts.$get,
    200
>["data"][0];

export const columns: ColumnDef<DataTableFeatures, ResponseType, unknown>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
    },

    {
        accessorKey: "name",

        header: ({ column }) => (
            <Button
                variant="ghost"
                className="h-8 p-0 font-medium hover:bg-transparent"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Name
                <ArrowUpDown className="ml-2 size-4" />
            </Button>
        ),

        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },

    {
        accessorKey: "amount",

        header: () => <div className="text-right">Amount</div>,

        cell: ({ row }) => (
            <div className="text-right font-medium">
                {row.getValue("amount")}
            </div>
        ),
    },
];
