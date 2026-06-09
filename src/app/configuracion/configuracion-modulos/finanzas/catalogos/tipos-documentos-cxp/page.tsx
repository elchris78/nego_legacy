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
import CXPsTableFilter from "./components/table/CXPsTableFilter";
import CXPsTable from "./components/table/CXPsTable";
import Loading from "@/components/ui/Modals/loading";

import { usePagination } from "@/lib/hooks/usePagination";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";


import type {
  CXPParams,
} from "./services/cxpsTypes";
import { getCuentasPorPagar } from "./services/CXPSlice";

const Page = () => {
  const token = Cookies.get("auth-token");

  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("TipoDocumentosCuentasPorPagar");
  const [searchParams, setSearchParams] = useState<CXPParams>({
    searchQuery: undefined,
    page: 1,
    size: 20,
    isActive: undefined,
    origen: undefined
  });

  // areas redux
  const dispatch: AppDispatch = useDispatch();

  const cuentasPorPagar = useSelector((state: RootState) => state.cxps.cxpsData);
  const totalRecords = useSelector((state: RootState) => state.cxps.totalRegistros);
  const isLoading = useSelector((state: RootState) => state.cxps.loading);
  // const error = useSelector((state: RootState) => state.cxps.error);

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
      getCuentasPorPagar({
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
      <TableTitle title={"Tipos de documentos cuentas por pagar"} total={totalRecords} />
      <br></br>
      <CXPsTableFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <CXPsTable
        paginatedData={cuentasPorPagar}
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
