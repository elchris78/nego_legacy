"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { Categories, CategoriesParams } from "./services/categoriesTypes";
import { CategoriesActions } from "./services/categoriesSlice";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import CategoriesTable from "./components/table/CategoriesTable";
import CategoriesTableFilters from "./components/table/CategoriesTableFilters";

import { AppDispatch, RootState } from "@/lib/store/store";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";

const page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("CategoriasProductos");
  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<CategoriesParams>({
    searchQuery: "",
    isActive: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const isLoading = useSelector((state: RootState) => state.categories.loading);
  const totalRecords = useSelector(
    (state: RootState) => state.categories.totalRegistros
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
    getCategories();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.isActive),
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  const getCategories = async () => {
    if (!token) return;
    try {
      await dispatch(
        CategoriesActions.getCategories({
          //cambiar al real cuando exista
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

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Categorías"} total={totalRecords} />
      <CategoriesTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <CategoriesTable
        paginatedData={categories ?? []}
        getCategories={getCategories}
        startIndex={(currentPage - 1) * itemsPerPage}
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

export default page;
