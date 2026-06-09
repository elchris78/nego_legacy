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
import DocumentacionTableFilter from "./components/table/DocumentacionTableFilter";
import DocuemntacionTable from "./components/table/DocumentacionTable";
import Loading from "@/components/ui/Modals/loading";

import { usePagination } from "@/lib/hooks/usePagination";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import type { DocumentacionParams } from "./services/documentacionTypes";
import TabLayout from "../../components/TabLayout";
import { useParams, useRouter } from "next/navigation";
import { sucursalActions } from "../../services/sucursalesSlice";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.sucursalesId as string | undefined;

  const token = Cookies.get("auth-token");

  const [searchParams, setSearchParams] = useState<DocumentacionParams>({
    searchQuery: undefined,
    page: 1,
    size: 20,
    isActive: undefined,
  });

  const dispatch: AppDispatch = useDispatch();

  const documentos = useSelector((state: RootState) => state.sucursales.documentos);
  const totalRecords = useSelector((state: RootState) => state.values.totalRegistros);
  const loading = useSelector((state: RootState) => state.values.loading);

  const currentSucursalName = useSelector(
    (state: RootState) => state.sucursales.currentSucursal?.nombre
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
    if (!token || !id || id === "undefined") {
      console.warn("ID o token inválido:", { id, token });
      return;
    }
    dispatch(
      sucursalActions.getDocumentsBySucursalId({
        token,
        id,
      })
    );
  }, [token, id, searchParams, currentPage, itemsPerPage, dispatch]);


  return (
    <div className="mt-0 md:mt-12">
      {loading && <Loading />}
      <TableTitle title={"Agregar sucursal"} total={totalRecords} />
      <TabLayout
        exists={true}
        tab={"documentacion"}
        valueName={currentSucursalName}
        spacingClasses={{
          informacion: "mt-[-40px] mb-4",
          documentacion: "mt-6 mb-4",
        }}
      />
      <DocumentacionTableFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        currentSucursalName={currentSucursalName}
      />
      <DocuemntacionTable
        paginatedData={documentos ?? []}
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
