import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ColaboradoresTableRow from "./ColaboradoresTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { Colaborador } from "../../services/colaboradoresTypes";

interface Props {
  colaboradores: Colaborador[] | null;
  startIndex: number;
  isLoading: boolean;
  getData: () => Promise<void>;
}

const tableHeaders = [
  "#",
  "Clave del colaborador",
  "Tipo de colaborador",
  "Nombre completo",
  "Teléfono",
  "Correo electrónico",
  "Curp",
  "Departamento",
  "Puesto",
  "Estatus",
];

const ColaboradoresTable = ({
  colaboradores,
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
          ) : colaboradores && colaboradores.length > 0 ? (
            colaboradores.map((colaborador, index) => (
              <ColaboradoresTableRow
                key={colaborador.id}
                index={index}
                colaborador={colaborador}
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

export default ColaboradoresTable;
