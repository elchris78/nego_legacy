"use client";

import { useState, useEffect } from "react";

import { CopyPlus, EllipsisIcon, PencilLine, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  fetchCreatePlantilla,
  fetchTogglePlantillaStatus,
} from "../../services/plantillasActions";
import { ComicTooltip } from "@/components/ui/LabelTooltip";
import { DeletePlantillaModal } from "./DeletePlantillaModal";
import { RoleTemplateResponse } from "../../services/plantillasCompanyTypes";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { transformDate } from "@/lib/utils/dates";

import { RootState } from "@/lib/store/store";

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

interface Props {
  index: number;
  startIndex: number;
  plantilla: RoleTemplateResponse;
  getPlantillas: () => Promise<void>;
}

export const PlantillaTableRow = ({
  plantilla,
  getPlantillas,
  index,
  startIndex,
}: Props) => {
  const token = Cookies.get("auth-token");

  const [isActive, setisActive] = useState<boolean>(plantilla?.active ?? false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const claims = useSelector((state: RootState) => state.claims.data);

  // Filtrar navegación según los claims
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  useEffect(() => {
    setisActive(plantilla.active);
  }, [plantilla.active]);

  const handleToggleStatus = async (newState: boolean) => {
    try {
      if (plantilla?.roleTemplateType !== "Exclusiva") {
        Swal.fire({
          title: "¡ERROR!",
          text: "No se puede desactivar la plantilla debido a que es compartida",
          icon: "error",
          confirmButtonText: "Volver a intentar",
          customClass: customClassesError,
        });
        return; // Salir de la función si no es una plantilla compartida
      }

      // Verifica si el usuario tiene el claim necesario
      if (
        !navigator.onLine ||
        (!hasClaim(
          "Configuración.Configuración del sistema.Usuarios.Plantillas de perfiles.ToggleStatus"
        ) &&
          !hasClaim("Configuración.Plantillas de perfiles.ToggleStatus"))
      ) {
        Swal.fire({
          title: "¡ERROR!",
          text: "Solicita el permiso con tu superior para realizar esta acción.",
          icon: "error",
          confirmButtonText: "Volver a intentar",
          customClass: customClassesError,
        });
        return;
        // Salir de la función si no tiene el claim
      }

      setisActive(newState);
      const resp = await fetchTogglePlantillaStatus({
        token,
        id: plantilla?.roleTemplateId,
      });
      if (resp?.success) {
        Swal.fire({
          title: "¡ÉXITO!",
          text: resp?.message || "Se ha editado la plantilla de forma exitosa.",
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: customClassesSuccess,
        });
        await getPlantillas();
      } else {
        throw new Error(
          resp?.message ||
            "Ocurrió un error al cambiar el estatus de la plantilla."
        );
      }
    } catch (resp: any) {
      console.log("🚀 ~ handleToggleStatus ~ error:", resp);
      let errorMsg = "Ocurrió un error al cambiar el estatus de la plantilla.";

      if (
        resp.message === "Failed to fetch" ||
        resp.message === "NetworkError when attempting to fetch resource."
      ) {
        errorMsg = "Ocurrió un error al cambiar el estatus de la plantilla.";
      } else {
        errorMsg = resp?.message || errorMsg;
      }
      Swal.fire({
        title: "¡ERROR!",
        text:
          errorMsg || "Ocurrió un error al cambiar el estatus de la plantilla.",
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
      setisActive(!newState);
    }
  };

  const onCopyPlantilla = async () => {
    const token = Cookies.get("auth-token") ?? "";
    if (!token) return;

    try {
      let nuevoNombre = plantilla.roleTemplateName;

      // Expresión regular para detectar si ya tiene "copy" y número
      const match = nuevoNombre.match(/^(.*?)( copia*)?$/);

      if (match) {
        let baseName = match[1]; // Nombre base sin "copia"
        let copySuffix = match[2] ? match[2] + " copia" : " copia"; // Agrega otra "copia" si ya tiene, sino empieza con una
        nuevoNombre = `${baseName}${copySuffix}`;
      } else {
        nuevoNombre = `${nuevoNombre} copia`;
      }

      const companyIds =
        plantilla.companies?.map((company: any) => company.item1) || [];
      // Crear la nueva plantilla sin 'roleTemplateId' y con fecha actualizada
      const nuevaPlantilla = {
        ...plantilla,
        roleTemplateName: nuevoNombre,
        createdAt: new Date().toISOString(),
        companyIds,
      };
      delete (nuevaPlantilla as any)?.roleTemplateId;
      delete (nuevaPlantilla as any)?.companies;

      // Enviar la nueva plantilla
      const resp = await fetchCreatePlantilla({ token, body: nuevaPlantilla });

      // console.log("Respuesta de fetchCreatePlantilla:", resp);

      if (resp?.success) {
        Swal.fire({
          title: "¡ÉXITO!",
          text: "Se ha clonado la plantilla de forma exitosa",
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: customClassesSuccess,
        });
        await getPlantillas();
      } else {
        Swal.fire({
          title: "¡ERROR!",
          text: "No se ha podido clonar la plantilla de forma exitosa",
          icon: "error",
          confirmButtonText: "Volver a intentar",
          customClass: customClassesError,
        });
      }
    } catch (error: any) {
      console.error("Error en onAddPlantilla:", error);
      Swal.fire({
        title: "¡ERROR!",
        text: "No se ha podido clonar la plantilla de forma exitosa",
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
        <TableCell className="text-center">
          {plantilla?.roleTemplateId}
        </TableCell>
        <TableCell className="text-[#3C98CB]">
          {plantilla?.roleTemplateName.length > 20 ? (
            <ComicTooltip
              title={plantilla?.roleTemplateName}
              placement="top-start"
            >
              <Link
                className="cursor-pointer hover:underline"
                href={`/configuracion/configuracion-sistemas/control-usuarios/plantillas/form?mode=view&id=${plantilla?.roleTemplateId}`}
              >
                {plantilla?.roleTemplateName.slice(0, 20) + "..."}
              </Link>
            </ComicTooltip>
          ) : (
            <Link
              className="cursor-pointer hover:underline"
              href={`/configuracion/configuracion-sistemas/control-usuarios/plantillas/form?mode=view&id=${plantilla?.roleTemplateId}`}
            >
              {plantilla?.roleTemplateName}
            </Link>
          )}
        </TableCell>
        <TableCell>{transformDate(plantilla?.createdAt)}</TableCell>
        <TableCell>{plantilla?.roleTemplateType}</TableCell>
        <TableCell className="flex justify-center">
          <Switch
            checked={isActive}
            onCheckedChange={(newState) => handleToggleStatus(newState)}
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
                {(hasClaim(
                  "Configuración.Configuración del sistema.Usuarios.Plantillas de perfiles.Actualizar"
                ) ||
                  hasClaim(
                    "Configuración.Plantillas de perfiles.Actualizar"
                  )) &&
                  plantilla.roleTemplateType !== "Compartida" && (
                    <Link
                      href={`/configuracion/configuracion-sistemas/control-usuarios/plantillas/form?mode=edit&id=${plantilla?.roleTemplateId}`}
                      className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                    >
                      <PencilLine size={18} />
                    </Link>
                  )}
                <CopyPlus
                  size={18}
                  className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                  onClick={onCopyPlantilla}
                />
                {(hasClaim(
                  "Configuración.Configuración del sistema.Usuarios.Plantillas de perfiles.Eliminar"
                ) ||
                  hasClaim("Configuración.Plantillas de perfiles.Eliminar")) &&
                  plantilla.roleTemplateType !== "Compartida" && (
                    <Trash2
                      size={18}
                      className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                      onClick={() => setIsOpenDeleteModal(true)}
                    />
                  )}
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>

      {/* Delete modal */}
      {isOpenDeleteModal && (
        <DeletePlantillaModal
          isOpenModal={isOpenDeleteModal}
          onCloseModal={() => setIsOpenDeleteModal(false)}
          id={plantilla?.roleTemplateId}
          getPlantillas={getPlantillas}
        />
      )}
    </>
  );
};
