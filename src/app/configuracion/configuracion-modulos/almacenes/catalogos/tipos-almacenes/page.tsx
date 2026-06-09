"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { typesWarehousesActions } from "./services/typesWarehousesSlice";
import { TypesWarehousesParams } from "./services/typesWarehousesTypes";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import TypesWarehousesTable from "./components/table/TypesWarehousesTable";
import TypesWarehousesTableFilters from "./components/table/TypesWarehousesTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { AppDispatch, RootState } from "@/lib/store/store";
import Loading from "@/components/ui/Modals/loading";

const page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("TiposAlmacen");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<TypesWarehousesParams>({
    searchQuery: "",
    isActive: [],
    origen: []
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const typesWarehouses = useSelector(
    (state: RootState) => state.typesWarehouses.typesWarehouses
  );
  const isLoading = useSelector((state: RootState) => state.typesWarehouses.loading);
  const totalRecords = useSelector(
    (state: RootState) => state.typesWarehouses.totalRegistros
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

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchParams.searchQuery,
    JSON.stringify(searchParams.isActive),
    JSON.stringify(searchParams.origen),
  ]);

  useEffect(() => {
    if (!token) return;
    getTypesWarehouses();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.isActive),
    JSON.stringify(searchParams.origen),
    currentPage,
    itemsPerPage,
  ]);

  const getTypesWarehouses = async () => {
    if (!token) return;
    try {
      await dispatch(
        typesWarehousesActions.getTypesWarehouses({
          token,
          params: {
            ...searchParams,
            page: currentPage,
            size: itemsPerPage,
          },
        })
      );
    } catch (error) {
      console.log("🚀 ~ getTypesWarehouses ~ error:", error);
    }
  };
  if (isKeyConfigLoading) {
    return <Loading />
  }
  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Tipos de almacenes"} total={totalRecords} />
      <TypesWarehousesTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <TypesWarehousesTable
        paginatedData={typesWarehouses ?? []}
        getTypesWarehouses={getTypesWarehouses}
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
