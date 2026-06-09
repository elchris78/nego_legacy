import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PuestosTableRow from "./PuestosTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { Puestos } from "../../services/puestosTypes";

interface Props {
  paginatedData: Puestos[];
  startIndex: number;
  getPuesto: () => Promise<void>;
  isLoading?: boolean;
}

const tableHeaders = [
  "#",
  "Clave",
  "Nombre del puesto",
  "Descripción",
  "Aplica para",
  "Estatus",
];

const PuestosTable = ({
  paginatedData,
  startIndex,
  getPuesto,
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
            paginatedData.map((puesto, index) => (
              <PuestosTableRow
                key={puesto.id}
                index={index}
                puestos={puesto}
                startIndex={startIndex}
                getPuesto={getPuesto}
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

export default PuestosTable;
