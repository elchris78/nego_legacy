"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface Props {
  handlePrevPage: () => void;
  currentPage: number;
  totalPages: number;
  handleNextPage: () => void;
  total: number;
  maxPage: number;
}

export const PlantillaTablePagination = ({
  handleNextPage,
  currentPage,
  totalPages,
  handlePrevPage,
  total,
  maxPage,
}: Props) => {
  useEffect(() => {
    if (currentPage > maxPage) handlePrevPage();
  }, [currentPage, maxPage]);

  return (
    <div className="grid grid-cols-12 gap-4 px-5">
      <div className="col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-3 lg:col-start-4">
        <div className="text-sm font-bold rounded-md bg-[#EDEDED] h-12 flex justify-center items-center p-2 w-full">
          <span className="text-[#5B89B4]">
            Sucursales registradas:{" "}
            <span className="text-slate-800">{total}</span>
          </span>
        </div>
      </div>

      <div className="col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-3 lg:col-start-7">
        <div className="rounded-md flex items-center justify-between border-[3px] border-[#EDEDED]">
          <div>
            <Button
              className="p-6 bg-[#EDEDED] hover:bg-[#cccbcb]"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <NavigateBeforeIcon className="text-[#5B89B4]" />
            </Button>
          </div>

          <div>
            <span>
              {currentPage} de {totalPages}
            </span>
          </div>

          <div>
            <Button
              className="p-6 bg-[#EDEDED] hover:bg-[#cccbcb] text-[#5B89B4]"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <NavigateNextIcon className="text-[#5B89B4]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
