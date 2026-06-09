import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MovimientosInventarioTableRow from "./MovimientosInventarioTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { MovimientoInventario } from "../../services/movimientosInventarioTypes";

interface Props {
  movimientos: MovimientoInventario[] | null;
  startIndex: number;
  isLoading?: boolean;
  getData: () => Promise<void>;
}

const tableHeaders = [
  "#",
  "Clave concepto",
  "Concepto de movimiento al inventario",
  "Origen",
  "Aplica para",
  "Tipo de movimiento",
  "Folio",
  "Estatus",
];

const MovimientosInventarioTable = ({
  movimientos,
  startIndex,
  isLoading,
  getData,
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
          ) : movimientos && movimientos.length > 0 ? (
            movimientos.map((movimiento, index) => (
              <MovimientosInventarioTableRow
                key={movimiento.id}
                movimiento={movimiento}
                index={index}
                startIndex={startIndex}
                getData={getData}
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

export default MovimientosInventarioTable;
