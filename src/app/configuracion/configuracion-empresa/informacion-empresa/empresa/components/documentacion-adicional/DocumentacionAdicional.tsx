"use client";

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch, RootState } from "@/lib/store/store";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { usePagination } from "@/lib/hooks/usePagination";
import Table from "./components/EmpresaDocumentacionAdocionalTable";
import Filters from "./components/EmpresaDocumentacionAdicionalTableFilters";
import showAlert from "@/lib/utils/alerts";

import { empresaDocumentacionAdicionalActions } from "./services/empresaDocumentacionAdicionalSlice";
import type { EmpresaDocumentacionAdicionalParams } from "./services/empresaDocumentacionAdicionalTypes";

const DocumentacionAdicional = () => {
  const router = useRouter();

  const token = Cookies.get("auth-token");
  const empresaId = Cookies.get("companyId");

  if (!empresaId) {
    router.push("/configuracion");
    showAlert({
      success: false,
      message: "El ID inválido o no está definido.",
    });
  }

  // State to manage search parameters for data
  const [searchParams, setSearchParams] =
    useState<EmpresaDocumentacionAdicionalParams>({
      searchQuery: "",
      formatos: [],
    });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const documentos = useSelector(
    (state: RootState) => state.empresaDocumentacion.documentacion
  );
  const totalRecords = useSelector(
    (state: RootState) => state.empresaDocumentacion.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.empresaDocumentacion.loading
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
    if (!token) return;
    try {
      await dispatch(
        empresaDocumentacionAdicionalActions.getEmpresaDocumentacionAdicional({
          token,
          params: {
            ...searchParams,
            page: currentPage,
            size: itemsPerPage,
          },
          empresaId: empresaId!,
        })
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert({
        success: false,
        message: "Error al obtener los documentos.",
      });
    }
  };

  return (
    <div className="mt-3 md:mt-4">
      <Filters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        getData={getData}
      />
      <Table
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

export default DocumentacionAdicional;
