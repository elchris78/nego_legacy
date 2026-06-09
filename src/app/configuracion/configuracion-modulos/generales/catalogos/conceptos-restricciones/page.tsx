"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import RestrictionConceptsTable from "./components/table/RestrictionConceptsTable";
import RestrictionConceptsTableFilters from "./components/table/RestrictionConceptsTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { RestrictionConceptTypeParams } from "./services/restrictionConceptsTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { restrictionConceptsActions } from "./services/restrictionConceptsSlice";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("ConceptosRestriccion");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] =
    useState<RestrictionConceptTypeParams>({
      searchQuery: "",
      isActive: [],
      requiereAutorizacion: [],
      requiereNotificacion: [],
      aplicaPara: [],
    });

  // Redux Hooks
  const dispatch: AppDispatch = useDispatch();
  const restrictionConcepts = useSelector(
    (state: RootState) => state.restrictionConcepts.restrictionConcepts
  );
  const totalRecords = useSelector(
    (state: RootState) => state.restrictionConcepts.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.restrictionConcepts.loading
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
      restrictionConceptsActions.getRestrictionConcepts({
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
    JSON.stringify(searchParams.searchQuery),
    JSON.stringify(searchParams.isActive),
    JSON.stringify(searchParams.requiereAutorizacion),
    JSON.stringify(searchParams.requiereNotificacion),
    JSON.stringify(searchParams.aplicaPara),
    currentPage,
    itemsPerPage,
    dispatch,
  ]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12 flex flex-col justify-between h-full">
      <TableTitle title={"Conceptos de restricciones"} total={totalRecords} />
      <RestrictionConceptsTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <RestrictionConceptsTable
        restrictionConcepts={restrictionConcepts}
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
