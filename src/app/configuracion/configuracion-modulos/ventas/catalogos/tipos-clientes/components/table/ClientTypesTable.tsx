import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClientTypesTableRow from "./ClientTypesTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { ClientType } from "../../services/clientTypes";

interface Props {
  clientTypes: ClientType[] | null;
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = [
  "#",
  "Clave",
  "Nombre del Tipo de cliente",
  "Descripción",
  "Estatus",
];

const ClientTypesTable = ({ clientTypes, startIndex, isLoading }: Props) => {
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
          ) : clientTypes && clientTypes.length > 0 ? (
            clientTypes.map((clientType, index) => (
              <ClientTypesTableRow
                key={clientType.id}
                index={index}
                clientType={clientType}
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

export default ClientTypesTable;
