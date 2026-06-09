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
import DeleteAttributeModal from "./DeleteAttributeModal";

import type { AttributeValue } from "../../services/attributesValueTypes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { toggleAttributeStatus } from "../../services/AttributeValueSlice";
import showAlert from "@/lib/utils/alerts";
import Swal from "sweetalert2";
import { ComicTooltip } from "@/components/ui/LabelTooltip";
import { useParams } from "next/navigation";

interface Props {
  index: number;
  startIndex: number;
  attributeValue: AttributeValue;
}

const AttributeTableRow = ({
  index,
  startIndex,
  attributeValue,
}: Props) => {
  // token
  const token = Cookies.get("auth-token") || "";
  const { atributoId } = useParams() as { atributoId: string }; // Atributo ID (Pre valores) desde URL params

  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const claims = useSelector((state: RootState) => state.claims.data);

  // Local states
  const [estatus, setisActive] = useState<boolean>(
    attributeValue?.estatus ?? false
  );
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Claims const
  const updateClaim = "Configuración.Configuración de módulos.Almacenes.Catálogos.Atributos.Actualizar";
  const deleteClaim = "Configuración.Configuración de módulos.Almacenes.Catálogos.Atributos.Eliminar";
  const toggleStatusClaim = "Configuración.Configuración de módulos.Almacenes.Catálogos.Atributos.ToggleStatus"

  // useEffects
  useEffect(() => {
    setisActive(attributeValue?.estatus);
  }, [attributeValue?.estatus]);

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
      toggleAttributeStatus({
        token,
        atributoId,
        request: { id: attributeValue.id },
      })
    ).unwrap();

    Swal.fire({
      title: "¡ÉXITO!",
      text:
        resp?.message ||
        "Estado del Valor del cliente actualizado correctamente.",
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
    setisActive(!newState); // Revertir estado si falla

    Swal.fire({
      title: "¡ERROR!",
      text:  `${error}`,
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
          {attributeValue?.id}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-[#3C98CB] text-center">
          {attributeValue.nombre.length > 20 ? (
            <ComicTooltip title={attributeValue?.nombre} placement="top-start">
              <Link
                className="cursor-pointer hover:underline"
                href={`/configuracion/configuracion-modulos/almacenes/catalogos/atributos/${atributoId}/valores/form?mode=view&id=${attributeValue?.id}`}
              >
                {attributeValue?.nombre.slice(0, 20) + "..."}
              </Link>
            </ComicTooltip>
          ):(
            <Link
              className="cursor-pointer hover:underline"
              href={`/configuracion/configuracion-modulos/almacenes/catalogos/atributos/${atributoId}/valores/form?mode=view&id=${attributeValue?.id}`}
            >
              {attributeValue?.nombre}
            </Link>
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
                    href={`/configuracion/configuracion-modulos/almacenes/catalogos/atributos/${atributoId}/valores/form?mode=edit&id=${attributeValue?.id}`}
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
      <DeleteAttributeModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        id={attributeValue?.id}
      />
    </>
  );
};

export default AttributeTableRow;
