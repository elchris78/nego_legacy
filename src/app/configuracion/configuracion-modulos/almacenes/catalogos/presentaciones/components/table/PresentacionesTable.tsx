import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PresentacionesTableRow from "./PresentacionesTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { Presentaciones } from "../../services/presentacionesTypes";

interface Props {
  paginatedData: Presentaciones[];
  startIndex: number;
  getPresentaciones: () => Promise<void>;
  isLoading?: boolean;
}

const tableHeaders = ["#", "Clave", "Descripción", "Estatus"];

const PresentacionesTable = ({
  paginatedData,
  startIndex,
  getPresentaciones,
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
            paginatedData.map((presentaciones, index) => (
              <PresentacionesTableRow
                key={presentaciones.id}
                index={index}
                presentaciones={presentaciones}
                startIndex={startIndex}
                getPresentaciones={getPresentaciones}
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
