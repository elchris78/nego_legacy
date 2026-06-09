import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TiposContratosBTableRow from "./TiposContratosBTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { TiposContratosB } from "../../services/tiposContratosBTypes";

interface Props {
  tiposContratosB: TiposContratosB[] | null;
  startIndex: number;
  isLoading?: boolean;
  getData: () => Promise<void>;
}

const tableHeaders = [
  "#",
  "Clave",
  "Número de contrato",
  "Nombre del tipo de contrato bancario",
  "Estatus",
];

const TiposContratosBTable = ({ tiposContratosB, startIndex, isLoading, getData }: Props) => {
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
          ) : tiposContratosB && tiposContratosB.length > 0 ? (
            tiposContratosB.map((tiposContratosB, index) => (
              <TiposContratosBTableRow
                key={tiposContratosB.id}
                index={index}
                tiposContratosB={tiposContratosB}
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

export default TiposContratosBTable;
