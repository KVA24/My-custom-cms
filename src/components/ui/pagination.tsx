'use client';

import * as React from 'react';
import {cn} from '@/lib/utils';
import {ChevronLeft, ChevronRight, MoreHorizontal} from 'lucide-react';
import {Link} from "react-router-dom";

const Pagination = ({className, ...props}: React.ComponentProps<'nav'>) => (
  <nav
    data-slot="pagination"
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);

function PaginationContent({className, ...props}: React.ComponentProps<'ul'>) {
  return <ul data-slot="pagination-content" className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}

function PaginationItem({className, ...props}: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" className={cn('', className)} {...props} />;
}

const PaginationEllipsis = ({className, ...props}: React.ComponentProps<'span'>) => (
  <span
    data-slot="pagination-ellipsis"
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4"/>
    <span className="sr-only">More pages</span>
  </span>
);

function PaginationLink({
                          className,
                          isActive,
                          ...props
                        }: React.ComponentProps<typeof Link> & { isActive?: boolean }) {
  return (
    <Link
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({className, ...props}: React.ComponentProps<typeof Link>) {
  return (
    <PaginationLink aria-label="Go to previous page" className={className} {...props}>
      <ChevronLeft className="h-4 w-4"/>
    </PaginationLink>
  );
}

function PaginationNext({className, ...props}: React.ComponentProps<typeof Link>) {
  return (
    <PaginationLink aria-label="Go to next page" className={className} {...props}>
      <ChevronRight className="h-4 w-4"/>
    </PaginationLink>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
};
