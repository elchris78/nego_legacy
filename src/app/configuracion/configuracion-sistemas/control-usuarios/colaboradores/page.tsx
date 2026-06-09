"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/lib/store/store";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { usePagination } from "@/lib/hooks/usePagination";
import ColaboradoresTable from "./components/table/ColaboradoresTable";
import ColaboradoresTableFilters from "./components/table/ColaboradoresTableFilters";
import showAlert from "@/lib/utils/alerts";

import { colaboradoresActions } from "./services/colaboradoresSlice";
import type { ColaboradorParams } from "./services/colaboradoresTypes";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("Colaboradores");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<ColaboradorParams>({
    searchQuery: "",
    estatus: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const colaboradores = useSelector(
    (state: RootState) => state.colaboradores.colaboradores
  );
  const totalRecords = useSelector(
    (state: RootState) => state.colaboradores.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.colaboradores.loading
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
    JSON.stringify(searchParams.estatus),
    JSON.stringify(searchParams.tipoColaborador),
    JSON.stringify(searchParams.puestos),
    JSON.stringify(searchParams.departamentos),
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  const getData = async () => {
    if (!token) return;
    try {
      await dispatch(
        colaboradoresActions.getColaboradores({
          token,
          params: {
            ...searchParams,
            page: currentPage,
            size: itemsPerPage,
          },
        })
      );
    } catch (error: any) {
      console.error("Error fetching colaboradores:", error);
      showAlert({
        success: false,
        message:
          error.message ||
          "Error al obtener los colaboradores, inténtalo de nuevo",
      });
    }
  };

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Colaboradores"} total={totalRecords} />
      <ColaboradoresTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <ColaboradoresTable
        colaboradores={colaboradores}
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
