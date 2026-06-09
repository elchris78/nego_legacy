import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TipoAlmacenajeTableRow from "./TipoAlmacenajeTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { TipoAlmacenaje } from "../../services/tipoAlmacenaje";

interface Props {
  paginatedData: TipoAlmacenaje[];
  startIndex: number;
  getTipoAlmacenaje: () => Promise<void>;
  isLoading?: boolean;
}

const tableHeaders = ["#", "Clave", "Tipo de almacenaje", "Estatus"];

const TipoAlmacenajeTable = ({
  paginatedData,
  startIndex,
  getTipoAlmacenaje,
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
            paginatedData.map((tipoAlmacenaje, index) => (
              <TipoAlmacenajeTableRow
                key={tipoAlmacenaje.id}
                index={index}
                tipoAlmacenaje={tipoAlmacenaje}
                startIndex={startIndex}
                getTipoAlmacenaje={getTipoAlmacenaje}
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

export default TipoAlmacenajeTable;
