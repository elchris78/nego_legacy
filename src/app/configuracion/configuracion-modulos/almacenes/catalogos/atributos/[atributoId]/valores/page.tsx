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
} from "./services/attributesValueTypes";
import { getAttributes } from "./services/AttributeValueSlice";
import TabLayout from "../../components/TabLayout";
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation'
import showAlert from "@/lib/utils/alerts";


const Page = () => {
  // URL params
  const router = useRouter()

  const { atributoId } = useParams() as { atributoId: string };
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("ValoresAtributo"); // Hook para validar la configuración de claves

  if (!atributoId || atributoId === "undefined") {
    router.push("/configuracion/configuracion-modulos/almacenes/catalogos/atributos");
    showAlert({success: false, message: "El ID del Valor es inválido o no está definido."})
  }

  // Cookies
  const token = Cookies.get("auth-token");

  const [searchParams, setSearchParams] = useState<AttributeParams>({
    searchQuery: undefined,
    page: 1,
    size: 20,
    isActive: undefined,
  });

  // areas redux
  const dispatch: AppDispatch = useDispatch();

  const attributes = useSelector((state: RootState) => state.values.attributeValuesData);
  const totalRecords = useSelector((state: RootState) => state.values.totalRegistros);
  const loading = useSelector((state: RootState) => state.values.loading);
  // const error = useSelector((state: RootState) => state.values.error);

  // Redux del padre
  const currentAttributeName = useSelector(
    (state: RootState) => state.attribute.attribute?.nombre
  );

  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
  } = usePagination(totalRecords);

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
        atributoId,
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
      <TableTitle title={"Valores del Atributo"} total={totalRecords} />
      <TabLayout exists={true} tab={'valores'} valueName={currentAttributeName} spacingClasses={{ atributos: "mt-[-40px] mb-4", valores: "mt-6 mb-4" }}/>
      <AttributesTableFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        currentAttributeName={currentAttributeName}
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
