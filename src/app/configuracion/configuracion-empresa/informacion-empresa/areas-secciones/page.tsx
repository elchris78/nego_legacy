"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/lib/store/store";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { usePagination } from "@/lib/hooks/usePagination";
import AreaTable from "./components/table/AreaTable";
import AreaTableFilter from "./components/table/AreaTableFilter";

import { areasActions } from "./services/areasSlice";
import type { AreaParams } from "./services/areaTypes";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("Areas");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<AreaParams>({
    searchQuery: "",
    isActive: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const areas = useSelector((state: RootState) => state.areas.areas);
  const totalRecords = useSelector(
    (state: RootState) => state.areas.totalRegistros
  );
  const isLoading = useSelector((state: RootState) => state.areas.loading);

  // Pagination hook logic
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
  } = usePagination(totalRecords);

  // Effect to fetch return data based on search params and pagination
  useEffect(() => {
    if (!token) return; // Evitar múltiples llamadas
    dispatch(
      areasActions.getAreas({
        token,
        params: {
          ...searchParams,
          page: currentPage,
          size: itemsPerPage,
        },
      })
    );
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.isActive),
    JSON.stringify(searchParams.responsibleId),
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Áreas/Secciones"} total={totalRecords} />
      <AreaTableFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <AreaTable
        paginatedData={areas}
        startIndex={(currentPage - 1) * itemsPerPage}
        isLoading={isLoading}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
      />
    </div>
  );
};

export default Page;
