"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { usePagination } from "@/lib/hooks/usePagination";
import ReturnConceptTable from "./components/table/ReturnConceptTable";
import ReturnConceptTableFilters from "./components/table/ReturnConceptTableFilters";

import { returnConceptsActions } from "./services/returnConceptsSlice";
import { ReturnConceptTypeParams } from "./services/ReturnConceptTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("ConceptosDevolucion");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<ReturnConceptTypeParams>({
    searchQuery: "",
    isActive: [],
    affectTo: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const returnConcepts = useSelector(
    (state: RootState) => state.returnConcepts.returnConcepts
  );
  const totalRecords = useSelector(
    (state: RootState) => state.returnConcepts.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.returnConcepts.loading
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
      returnConceptsActions.getReturnConcepts({
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
    JSON.stringify(searchParams.affectTo),
    currentPage,
    itemsPerPage,
    dispatch,
  ]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Conceptos de Devolución"} total={totalRecords} />
      <ReturnConceptTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <ReturnConceptTable
        returnConcepts={returnConcepts}
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
