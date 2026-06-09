"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/lib/store/store";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import ConceptCancelationTableFilter from "./components/table/CancelConceptsTableFilter";
import ConceptCancelationTable from "./components/table/CancelConceptsTable";

import type { CancelConceptsParams } from "./services/cancelConceptsTypes";
import { CancelConceptsActions } from "./services/conceptosCancelSlice";
import { usePagination } from "@/lib/hooks/usePagination";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("ConceptosCancelacion");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<CancelConceptsParams>({
    searchQuery: "",
    isActive: [],
    affectTo: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const ConceptoCancelacion = useSelector(
    (state: RootState) => state.ConceptoCancelacion.cancelConcepts
  );
  const totalRecords = useSelector(
    (state: RootState) => state.ConceptoCancelacion.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.ConceptoCancelacion.loading
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
    getConceptoCancelacion();
  }, [
    token,
    JSON.stringify(searchParams.searchQuery),
    JSON.stringify(searchParams.isActive),
    JSON.stringify(searchParams.affectTo),
    currentPage,
    itemsPerPage,
  ]);

  const getConceptoCancelacion = async () => {
    if (!token) return;
    try {
      await dispatch(
        CancelConceptsActions.getConceptCancel({
          token,
          params: {
            ...searchParams,
            page: currentPage,
            size: itemsPerPage,
          },
        })
      );
    } catch (error) {
      console.log("🚀 ~ getUsers ~ error:", error);
    }
  };

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Conceptos de cancelación"} total={totalRecords} />
      <ConceptCancelationTableFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <ConceptCancelationTable
        paginatedData={ConceptoCancelacion ?? []}
        startIndex={(currentPage - 1) * itemsPerPage}
        getConceptoCancelacion={getConceptoCancelacion}
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
