"use client";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { GetAdminUsersParams } from "./services/adminUsersTypes";
import { getUsers as fetchUsers } from "./services/usersSlice";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import { UsersTable } from "./components/table/UsersTable";
import { UsersTableFilters } from "./components/table/UsersTableFilters";

import { AppDispatch, RootState } from "@/lib/store/store";

export default function Usuarios() {
  const token = Cookies.get("auth-token");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<GetAdminUsersParams>({
    searchQuery: "",
    status: [],
    roleTemplateIds: [],
    companyId: [],
    startDate: "",
    endDate: "",
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const usersState = useSelector((state: RootState) => state.users.users) || [];
  const totalRecords = useSelector(
    (state: RootState) => state.users.totalRecordsUsers || 0
  );
  const isLoading = useSelector((state: RootState) => state.users.loading);

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
    getUsers();
  }, [
    token,
    JSON.stringify(searchParams.companyId),
    JSON.stringify(searchParams.roleTemplateIds),
    JSON.stringify(searchParams.status),
    JSON.stringify(searchParams.searchQuery),
    JSON.stringify(searchParams.startDate),
    JSON.stringify(searchParams.endDate),
    currentPage,
    itemsPerPage,
  ]);

  const getUsers = async () => {
    if (!token) return;
    try {
      await dispatch(
        fetchUsers({
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

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title="Usuarios" total={totalRecords} />
      <UsersTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <UsersTable
        paginatedData={usersState}
        getUsers={getUsers}
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
}
