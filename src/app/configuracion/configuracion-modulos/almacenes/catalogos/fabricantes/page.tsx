"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { usePagination } from "@/lib/hooks/usePagination";
import FabricantesTable from "./components/table/FabricantesTable";
import FabricantesTableFilters from "./components/table/FabricanteTableFilters";

import { FabricanteTypeParams } from "./services/fabricantesTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { fabricanteActions } from "./services/fabricanteSlice";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("Fabricantes");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<FabricanteTypeParams>({
    searchQuery: "",
    isActive: [],
    paisClave: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const fabricantes = useSelector(
    (state: RootState) => state.fabricantes.fabricantes
  );
  const totalRecords = useSelector(
    (state: RootState) => state.fabricantes.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.fabricantes.loading
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
    if (!token) return;
    dispatch(
      fabricanteActions.getFabricantes({
        token,
        params: {
          ...searchParams,
          page: currentPage,
          size: itemsPerPage,
        },
      })
    );
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.isActive),
    JSON.stringify(searchParams.paisClave),
    currentPage,
    itemsPerPage,
    dispatch,
  ]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Fabricantes"} total={totalRecords} />
      <FabricantesTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <FabricantesTable
        fabricantes={fabricantes}
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
