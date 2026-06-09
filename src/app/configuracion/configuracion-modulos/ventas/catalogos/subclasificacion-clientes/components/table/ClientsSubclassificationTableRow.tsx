import { useEffect, useState } from "react";

import { EllipsisIcon, PencilLine, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteClientClassificationModal from "./DeleteClientSubclassificationModal";

import type { ClientSubclassification } from "../../services/clientsSubclassificationTypes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { toggleClientSubclassificationStatus } from "../../services/clientsSubclassificationSlice";
import showAlert from "@/lib/utils/alerts";
import Swal from "sweetalert2";
import { ComicTooltip } from "@/components/ui/LabelTooltip";

interface Props {
  index: number;
  startIndex: number;
  clientSubclassification: ClientSubclassification;
}

const ClientsSubclassificationTableRow = ({
  index,
  startIndex,
  clientSubclassification,
}: Props) => {
  // token
  const token = Cookies.get("auth-token") || "";

  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const claims = useSelector((state: RootState) => state.claims.data);

  // Local states
  const [estatus, setisActive] = useState<boolean>(
    clientSubclassification?.estatus ?? false
  );
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Claims const
  const updateClaim = "Configuración.Configuración de módulos.Ventas.Catálogos.Subclasificación de clientes.Actualizar";
  const deleteClaim = "Configuración.Configuración de módulos.Ventas.Catálogos.Subclasificación de clientes.Eliminar";
  const toggleStatusClaim = "Configuración.Configuración de módulos.Ventas.Catálogos.Subclasificación de clientes.ToggleStatus"

  // useEffects
  useEffect(() => {
    setisActive(clientSubclassification?.estatus);
  }, [clientSubclassification?.estatus]);

  const hasClaim = (claimValue: string) =>
    claims?.some((c: { claimValue: string }) => c.claimValue === claimValue);

  // Handlers
  const handleToggleStatus = async (newState: boolean) => {
  try {
    // Validación de conexión y permisos
    if (
      !navigator.onLine ||
      !toggleStatusClaim
    ) {
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
      return;
    }

    setisActive(newState);

    const resp = await dispatch(
      toggleClientSubclassificationStatus({
        token,
        request: { id: Number(clientSubclassification.id) },
      })
    ).unwrap();

    Swal.fire({
      title: "¡ÉXITO!",
      text:
        resp?.message ||
        "Estado de la subclasificación del cliente actualizado correctamente.",
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

  } catch (error) {
    console.log("🚀 ~ handleToggleStatus ~ error:", error);
    setisActive(!newState); // Revertir estado si falla

    Swal.fire({
      title: "¡ERROR!",
      text: "Ocurrió un error al cambiar el estatus de la subclasificación del cliente.",
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
  }
};


  const handleDeleteArea = () => {
    setIsOpenModal(true);
  };

  return (
    <>
      <TableRow className="text-[#5B6670]">
        <TableCell className="border-r border-[#EDEDED] text-center">
          {startIndex + index + 1}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-center">
          {clientSubclassification?.id}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-[#3C98CB] text-center">
          {clientSubclassification.nombre.length > 20 ? (
            <ComicTooltip title={clientSubclassification?.nombre} placement="top-start">
              <Link
                className="cursor-pointer hover:underline"
                href={`/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes/form?mode=view&id=${clientSubclassification?.id}`}
              >
                {clientSubclassification?.nombre.slice(0, 20) + "..."}
              </Link>
            </ComicTooltip>
          ):(
            <Link
              className="cursor-pointer hover:underline"
              href={`/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes/form?mode=view&id=${clientSubclassification?.id}`}
            >
              {clientSubclassification?.nombre}
            </Link>
          )}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-center">
          {clientSubclassification?.descripcion.length > 20 ?(
            <ComicTooltip title={clientSubclassification?.descripcion} placement="top-start">
              <span>{clientSubclassification?.descripcion.slice(0, 20) + "..."}</span>
            </ComicTooltip>
          ):(
          clientSubclassification?.descripcion
          )}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] flex justify-center">
          <Switch
            checked={estatus}
            onCheckedChange={(newState) => handleToggleStatus(newState)}
            disabled={!hasClaim(toggleStatusClaim)}
            className="data-[state=checked]:bg-[#3C98CB]"
          />
        </TableCell>
        <TableCell className="border-r border-[#EDEDED]">
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
                    href={`/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes/form?mode=edit&id=${clientSubclassification?.id}`}
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
        id={String(clientSubclassification?.id)}
      />
    </>
  );
};

export default ClientsSubclassificationTableRow;
