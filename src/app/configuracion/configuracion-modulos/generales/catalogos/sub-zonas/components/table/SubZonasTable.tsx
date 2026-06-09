import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SubZonasTableRow from "./SubZonasTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { SubZona } from "../../services/subZonasTypes";

interface Props {
  subZonas: SubZona[] | null;
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = ["#", "Clave SubZona", "Zona", "Nombre", "Estatus"];

const SubZonasTable = ({ subZonas, startIndex, isLoading }: Props) => {
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
          ) : subZonas && subZonas.length > 0 ? (
            subZonas.map((subZona, index) => (
              <SubZonasTableRow
                key={subZona.id}
                index={index}
                subZona={subZona}
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

export default SubZonasTable;
