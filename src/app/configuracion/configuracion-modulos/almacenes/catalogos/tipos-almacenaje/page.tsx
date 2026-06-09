"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { tipoAlmacenajeActions } from "./services/tipoAlmacenajeSlice";
import { TipoAlmacenajeParams } from "./services/tipoAlmacenaje";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import TipoAlmacenajeTable from "./components/table/TipoAlmacenajeTable";
import TipoAlmacenajeTableFilters from "./components/table/TipoAlmacenajeTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { AppDispatch, RootState } from "@/lib/store/store";
import Loading from "@/components/ui/Modals/loading";

const page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("TiposAlmacenaje");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<TipoAlmacenajeParams>({
    searchQuery: "",
    isActive: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const tipoAlmacenaje = useSelector(
    (state: RootState) => state.tiposAlmacenaje.tipoAlmacenaje
  );
  const isLoading = useSelector((state: RootState) => state.tiposAlmacenaje.loading);
  const totalRecords = useSelector(
    (state: RootState) => state.tiposAlmacenaje.totalRegistros
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
    getTipoAlmacenaje();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.isActive),
    currentPage,
    itemsPerPage,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchParams.searchQuery,
    JSON.stringify(searchParams.isActive),
  ]);

  const getTipoAlmacenaje = async () => {
    if (!token) return;
    try {
      await dispatch(
        tipoAlmacenajeActions.getTipoAlmacenaje({
          token,
          params: {
            ...searchParams,
            page: currentPage,
            size: itemsPerPage,
          },
        })
      );
    } catch (error) {
      console.log("🚀 ~ getTipoAlmacenaje ~ error:", error);
    }
  };
  if (isKeyConfigLoading) {
    return <Loading />
  }
  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Tipos de almacenaje"} total={totalRecords} />
      <TipoAlmacenajeTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <TipoAlmacenajeTable
        paginatedData={tipoAlmacenaje ?? []}
        getTipoAlmacenaje={getTipoAlmacenaje}
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
