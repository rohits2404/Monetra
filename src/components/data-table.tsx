"use client";

import * as React from "react";
import { Trash } from "lucide-react";
import {
    ColumnDef,
    ColumnFiltersState,
    Row,
    RowData,
    SortingState,
    flexRender,
    useTable,
    tableFeatures,
    rowSortingFeature,
    columnFilteringFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    createSortedRowModel,
    createFilteredRowModel,
    createPaginatedRowModel,
    filterFn_includesString,
    sortFn_text,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { row_getVisibleCells } from "@tanstack/react-table/static-functions";
import { useConfirm } from "@/hooks/use-confirm";

const features = tableFeatures({
    rowSortingFeature,
    columnFilteringFeature,
    rowPaginationFeature,
    rowSelectionFeature,

    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),

    filterFns: {
        includesString: filterFn_includesString,
    },

    sortFns: {
        text: sortFn_text,
    },
});

export type DataTableFeatures = typeof features;

interface DataTableProps<TData extends RowData> {
    columns: ColumnDef<DataTableFeatures, TData, any>[];
    data: TData[];
    filterKey: string;
    onDelete: (rows: Row<DataTableFeatures, TData>[]) => void;
    disabled?: boolean;
}

export function DataTable<TData extends RowData>({
    columns,
    data,
    filterKey,
    onDelete,
    disabled,
}: DataTableProps<TData>) {
    const [ConfirmDialog, confirm] = useConfirm(
        "Are You Sure?",
        "You Are About To Perform a Bulk Delete.",
    );

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useTable({
        features,
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });

    console.log("Filter state:", columnFilters);
    console.log("Rows:", table.getRowModel().rows);

    return (
        <div>
            <ConfirmDialog />
            <div className="flex items-center py-4">
                <Input
                    placeholder={`Filter ${filterKey}...`}
                    value={
                        (table
                            .getColumn(filterKey)
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn(filterKey)
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <Button
                        disabled={disabled}
                        size="sm"
                        variant="outline"
                        className="ml-auto font-normal text-xs"
                        onClick={async () => {
                            const ok = await confirm();
                            if (ok) {
                                onDelete(
                                    table.getFilteredSelectedRowModel().rows,
                                );
                                table.resetRowSelection();
                            }
                        }}
                    >
                        <Trash className="size-4 mr-2" />
                        Delete (
                        {table.getFilteredSelectedRowModel().rows.length})
                    </Button>
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row_getVisibleCells(row).map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
