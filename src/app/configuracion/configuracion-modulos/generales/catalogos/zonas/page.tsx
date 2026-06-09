"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import ZonasTable from "./components/table/ZonasTable";
import ZonaTableFilters from "./components/table/ZonaTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { ZonaTypeParams } from "./services/zonasTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { zonasActions } from "./services/zonasSlice";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("Zonas");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<ZonaTypeParams>({
    searchQuery: "",
    isActive: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const zonas = useSelector((state: RootState) => state.zonas.zonas);
  const totalRecords = useSelector(
    (state: RootState) => state.zonas.totalRegistros
  );
  const isLoading = useSelector((state: RootState) => state.zonas.loading);

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
    if (!token) return;
    dispatch(
      zonasActions.getZonas({
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
    JSON.stringify(searchParams.searchQuery),
    JSON.stringify(searchParams.isActive),
    currentPage,
    itemsPerPage,
  ]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Zonas"} total={totalRecords} />
      <ZonaTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <ZonasTable
        zonas={zonas}
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
