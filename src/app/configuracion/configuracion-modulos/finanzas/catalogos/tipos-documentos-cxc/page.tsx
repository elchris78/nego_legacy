"use client";

import { useState, useEffect } from "react";

import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/lib/store/store";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import CXCsTableFilter from "./components/table/CXCsTableFilter";
import CXCsTable from "./components/table/CXCsTable";
import Loading from "@/components/ui/Modals/loading";

import { usePagination } from "@/lib/hooks/usePagination";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";


import type {
  CXCParams,
  CXC,
} from "./services/cxcsTypes";
import { getCuentasPorCobrar } from "./services/CXCSlice";

const Page = () => {
  const token = Cookies.get("auth-token");

  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("TipoDocumentosCuentasPorCobrar");
  const [searchParams, setSearchParams] = useState<CXCParams>({
    searchQuery: undefined,
    page: 1,
    size: 20,
    isActive: undefined,
    origen: undefined
  });

  // areas redux
  const dispatch: AppDispatch = useDispatch();

  const cuentasPorCobrar = useSelector((state: RootState) => state.cxcs.cxcsData);
  const totalRecords = useSelector((state: RootState) => state.cxcs.totalRegistros);
  const isLoading = useSelector((state: RootState) => state.cxcs.loading);
  // const error = useSelector((state: RootState) => state.cxcs.error);

  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
  } = usePagination(totalRecords);

  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    setItemsPerPage(event.target.value as number);
    setCurrentPage(1);
  };

  const { isActive: isActiveArray, origen: originArray, ...restParams } = searchParams;

  useEffect(() => {
    if (!token) return;
    const arr = searchParams.isActive ?? [];
    const hasTrue = arr.includes("true");
    const hasFalse = arr.includes("false");
    // si tiene ambas opciones o ninguna, queda undefined; si sólo true → true; sólo false → false
    const boolIsActive = hasTrue === hasFalse ? undefined : hasTrue;

    const onlyOneOrigin = Array.isArray(originArray) && originArray.length === 1
      ? originArray[0]
      : undefined;

    dispatch(
      getCuentasPorCobrar({
        token,
        requestParams: {
          ...restParams,
          ...(typeof boolIsActive === "boolean" && { isActive: boolIsActive }),
          ...(onlyOneOrigin && { origen: onlyOneOrigin }),
          page: currentPage,
          size: itemsPerPage,
        },
      })
    );
  }, [searchParams, currentPage, itemsPerPage ]);

  // if (error) return <p>Error: {error}</p>;
  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-0 md:mt-12">
      {/* {loading && (
        <Loading />
      )} */}
      <TableTitle title={"Tipos de documentos cuentas por cobrar"} total={totalRecords} />
      <br></br>
      <CXCsTableFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <CXCsTable
        paginatedData={cuentasPorCobrar}
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
