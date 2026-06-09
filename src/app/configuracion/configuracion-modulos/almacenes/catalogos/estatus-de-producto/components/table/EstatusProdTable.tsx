import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EstatusProdTableRow from "./EstatusProdTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { Estatus } from "../../services/estatusProdTypes";

interface Props {
  paginatedData: Estatus[];
  startIndex: number;
  getEstatusProd: () => Promise<void>;
  isLoading?: boolean;
}

const tableHeaders = ["#", "Clave", "Nombre del estatus del producto", "Estatus"];

const EstatusProdTable = ({
  paginatedData,
  startIndex,
  getEstatusProd,
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
            paginatedData.map((estatusProd, index) => (
              <EstatusProdTableRow
                key={estatusProd.id}
                index={index}
                estatusProd={estatusProd}
                startIndex={startIndex}
                getEstatusProd={getEstatusProd}
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

export default EstatusProdTable;
