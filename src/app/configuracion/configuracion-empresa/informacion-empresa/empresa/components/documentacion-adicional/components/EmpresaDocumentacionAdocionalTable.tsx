import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmpresaDocumentacionAdicionalTableRow from "./EmpresaDocumentacionAdicionalTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { EmpresaDocumentacionAdicional } from "../services/empresaDocumentacionAdicionalTypes";

interface Props {
  documentos: EmpresaDocumentacionAdicional[] | null;
  startIndex: number;
  isLoading: boolean;
  getData?: () => void; // Optional function to refresh data
}

const tableHeaders = ["#", "Formato", "Nombre del archivo", "Fecha de carga"];

const EmpresaDocumentacionAdocionalTable = ({
  documentos,
  startIndex,
  isLoading,
  getData = () => {},
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
          ) : documentos && documentos.length > 0 ? (
            documentos.map((documento, index) => (
              <EmpresaDocumentacionAdicionalTableRow
                key={documento.id}
                index={index}
                documento={documento}
                startIndex={startIndex}
                getData={getData}
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

export default EmpresaDocumentacionAdocionalTable;
