import { useEffect, useState } from "react";

import { EllipsisIcon, PencilLine, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteClientClassificationModal from "./DeleteClientClassificationModal";

import { AppDispatch, RootState } from "@/lib/store/store";
import { clientClassificationsActions } from "../../services/clientClassificationsSlice";
import type { ClientClassification } from "../../services/clientesClassificationTypes";
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

const updateClaim =
  "Configuración.Configuración de módulos.Ventas.Catálogos.Clasificación de clientes.Actualizar";
const deleteClaim =
  "Configuración.Configuración de módulos.Ventas.Catálogos.Clasificación de clientes.Eliminar";
const toggleStatusClaim =
  "Configuración.Configuración de módulos.Ventas.Catálogos.Clasificación de clientes.ToggleStatus";

interface Props {
  index: number;
  startIndex: number;
  clientClassification: ClientClassification;
}

const ClientsClassificationTableRow = ({
  index,
  startIndex,
  clientClassification,
}: Props) => {
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();

  const claims = useSelector((state: RootState) => state.claims.data);

  const [isActive, setisActive] = useState<boolean>(
    clientClassification?.estatus ?? false
  );
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    setisActive(clientClassification?.estatus);
  }, [clientClassification?.estatus]);

  const handleToggleStatus = async (newState: boolean) => {
    try {
      const resultAction = await dispatch(
        clientClassificationsActions.toggleClientClassificationStatus({
          token,
          id: clientClassification.id,
        })
      );
      if (
        clientClassificationsActions.toggleClientClassificationStatus.rejected.match(
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
        confirmButtonText: "Cerrar",
        customClass: customClassesSuccess,
      });
    } catch (error: any) {
      console.error("Error toggling client classification status:", error);
      setisActive(!newState);

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

  const handleDeleteArea = () => {
    setIsOpenModal(true);
  };

  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  return (
    <>
      <TableRow>
        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
        <TableCell className="text-center">
          {clientClassification?.id}
        </TableCell>
        <TableCell className="text-[#3C98CB]">
          {clientClassification.nombre.length > 20 ? (
            <ComicTooltip title={clientClassification?.nombre} placement="top-start">
              <Link
                className="cursor-pointer hover:underline"
                href={`/configuracion/configuracion-modulos/ventas/catalogos/clasificacion-clientes/form?mode=view&id=${clientClassification?.id}`}
              >
                {clientClassification?.nombre.slice(0, 20) + "..."}
              </Link>
            </ComicTooltip>
          ):(
            <Link
              className="cursor-pointer hover:underline"
              href={`/configuracion/configuracion-modulos/ventas/catalogos/clasificacion-clientes/form?mode=view&id=${clientClassification?.id}`}
            >
              {clientClassification?.nombre}
            </Link>
          )}
        </TableCell>
        <TableCell>
          {clientClassification?.descripcion && clientClassification.descripcion.length > 20 ? (
            <ComicTooltip title={clientClassification?.descripcion}>
              <span>{clientClassification?.descripcion?.slice(0,20) + "..."}</span>
            </ComicTooltip>
          ):(
          clientClassification?.descripcion
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
                {hasClaim(updateClaim) && (
                  <Link
                    href={`/configuracion/configuracion-modulos/ventas/catalogos/clasificacion-clientes/form?mode=edit&id=${clientClassification?.id}`}
                    className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                  >
                    <PencilLine size={18} />
                  </Link>
                )}
                {hasClaim(deleteClaim) && (
                  <Trash2
                    size={18}
                    className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                    onClick={handleDeleteArea}
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
      <DeleteClientClassificationModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        id={clientClassification?.id}
      />
    </>
  );
};

export default ClientsClassificationTableRow;
