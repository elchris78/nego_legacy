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
import DeleteReturnConceptModal from "./DeleteReturnConceptModal";
import { returnConceptsActions } from "../../services/returnConceptsSlice";

import { AppDispatch, RootState } from "@/lib/store/store";
import type { ReturnConcept } from "../../services/ReturnConceptTypes";
import { ComicTooltip } from "@/components/ui/LabelTooltip";

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
  "Configuración.Configuración de módulos.Generales.Catálogos.Conceptos de Devolución.ToggleStatus";
const deleteClaim =
  "Configuración.Configuración de módulos.Generales.Catálogos.Conceptos de Devolución.Eliminar";
const updateClaim =
  "Configuración.Configuración de módulos.Generales.Catálogos.Conceptos de Devolución.Actualizar";

interface Props {
  index: number;
  startIndex: number;
  returnConcept: ReturnConcept;
}

const ReturnConceptTableRow = ({ index, startIndex, returnConcept }: Props) => {
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();

  const [isActive, setisActive] = useState<boolean>(
    returnConcept?.estatus ?? false
  );
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    setisActive(returnConcept?.estatus);
  }, [returnConcept?.estatus]);

  const handleToggleStatus = async (newState: boolean) => {
    try {
      const resultAction = await dispatch(
        returnConceptsActions.toggleReturnConceptStatus({
          token,
          id: returnConcept?.id,
        })
      );
      if (
        returnConceptsActions.toggleReturnConceptStatus.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }

      setisActive(newState);

      // Show success message
      Swal.fire({
        title: "Éxito",
        text: resultAction.payload.message,
        icon: "success",
        customClass: customClassesSuccess,
      });
    } catch (error: any) {
      console.error("Error al cambiar el estatus", error);
      setisActive(!newState); // Revertir el estado en caso de error

      // Show error message
      Swal.fire({
        title: "Error",
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
        <TableCell className="text-center">{returnConcept?.id}</TableCell>
        <TableCell className="text-[#3C98CB]">
          {returnConcept.concepto.length > 20 ? (
            <ComicTooltip title={returnConcept?.concepto} placement="top-start">
              <Link
                className="cursor-pointer hover:underline"
                href={`/configuracion/configuracion-modulos/generales/catalogos/conceptos-devolucion/form?mode=view&id=${returnConcept?.id}`}
              >
                {returnConcept?.concepto.slice(0, 20) + "..."}
              </Link>
            </ComicTooltip>
          ):(
            <Link
              className="cursor-pointer hover:underline"
              href={`/configuracion/configuracion-modulos/generales/catalogos/conceptos-devolucion/form?mode=view&id=${returnConcept?.id}`}
            >
              {returnConcept?.concepto}
            </Link>
          )}
        </TableCell>
        <TableCell className="capitalize">{returnConcept?.afectaA}</TableCell>
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
                    href={`/configuracion/configuracion-modulos/generales/catalogos/conceptos-devolucion/form?mode=edit&id=${returnConcept?.id}`}
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
      <DeleteReturnConceptModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        id={returnConcept?.id}
      />
    </>
  );
};

export default ReturnConceptTableRow;
