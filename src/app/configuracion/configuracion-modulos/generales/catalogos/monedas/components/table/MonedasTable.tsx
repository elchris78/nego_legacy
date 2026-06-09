import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MonedasTableRow from "./MonedasTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { Monedas } from "../../services/monedasTypes";

interface Props {
  monedas: Monedas[] | null;
  startIndex: number;
  isLoading?: boolean;
  getData: () => void;
}

const tableHeaders = [
  "#",
  "Clave",
  "Moneda SAT",
  "Descripción",
  "País",
  "Tipo de Cambio",
  "Estatus",
];

const MonedasTable = ({ monedas, startIndex, isLoading, getData }: Props) => {
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
          ) : monedas && monedas.length > 0 ? (
            monedas.map((monedas, index) => (
              <MonedasTableRow
                key={monedas.id}
                index={index}
                monedas={monedas}
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

export default MonedasTable;
