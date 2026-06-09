import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CancelConceptsTableRow from "./CancelConceptsTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { CancelConcepts } from "../../services/cancelConceptsTypes";

interface Props {
  paginatedData: CancelConcepts[];
  startIndex: number;
  getConceptoCancelacion: () => Promise<void>;
  isLoading?: boolean;
}

const tableHeaders = [
  "#",
  "Clave",
  "Concepto de cancelación",
  "Afecta a",
  "Motivos SAT",
  "Estatus",
];

const CancelConceptsTable = ({
  paginatedData,
  startIndex,
  getConceptoCancelacion,
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
            <TableHead className="border-r border-[#EDEDED] text-[#5B6670] flex justify-center items-center">
              <CircleEllipsisIcon />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoader length={tableHeaders.length + 1} />
          ) : paginatedData && paginatedData.length > 0 ? (
            paginatedData.map((cancelConcept, index) => (
              <CancelConceptsTableRow
                key={cancelConcept.id}
                index={index}
                cancelConcept={cancelConcept}
                startIndex={startIndex}
                getConceptoCancelacion={getConceptoCancelacion}
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

export default CancelConceptsTable;
