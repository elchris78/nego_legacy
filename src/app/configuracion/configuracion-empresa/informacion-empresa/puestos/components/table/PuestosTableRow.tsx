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

import type { Puestos } from "../../services/puestosTypes"; 
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import alerta from "@/Asset/alerta 1.png";
import DeletePuestosModal from "./DeletePuestosModal";
import { togglePuestosStatus } from "../../services/puestosAction";
import { ComicTooltip } from "@/components/ui/LabelTooltip";

const toggleStatusClaim =
  "Configuración.Configuración empresa.Información de la empresa.Puestos.ToggleStatus";
const deleteClaim =
  "Configuración.Configuración empresa.Información de la empresa.Puestos.Eliminar";
const updateClaim =
  "Configuración.Configuración empresa.Información de la empresa.Puestos.Actualizar";

interface Props {
  index: number;
  startIndex: number;
  puestos: Puestos;
  getPuesto: () => Promise<void>;
}

const PuestosTableRow = ({ index, startIndex, puestos, getPuesto }: Props) => {
  const token = Cookies.get("auth-token") || "";
  const router = useRouter();

  const [isActive, setisActive] = useState<boolean>(puestos?.estatus ?? false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    setisActive(puestos.estatus);
  }, [puestos.estatus]);



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
      // Verifica si el usuario tiene el claim necesario
      if (!navigator.onLine ) {
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
      const resp = await togglePuestosStatus({ token, id: puestos?.id, isActive: !puestos?.estatus });
      if (resp?.success) 
        {
        Swal.fire({
          title: "¡ÉXITO!",
          text:
            resp.message ||
            "Estado del Puesto actualizado correctamente en la empresa seleccionada.",
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
        await getPuesto()
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
          {puestos?.id}
        </TableCell>
        <TableCell className="text-[#3C98CB]">
          {puestos.nombre.length > 20 ? (
            <ComicTooltip title={puestos?.nombre} placement="top-start">
              <Link
                className="cursor-pointer hover:underline"
                href={`/configuracion/configuracion-empresa/informacion-empresa/puestos/form?mode=view&id=${puestos?.id}`}
              >
                {puestos?.nombre.slice(0, 20) + "..."}
              </Link>
            </ComicTooltip>
          ):(
          <Link
            className="cursor-pointer hover:underline"
            href={`/configuracion/configuracion-empresa/informacion-empresa/puestos/form?mode=view&id=${puestos?.id}`}
          >
            {puestos?.nombre}
          </Link>
          )}
        </TableCell>
        <TableCell>
          {puestos?.descripcion.length > 20 ? (
            <ComicTooltip title={puestos?.descripcion} placement="top-start">
              <span>{puestos?.descripcion.slice(0, 20) + "..."}</span> 
            </ComicTooltip>
          ):(
            puestos?.descripcion
          )}
        </TableCell>
        <TableCell>
          {puestos?.aplicaPara}
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
                    href={`/configuracion/configuracion-empresa/informacion-empresa/puestos/form?mode=edit&id=${puestos?.id}`}
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
      <DeletePuestosModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        id={puestos?.id}
        getPuesto={getPuesto}
      />
    </>
  );
};

export default PuestosTableRow;
