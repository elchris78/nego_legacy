import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SellersTableRow from "./SellersTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { Sellers } from "../../services/sellersTypes";

interface Props {
  sellers: Sellers[] | null;
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = [
  "#",
  "Clave vendedor",
  "Tipo vendedor",
  "Vendedor",
  "Correo electrónico",
  "Teléfono",
  "Supervisor",
  "Zona",
  "Subzona",
  "Tipo de comisión",
  "Estatus",
];

const SellersTable = ({ sellers, startIndex, isLoading }: Props) => {
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
          ) : sellers && sellers.length > 0 ? (
            sellers.map((sellers, index) => (
              <SellersTableRow
                key={sellers.id}
                index={index}
                sellers={sellers}
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

export default SellersTable;
