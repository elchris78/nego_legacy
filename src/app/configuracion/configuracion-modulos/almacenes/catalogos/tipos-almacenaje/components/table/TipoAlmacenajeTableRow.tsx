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

import type { TipoAlmacenaje } from "../../services/tipoAlmacenaje"; 
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import alerta from "@/Asset/alerta 1.png";
import { toggleTiposAlmacenajeStatus } from "../../services/tipoAlmacenajeAction";
import { ComicTooltip } from "@/components/ui/LabelTooltip";
import DeleteTipoAlmacenajeModal from "./DeleteTipoAlmacenajeModal";

const toggleStatusClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Tipos de almacenaje.ToggleStatus";
const deleteClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Tipos de almacenaje.Eliminar";
const updateClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Tipos de almacenaje.Actualizar";

interface Props {
  index: number;
  startIndex: number;
  tipoAlmacenaje: TipoAlmacenaje;
  getTipoAlmacenaje: () => Promise<void>;
}

const TipoAlmacenajeTableRow = ({ index, startIndex, tipoAlmacenaje, getTipoAlmacenaje }: Props) => {
  const token = Cookies.get("auth-token") || "";
  const router = useRouter();

  const [isActive, setisActive] = useState<boolean>(tipoAlmacenaje?.estatus ?? false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    setisActive(tipoAlmacenaje.estatus);
  }, [tipoAlmacenaje.estatus]);



  const claims = useSelector((state: RootState) => state.claims.data);

  // Filtrar navegación según los claims
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const handleToggleStatus = async (newState: boolean) => {
    try {
      // Verifica si el usuario tiene el claim necesario
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
      const resp = await toggleTiposAlmacenajeStatus({ token, id: tipoAlmacenaje?.id, isActive: !tipoAlmacenaje?.estatus });
      if (resp?.success) 
        {
        Swal.fire({
          title: "¡ÉXITO!",
          text:
            resp.message ||
            "Estado del estatusP actualizado correctamente en la empresa seleccionada.",
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
        await getTipoAlmacenaje()
      }
    } catch (error) {
      console.log("🚀 ~ handleToggleStatus ~ error:", error);
      Swal.fire({
        title: "¡ERROR!",
        text: "Ocurrió un error al cambiar el estatus del estatusP.",
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
          {tipoAlmacenaje?.id}
        </TableCell>
        <TableCell className="text-[#3C98CB] text-center">
              <Link
                className="cursor-pointer hover:underline"
                href={`/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenaje/form?mode=view&id=${tipoAlmacenaje?.id}`}
              >
                {tipoAlmacenaje?.tipo}
              </Link>
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
                    href={`/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenaje/form?mode=edit&id=${tipoAlmacenaje?.id}`}
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
      <DeleteTipoAlmacenajeModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        id={tipoAlmacenaje?.id}
        getTipoAlmacenaje={getTipoAlmacenaje}
      />
    </>
  );
};

export default TipoAlmacenajeTableRow;
