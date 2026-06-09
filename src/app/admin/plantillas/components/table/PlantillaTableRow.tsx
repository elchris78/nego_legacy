"use client";

import { useEffect, useState } from "react";

import { CopyPlus, EllipsisIcon, PencilLine, Trash2 } from "lucide-react";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";

import { DeletePlantillaModal } from "./DeletePlantillaModal";
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
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";

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
  plantilla: any;
  getPlantillas: () => Promise<void>;
}

const transformDate = (date?: string) => {
  if (date) {
    const newDate = new Date(date);
    return format(newDate, "dd/MM/yyyy", {
      locale: es,
    });
  }
};

export const PlantillaTableRow = ({
  index,
  startIndex,
  plantilla,
  getPlantillas,
}: Props) => {
  const token = Cookies.get("auth-token");

  const [isActive, setisActive] = useState<boolean>(plantilla?.active ?? false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const companiesNames = plantilla?.companies
    .map((company: any) => company.item2)
    .join(", ");

  useEffect(() => {
    setisActive(plantilla?.active);
  }, [plantilla?.active]);

  const handleToggleStatus = async (newState: boolean) => {
    try {
      setisActive(newState);
      const resp = await fetchTogglePlantillaStatus({
        token,
        id: plantilla?.roleTemplateId,
      });
      if (resp?.success) {
        Swal.fire({
          title: "¡ÉXITO!",
          text: "Se ha editado la plantilla de forma exitosaaaaaa.",
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: customClassesSuccess,
        });
        await getPlantillas();
      } else {
        throw new Error(
          resp?.message || "No se pudo editar la plantilla de forma exitosa"
        );
      }
    } catch (error) {
      let errorMsg = "No se pudo editar la plantilla de forma exitosa";

      if (
        error === "Failed to fetch" ||
        error === "NetworkError when attempting to fetch resource."
      ) {
        errorMsg = "No se pudo editar la plantilla de forma exitosa";
      } else {
      }
      console.log("🚀 ~ handleToggleStatus ~ error:", error);
      Swal.fire({
        title: "¡ERROR!",
        text: "No se pudo editar la plantilla de forma exitosa",
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
      setisActive(!newState);
    }
  };

  const onCopyTemplate = async () => {
    const token = Cookies.get("auth-token") ?? "";
    if (!token) {
      Swal.fire({
        title: "¡ERROR!",
        text: "No hay token de autenticación.",
        icon: "success",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
      return;
    }

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
      delete nuevaPlantilla.roleTemplateId;
      delete nuevaPlantilla.companies;
      // console.log("Nueva plantilla:", nuevaPlantilla);
      // Enviar la nueva plantilla
      const resp = await fetchCreatePlantilla({ token, body: nuevaPlantilla });

      console.log("Respuesta de fetchCreatePlantilla:", resp);

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
                href={`/admin/plantillas/form?mode=view&id=${plantilla?.roleTemplateId}`}
              >
                {plantilla?.roleTemplateName.slice(0, 20) + "..."}
              </Link>
            </ComicTooltip>
          ) : (
            <Link
              className="cursor-pointer hover:underline"
              href={`/admin/plantillas/form?mode=view&id=${plantilla?.roleTemplateId}`}
            >
              {plantilla?.roleTemplateName}
            </Link>
          )}
        </TableCell>
        <TableCell>{plantilla?.description}</TableCell>
        <TableCell>{companiesNames}</TableCell>
        <TableCell className="text-center">
          {transformDate(plantilla?.createdAt)}
        </TableCell>
        <TableCell className="flex justify-center items-center">
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
                <Link
                  href={`/admin/plantillas/form?mode=edit&id=${plantilla?.roleTemplateId}`}
                  className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                >
                  <PencilLine size={18} />
                </Link>

                <CopyPlus
                  size={18}
                  className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                  onClick={onCopyTemplate}
                />

                <Trash2
                  size={18}
                  className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                  onClick={() => setIsDeleteModalOpen(true)}
                />
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>

      {/* Delete modal */}
      {isDeleteModalOpen && (
        <DeletePlantillaModal
          isOpenModal={isDeleteModalOpen}
          onCloseModal={() => setIsDeleteModalOpen(false)}
          getPlantillas={getPlantillas}
          id={plantilla?.roleTemplateId}
        />
      )}
    </>
  );
};
