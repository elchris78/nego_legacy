"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { PuestosParams } from "./services/puestosTypes";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { usePagination } from "@/lib/hooks/usePagination";
import PuestosTable from "./components/table/PuestosTable";
import PuestosTableFilter from "./components/table/PuestosTableFilters";

import { puestosActions } from "./services/puestosSlice";
import { AppDispatch, RootState } from "@/lib/store/store";
import Loading from "@/components/ui/Modals/loading";

const page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("Puestos");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<PuestosParams>({
    searchQuery: "",
    isActive: [],
    aplicapara: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const puestos = useSelector((state: RootState) => state.puestos.puestos);
  const isLoading = useSelector((state: RootState) => state.puestos.loading);
  const totalRecords = useSelector(
    (state: RootState) => state.puestos.totalRegistros
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
    getPuesto();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.isActive),
    JSON.stringify(searchParams.aplicapara),
    currentPage,
    itemsPerPage,
  ]);

  const getPuesto = async () => {
    if (!token) return;
    try {
      await dispatch(
        puestosActions.getPuestos({
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
      <TableTitle title={"Puestos"} total={totalRecords} />
      <PuestosTableFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <PuestosTable
        paginatedData={puestos ?? []}
        getPuesto={getPuesto}
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
