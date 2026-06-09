import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MarcasTableRow from "./MarcaTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { Marcas } from "../../services/MarcasTypes";

interface Props {
  paginatedData: Marcas[];
  startIndex: number;
  getMarcas: () => Promise<void>;
  isLoading?: boolean;
}

const tableHeaders = ["#", "Clave", "Marca", "Fabricante", "Estatus"];

const PresentacionesTable = ({
  paginatedData,
  startIndex,
  getMarcas,
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
            paginatedData.map((marcas, index) => (
              <MarcasTableRow
                key={marcas.id}
                index={index}
                marcas={marcas}
                startIndex={startIndex}
                getMarcas={getMarcas}
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

export default PresentacionesTable;
