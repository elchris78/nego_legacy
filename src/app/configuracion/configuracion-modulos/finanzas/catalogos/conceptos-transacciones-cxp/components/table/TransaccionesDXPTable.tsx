import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TransaccionesDXPTableRow from "./TransaccionesDXPTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { TransaccionesDXP } from "../../services/transaccionesDXPTypes";

interface Props {
  transaccionesDXP: TransaccionesDXP[] | null;
  startIndex: number;
  isLoading?: boolean;
  getData: () => Promise<void>;
}

const tableHeaders = [
  "#",
  "Clave concepto",
  "Concepto de transacción CXP",
  "Origen",
  "Contrapartida",
  "Tipo de transacción",
  "Forma de pago",
  "Estatus",
];

const TransaccionesDXPTable = ({ transaccionesDXP, startIndex, isLoading, getData }: Props) => {
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
          ) : transaccionesDXP && transaccionesDXP.length > 0 ? (
            transaccionesDXP.map((transaccionesDXP, index) => (
              <TransaccionesDXPTableRow
                key={transaccionesDXP.id}
                index={index}
                transaccionesDXP={transaccionesDXP}
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

export default TransaccionesDXPTable;
