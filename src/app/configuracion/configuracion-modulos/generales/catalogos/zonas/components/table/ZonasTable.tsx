import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ZonasTableRow from "./ZonasTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { Zona } from "../../services/zonasTypes";

interface Props {
  zonas: Zona[] | null;
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = ["#", "Clave zona", "Nombre de la zona", "Estatus"];

const ZonasTable = ({ zonas, startIndex, isLoading }: Props) => {
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
          ) : zonas && zonas.length > 0 ? (
            zonas.map((zona, index) => (
              <ZonasTableRow
                key={zona.id}
                index={index}
                zona={zona}
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

export default ZonasTable;
