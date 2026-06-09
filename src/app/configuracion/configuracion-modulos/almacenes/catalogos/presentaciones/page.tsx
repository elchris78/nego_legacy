"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { presentacionesActions } from "./services/presentacionesSlice";
import { PresentacionesParams } from "./services/presentacionesTypes";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import PresentacionesTable from "./components/table/PresentacionesTable";
import PresentacionesTableFilters from "./components/table/PresentacionesTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { AppDispatch, RootState } from "@/lib/store/store";
import Loading from "@/components/ui/Modals/loading";

const page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("Presentaciones");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<PresentacionesParams>({
    searchQuery: "",
    isActive: [],
  });

  // Estatus de producto redux
  const dispatch: AppDispatch = useDispatch();
  const presentaciones = useSelector(
    (state: RootState) => state.presentaciones.presentaciones
  );
  const isLoading = useSelector(
    (state: RootState) => state.presentaciones.loading
  );
  const totalRecords = useSelector(
    (state: RootState) => state.presentaciones.totalRegistros
  );

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
    getPresentaciones();
  }, [token, searchParams, currentPage, itemsPerPage]);

  const getPresentaciones = async () => {
    if (!token) return;
    try {
      await dispatch(
        presentacionesActions.getPresentaciones({
          //cambiar al real cuando exista
          token,
          params: {
            ...searchParams,
            page: currentPage,
            size: itemsPerPage,
          },
        })
      );
    } catch (error) {
      console.log("🚀 ~ getUsers ~ error:", error);
    }
  };

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Presentaciones"} total={totalRecords} />
      <PresentacionesTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <PresentacionesTable
        paginatedData={presentaciones ?? []}
        getPresentaciones={getPresentaciones}
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

export default page;
