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
import { AppDispatch, RootState } from "@/lib/store/store";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteAreaModal from "./DeleteAreaModal";

import type { Area } from "../../services/areaTypes";
import { areasActions } from "../../services/areasSlice";
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
  "Configuración.Configuración empresa.Información de la empresa.Áreas / Secciones.Actualizar";
const deleteClaim =
  "Configuración.Configuración empresa.Información de la empresa.Áreas / Secciones.Eliminar";
const toggleStatusClaims =
  "Configuración.Configuración empresa.Información de la empresa.Áreas / Secciones.ToggleStatus";

interface Props {
  index: number;
  startIndex: number;
  area: Area;
}

const AreaTableRow = ({ index, startIndex, area }: Props) => {
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();

  const [isActive, setisActive] = useState<boolean>(area?.estatus ?? false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    setisActive(area.estatus);
  }, [area.estatus]);

  const handleToggleStatus = async (newState: boolean) => {
    try {
      const resultAction = await dispatch(
        areasActions.toggleAreaStatus({ token, id: area.id })
      );
      if (areasActions.toggleAreaStatus.rejected.match(resultAction)) {
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
      console.error("Error toggling area status:", error);
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
        <TableCell className="text-center">{area?.id}</TableCell>
        <TableCell className="text-[#3C98CB]">
          { area.nombre.length > 20 ? (
            <ComicTooltip title={area.nombre} placement="top-start">
              <Link
                className="cursor-pointer hover:underline"
                href={`/configuracion/configuracion-empresa/informacion-empresa/areas-secciones/form?mode=view&id=${area?.id}`}
              >
                {area?.nombre.slice(0, 20) + "..."}
              </Link>
            </ComicTooltip>
          ) : (
            <Link
              className="cursor-pointer hover:underline"
              href={`/configuracion/configuracion-empresa/informacion-empresa/areas-secciones/form?mode=view&id=${area?.id}`}
            >
              {area?.nombre}
            </Link>
          )}

        </TableCell>
        <TableCell>{area?.nombreResponsable}</TableCell>
        <TableCell className="flex justify-center">
          <Switch
            checked={isActive}
            onCheckedChange={(newState) => handleToggleStatus(newState)}
            disabled={!hasClaim(toggleStatusClaims)}
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
                    href={`/configuracion/configuracion-empresa/informacion-empresa/areas-secciones/form?mode=edit&id=${area?.id}`}
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
      <DeleteAreaModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        id={area?.id}
      />
    </>
  );
};

export default AreaTableRow;
