"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";

import { AppDispatch, RootState } from "@/lib/store/store";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import FabricanteDocumentosTable from "./components/table/FabricanteDocumentosTable";
import FabricanteDocumentosTableFilters from "./components/table/FabricanteDocumentosTableFilters";
import showAlert from "@/lib/utils/alerts";
import TabLayout from "../../components/TabLayout";

import { fabricanteDocumentosActions } from "./services/fabricanteDocumentosSlice";
import type { FabricanteDocumentoTypeParams } from "./services/fabricantesDocumentosTypes";

const Page = () => {
  // URL params
  const router = useRouter();

  const { fabricanteId } = useParams() as { fabricanteId: string };
  const token = Cookies.get("auth-token");

  if (!fabricanteId || fabricanteId === "undefined") {
    router.push(
      "/configuracion/configuracion-modulos/almacenes/catalogos/fabricantes"
    );
    showAlert({
      success: false,
      message: "El ID inválido o no está definido.",
    });
  }

  // State to manage search parameters for data
  const [searchParams, setSearchParams] =
    useState<FabricanteDocumentoTypeParams>({
      searchQuery: "",
      formatos: [],
    });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const documentos = useSelector(
    (state: RootState) => state.fabricanteDocumentos.documentos
  );
  const totalRecords = useSelector(
    (state: RootState) => state.fabricanteDocumentos.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.fabricanteDocumentos.loading
  );
  // Redux del padre
  const currentName = useSelector(
    (state: RootState) => state.fabricantes.currentFabricante?.nombre
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
    getData();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.formatos),
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  const getData = async () => {
    if (!token) return; // Evitar múltiples llamadas
    try {
      await dispatch(
        fabricanteDocumentosActions.getFabricanteDocumentos({
          token,
          params: {
            ...searchParams,
            page: currentPage,
            size: itemsPerPage,
          },
          fabricanteId,
        })
      );
    } catch (error) {
      showAlert({
        success: false,
        message: "Error al obtener los documentos del fabricante.",
      });
    }
  };

  return (
    <div className="mt-0 md:mt-12">
      <TableTitle title="Documentos del Fabricante" total={totalRecords} />
      <TabLayout tab={"files"} valueName={currentName} />
      <FabricanteDocumentosTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        getData={getData}
      />
      <FabricanteDocumentosTable
        documentos={documentos}
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
