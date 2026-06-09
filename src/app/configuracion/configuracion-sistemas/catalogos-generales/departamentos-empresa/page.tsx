"use client";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { DepartamentoTable } from "./components/table/DepartamentoTable";
import { DepartamentoTableFilter } from "./components/table/DepartamentoTableFilter";
import { GetDepartmentsRequest } from "@/lib/services/departments/departmentsTypes";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import { useKeyConfigValidation } from "../../configuracion-claves/hooks/useKeyConfigValidation";

import { getDepartments } from "@/lib/services/departments/departmentsSlice";
import { AppDispatch, RootState } from "@/lib/store/store";
import Loading from "@/components/ui/Modals/loading";

export default function Page() {
  const token = Cookies.get("auth-token") || "";
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("Departamentos");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<GetDepartmentsRequest>({
    SearchTerm: "",
    Names: [],
    Status: [],
    Areas: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const departmentsState = useSelector(
    (state: RootState) => state.departments.departments
  );
  const totalRecords = useSelector(
    (state: RootState) => state.departments.totalRecords
  );
  const isLoading = useSelector(
    (state: RootState) => state.departments.loading
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
    getDepartamentos();
  }, [token, searchParams, currentPage, itemsPerPage]);

  const getDepartamentos = async () => {
    try {
      await dispatch(
        getDepartments({
          token,
          requestParams: {
            PageNumber: currentPage,
            PageSize: itemsPerPage,
            ...searchParams,
          },
        })
      );
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  };

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-0 md:mt-12 flex-grow">
      <TableTitle title="Departamentos" total={totalRecords} />
      <DepartamentoTableFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        getData={getDepartamentos}
      />
      <DepartamentoTable
        paginatedData={departmentsState}
        getDepartamentos={getDepartamentos}
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
