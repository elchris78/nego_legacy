"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import SellersTable from "./components/table/SellersTable";
import SellersTableFilters from "./components/table/SellersTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { Sellers, SellersParams } from "./services/sellersTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { sellersActions } from "./services/sellersSlice";
import Loading from "@/components/ui/Modals/loading";



const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("Vendedores");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<SellersParams>({
    searchQuery: "",
    isActive: [],
    zonas: [],
    subzonas: [],
    colaboradorIds: [],
    tipoVendedorIds: [],
    supervisorIds: [],
    tipoComision: []
  });

  // return concepts redux
  const dispatch: AppDispatch = useDispatch();
  const sellers = useSelector(
    (state: RootState) => state.sellers.sellers
  );
  const totalRecords = useSelector(
    (state: RootState) => state.sellers.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.sellers.loading
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
      sellersActions.getSellers({
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
    JSON.stringify(searchParams.zonas),
    JSON.stringify(searchParams.subzonas),
    JSON.stringify(searchParams.colaboradorIds),
    JSON.stringify(searchParams.tipoVendedorIds),
    JSON.stringify(searchParams.supervisorIds),
    JSON.stringify(searchParams.tipoComision),
    currentPage,
    itemsPerPage,
  ]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Vendedores"} total={totalRecords} />
      <SellersTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <SellersTable
        sellers={sellers}
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
