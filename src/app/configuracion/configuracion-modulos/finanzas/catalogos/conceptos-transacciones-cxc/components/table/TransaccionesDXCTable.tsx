import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SellersTableRow from "./TransaccionesDXCTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { TransaccionesDXC } from "../../services/transaccionesDXCTypes";

interface Props {
  transaccionesDXC: TransaccionesDXC[] | null;
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = [
  "#",
  "Clave concepto",
  "Origen",
  "Concepto de transacción CXC",
  "Contrapartida",
  "Tipo de transacción",
  "Tipo de relación SAT",
  "Forma de pago",
  "Estatus",
];

const TransaccionesDXCTable = ({ transaccionesDXC, startIndex, isLoading }: Props) => {
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
          ) : transaccionesDXC && transaccionesDXC.length > 0 ? (
            transaccionesDXC.map((transaccionesDXC, index) => (
              <SellersTableRow
                key={transaccionesDXC.id}
                index={index}
                transaccionesDXC={transaccionesDXC}
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

export default TransaccionesDXCTable;
