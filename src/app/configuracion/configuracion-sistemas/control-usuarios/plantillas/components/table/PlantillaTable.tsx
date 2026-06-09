import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlantillaTableRow } from "./PlantillaTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import { RoleTemplateResponse } from "../../services/plantillasCompanyTypes";

interface Props {
  paginatedData: RoleTemplateResponse[];
  getPlantillas: () => Promise<void>;
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = [
  "#",
  "ID",
  "Nombre de la plantilla",
  "Fecha de creación",
  "Tipo de plantilla",
  "Estatus",
];

export const PlantillaTable = ({
  paginatedData,
  getPlantillas,
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
            paginatedData.map((plantilla, index) => (
              <PlantillaTableRow
                key={plantilla.roleTemplateId}
                index={index}
                plantilla={plantilla}
                getPlantillas={getPlantillas}
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
