import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RestrictionConceptsTableRow from "./RestrictionConceptsTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { RestrictionConcept } from "../../services/restrictionConceptsTypes";

interface Props {
  restrictionConcepts: RestrictionConcept[] | null;
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = [
  "#",
  "Clave",
  "Concepto de restricción",
  "Descripción",
  "Advertencia",
  "Aplica para",
  "Requiere autorización",
  "Requiere notificación",
  "Estatus",
];

const RestrictionConceptsTable = ({
  restrictionConcepts,
  startIndex,
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
          ) : restrictionConcepts && restrictionConcepts.length > 0 ? (
            restrictionConcepts.map((restrictionConcept, index) => (
              <RestrictionConceptsTableRow
                key={restrictionConcept.id}
                index={index}
                restrictionConcept={restrictionConcept}
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

export default RestrictionConceptsTable;
