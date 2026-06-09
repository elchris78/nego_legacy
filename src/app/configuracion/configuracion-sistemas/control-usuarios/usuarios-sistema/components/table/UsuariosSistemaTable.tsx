import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UsuariosSistemaTableRow } from "./UsuariosSistemaTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { UserActivityHistoryDto } from "@/lib/services/userActivity/userActivityTypes";

interface Props {
  paginatedData: UserActivityHistoryDto[];
  getUsuariosSistema: () => Promise<void>;
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = [
  { label: "#", key: "index" },
  { label: "ID", key: "#" },
  { label: "Nombre", key: "#" },
  { label: "Usuario", key: "#" },
  { label: "Correo electrónico", key: "#" },
  { label: "Estatus de conexión", key: "#" },
  { label: "Inicio de sesión\n(fecha y hora)", key: "#" },
  { label: "Cierre de sesión\n(fecha y hora)", key: "#" },
  { label: "Motivo de cierre de sesión", key: "#" },
  { label: "Tiempo inactivo hoy (hrs)", key: "#" },
  { label: "Tiempo activo hoy (hrs)", key: "#" },
  { label: "Cierre de sesión", key: "#" },
];

export const UsuariosSistemaTable = ({
  paginatedData,
  startIndex,
  getUsuariosSistema,
  isLoading,
}: Props) => {
  return (
    <div className="p-5">
      <Table className="border-[5px] border-solid border-[#EDEDED]">
        <TableHeader className="bg-[#EDEDED]">
          <TableRow className="p-5">
            {tableHeaders.map((header, index) => (
              <TableHead key={index}>{header.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoader length={tableHeaders.length} />
          ) : paginatedData && paginatedData.length > 0 ? (
            paginatedData.map((user, index) => (
              <UsuariosSistemaTableRow
                key={user.userId}
                user={user}
                index={index}
                startIndex={startIndex}
                getUsuariosSistema={getUsuariosSistema}
              />
            ))
          ) : (
            <EmptyTable length={tableHeaders.length} />
          )}
        </TableBody>
      </Table>
    </div>
  );
};
