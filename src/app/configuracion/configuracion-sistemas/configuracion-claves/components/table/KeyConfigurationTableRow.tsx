import { useEffect, useState } from "react";

import { EllipsisIcon, PencilLine, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteKeyConfigurationModal from "./DeleteKeyConfigurationModal";
import { RootState } from "@/lib/store/store";
import type { KeyConfiguration } from "../../services/keyConfigurationTypes";


const deleteClaim =
  "Configuración.Configuración del sistema.Definición de claves de catálogos.Eliminar";
const updateClaim =
  "Configuración.Configuración del sistema.Definición de claves de catálogos.Actualizar";

interface Props {
  index: number;
  startIndex: number;
  keyConfiguration: KeyConfiguration;
}

const KeyConfigurationTableRow = ({ index, startIndex, keyConfiguration }: Props) => {

  const [isOpenModal, setIsOpenModal] = useState(false);


  const handleReturnConcept = () => {
    setIsOpenModal(true);
  };

  const claims = useSelector((state: RootState) => state.claims.data);

  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  return (
    <>
      <TableRow>
        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
        <TableCell className="text-center">{keyConfiguration?.modulo}</TableCell>
        <TableCell className="text-[#3C98CB]">
          <Link
            className="cursor-pointer hover:underline"
            href={`/configuracion/configuracion-sistemas/configuracion-claves/form?mode=view&id=${keyConfiguration?.catalogo}`}
          >
            {keyConfiguration?.catalogo}
          </Link>
        </TableCell>
        <TableCell className="flex justify-center">
          {keyConfiguration?.tipoClave}
        </TableCell>
       <TableCell>
        {keyConfiguration?.tipoPrefijo || 'N/A'}
       </TableCell>
        <TableCell>
          {keyConfiguration.prefijo || 'N/A'}
        </TableCell>
        <TableCell>
          <Popover>
            <PopoverTrigger
              className="flex items-center justify-center w-full cursor-pointer"
              asChild
            >
              <EllipsisIcon className="mr-1 mt-1" color="#BDC3C7" />
            </PopoverTrigger>
            <PopoverContent align="center" className="p-2 w-fit">
              <div className="flex flex-row gap-2">
                {hasClaim(updateClaim) && keyConfiguration.isEmpty && (
                  <Link
                    href={`/configuracion/configuracion-sistemas/configuracion-claves/form?mode=edit&id=${keyConfiguration?.catalogo}`}
                    className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                  >
                    <PencilLine size={18} />
                  </Link>
                )}
                {hasClaim(deleteClaim) && keyConfiguration.isEmpty && (
                  <Trash2
                    size={18}
                    className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                    onClick={handleReturnConcept}
                  />
                )}
                {!keyConfiguration.isEmpty && (
                  <span className="text-gray-500 text-sm">Catálogo con registros</span>
                )}
                {!hasClaim(updateClaim) && !hasClaim(deleteClaim) && (
                  <span className="text-gray-500 text-sm">Sin permisos</span>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>

      {/* Delete modal */}
      <DeleteKeyConfigurationModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        catalogo={keyConfiguration?.catalogo}
      />
    </>
  );
};

export default KeyConfigurationTableRow;
