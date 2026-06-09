"use client";
import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { getUsers as fetchCompanyUsers } from "./services/usersCompanySlice";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import { UsersTable } from "./components/table/UsersTable";
import { UsersTableFilters } from "./components/table/UsersTableFilters";

import { GetCompanyUsersParams } from "./services/companyUsersTypes";
import { AppDispatch, RootState } from "@/lib/store/store";

const Usuarios = () => {
  const token = Cookies.get("auth-token");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<GetCompanyUsersParams>({
    searchQuery: "",
    status: [],
    roleTemplateId: [],
    startDate: "",
    endDate: "",
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const usersState = useSelector(
    (state: RootState) => state.usersCompany.users
  );
  const totalRecords = useSelector(
    (state: RootState) => state.usersCompany.totalRecordsUsers
  );
  const isLoading = useSelector(
    (state: RootState) => state.usersCompany.loading
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

  useEffect(() => {
    if (!token) return;
    getUsers();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.status),
    JSON.stringify(searchParams.roleTemplateId),
    searchParams.startDate,
    searchParams.endDate,
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  const getUsers = async () => {
    if (!token) return;
    try {
      await dispatch(
        fetchCompanyUsers({
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
        paginatedData={usersState!}
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
};

export default Usuarios;
