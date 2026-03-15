"use client";

import { Button } from "@/components/ui/button";

type PaginationControlsProps = {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages?: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
};

function getVisiblePages(currentPage: number, totalPages: number) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
        return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
}

export function PaginationControls({
    page,
    pageSize,
    totalItems,
    totalPages,
    onPageChange,
    isLoading = false,
}: PaginationControlsProps) {
    const safePageSize = Math.max(1, pageSize);
    const resolvedTotalPages = Math.max(
        1,
        typeof totalPages === "number" && Number.isFinite(totalPages)
            ? totalPages
            : Math.ceil(totalItems / safePageSize),
    );
    const currentPage = Math.min(Math.max(1, page), resolvedTotalPages);
    const visiblePages = getVisiblePages(currentPage, resolvedTotalPages);

    if (resolvedTotalPages <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
                Page {currentPage} of {resolvedTotalPages} • {totalItems} total
            </p>

            <div className="flex flex-wrap items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-auto"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={isLoading || currentPage <= 1}
                >
                    Previous
                </Button>

                {visiblePages.map((pageNumber) => (
                    <Button
                        key={pageNumber}
                        type="button"
                        size="sm"
                        className="w-auto"
                        variant={pageNumber === currentPage ? "default" : "outline"}
                        onClick={() => onPageChange(pageNumber)}
                        disabled={isLoading}
                    >
                        {pageNumber}
                    </Button>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-auto"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={isLoading || currentPage >= resolvedTotalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}