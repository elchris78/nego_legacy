"use client";

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch, RootState } from "@/lib/store/store";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { usePagination } from "@/lib/hooks/usePagination";
import ColaboradorDocumentacionTable from "./components/table/ColaboradorDocumentacionTable";
import ColaboradorDocumentacionTableFilters from "./components/table/ColaboradorDocumentacionTableFilters";
import showAlert from "@/lib/utils/alerts";

import { colaboradorDocumentacionActions } from "./services/colaboradorDocumentacionSlice";
import type { ColaboradorDocumentacionParams } from "./services/colaboradorDocumentacionTypes";

const DocumentacionAdicional = () => {
  const router = useRouter();
  const params = useSearchParams();

  const mode = params.get("mode");
  const id = params.get("id");
  const token = Cookies.get("auth-token");

  if (!id || !mode) {
    router.push(
      "/configuracion/configuracion-sistemas/control-usuarios/colaboradores"
    );
    showAlert({
      success: false,
      message: "El ID inválido o no está definido.",
    });
  }

  // State to manage search parameters for data
  const [searchParams, setSearchParams] =
    useState<ColaboradorDocumentacionParams>({
      searchQuery: "",
      formatos: [],
    });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const documentos = useSelector(
    (state: RootState) => state.colaboradoresDocumentacion.documentacion
  );
  const totalRecords = useSelector(
    (state: RootState) => state.colaboradoresDocumentacion.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.colaboradoresDocumentacion.loading
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
        colaboradorDocumentacionActions.getColaboradorDocumentacion({
          token,
          params: {
            ...searchParams,
            page: currentPage,
            size: itemsPerPage,
          },
          colaboradorId: id || "",
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
      <ColaboradorDocumentacionTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        getData={getData}
      />
      <ColaboradorDocumentacionTable
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
