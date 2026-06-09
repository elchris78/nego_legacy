"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/lib/store/store";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { usePagination } from "@/lib/hooks/usePagination";
import MovimientosInventarioTable from "./components/table/MovimientosInventarioTable";
import MovimientosInventarioTableFilters from "./components/table/MovimientosInventarioTableFilters";
import showAlert from "@/lib/utils/alerts";

import { movimientosInventarioActions } from "./services/movimientosInventariosSlice";
import type { MovimientoInventarioTypeParams } from "./services/movimientosInventarioTypes";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("ConceptosMovimientoInventario");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] =
    useState<MovimientoInventarioTypeParams>({
      searchQuery: "",
      estatus: [],
      origen: [],
      aplicaPara: [],
      tipoMovimiento: [],
    });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const movimientos = useSelector(
    (state: RootState) => state.movimientosInventario.movimientosInventario
  );
  const totalRecords = useSelector(
    (state: RootState) => state.movimientosInventario.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.movimientosInventario.loading
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
    JSON.stringify(searchParams.estatus),
    JSON.stringify(searchParams.origen),
    JSON.stringify(searchParams.aplicaPara),
    JSON.stringify(searchParams.tipoMovimiento),
  ]);


  // Effect to fetch return data based on search params and pagination
  useEffect(() => {
    getData();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.estatus),
    JSON.stringify(searchParams.origen),
    JSON.stringify(searchParams.aplicaPara),
    JSON.stringify(searchParams.tipoMovimiento),
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  const getData = async () => {
    if (!token) return;
    try {
      await dispatch(
        movimientosInventarioActions.getMovimientosInventario({
          token,
          params: {
            ...searchParams,
            page: currentPage,
            size: itemsPerPage,
          },
        })
      );
    } catch (error: any) {
      console.error("Error fetching movimientos de inventario:", error);
      showAlert({
        success: false,
        message:
          error.message ||
          "Error al obtener los movimientos de inventario, inténtalo de nuevo",
      });
    }
  };

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle
        title={"Conceptos de movimientos al inventario"}
        total={totalRecords}
      />
      <MovimientosInventarioTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        getData={getData}
      />
      <MovimientosInventarioTable
        movimientos={movimientos}
        startIndex={(currentPage - 1) * itemsPerPage}
        isLoading={isLoading}
        getData={getData}
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
