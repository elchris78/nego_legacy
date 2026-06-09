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
import AttributesTableFilter from "./components/table/AttributesTableFilter";
import AttributeTable from "./components/table/AttributesTable";
import Loading from "@/components/ui/Modals/loading";

import { usePagination } from "@/lib/hooks/usePagination";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";


import type {
  AttributeParams,
  Attribute,
} from "./services/attributesTypes";
import { getAttributes } from "./services/AttributeSlice";

const Page = () => {
  const token = Cookies.get("auth-token");

  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("Atributos");

  const [searchParams, setSearchParams] = useState<AttributeParams>({
    searchQuery: undefined,
    page: 1,
    size: 20,
    isActive: undefined,
  });

  // areas redux
  const dispatch: AppDispatch = useDispatch();

  const attributes = useSelector((state: RootState) => state.attribute.attributesData);
  const totalRecords = useSelector((state: RootState) => state.attribute.totalRegistros);
  const loading = useSelector((state: RootState) => state.attribute.loading);
  // const error = useSelector((state: RootState) => state.attribute.error);

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

  const { isActive: isActiveArray, ...restParams } = searchParams;

  useEffect(() => {
    if (!token) return;
    const arr = searchParams.isActive ?? [];
    const hasTrue = arr.includes("true");
    const hasFalse = arr.includes("false");
    // si tiene ambas opciones o ninguna, queda undefined; si sólo true → true; sólo false → false
    const boolIsActive = hasTrue === hasFalse ? undefined : hasTrue;
    dispatch(
      getAttributes({
        token,
        requestParams: {
          ...restParams,
          ...(typeof boolIsActive === "boolean" && { isActive: boolIsActive }),
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
      <TableTitle title={"Atributos"} total={totalRecords} />
      <br></br>
      <AttributesTableFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <AttributeTable
        paginatedData={attributes}
        startIndex={(currentPage - 1) * itemsPerPage}
        isLoading={loading}
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
