import React from 'react';
import ReactPaginate from 'react-paginate';
import {ChevronLeft, ChevronRight} from "lucide-react";

interface ReactPaginateProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  currentSize: number;
  onChangeSize: (size: number) => void;
}

const CustomPagination = ({
                            currentPage,
                            totalPages,
                            onChangePage,
                            currentSize,
                            onChangeSize,
                          }: ReactPaginateProps) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 mt-4">
      {/* Select page size */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Number per page:</span>
        <select
          value={currentSize}
          onChange={(e) => onChangeSize(Number(e.target.value))}
          className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {[5, 10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      
      <ReactPaginate
        renderOnZeroPageCount={null}
        forcePage={currentPage}
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={5}
        onPageChange={({selected}) => onChangePage(selected)}
        previousLabel={<ChevronLeft size={20}/>}
        nextLabel={<ChevronRight size={20}/>}
        breakLabel="…"
        containerClassName="flex items-center gap-2"
        pageClassName="h-7 w-7 flex items-center justify-center rounded-md border
                       bg-white dark:bg-gray-900
                       border-gray-300 dark:border-gray-700
                       hover:bg-accent dark:hover:bg-gray-700
                       cursor-pointer"
        pageLinkClassName="h-full w-full flex items-center justify-center"
        activeClassName="bg-primary border-primary dark:border-white"
        activeLinkClassName="text-foreground"
        breakClassName="h-7 w-7 flex items-center justify-center text-gray-500 dark:text-gray-400"
        previousClassName="h-7 w-7 flex items-center justify-center rounded-md border
                           bg-white dark:bg-gray-900
                           border-gray-300 dark:border-gray-700
                           hover:bg-accent dark:hover:bg-gray-700"
        nextClassName="h-7 w-7 flex items-center justify-center rounded-md border
                       bg-white dark:bg-gray-900
                       border-gray-300 dark:border-gray-700
                       hover:bg-accent dark:hover:bg-gray-700"
        disabledClassName="opacity-50 cursor-not-allowed"
      />
    </div>
  );
}

export default CustomPagination;