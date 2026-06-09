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

import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from "react";
import { usePlantillaForm } from "./SucursalFormContext";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchGetAllEmpresas } from "../../services/plantillasActions";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import  cargarImagen  from '@/Asset/cargarImagen.svg';

interface Company {
  companyId: number;
  name: string;
  normalizedName: string;
  success: true;
  message: string;
}

interface FormInputs {
  id: string;
  fechaCreacion: string;
  estatus: boolean;
  nombre: string;
  imagen: FileList;
  codigoPostal: string;
  colonia: string;
  calle: string;
  noExterior: string;
  noInterior: string;
  localidad: string;
  municipio: string;
  estado: string;
  pais: string;
  telefono: string;
  responsable: string;
  nombreResponsable: string;
  horarioAtencion: string;
  correoContacto: string;
}

const transformDate = (date?: string) => {
  const newDate = date ? new Date(date) : new Date();
  return format(newDate, "d MMMM yyyy", {
    locale: es,
  });
};


export const GeneralDataForm = () => {
  const router = useRouter();
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


  // Asign default values anly on editing
  useEffect(() => {
    // if (mode === "new" || !currentPlantilla || companies?.length === 0) return;
    if (mode === "new") {
      setValue("isActive", "true");
    } else if (
      (mode === "edit" || mode === "view") &&
      (currentPlantilla)
    ) {
      setValue(
        "isActive",
        currentPlantilla?.status === true ? "true" : "false"
      );
      setValue("nombreSucursal", currentPlantilla?.name);
      setValue(
        "isEstatus",
        currentPlantilla?.status === true ? "true" : "false"
      );
      setValue("id", currentPlantilla?.branchId);
      setValue("codigoPostal", currentPlantilla?.postalCode);
      setValue("colonia", currentPlantilla?.neighborhood);
      setValue("calle", currentPlantilla?.street);
      setValue("noExterior", currentPlantilla?.externalNumber);
      setValue("noInterior", currentPlantilla?.internalNumber);
      setValue("localidad", currentPlantilla?.localidad);
      setValue("municipio", currentPlantilla?.municipio);
      setValue("estado", currentPlantilla?.estado);
      setValue("pais", currentPlantilla?.pais);
      setValue("telefono", currentPlantilla?.phone);
      setValue("responsable", currentPlantilla?.responsible);
      setValue("nombreResponsable", currentPlantilla?.responsible);
      setValue("horarioAtencion", currentPlantilla?.businessHours);
      setValue("correoContacto", currentPlantilla?.contactEmail);
    }
  }, [currentPlantilla, mode]);

  

  return (
    <form className="grid grid-cols-1 grid-rows-4 items-center gap-2 md:grid-cols-2 md:grid-rows-2 lg:grid-rows-2 lg:grid-cols-3">
      {/* name field */}      
      <div>
        <LabelTooltip
          label="*ID de nueva sucursal"
          tooltip="ID generado automaticamente."
          htmlFor="id"
        />
        <Input
          id="id"
          type="text"
          placeholder="No. de ID "
          className="bg-white disabled:bg-gray-100"
          disabled={true} 
          value={mode !== "new" ? currentPlantilla?.branchId : ''}
        />
      </div>

      {/* Creation date field */}
      <div>
        <LabelTooltip
          label="*Fecha de creación"
          tooltip="Fecha de creación."
          htmlFor="creation-date"
        />
        <Input
          id="creation-date"
          type="text"
          placeholder="Fecha de creación"
          className="bg-white disabled:bg-gray-100"
          disabled
          value={
            mode !== "new"
              ? transformDate(currentPlantilla?.createdDate)
              : transformDate()
          }
        />
      </div>

      {/* status field */}
      <div>
        <LabelTooltip label="*Estatus" tooltip="Estatus." />
        <Select
          onValueChange={(newValue) => {
            setValue("isEstatus", newValue);
            clearErrors("isEstatus");
          }}
          {...register("isEstatus", {
            required: "El estatus del usuario es requerido",
          })}
          value={undefined}
          defaultValue={
            mode !== "new"
              ? currentPlantilla?.status === true
                ? "true"
                : "false"
              : undefined
          }
          disabled={mode === "view"}
        >
          <SelectTrigger error={!!errors.isEstatus}>
            <SelectValue placeholder="Selecciona un estatus" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={"true"}>Activo</SelectItem>
              <SelectItem value={"false"}>Inactivo</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.isEstatus && (
          <span className="text-[#CF5459] text-xs">
            {errors.isEstatus?.message}
          </span>
        )}
      </div>

      {/* nombreSucursal field */}
      <div>
        <LabelTooltip
          label="*Nombre de la sucursal"
          tooltip="Nombre de la sucursal."
          htmlFor="nombreSucursal"
        />
        <Input
          id="nombreSucursal"
          type="text"
          placeholder="Ingresa el nombre sucursal"
          className="bg-white disabled:bg-gray-100"
          disabled={mode === "view"}
          {...register("nombreSucursal", {
            maxLength: {
              value: 250,
              message:
                "El nombre de la sucursal no puede contener más de 250 caracteres.",
            },
          })}
          isError={!!errors.nombreSucursal}
        />
        {errors.nombreSucursal && (
          <span className="text-[#CF5459] text-xs">
            {errors.nombreSucursal?.message}
          </span>
        )}
      </div>

      {/* Imagen field */}
      <div>
      <LabelTooltip
        label="*Imagen"
        tooltip="Imagen de la sucursal."
        htmlFor="imagen"
      />
      <div className="relative">
        <Input
          id="imagen"
          type="file"
          accept="image/*"
          disabled={mode === "view"}
          onChange={handleFileChange}
          className="bg-white disabled:bg-gray-100 cursor-pointer [&::-webkit-file-upload-button]:hidden [&::file-selector-button]:hidden opacity-0 absolute inset-0 w-full h-full"
        />
        <div className="flex items-center gap-2 px-1 ml-2 border rounded-md bg-white">
          <Image
            src={cargarImagen}
            alt=""
            width={40}
            height={40}
          />
          <span className="text-gray-500">
            {fileName}
          </span>
        </div>
      </div>
    </div>

      <div>
        <LabelTooltip
          label="*Código postal"
          tooltip="Código postal de la ubicación"
          htmlFor="codigoPostal"        />
        <Input
          id="codigoPostal"
          type="text"
          placeholder="Código postal"
          className="bg-white disabled:bg-gray-100"
          disabled={mode === "view"}
          {...register("codigoPostal", { 
            required: "El código postal es requerido",
            pattern: { value: /^\d{5}$/, message: "El código postal debe tener 5 dígitos" }
          })}
        />
        {errors.codigoPostal && <span className="text-[#CF5459] text-xs">{errors.codigoPostal.message}</span>}
      </div>

      <div>
        <LabelTooltip
          label="*Colonia"
          tooltip="Colonia de la ubicación"
          htmlFor="colonia"
        />
        <Input
          id="colonia"
          className="bg-white disabled:bg-gray-100"
          type="text"
          placeholder="Ingresa la colonia"
          disabled={mode === "view"}
          {...register("colonia", { required: "La colonia es requerida" })}
        />
        {errors.colonia && <span className="text-[#CF5459] text-xs">{errors.colonia.message}</span>}
      </div>

      <div>
        <LabelTooltip
          label="*Calle"
          tooltip="Calle de la ubicación"
          htmlFor="calle"
        />
        <Input
          id="calle"
          type="text"
          className="bg-white disabled:bg-gray-100"
          placeholder="Ingresa la calle"
          disabled={mode === "view"}
          {...register("calle", { required: "La calle es requerida" })}
        />
        {errors.calle && <span className="text-[#CF5459] text-xs">{errors.calle.message}</span>}
      </div>

      <div>
        <LabelTooltip
          label="*No. Exterior"
          tooltip="Número exterior de la ubicación"
          htmlFor="noExterior"
        />
        <Input
          id="noExterior"
          type="text"
          className="bg-white disabled:bg-gray-100"
          placeholder="Ingresa el no. exterior"
          disabled={mode === "view"}
          {...register("noExterior", { required: "El número exterior es requerido" })}
        />
        {errors.noExterior && <span className="text-[#CF5459] text-xs">{errors.noExterior.message}</span>}
      </div>

      <div>
        <LabelTooltip
          label="No. Interior"
          tooltip="Número interior de la ubicación"
          htmlFor="noInterior"
        />
        <Input
          id="noInterior"
          type="text"
          className="bg-white disabled:bg-gray-100"
          placeholder="Ingresa el no. interior"
          disabled={mode === "view"}
          {...register("noInterior")}
        />
        {errors.noInterior && <span className="text-[#CF5459] text-xs">{errors.noInterior.message}</span>}        
      </div>

      <div>
        <LabelTooltip
          label="Localidad"
          tooltip="Localidad de la ubicación"
          htmlFor="localidad"
        />
        <Input
          id="localidad"
          type="text"
          className="bg-white disabled:bg-gray-100"
          placeholder="Ingresa la localidad"
          disabled={mode === "view"}
          {...register("localidad")}
        />
        {errors.localidad && <span className="text-[#CF5459] text-xs">{errors.localidad.message}</span>}        
      </div>

      <div>
        <LabelTooltip
          label="Municipio/delegación"
          tooltip="Municipio o delegación de la ubicación"
          htmlFor="municipio"
        />
        <Input
          id="municipio"
          type="text"
          className="bg-white disabled:bg-gray-100"
          placeholder="Ingresa el municipio/delegación"
          disabled={mode === "view"}
          {...register("municipio", { required: "El municipio/delegación es requerido" })}
        />
        {errors.municipio && <span className="text-[#CF5459] text-xs">{errors.municipio.message}</span>}
      </div>

      <div>
        <LabelTooltip
          label="Estado"
          tooltip="Estado de la ubicación"
          htmlFor="estado"
        />
        <Input
          id="estado"
          type="text"
          className="bg-white disabled:bg-gray-100"
          placeholder="Ingresa el estado"
          disabled={mode === "view"}
          {...register("estado", { required: "El estado es requerido" })}
        />
        {errors.estado && <span className="text-[#CF5459] text-xs">{errors.estado.message}</span>}
      </div>

      <div>
        <LabelTooltip
          label="País"
          tooltip="País de la ubicación"
          htmlFor="pais"
        />
        <Input
          id="pais"
          type="text"
          className="bg-white disabled:bg-gray-100"
          placeholder="Ingresa el país"
          disabled={mode === "view"}
          {...register("pais", { required: "El país es requerido" })}
        />
        {errors.pais && <span className="text-[#CF5459] text-xs">{errors.pais.message}</span>}
      </div>

      <div>
        <LabelTooltip
          label="Teléfono"
          tooltip="Teléfono de contacto"
          htmlFor="telefono"
        />
        <Input
          id="telefono"
          type="tel"
          className="bg-white disabled:bg-gray-100"
          placeholder="Ingresa el teléfono"
          disabled={mode === "view"}
          {...register("telefono", { 
            required: "El teléfono es requerido",
            pattern: { value: /^\d{10}$/, message: "El teléfono debe tener 10 dígitos" }
          })}
        />
        {errors.telefono && <span className="text-[#CF5459] text-xs">{errors.telefono.message}</span>}
      </div>

<div>
        <LabelTooltip 
          label="Responsable" 
          tooltip="Responsable." 
        />
        <Select
          onValueChange={(newValue) => {
            setValue("responsable", newValue);
            setSelectedResponsible(newValue);
            clearErrors("responsable");
          }}
          {...register("responsable", {
            required: "El responsable es requerido",
          })}
          value={undefined}
          defaultValue={mode !== "new" ? currentPlantilla?.responsable : undefined}
          disabled={mode === "view"}
        >
          <SelectTrigger error={!!errors.responsable}>
            <SelectValue placeholder="Selecciona una Opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* <SelectItem value="undefined">Selecciona una Opción</SelectItem> */}
              <SelectItem value="Daniel">Daniel</SelectItem>
              <SelectItem value="Alexandro">Alexandro</SelectItem>
              <SelectItem value="Netzer">Netzer</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.responsable && (
          <span className="text-[#CF5459] text-xs">
            {errors.responsable?.message}
          </span>
        )}
      </div>

      <div>
        <LabelTooltip
          label="*Nombre del responsable"
          tooltip="Nombre completo del responsable"
          htmlFor="nombreResponsable"
        />
        <Input
          id="nombreResponsable"
          type="text"
          className="bg-white disabled:bg-gray-100"
          placeholder="Nombre del responsable"
          // disabled={mode === "view" || selectedResponsible == "undefined" || !selectedResponsible }
          disabled={mode === "view" || !selectedResponsible }
          {...register("nombreResponsable", { required: "El nombre del responsable es requerido" })}
        />
        {errors.nombreResponsable && <span className="text-[#CF5459] text-xs">{errors.nombreResponsable.message}</span>}
      </div>
      <div>
        <LabelTooltip
          label="Horario de atención"
          tooltip="Horario de operación de la sucursal"
          htmlFor="horarioAtencion"
        />
        <Input
          id="horarioAtencion"
          type="text"
          className="bg-white disabled:bg-gray-100"
          placeholder="Horario de atención"
          disabled={mode === "view"}
          {...register("horarioAtencion", { required: "El horario de atención es requerido" })}
        />
        {errors.horarioAtencion && <span className="text-[#CF5459] text-xs">{errors.horarioAtencion.message}</span>}
      </div>

    <div className="col-span-full md:col-start-1 md:col-end-2 lg:col-start-2 lg:col-end-3">
      <div>
        <LabelTooltip
          label="Correo del Contacto"
          tooltip="Correo electrónico de contacto"
          htmlFor="correoContacto"
        />
        <Input
          id="correoContacto"
          type="email"
          className="bg-white disabled:bg-gray-100"
          placeholder="correo@ejemplo.com"
          disabled={mode === "view"}
          {...register("correoContacto", { 
            required: "El correo de contacto es requerido",
            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Correo electrónico inválido" }
          })}
        />
        {errors.correoContacto && <span className="text-[#CF5459] text-xs">{errors.correoContacto.message}</span>}
      </div>
    </div>

    </form>
  );
};
