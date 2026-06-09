import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TypesWarehousesTableRow from "./TypesWarehousesTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { TypesWarehouses } from "../../services/typesWarehousesTypes";

interface Props {
  paginatedData: TypesWarehouses[];
  startIndex: number;
  getTypesWarehouses: () => Promise<void>;
  isLoading?: boolean;
}

const tableHeaders = ["#", "Clave", "Nombre de tipo de almacén", "Origen", "Estatus"];

const TypesWarehousesTable = ({
  paginatedData,
  startIndex,
  getTypesWarehouses,
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
            paginatedData.map((typesWarehouses, index) => (
              <TypesWarehousesTableRow
                key={typesWarehouses.id}
                index={index}
                typesWarehouses={typesWarehouses}
                startIndex={startIndex}
                getTypesWarehouses={getTypesWarehouses}
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

export default TypesWarehousesTable;
