import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClientsClassificationTableRow from "./ClientsSubclassificationTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { ClientSubclassification } from "../../services/clientsSubclassificationTypes";

interface Props {
  paginatedData: ClientSubclassification[];
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = [
  "#",
  "Clave",
  "Nombre de la Subclasificación",
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
            paginatedData.map((clientSubclassification, index) => (
              <ClientsClassificationTableRow
                key={clientSubclassification.id}
                index={index}
                clientSubclassification={clientSubclassification}
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
