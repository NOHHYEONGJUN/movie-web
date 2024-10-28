import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

// 버튼 기본 스타일
const buttonBaseStyles = `
  inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium 
  transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400
  disabled:pointer-events-none disabled:opacity-50
`;

export function Pagination({ children }) {
  return <nav className="mx-auto flex w-full justify-center">{children}</nav>;
}

export function PaginationContent({ children }) {
  return <ul className="flex flex-row items-center gap-1">{children}</ul>;
}

export function PaginationItem({ children }) {
  return <li>{children}</li>;
}

export function PaginationLink({ children, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${buttonBaseStyles} h-9 w-9
        ${isActive 
          ? 'bg-white text-gray-900 hover:bg-gray-200' 
          : 'text-gray-200 hover:bg-gray-800'}`}
    >
      {children}
    </button>
  );
}

export function PaginationPrevious({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${buttonBaseStyles} h-9 gap-1 pl-2.5 pr-3 text-gray-200 hover:bg-gray-800`}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>이전</span>
    </button>
  );
}

export function PaginationNext({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${buttonBaseStyles} h-9 gap-1 pl-3 pr-2.5 text-gray-200 hover:bg-gray-800`}
    >
      <span>다음</span>
      <ChevronRight className="h-4 w-4" />
    </button>
  );
}

export function PaginationEllipsis() {
  return (
    <div className="flex h-9 w-9 items-center justify-center">
      <MoreHorizontal className="h-4 w-4 text-gray-400" />
    </div>
  );
}