import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableHead as TH,
} from "@/components/ui/table";
import DocumentacionTableRow from "./DocumentacionTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";
import { AddDocumentSucursal } from "../../../../services/sucursalesTypes";


interface Props {
  paginatedData: AddDocumentSucursal[];
  startIndex: number;
  isLoading?: boolean;                // <-- añadimos isLoading
}

const tableHeaders = [
  "#",
  "Formato",
  "Nombre del archivo",
  "Fecha de carga",
];

const DocuemntacionTable = ({ paginatedData, startIndex, isLoading = false }: Props) => {
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
            paginatedData.map((documentacionValue, index) => (
              <DocumentacionTableRow
                key={documentacionValue.id}
                index={index}
                documentacionValue={documentacionValue}
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

export default DocuemntacionTable;
