import React from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export const PaginationControls = ({ page, totalPages, onPageChange }) => {
  // 현재 페이지 주변에 표시할 페이지 버튼 계산
  const getPageNumbers = () => {
    let pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(start + 4, totalPages);

    // 끝부분에 도달했을 때 시작점 조정
    if (end === totalPages) {
      start = Math.max(1, end - 4);
    }

    // 시작점에 있을 때 끝점 조정
    if (start === 1) {
      end = Math.min(5, totalPages);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* 처음으로 버튼 */}
        <PaginationItem>
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4"
            aria-label="처음으로"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        </PaginationItem>

        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
          />
        </PaginationItem>

        {/* 첫 페이지가 보이는 페이지 범위에 없으면 표시 */}
        {getPageNumbers()[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            {getPageNumbers()[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* 현재 페이지 주변 페이지들 */}
        {getPageNumbers().map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              onClick={() => onPageChange(pageNum)}
              isActive={page === pageNum}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 마지막 페이지가 보이는 페이지 범위에 없으면 표시 */}
        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
          <>
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)}>
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

        {/* 마지막으로 버튼 */}
        <PaginationItem>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4"
            aria-label="마지막으로"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};