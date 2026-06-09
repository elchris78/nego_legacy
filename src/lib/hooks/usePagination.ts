import { useState } from "react";

export function usePagination(totalRecords: number, initialItemsPerPage = 20) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages =
    itemsPerPage === 0 ? 1 : Math.ceil(totalRecords / itemsPerPage);

  const maxPage =
    totalRecords === 0 || itemsPerPage === 0
      ? 1
      : Math.ceil(totalRecords / itemsPerPage);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage: handleItemsPerPageChange,
    totalPages,
    goToNextPage,
    goToPrevPage,
    maxPage,
  };
}
