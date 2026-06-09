"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { MarcasActions } from "./services/MarcasSlice";
import { MarcasParams } from "./services/MarcasTypes";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import MarcasTable from "./components/table/MarcaTable";
import MarcasTableFilters from "./components/table/MarcaTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { AppDispatch, RootState } from "@/lib/store/store";
import Loading from "@/components/ui/Modals/loading";

const page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("Marcas");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<MarcasParams>({
    searchQuery: "",
    isActive: [],
    fabricante: [],
    fechaVigencia: "",
  });

  // Estatus de producto redux
  const dispatch: AppDispatch = useDispatch();
  const marcas = useSelector((state: RootState) => state.marcas.marcas);
  const isLoading = useSelector((state: RootState) => state.marcas.loading);
  const totalRecords = useSelector(
    (state: RootState) => state.marcas.totalRegistros
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
    getMarcas();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.isActive),
    JSON.stringify(searchParams.fabricante),
    searchParams.fechaVigencia,
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  const getMarcas = async () => {
    if (!token) return;
    try {
      await dispatch(
        MarcasActions.getMarcas({
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
      <TableTitle title={"Marcas"} total={totalRecords} />
      <MarcasTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <MarcasTable
        paginatedData={marcas ?? []}
        getMarcas={getMarcas}
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
