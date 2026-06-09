import { useState } from "react";

import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoriesTableRow from "./CategoriesTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { Categories } from "../../services/categoriesTypes";

interface Props {
  paginatedData: Categories[];
  startIndex: number;
  getCategories: () => Promise<void>;
  isLoading?: boolean;
}

const tableHeaders = [
  "#",
  "Clave de categoría",
  "Nombre de categoría",
  "Estatus",
];

const CategoriesTable = ({
  paginatedData,
  startIndex,
  getCategories,
  isLoading,
}: Props) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(
    new Set(["2", "2-1", "2-1-1", "2-1-1-1"]) // Ropa > Playeras > Informal > Cuello redondo
  );
  const handleToggleExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };
const collapseAll = () => {
  setExpandedRows(new Set());
};

  return (
    <div className="p-5">
      <Table className="border-[5px] border-solid border-[#EDEDED]">
        <TableHeader className="bg-[#EDEDED]">
          <TableRow className="p-5">
            {tableHeaders.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
            <TableHead className="border-r border-[#EDEDED] text-[#5B6670] flex justify-center items-center">
              <CircleEllipsisIcon />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoader length={tableHeaders.length + 1} />
          ) : paginatedData && paginatedData.length > 0 ? (
            paginatedData.map((categories, index) => (
              <CategoriesTableRow
                key={categories.id}
                index={index}
                startIndex={startIndex}
                categories={categories}
                getCategories={getCategories}
                indentLevel={0}
                onToggleExpand={handleToggleExpand}
                expandedRows={expandedRows}
                isExpanded={expandedRows.has(categories.id)}
                collapseAll={collapseAll}
              />
            ))
          ) : (
            <EmptyTable length={tableHeaders.length + 1} />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesTable;
