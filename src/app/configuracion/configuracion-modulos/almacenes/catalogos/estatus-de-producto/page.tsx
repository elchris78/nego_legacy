"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { estatusProdActions } from "./services/estatusProdSlice";
import { EstatusProdParams } from "./services/estatusProdTypes";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import EstatusProdTable from "./components/table/EstatusProdTable";
import EstatusProdTableFilters from "./components/table/EstatusProdTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { AppDispatch, RootState } from "@/lib/store/store";
import Loading from "@/components/ui/Modals/loading";

const page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("EstatusProductos");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<EstatusProdParams>({
    searchQuery: "",
    isActive: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const estatusProd = useSelector(
    (state: RootState) => state.estatus.estatusProd
  );
  const isLoading = useSelector((state: RootState) => state.estatus.loading);
  const totalRecords = useSelector(
    (state: RootState) => state.estatus.totalRegistros
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
    getEstatusProd();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.isActive),
    currentPage,
    itemsPerPage,
  ]);

  const getEstatusProd = async () => {
    if (!token) return;
    try {
      await dispatch(
        estatusProdActions.getEstatusProd({
          token,
          params: {
            ...searchParams,
            page: currentPage,
            size: itemsPerPage,
          },
        })
      );
    } catch (error) {
      console.log("🚀 ~ getEstatusProd ~ error:", error);
    }
  };

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Estatus de producto"} total={totalRecords} />
      <EstatusProdTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <EstatusProdTable
        paginatedData={estatusProd ?? []}
        getEstatusProd={getEstatusProd}
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
