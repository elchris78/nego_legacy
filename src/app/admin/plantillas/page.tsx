"use client";

import { useEffect, useState } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { getTemplates as fetchTemplates } from "./services/plantillasSlice";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { PlantillaTable } from "./components/table/PlantillaTable";
import { PlantillaTableFilter } from "./components/table/PlantillaTableFilter";
import { RolTemplatesAdminParams } from "./services/plantillasTypes";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";

import { AppDispatch, RootState } from "@/lib/store/store";

export default function Page() {
  const token = Cookies.get("auth-token");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<RolTemplatesAdminParams>({
    searchQuery: "",
    active: [],
    companyId: [],
    startDate: "",
    endDate: "",
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const templatesState = useSelector(
    (state: RootState) => state.plantillas.roleTemplates
  );
  const totalRecords =
    useSelector((state: RootState) => state.plantillas.totalRecordsTemplates) ||
    0;
  const isLoading = useSelector((state: RootState) => state.plantillas.loading);

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
    JSON.stringify(searchParams.companyId),
    JSON.stringify(searchParams.active),
    JSON.stringify(searchParams.startDate),
    JSON.stringify(searchParams.endDate),
    JSON.stringify(searchParams.searchQuery),
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
    <div className="mt-0 md:mt-5">
      <TableTitle title="Plantillas de perfil" total={totalRecords} />
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
