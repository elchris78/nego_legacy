import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmpaquesTableRow from "./EmpaquesTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { Empaque } from "../../services/empaquesTypes";

interface Props {
  empaques: Empaque[] | null;
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = ["#", "Clave", "Descripción", "Unidades SAT", "Estatus"];

const EmpaquesTable = ({ empaques, startIndex, isLoading }: Props) => {
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
          ) : empaques && empaques.length > 0 ? (
            empaques.map((empaque, index) => (
              <EmpaquesTableRow
                key={empaque.id}
                index={index}
                empaque={empaque}
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

export default EmpaquesTable;
