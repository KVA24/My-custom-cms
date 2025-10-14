import React from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";

interface SimplePaginationProps {
  disabledNext: boolean;
  disabledPre: boolean;
  currentSize: number;
  onChangeSize: (size: number) => void;
  onChangePage: (action: "next" | "prev") => void;
}

const SimplePagination = ({
                            disabledNext,
                            disabledPre,
                            currentSize,
                            onChangeSize,
                            onChangePage,
                          }: SimplePaginationProps) => {
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
      
      {/* Prev / Next */}
      <div className="flex items-center gap-2">
        <button
          disabled={disabledPre}
          onClick={() => onChangePage("prev")}
          className="cursor-pointer h-8 w-8 flex items-center justify-center rounded-md border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20}/>
        </button>
        <button
          disabled={disabledNext}
          onClick={() => onChangePage("next")}
          className="cursor-pointer h-8 w-8 flex items-center justify-center rounded-md border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20}/>
        </button>
      </div>
    </div>
  );
};

export default SimplePagination;
