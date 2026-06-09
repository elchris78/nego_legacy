"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { usePagination } from "@/lib/hooks/usePagination";
import EmpaquesTable from "./components/table/EmpaquesTable";
import EmpaquesTableFilters from "./components/table/EmpaquesTableFilters";

import { EmpaqueTypeParams } from "./services/empaquesTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { empaquesActions } from "./services/empaquesSlice";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("Empaques");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<EmpaqueTypeParams>({
    searchQuery: "",
    isActive: [],
    unidadSat: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const empaques = useSelector((state: RootState) => state.empaques.empaques);
  const totalRecords = useSelector(
    (state: RootState) => state.empaques.totalRegistros
  );
  const isLoading = useSelector((state: RootState) => state.empaques.loading);

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
      empaquesActions.getEmpaques({
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
    JSON.stringify(searchParams.unidadSat),
    currentPage,
    itemsPerPage,
    dispatch,
  ]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Empaques"} total={totalRecords} />
      <EmpaquesTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <EmpaquesTable
        empaques={empaques}
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
