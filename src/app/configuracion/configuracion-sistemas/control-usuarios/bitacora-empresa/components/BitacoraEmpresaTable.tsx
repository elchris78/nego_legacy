import { useState } from "react";

import { ArrowDown, ArrowUp } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BitacoraEmpresaTableRow } from "./BitacoraEmpresaTableRow";
import { Button } from "@/components/ui/button";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

interface Props {
  paginatedData: any[];
  getData: () => Promise<void>;
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = [
  { label: "#", key: "index" },
  { label: "Folio de registro", key: "#" },
  { label: "Usuario", key: "#" },
  { label: "Módulo", key: "#" },
  { label: "Submódulo", key: "#" },
  { label: "Acción", key: "#" },
  { label: "ID del documento", key: "#" },
  { label: "Nombre del equipo", key: "#" },
  { label: "Fecha", key: "date" },
  { label: "Hora", key: "#" },
];

export const BitacoraEmpresaTable = ({
  paginatedData,
  startIndex,
  isLoading,
}: Props) => {
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (field !== sortField) return <ArrowDown className="ml-2 h-4 w-4" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const sortedData = [...paginatedData].sort((a, b) => {
    if (
      !sortField ||
      !a.hasOwnProperty(sortField) ||
      !b.hasOwnProperty(sortField)
    )
      return 0;

    const valueA = a[sortField] ?? "";
    const valueB = b[sortField] ?? "";

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortOrder === "asc"
        ? valueA < valueB
          ? -1
          : 1
        : valueA > valueB
          ? -1
          : 1;
    }
  });

  return (
    <div className="p-5">
      <Table className="border-[5px] border-solid border-[#EDEDED]">
        <TableHeader className="bg-[#EDEDED]">
          <TableRow className="p-5">
            {tableHeaders.map((header, index) => (
              <TableHead key={index}>
                <div className="flex flex-row justify-center items-center">
                  {header.label}
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(header.key)}
                    className="hover:bg-muted"
                  >
                    {getSortIcon(header.key)}
                  </Button>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoader length={tableHeaders.length} />
          ) : sortedData && sortedData.length > 0 ? (
            sortedData.map((user, index) => (
              <BitacoraEmpresaTableRow
                index={index}
                key={user.id}
                user={user}
                startIndex={startIndex}
              />
            ))
          ) : (
            <EmptyTable length={tableHeaders.length} />
          )}
        </TableBody>
      </Table>
    </div>
  );
};
