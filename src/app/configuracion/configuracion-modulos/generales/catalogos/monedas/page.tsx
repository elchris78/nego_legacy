"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import MonedasTable from "./components/table/MonedasTable";
import MonedasTableFilters from "./components/table/MonedasTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { MonedasParams } from "./services/monedasTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { monedasActions } from "./services/monedasSlice";
import Loading from "@/components/ui/Modals/loading";
import showAlert from "@/lib/utils/alerts";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("Monedas");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<MonedasParams>({
    searchQuery: "",
    estatus: [],
    monedaSatIds: [],
    paisIds: [],
  });

  // return concepts redux
  const dispatch: AppDispatch = useDispatch();
  const monedas = useSelector(
    (state: RootState) => state.monedas.monedas
  );
  const totalRecords = useSelector(
    (state: RootState) => state.monedas.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.monedas.loading
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

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchParams.searchQuery,
    JSON.stringify(searchParams.estatus),
    JSON.stringify(searchParams.monedaSatIds),
    JSON.stringify(searchParams.paisIds),
  ]);
  
  // Effect to fetch return data based on search params and pagination
  useEffect(() => {
    getData();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.estatus),
    JSON.stringify(searchParams.monedaSatIds),
    JSON.stringify(searchParams.paisIds),
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  const getData = async () => {
    if (!token) return;
    try {
      await dispatch(
        monedasActions.getMonedas({
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
      <TableTitle title={"Monedas"} total={totalRecords} />
      <MonedasTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <MonedasTable
        monedas={monedas}
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
