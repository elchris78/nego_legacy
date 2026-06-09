"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleEllipsisIcon } from "lucide-react";

import { UsersTableRow } from "./UsersTableRow";
import EmptyTable from "@/components/ui/Tables/EmptyTable";
import TableLoader from "@/components/ui/Tables/TableLoader";

import { GetAdminUserResponse } from "../../services/adminUsersTypes";

interface Props {
  paginatedData: GetAdminUserResponse[];
  getUsers: () => Promise<void>;
  startIndex: number;
  isLoading?: boolean;
}

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

export const UsersTable = ({
  paginatedData,
  getUsers,
  startIndex,
  isLoading,
}: Props) => {
  return (
    <div className="p-5">
      <Table className="border-[5px] border-solid border-[#EDEDED]">
        <TableHeader className="bg-[#EDEDED]">
          <TableRow className="p-5">
            {tableHeaders.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
            <TableHead className="flex justify-center items-center">
              <CircleEllipsisIcon />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoader length={tableHeaders.length + 1} />
          ) : paginatedData && paginatedData.length > 0 ? (
            paginatedData.map((user, index) => (
              <UsersTableRow
                key={user.id}
                index={index}
                user={user}
                getUsers={getUsers}
                startIndex={startIndex}
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
