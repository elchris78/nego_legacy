import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DepartamentoTableRow } from "./DepartamentoTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { DepartmentDto } from "@/lib/services/departments/departmentsTypes";

interface Props {
  paginatedData: DepartmentDto[];
  getDepartamentos: () => void;
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = [
  { key: "index", label: "#" },
  { key: "#", label: "Clave" },
  { key: "#", label: "Departamento" },
  { key: "#", label: "Área" },
  { key: "#", label: "Nombre del responsable" },
  { key: "creationDate", label: "Fecha de creación" },
  { key: "#", label: "Estatus" },
];

export const DepartamentoTable = ({
  paginatedData,
  getDepartamentos,
  startIndex,
  isLoading,
}: Props) => {
  return (
    <div className="p-5">
      <Table className="border-[5px] border-solid border-[#EDEDED]">
        <TableHeader className="bg-[#EDEDED]">
          <TableRow className="p-5">
            {tableHeaders.map((header, index) => (
              <TableHead key={index}>{header.label}</TableHead>
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
            paginatedData.map((department, index) => (
              <DepartamentoTableRow
                index={index}
                key={department?.id}
                departamento={department}
                getDepartamentos={getDepartamentos}
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
