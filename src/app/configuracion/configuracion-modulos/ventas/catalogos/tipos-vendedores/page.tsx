"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import SellersTypesTable from "./components/table/SellersTypesTable";
import SellersTypesTableFilters from "./components/table/SellersTypesTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { SellersTypeParams } from "./services/sellersTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { sellersTypesActions } from "./services/sellersTypesSlice";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("TiposVendedor");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<SellersTypeParams>({
    searchQuery: "",
    isActive: [],
  });

  // return concepts redux
  const dispatch: AppDispatch = useDispatch();
  const sellersTypes = useSelector(
    (state: RootState) => state.sellersTypes.sellersTypes
  );
  const totalRecords = useSelector(
    (state: RootState) => state.sellersTypes.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.sellersTypes.loading
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
      sellersTypesActions.getSellersTypes({
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
    currentPage,
    itemsPerPage,
  ]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Tipos de Vendedor"} total={totalRecords} />
      <SellersTypesTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <SellersTypesTable
        sellersTypes={sellersTypes}
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
