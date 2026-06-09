import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DepartamentoTableRow } from "./DepartamentoTableRow";
import { CircleEllipsisIcon } from "lucide-react";
import { DepartamentoTableRowDown } from "./DepartamentoTableRowDown";

interface Props {
  paginatedData: any[];
  getDepartamentos: () => void;
  startIndex: number;
}

const tableHeaders = [
  "#",
  "ID",
  "Departamento",
  "Área",
  "Nombre del responsable",
  "Fecha de creación",
  "Estatus",
];

export const DepartamentoTableDown = ({
  paginatedData,
  getDepartamentos,
  startIndex
}: Props) => {
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
          {paginatedData && paginatedData.length > 0 ? (
            paginatedData.map((departamento, index) => (
              <DepartamentoTableRowDown
                index={index}
                key={departamento.id}
                departamento={departamento}
                getDepartamentos={getDepartamentos}
                startIndex={startIndex}
              />
            ))
          ) : (
            <tr>
              <td colSpan={5}>No hay datos disponibles</td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
