import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ConceptosTransaccionesBancariasTableRow from "./ConceptosTransaccionesBancariasTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { ConceptoTransaccionBancaria } from "../../services/conceptosTransaccionesBancariasTypes";

interface Props {
  conceptos: ConceptoTransaccionBancaria[] | null;
  startIndex: number;
  isLoading?: boolean;
  getData: () => Promise<void>;
}

const tableHeaders = [
  "#",
  "Clave",
  "Concepto de transacción bancaria",
  "Tipo de transacción",
  "Observaciones",
  "Estatus",
];

const ConceptosTransaccionesBancariasTable = ({
  conceptos,
  startIndex,
  isLoading,
  getData,
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
          ) : conceptos && conceptos.length > 0 ? (
            conceptos.map((concepto, index) => (
              <ConceptosTransaccionesBancariasTableRow
                key={concepto.id}
                concepto={concepto}
                index={index}
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
}

export default ConceptosTransaccionesBancariasTable