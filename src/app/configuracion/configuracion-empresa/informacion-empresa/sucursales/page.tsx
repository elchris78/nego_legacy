"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/lib/store/store";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { usePagination } from "@/lib/hooks/usePagination";
import SucursalTable from "./components/table/SucursalesTable";
import SucursalesTableFilter from "./components/table/SucursalesTableFilter";
import Loading from "@/components/ui/Modals/loading";
//import { areasActions } from "./services/areasSlice";
import type { Sucursal, SucursalesParams } from "./services/sucursalesTypes";
import { sucursalActions } from "./services/sucursalesSlice";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("Sucursales");
  const [searchParams, setSearchParams] = useState<SucursalesParams>({
    searchQuery: "",
    isActive: [],
    pais: [],
    responsableId: [],
    codigoPostal:[],
    estado:[],
    ciudad:[],
    colonia: []
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const sucursales = useSelector(
    (state: RootState) => state.sucursales.sucursal
  );

  const totalRecords = useSelector(
    (state: RootState) => state.sucursales.totalRegistros
  );
  const isLoading = useSelector((state: RootState) => state.sucursales.loading);
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
        sucursalActions.getSucursal({
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
      JSON.stringify(searchParams.pais),
      JSON.stringify(searchParams.responsableId),
      JSON.stringify(searchParams.codigoPostal),
      JSON.stringify(searchParams.estado),
      JSON.stringify(searchParams.ciudad),
      JSON.stringify(searchParams.colonia),
      currentPage,
      itemsPerPage,
    ]);
  
    if (isKeyConfigLoading) {
      return <Loading />
    }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Sucursales"} total={totalRecords} />
      <SucursalesTableFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <SucursalTable
        paginatedData={sucursales}
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
