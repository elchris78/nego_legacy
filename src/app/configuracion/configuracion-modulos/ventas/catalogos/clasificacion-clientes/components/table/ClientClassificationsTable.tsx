import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClientsClassificationTableRow from "./ClientsClassificationTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { ClientClassification } from "../../services/clientesClassificationTypes";

interface Props {
  paginatedData: ClientClassification[] | null;
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = [
  "#",
  "Clave",
  "Nombre de la clasificación",
  "Descripción",
  "Estatus",
];

const ClientClassificationsTable = ({
  paginatedData,
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
          ) : paginatedData && paginatedData.length > 0 ? (
            paginatedData.map((clientClassification, index) => (
              <ClientsClassificationTableRow
                key={clientClassification.id}
                index={index}
                clientClassification={clientClassification}
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

export default ClientClassificationsTable;
