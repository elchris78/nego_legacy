"use client";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { BitacoraEmpresaFilters } from "./components/BitacoraEmpresaFilters";
import { BitacoraEmpresaTable } from "./components/BitacoraEmpresaTable";
import { fetchActionActivityHistory } from "@/lib/services/userActivity/userActivitySlice";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";

import { AppDispatch, RootState } from "@/store";
import { GetActivityCompanyHistoryRequest } from "@/lib/services/userActivity/userActivityTypes";

const Page = () => {
  const token = Cookies.get("auth-token");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] =
    useState<GetActivityCompanyHistoryRequest>({
      searchQuery: "",
      startDate: "",
      endDate: "",
      actionTypes: [],
      modules: [],
      subModules: [],
      startTime: "",
      endTime: "",
    });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const userActivityHistory = useSelector(
    (state: RootState) => state.userActivity.actionsActivityHistory
  );
  const totalRecords = useSelector(
    (state: RootState) => state.userActivity.actionsTotalRecords
  );
  const isLoading = useSelector(
    (state: RootState) => state.userActivity.loading
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
    getData();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.startDate),
    JSON.stringify(searchParams.endDate),
    JSON.stringify(searchParams.actionTypes),
    JSON.stringify(searchParams.modules),
    JSON.stringify(searchParams.subModules),
    JSON.stringify(searchParams.startTime),
    JSON.stringify(searchParams.endTime),
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  // Effect to refresh data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      getData();
    }, 60000);

    return () => clearInterval(interval);
  }, [token, searchParams, currentPage, itemsPerPage]);

  const getData = async () => {
    if (!token) return;

    try {
      await dispatch(
        fetchActionActivityHistory(token, {
          ...searchParams,
          Paginas: currentPage,
          Size: itemsPerPage,
        })
      );
    } catch (error) {
      console.log("🚀 ~ getUsers ~ error:", error);
    }
  };

  return (
    <div className="mt-0 md:mt-12">
      <TableTitle title="Bitácora de la empresa" total={totalRecords} />
      <BitacoraEmpresaFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <BitacoraEmpresaTable
        paginatedData={userActivityHistory}
        getData={getData}
        startIndex={itemsPerPage * (currentPage - 1)}
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
