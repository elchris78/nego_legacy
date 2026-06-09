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
import DeleteCancelConceptModal from "./DeleteCancelConceptModal";

import type { CancelConcepts } from "../../services/cancelConceptsTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toggleCancelConceptsStatus } from "../../services/conceptosCancelAction";
import { ComicTooltip } from "@/components/ui/LabelTooltip";

const toggleStatusClaim =
  "Configuración.Configuración de módulos.Generales.Catálogos.Conceptos de Cancelación.ToggleStatus";
const deleteClaim =
  "Configuración.Configuración de módulos.Generales.Catálogos.Conceptos de Cancelación.Eliminar";
const updateClaim =
  "Configuración.Configuración de módulos.Generales.Catálogos.Conceptos de Cancelación.Actualizar";
interface Props {
  index: number;
  startIndex: number;
  cancelConcept: CancelConcepts;
  getConceptoCancelacion: () => Promise<void>;
}

const CancelConceptsTableRow = ({
  index,
  startIndex,
  cancelConcept,
  getConceptoCancelacion
}: Props) => {
  const token = Cookies.get("auth-token") || "";
  const router = useRouter();

  const [isActive, setisActive] = useState<boolean>(
    cancelConcept?.estatus ?? false
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };


  useEffect(() => {
    setisActive(cancelConcept?.estatus);
  }, [cancelConcept?.estatus]);

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
      const resp = await toggleCancelConceptsStatus({ token, id: cancelConcept?.id, isActive: !cancelConcept?.estatus });
      if (resp?.success) 
        {
        Swal.fire({
          title: "¡ÉXITO!",
          text:
            resp.message ||
            "Estado del usuario actualizado correctamente en la empresa seleccionada.",
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
        await getConceptoCancelacion();
      }
    } catch (error) {
      console.log("🚀 ~ handleToggleStatus ~ error:", error);
      Swal.fire({
        title: "¡ERROR!",
        text: "Ocurrió un error al cambiar el estatus del usuario.",
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

  const handleDeleteConCacelacion = async () => {
    setIsOpenModal(true)
  };
  

  return (
    <>
      <TableRow>
        <TableCell className="text-center">
          {startIndex + index + 1}
        </TableCell>
        <TableCell className="text-center">
          {cancelConcept?.id}
        </TableCell>
        <TableCell className="text-[#3C98CB]">
          {cancelConcept.concepto.length > 20 ? (
            <ComicTooltip title={cancelConcept?.concepto} placement="top-start">
              <Link
                className="cursor-pointer hover:underline"
                href={`/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion/form?mode=view&id=${cancelConcept?.id}`}
              >
                {cancelConcept?.concepto.slice(0, 20) + "..."}
              </Link>
            </ComicTooltip>
          ):(
            <Link
              className="cursor-pointer hover:underline"
              href={`/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion/form?mode=view&id=${cancelConcept?.id}`}
            >
              {cancelConcept?.concepto}
            </Link>
          )}
        </TableCell>
        <TableCell>
          {cancelConcept?.afectaA}
        </TableCell>
        <TableCell>
          {cancelConcept?.motivoSat}
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
                {hasClaim(updateClaim)&&(
                  <Link
                    href={`/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion/form?mode=edit&id=${cancelConcept?.id}`}
                    className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                  >
                    <PencilLine size={18} />
                  </Link>
                )}
                

                {hasClaim(deleteClaim)&&(
                  <Trash2
                    size={18}
                    className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                    onClick={handleDeleteConCacelacion}
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
      <DeleteCancelConceptModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        id={cancelConcept?.id}
        getConceptoCancelacion={getConceptoCancelacion}
      />
    </>
  );
};

export default CancelConceptsTableRow;
