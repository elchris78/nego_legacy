import { useEffect, useState } from "react";

import { EllipsisIcon, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";

import type { Marcas } from "../../services/MarcasTypes"; 
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import alerta from "@/Asset/alerta 1.png";
import { toggleMarcasStatus, getMarcas } from '../../services/MarcaAction';
import { ComicTooltip } from "@/components/ui/LabelTooltip";
import DeleteMarcaModal from "./DeleteMarcaModal";

const toggleStatusClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Marcas.ToggleStatus";
const deleteClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Marcas.Eliminar";
const updateClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Marcas.Actualizar";

interface Props {
  index: number;
  startIndex: number;
  marcas: Marcas;
  getMarcas: () => Promise<void>;
}

const PuestosTableRow = ({ index, startIndex, marcas, getMarcas }: Props) => {
  const token = Cookies.get("auth-token") || "";
  const router = useRouter();

  const [isActive, setisActive] = useState<boolean>(marcas?.estatus ?? false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    setisActive(marcas.estatus);
  }, [marcas.estatus]);



  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claims.data);

  // const menuRef = useRef<HTMLDivElement>(null);
  // const [isActionsVisible, setIsActionsVisible] = useState(false);
  // Filtrar navegación según los claims
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const handleToggleStatus = async (newState: boolean) => {
    try {
      if (!navigator.onLine) {
        Swal.fire({
          title: "¡ERROR!",
          text: "Solicita el permiso con tu superior para realizar esta acción.",
          icon: "error",
          confirmButtonText: "Cerrar",
          customClass: {
            container: "swal2-container",
            popup: "swal-popup-error",
            confirmButton: "swal-confirm-button",
            title: "swal-title",
            actions: 'swal-actions',
          },
        });
        return; // Salir de la función si no tiene el claim
      }

      setisActive(newState);
      const resp = await toggleMarcasStatus({ token, id: marcas?.id, isActive: !marcas?.estatus });
      if (resp?.success) 
        {
        Swal.fire({
          title: "¡ÉXITO!",
          text:
            resp.message ||
            "Estado de la marca actualizado correctamente en la empresa seleccionada.",
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: {
            container: "swal2-container",
            popup: "swal-popup-succes",
            confirmButton: "swal-confirm-button",
            title: "swal-title",
            actions: 'swal-actions',
          },
        });
        await getMarcas()
      }
    } catch (error) {
      console.log("🚀 ~ handleToggleStatus ~ error:", error);
      Swal.fire({
        title: "¡ERROR!",
        text: "Ocurrió un error al cambiar el estatus del Puesto.",
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: {
          container: "swal2-container",
          popup: "swal-popup-error",
          confirmButton: "swal-confirm-button",
          title: "swal-title",
          actions: 'swal-actions',
        },
      });
      setisActive(!newState);
    }
  };

  const handleDeletePuestos = async () => {
    setIsOpenModal(true);
  };
  

  return (
    <> 
      <TableRow>
        <TableCell className="text-center">
          {startIndex + index + 1}
        </TableCell>
        <TableCell className="text-center">
          {marcas?.id}
        </TableCell>
        <TableCell className="text-[#3C98CB]">
          {marcas.nombre?.length > 20 ? (
            <ComicTooltip title={marcas?.nombre} placement="top-start">
              <Link
                className="cursor-pointer hover:underline"
                href={`/configuracion/configuracion-modulos/almacenes/catalogos/marcas/form?mode=view&id=${marcas?.id}`}
              >
                {marcas?.nombre.slice(0, 20) + "..."}
              </Link>
            </ComicTooltip>
          ):(
          <Link
            className="cursor-pointer hover:underline"
            href={`/configuracion/configuracion-modulos/almacenes/catalogos/marcas/form?mode=view&id=${marcas?.id}`}
          >
            {marcas?.nombre}
          </Link>
          )}
        </TableCell>
         <TableCell>
          {marcas.fabricante?.length > 20 ? (
            <ComicTooltip title={marcas?.fabricante} placement="top-start">
              
              <span>{marcas?.fabricante.slice(0, 20) + "..."}</span>  
              
            </ComicTooltip>
          ):(
            <span>{marcas?.fabricante}</span> 
          )}
        </TableCell>
        
        <TableCell className="flex justify-center">
          <Switch
            checked={isActive}
            onCheckedChange={(newState) => handleToggleStatus(newState)}
            disabled={!hasClaim(toggleStatusClaim)}
            className="data-[state=checked]:bg-[#3C98CB]"
          />
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
                { hasClaim(updateClaim) && (
                  <Link
                    href={`/configuracion/configuracion-modulos/almacenes/catalogos/marcas/form?mode=edit&id=${marcas?.id}`}
                    className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                  >
                    <PencilLine size={18} />
                  </Link>
                )}
                {hasClaim(deleteClaim) && (
                  <Trash2
                    size={18}
                    className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                    onClick={handleDeletePuestos}
                  />
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
      <DeleteMarcaModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        id={marcas?.id}
        getMarcas={getMarcas}
      />
    </>
  );
};

export default PuestosTableRow;
