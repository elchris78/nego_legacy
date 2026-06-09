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
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteRestrictionConceptModal from "./DeleteRestrictionConceptModal";
import { restrictionConceptsActions } from "../../services/restrictionConceptsSlice";

import { AppDispatch, RootState } from "@/lib/store/store";
import type { RestrictionConcept } from "../../services/restrictionConceptsTypes";

const customClassesSuccess = {
  container: "swal2-container",
  popup: "swal-popup-succes",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

const customClassesError = {
  container: "swal2-container",
  popup: "swal-popup-error",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

const toggleStatusClaim =
  "Configuración.Configuración de módulos.Generales.Catálogos.Conceptos de restricciones.ToggleStatus";
const deleteClaim =
  "Configuración.Configuración de módulos.Generales.Catálogos.Conceptos de restricciones.Eliminar";
const updateClaim =
  "Configuración.Configuración de módulos.Generales.Catálogos.Conceptos de restricciones.Actualizar";

interface Props {
  index: number;
  startIndex: number;
  restrictionConcept: RestrictionConcept;
}

const RestrictionConceptsTableRow = ({
  index,
  startIndex,
  restrictionConcept,
}: Props) => {
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();

  const [isActive, setisActive] = useState<boolean>(
    restrictionConcept?.estatus ?? false
  );
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    setisActive(restrictionConcept?.estatus);
  }, [restrictionConcept?.estatus]);

  const handleToggleStatus = async (newState: boolean) => {
    try {
      const resultAction = await dispatch(
        restrictionConceptsActions.toggleRestrictionConceptStatus({
          token,
          id: restrictionConcept?.id,
        })
      );
      if (
        restrictionConceptsActions.toggleRestrictionConceptStatus.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }

      setisActive(newState);

      // Show success message
      Swal.fire({
        title: "¡ÉXITO!",
        text: resultAction.payload.message,
        icon: "success",
        customClass: customClassesSuccess,
      });
    } catch (error: any) {
      console.error("Error al cambiar el estatus", error);
      setisActive(!newState); // Revertir el estado en caso de error

      // Show error message
      Swal.fire({
        title: "¡ERROR!",
        text: error.message,
        icon: "error",
        confirmButtonText: "Cerrar",
        customClass: customClassesError,
      });
    }
  };

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
        <TableCell className="text-center">{restrictionConcept?.id}</TableCell>
        <TableCell className="text-[#3C98CB]">
          <Link
            className="cursor-pointer hover:underline"
            href={`/configuracion/configuracion-modulos/generales/catalogos/conceptos-restricciones/form?mode=view&id=${restrictionConcept?.id}`}
          >
            {restrictionConcept?.concepto}
          </Link>
        </TableCell>
        <TableCell className="text-center">
          {restrictionConcept?.descripcion}
        </TableCell>
        <TableCell className="text-center">
          {restrictionConcept?.advertencia}
        </TableCell>
        <TableCell className="text-center capitalize">
          {restrictionConcept?.aplicaPara === "ambas"
            ? "Compras, Ventas"
            : restrictionConcept?.aplicaPara}
        </TableCell>
        <TableCell className="text-center">
          {restrictionConcept?.requiereAutorizacion ? "Sí" : "No"}
        </TableCell>
        <TableCell className="text-center">
          {restrictionConcept?.requiereNotificacion ? "Sí" : "No"}
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
                {hasClaim(updateClaim) && (
                  <Link
                    href={`/configuracion/configuracion-modulos/generales/catalogos/conceptos-restricciones/form?mode=edit&id=${restrictionConcept?.id}`}
                    className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                  >
                    <PencilLine size={18} />
                  </Link>
                )}
                {hasClaim(deleteClaim) && (
                  <Trash2
                    size={18}
                    className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                    onClick={handleReturnConcept}
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
      <DeleteRestrictionConceptModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        id={restrictionConcept?.id}
      />
    </>
  );
};

export default RestrictionConceptsTableRow;
