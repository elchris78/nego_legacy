"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import SubZonasTable from "./components/table/SubZonasTable";
import SubZonasTableFilters from "./components/table/SubZonasTableFilters";

import { SubZonaTypeParams } from "./services/subZonasTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { subZonasActions } from "./services/subZonasSlice";
import { usePagination } from "@/lib/hooks/usePagination";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("SubZonas"); // Hook to validate key configuration

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<SubZonaTypeParams>({
    searchQuery: "",
    isActive: [],
    zonaClave: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const subZonas = useSelector((state: RootState) => state.subZonas.subzonas);
  const totalRecords = useSelector(
    (state: RootState) => state.subZonas.totalRegistros
  );
  const isLoading = useSelector((state: RootState) => state.subZonas.loading);

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

  useEffect(() => {
    if (!token) return;
    dispatch(
      subZonasActions.getSubZonas({
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
    JSON.stringify(searchParams.zonaClave),
    currentPage,
    itemsPerPage,
  ]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"SubZonas"} total={totalRecords} />
      <SubZonasTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <SubZonasTable
        subZonas={subZonas}
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
