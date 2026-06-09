import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
  } from "@/ui/select";
  import Cookies from "js-cookie";
  import { Input } from "@/ui/input";
  import MultipleSelector, { Option } from "@/ui/multiselect";
  import { Button } from "@/ui/button";  
  import { format } from "date-fns";
  import { es } from "date-fns/locale";
  import Image from 'next/image'
  import { ChangeEvent, useEffect, useState } from "react";
  import { usePlantillaForm } from "./SucursalFormContext";
  import { useRouter, useSearchParams } from "next/navigation";
  import { fetchGetAllEmpresas } from "../../services/plantillasActions";
  import { LabelTooltip } from "@/components/ui/LabelTooltip";
  import  cargarDocumento  from '@/Asset/cargarDocumento.svg';
  import TrashButton from '@/Asset/TrashButton.svg'
  
  export const DocumentacionDataForm = () => {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");
    const token = Cookies.get("auth-token");
    const [fileName, setFileName] = useState<string>('Cargar archivo')
    const [selectedResponsible, setSelectedResponsible] = useState<string | undefined>(undefined);
  
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      setFileName(file ? "1 archivo cargado" : 'Cargar archivo')
    }
  
    const { generalDataForm, currentPlantilla } = usePlantillaForm();
    const {
      register,
      formState: { errors },
      setValue,
      clearErrors,
    } = generalDataForm;
  
  
    // useEffect(() => {
    //   // if (mode === "new" || !currentPlantilla || companies?.length === 0) return;
    //   if (mode === "new") {
    //     setValue("isActive", "true");
    //   } else if (
    //     (mode === "edit" || mode === "view") &&
    //     (currentPlantilla)
    //   ) {
    //     setValue(
    //       "isActive",
    //       currentPlantilla?.active === true ? "true" : "false"
    //     );
    //     setValue("nombreSucursal", currentPlantilla?.sucursalName);
    //     setValue(
    //       "isEstatus",
    //       currentPlantilla?.estatus === true ? "true" : "false"
    //     );
    //     setValue("codigoPostal", currentPlantilla?.codigoPostal);
    //     setValue("colonia", currentPlantilla?.colonia);
    //     setValue("calle", currentPlantilla?.calle);
    //     setValue("noExterior", currentPlantilla?.noExterior);
    //     setValue("noInterior", currentPlantilla?.noInterior);
    //     setValue("localidad", currentPlantilla?.localidad);
    //     setValue("municipio", currentPlantilla?.municipio);
    //     setValue("estado", currentPlantilla?.estado);
    //     setValue("pais", currentPlantilla?.pais);
    //     setValue("telefono", currentPlantilla?.telefono);
    //     setValue("telefono", currentPlantilla?.telefono);
    //     setValue("responsable", currentPlantilla?.responsable);
    //     setValue("nombreResponsable", currentPlantilla?.nombreResponsable);
    //     setValue("horarioAtencion", currentPlantilla?.horarioAtencion);
    //     setValue("correoContacto", currentPlantilla?.correoContacto);
    //   }
    // }, [currentPlantilla, mode]);
  
    
  
    return (
      <>
<form className="grid grid-cols-3 gap-4">
        {/* Descripción - Ocupa dos columnas */}
        <div className="col-span-2">
          <LabelTooltip
            label="*Descripción"
            tooltip="Descripción de la sucursal."
            htmlFor="description"
          />
          <Input
            id="description"
            type="text"
            placeholder="Ingresa la descripción"
            className="w-full bg-white disabled:bg-gray-100"
            disabled={mode === "view"}
          />
        </div>

        {/* Documento y Trash - Ocupan una columna */}
        <div className="flex xs:flex-col lg:flex-row items-end">
          <div>
            <LabelTooltip
              label="*Documento"
              tooltip="Documentos de la sucursal."
              htmlFor="documento"
            />
            <div className="relative">
              <Input
                id="documento"
                type="file"
                disabled={mode === "view"}
                onChange={handleFileChange}
                className="opacity-0 absolute inset-0 min-w-full h-full cursor-pointer [&::-webkit-file-upload-button]:hidden [&::file-selector-button]:hidden"
                />
              <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white">
                <Image
                  src={cargarDocumento}
                  alt="Cargar documento de la empresa"
                  width={28}
                  height={28}
                  />
                <span className="text-gray-500 text-sm">{fileName}</span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="w-auto p-2 hover:bg-gray-50 mb-2"
            >
            <Image
              src={TrashButton}
              alt="Eliminar archivo"
              width={28}
              height={28}
              />
          </Button>
              
        </div>
      </form>

<div className="flex justify-center items-center mb-5">
  <p>* Campos obligatorios</p>
</div>

      </>
    );
  };
  