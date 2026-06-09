"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { UsersTableRowDown } from "./UsersTableRowDown";

interface Props {
  paginatedData: any[];
  getUsers: () => Promise<void>;
  startIndex: number;
}

// interface Props {
//   paginatedData: any[]
//   getUsuarios: () => void
//   startIndex: number
// }

const tableHeaders = [
  "#",
  "ID",
  "Nombre completo",
  "Usuario",
  "Empresas",
  "Plantillas",
  "Fecha creación",
  "Estatus",
];

export const UsersTableDown = ({ paginatedData, getUsers, startIndex }: Props) => {
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
            {tableHeaders.map((header) => (
              <TableHead
                key={header}
                className="border-r border-[#EDEDED] text-slate-800 text-center h-16"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData && sortedData.length > 0 ? (
            sortedData.map((user, index) => (
              <UsersTableRowDown
                index={index}
                key={user.userId}
                user={user}
                getUsers={getUsers}
                startIndex={startIndex}
              />
            ))
          ) : (
            <TableRow>
              <TableHead
                colSpan={tableHeaders.length + 1}
                className="text-center"
              >
                No hay usuarios
              </TableHead>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
