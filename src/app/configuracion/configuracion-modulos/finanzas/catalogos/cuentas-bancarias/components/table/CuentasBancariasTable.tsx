import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CuentasBancariasTableRow from "./CuentasBancariasTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { CuentaBancaria } from "../../services/cuentasBancariasTypes";

interface Props {
  cuentasBancarias: CuentaBancaria[] | null;
  startIndex: number;
  isLoading?: boolean;
  getData: () => Promise<void>;
}

const tableHeaders = [
  "#",
  "Clave",
  "Número de cuenta",
  "Descripción",
  "Banco",
  "Moneda",
  "Sucursal",
  "Tipo de instrumento bancario",
  "Cuenta contable",
  "Estatus",
];

const CuentasBancariasTable = ({
  cuentasBancarias,
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
          ) : cuentasBancarias && cuentasBancarias.length > 0 ? (
            cuentasBancarias.map((cuentaBancaria, index) => (
              <CuentasBancariasTableRow
                key={cuentaBancaria.id}
                cuentaBancaria={cuentaBancaria}
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
};

export default CuentasBancariasTable;
