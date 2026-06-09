"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { clientClassificationsActions } from "./services/clientClassificationsSlice";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { usePagination } from "@/lib/hooks/usePagination";
import ClientClassificationsTable from "./components/table/ClientClassificationsTable";
import ClientClassificationsTableFilter from "./components/table/ClientClassificationsTableFilter";

import type { ClientClassificationParams } from "./services/clientesClassificationTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("ClasificacionesClientes");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<ClientClassificationParams>({
    searchQuery: "",
    isActive: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const clasifications = useSelector(
    (state: RootState) => state.clientClassification.clientClassifications
  );
  const totalRecords = useSelector(
    (state: RootState) => state.clientClassification.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.clientClassification.loading
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
      clientClassificationsActions.getClientClassifications({
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
    currentPage,
    itemsPerPage,
  ]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Clasificación de clientes"} total={totalRecords} />
      <ClientClassificationsTableFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <ClientClassificationsTable
        paginatedData={clasifications}
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
