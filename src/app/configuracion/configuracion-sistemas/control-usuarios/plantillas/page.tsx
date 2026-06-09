"use client";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { getTemplates as fetchTemplates } from "./services/plantillasCompanySlice";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { PlantillaTable } from "./components/table/PlantillaTable";
import { PlantillaTableFilter } from "./components/table/PlantillaTableFilter";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";

import { RootState, AppDispatch } from "@/lib/store/store";
import type { RoleTemplatesParams } from "./services/plantillasCompanyTypes";

export default function Page() {
  const token = Cookies.get("auth-token");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<RoleTemplatesParams>({
    searchQuery: "",
    active: [],
    type: [],
    startDate: "",
    endDate: "",
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const templatesState = useSelector(
    (state: RootState) => state.plantillasCompany.roleTemplates
  );
  const totalRecords =
    useSelector(
      (state: RootState) => state.plantillasCompany.totalRecordsTemplates
    ) || 0;
  const isLoading = useSelector(
    (state: RootState) => state.plantillasCompany.loading
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
    getPlantillas();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.active),
    JSON.stringify(searchParams.type),
    searchParams.startDate,
    searchParams.endDate,
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  const getPlantillas = async () => {
    if (!token) return;
    try {
      await dispatch(
        fetchTemplates({
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
      <TableTitle title={"Plantillas de perfiles"} total={totalRecords} />
      <PlantillaTableFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <PlantillaTable
        paginatedData={templatesState}
        getPlantillas={getPlantillas}
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
