import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableHead as TH,
} from "@/components/ui/table";
import CXCTableRow from "./CXCsTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { CXC } from "../../services/cxcsTypes";

interface Props {
  paginatedData: CXC[];
  startIndex: number;
  isLoading?: boolean;                // <-- añadimos isLoading
}

const tableHeaders = [
  "#",
  "Clave",
  "Origen",
  "Tipo de Documento CxC",
  "Estatus",
];

const CXCsTable = ({ paginatedData, startIndex, isLoading = false }: Props) => {
  // Número de columnas (headers) + 1 para la columna de acciones
  const colSpanLength = tableHeaders.length + 1;

  return (
    <div className="p-5">
      <Table className="border-[5px] border-solid border-[#EDEDED]">
        <TableHeader className="bg-[#EDEDED]">
          <TableRow className="p-5">
            {tableHeaders.map((header) => (
              <TH
                key={header}
                className="border-r border-[#EDEDED] text-slate-800 text-center"
              >
                {header}
              </TH>
            ))}
            <TH className="border-r border-[#EDEDED] text-slate-800 flex justify-center items-center">
              <CircleEllipsisIcon className="mr-1 mt-1" color="#BDC3C7" />
            </TH>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Muestra el loader mientras carga
            <TableLoader length={colSpanLength} />
          ) : paginatedData && paginatedData.length > 0 ? (
            // Si hay datos, renderiza las filas
            paginatedData.map((tipoDocumento, index) => (
              <CXCTableRow
                key={tipoDocumento.id}
                index={index}
                tipoDocumento={tipoDocumento}
                startIndex={startIndex}
              />
            ))
          ) : (
            // Si no hay datos y no está cargando, muestra mensaje vacío
            <EmptyTable length={colSpanLength} />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CXCsTable;
