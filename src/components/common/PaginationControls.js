import React from 'react';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export const PaginationControls = ({ 
  page, 
  totalPages, 
  onPageChange 
}) => {
  return (
    <div className="mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
            />
          </PaginationItem>
          
          {[...Array(Math.min(5, totalPages))].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => onPageChange(pageNum)}
                  isActive={page === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          {totalPages > 5 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(totalPages)}
                  isActive={page === totalPages}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};