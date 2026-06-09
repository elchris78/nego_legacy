import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from 'lucide-react';
import { useRouter } from "next/navigation";
import { DeleteSucursalModal } from "./DeleteSucursalModal";
import { useState } from "react";
import { SucursalTableRow } from './SucursalTableRow';
import accionesIcono from "@/assets/Acciones.svg";

interface Props {
  paginatedData: any[];
  getDepartamentos: () => void;
}

const tableHeaders = [
  "ID",
  "Sucursal",
  "Estado",
  "Fecha de creación",
  "Estatus",
  "Acciones",
];

export const PlantillaTable = ({ paginatedData, getDepartamentos }: Props) => {
  const router = useRouter();

  const renderHeaderContent = (header: string) => {
    if (header === "Estatus" || header === "Acciones") {
      return <div className="text-center">{header}</div>;
    }
    
    return (
      <div className="flex items-center justify-between w-full px-4">
        <span className="flex-1 text-center">{header}</span>
        <ChevronDown className="w-6 h-6 text-[#5B89B4]" />
      </div>
    );
  };

  return (
    <div className="h-[60vh] p-5 sm:h-[60vh] overflow-auto">
      <Table className="border-[5px] border-solid border-[#EDEDED]">
        <TableHeader className="bg-[#EDEDED]">
          <TableRow className="p-5 border rounded-lg">
            {tableHeaders.map((header) => (
              <TableHead
                key={header}
                className="border-r border-[#EDEDED] text-slate-800 cursor-pointer hover:bg-gray-100"
              >
                {renderHeaderContent(header)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((sucursal) => (
            <SucursalTableRow
              key={sucursal.id}
              sucursal={sucursal}
              getDepartamentos={getDepartamentos}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

