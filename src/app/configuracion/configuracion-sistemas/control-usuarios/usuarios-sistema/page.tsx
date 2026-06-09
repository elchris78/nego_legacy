"use client";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { fetchUserActivityHistory } from "@/lib/services/userActivity/userActivitySlice";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import { UsuariosSistemaFilter } from "./components/table/UsuariosSistemaFilter";
import { UsuariosSistemaTable } from "./components/table/UsuariosSistemaTable";

import { RootState, AppDispatch } from "@/store";
import { GetActivityHistoryRequest } from "@/lib/services/userActivity/userActivityTypes";

const Page = () => {
  const token = Cookies.get("auth-token");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<GetActivityHistoryRequest>({
    searchQuery: "",
    connectionStatuses: [],
    loginStartDate: "",
    loginEndDate: "",
    loginStartTime: "",
    loginEndTime: "",
    logoutStartDate: "",
    logoutEndDate: "",
    logoutStartTime: "",
    logoutEndTime: "",
    activePeriodStart: "",
    activePeriodEnd: "",
    minActiveHours: "",
    inactivePeriodStart: "",
    inactivePeriodEnd: "",
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const systemUsers = useSelector(
    (state: RootState) => state.userActivity.userActivityHistory
  );
  const totalRecords = useSelector(
    (state: RootState) => state.userActivity.totalRecords
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
    getUsuariosSistema();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.connectionStatuses),
    searchParams.loginStartDate,
    searchParams.loginEndDate,
    searchParams.loginStartTime,
    searchParams.loginEndTime,
    searchParams.logoutStartDate,
    searchParams.logoutEndDate,
    searchParams.logoutStartTime,
    searchParams.logoutEndTime,
    searchParams.activePeriodStart,
    searchParams.activePeriodEnd,
    searchParams.minActiveHours,
    searchParams.inactivePeriodStart,
    searchParams.inactivePeriodEnd,
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      getUsuariosSistema();
    }, 60000);

    return () => clearInterval(interval);
  }, [token, searchParams, currentPage, itemsPerPage]);

  const getUsuariosSistema = async () => {
    if (!token) return;

    try {
      await dispatch(
        fetchUserActivityHistory(token, {
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
      <TableTitle title="Usuarios dentro del sistema" total={totalRecords} />
      <UsuariosSistemaFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <UsuariosSistemaTable
        paginatedData={systemUsers}
        getUsuariosSistema={getUsuariosSistema}
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
