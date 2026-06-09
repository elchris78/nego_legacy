import { useEffect, useRef, useState } from "react";

import { useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  alphanumericNoAccentsRegex,
  lettersNumbersSpecialsFirstUppercase,
  onlyNumbers,
} from "@/utils/regex";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { useMarcaForm } from "./MarcaFormContext";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import DownArrow from "@/Asset/downArrow.svg";
import Calendar from "@/Asset/Calendar.svg";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { BsFillTrash3Fill } from "react-icons/bs";
import "dayjs/locale/es"; // Importa idioma español
import Cookies from "js-cookie";
import { getFabricantes } from "../../../fabricantes/services/fabricantesActions";
import { Button } from "@/components/ui/button";
import ViewImageModal from "@/components/ui/Modals/ViewImageModal";

dayjs.locale("es");

const GeneralDataForm = () => {
  // const today = new Date().toISOString().split("T")[0];
  const today = dayjs();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const { generalDataForm, currentMarca, keyConfig } = useMarcaForm();
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorImage, setErrorImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fabricanteOptions, setFabricanteOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [showImageModal, setShowImageModal] = useState(false);

  const imageUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : typeof generalDataForm.watch("logo") === "string"
      ? generalDataForm.watch("logo")
      : currentMarca?.logoUrl || "";

  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
  } = generalDataForm;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validImageExtensions = /\.(jpg|jpeg|png)$/i;
      if (!validImageExtensions.test(file.name)) {
        setErrorImage(
          "El archivo debe ser una imagen con extensión .jpg, .jpeg, .png."
        );
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
      setSelectedFileName(file.name);
      setValue("logo", file);
      clearErrors("logo");
      setErrorImage("");
    }
  };



  const handleClick = () => {
    if (mode !== "view") {
      fileInputRef.current?.click();
    }
  };

  useEffect(() => {
    if (mode === "new") {
      setValue("estatus", "true");
    }
  }, [mode, setValue]);

  useEffect(() => {
    register("fabricante", { required: "El Fabricante es requerido" });
  }, [register]);

  


  useEffect(() => {
    const fetchFabricantes = async () => {
      try {
        const token = Cookies.get("auth-token");
        const resp = await getFabricantes({
          token,
          params: { isActive: ["true"] }, // Solo activos
        });
        const options = (resp.fabricantes || []).map((fab) => ({
          label: fab.nombre,
          value: fab.id,
        }));
        setFabricanteOptions(options);
      } catch (error) {
        setFabricanteOptions([]);
      }
    };
    fetchFabricantes();
  }, []);
useEffect(() => {
  if ((mode === "edit" || mode === "view") && currentMarca && fabricanteOptions.length > 0) {
    const fabricanteId = currentMarca?.fabricanteId ?? "";
    const found = fabricanteOptions.find((f) => String(f.value) === String(fabricanteId));


    setValue("claveMarca", currentMarca.id);
    setValue("prefix", keyConfig?.prefijo || "");
    setValue("estatus", currentMarca?.estatus === true ? "true" : "false");
    setValue("logo", currentMarca?.logoUrl);
    setValue("marca", currentMarca?.nombre);
    setValue("fabricante", found?.value ?? ""); // ✅ Usamos el id si lo encontramos

    // Fecha
    const fechaISO = currentMarca?.fechaVigencia;
    const fechaFormateada = fechaISO ? fechaISO.split("T")[0] : "";
    setValue("fechaVigencia", fechaFormateada);

    // Nombre de archivo de logo
    if (currentMarca.logoUrl) {
      try {
        const url = new URL(currentMarca.logoUrl);
        const pathname = url.pathname;
        const fileName = pathname.substring(pathname.lastIndexOf("/") + 1);
        const match = fileName.match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-(.+)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|gif|ico|avif|svg)$/i
        );
        if (match && match[1]) {
          setSelectedFileName(match[1]);
        } else {
          setSelectedFileName(fileName);
        }
      } catch {
        setSelectedFileName(currentMarca.logoUrl);
      }
    } else {
      setSelectedFileName("");
    }

    generalDataForm.trigger();
  }
}, [mode, currentMarca, fabricanteOptions, setValue, keyConfig, generalDataForm]);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID de La Descripción */}
        <div>
          <LabelTooltip
            label="*Clave Marca"
            tooltip="Identificador único de la Marca para uso interno de la empresa"
            htmlFor="id-marca"
          />
          <Input
            id="id-marca"
            type="text"
            placeholder="Clave Marca"
            isError={!!errors.claveMarca}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveMarca", {
              required:
                mode === "new" &&
                (keyConfig?.tipoClave === "Numérico" ||
                  keyConfig?.tipoClave === "Alfanumérico")
                  ? "La clave es requerida"
                  : false,
              pattern:
                mode === "new"
                  ? {
                      value:
                        keyConfig?.tipoClave === "Alfanumérico"
                          ? alphanumericNoAccentsRegex
                          : onlyNumbers,
                      message:
                        keyConfig?.tipoClave === "Alfanumérico"
                          ? "La clave debe ser alfanumérica"
                          : "La clave debe ser numérica",
                    }
                  : undefined,
              validate: (value) => {
                // Max length only on add
                if (mode === "new" && keyConfig?.longitudMaxima) {
                  if (value && value.length > keyConfig.longitudMaxima) {
                    return `La clave no puede exceder los ${keyConfig.longitudMaxima} caracteres`;
                  }
                }
              },
            })}
          />
          {errors.claveMarca && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveMarca?.message}
            </span>
          )}
        </div>

        {/* Prefijo */}
        {keyConfig?.tienePrefijo &&
          keyConfig?.tipoPrefijo === "Variable" &&
          mode === "new" && (
            <div>
              <LabelTooltip
                label="*Prefijo"
                tooltip="Ingresa el prefijo personalizado"
                htmlFor="prefix-input"
              />
              <Input
                id="prefix-input"
                type="text"
                placeholder="Prefijo personalizado"
                isError={!!errors.prefix}
                disabled={mode !== "new"}
                {...register("prefix", {
                  required: "Campo requerido",
                  pattern: {
                    value: alphanumericNoAccentsRegex,
                    message: "El prefijo debe ser alfanumérico",
                  },
                  maxLength: {
                    value: 3,
                    message: "El prefijo no puede exceder los 3 caracteres",
                  },
                })}
              />
              {errors.prefix && (
                <span className="text-[#CF5459] text-xs">
                  {errors.prefix.message}
                </span>
              )}
            </div>
          )}

        {/* Estatus de La marca */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si la marca esta activa o inactiva"
            htmlFor="status-puestos"
          />
          <Select
            onValueChange={(newValue) => {
              setValue("estatus", newValue);
              clearErrors("estatus");
            }}
            {...register("estatus", {
              required: "El estatus de la marca",
            })}
            value={
              generalDataForm.watch("estatus") ??
              (mode !== "new"
                ? currentMarca?.estatus === true
                  ? "true"
                  : "false"
                : "true")
            }
            disabled={mode === "view"}
          >
            <SelectTrigger error={!!errors.estatus}>
              <SelectValue placeholder="Selecciona un estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"true"}>Activo</SelectItem>
                <SelectItem value={"false"}>Inactivo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.estatus && (
            <span className="text-[#CF5459] text-xs">
              {errors.estatus?.message}
            </span>
          )}
        </div>

        {/* Logo */}
        <div>
          <LabelTooltip
            label="Logo"
            tooltip="Selecciona la imagen que representa el logo de la marca"
            htmlFor="logo"
          />

          {/* Input falso para mostrar nombre del archivo */}
          <div className="relative" onClick={handleClick}>
            <Input
              id="logo"
              type="text"
              placeholder="Seleccionar archivo"
              value={
                selectedFileName
                  ? `Archivo seleccionado - ${selectedFileName}`
                  : ""
              }
              readOnly
              isError={!!errors.logo}
              disabled={mode === "view"}
              className="pr-10" // espacio para el icono
            />

            {selectedFileName && mode !== "view" && (
              <BsFillTrash3Fill
                onClick={(e: any) => {
                  e.stopPropagation(); // prevenir que se dispare handleClick
                  setSelectedFileName("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  setValue("logo", "");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 cursor-pointer hover:text-red-500"
              />
            )}
          </div>

          {/* Botón para ver imagen */}
          {imageUrl && imageUrl !== "" && (
            <Button
              type="button"
              variant="link"
              className=" text-[#4197CB]"
              onClick={() => setShowImageModal(true)}
            >
              Ver imagen
            </Button>
          )}

          {/* Input real para seleccionar archivo */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          {errors.logo && (
            <span className="text-[#CF5459] text-xs">
              {errors.logo?.message}
            </span>
          )}
          {/* Modal para ver imagen */}
          <ViewImageModal
            open={showImageModal}
            onClose={() => setShowImageModal(false)}
            imagen={
              selectedFile
                ? URL.createObjectURL(selectedFile)
                : typeof generalDataForm.watch("logo") === "string"
                  ? (generalDataForm.watch("logo") as string)
                  : currentMarca?.logoUrl || ""
            }
          />
          {errorImage && (
            <span className="text-[#CF5459] text-xs">
              {errorImage}
            </span>
          )}
        </div>

        <div>
          <LabelTooltip
            label="*Marca"
            tooltip="Ingresa el nombre oficial de la marca. Evita abreviaciones o variaciones. Ejemplo: Coca-Cola, Sony, Microsoft."
            htmlFor="Marca"
          />
          <Input
            id="marca"
            type="text"
            placeholder="Ingresa el nombre de la marca"
            isError={!!errors.marca}
            {...register("marca", {
              required: "La Marca es requerida",
              minLength: {
                value: 3,
                message: "La Marca debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "La Marca no puede exceder los 100 caracteres",
              },
              pattern: {
                value: lettersNumbersSpecialsFirstUppercase,
                message: "La Marca debe iniciar con mayúscula",
              },
            })}
            disabled={mode === "view"}
          />
          {errors.marca && (
            <span className="text-[#CF5459] text-xs">
              {errors.marca?.message}
            </span>
          )}
        </div>

        <div>
          <LabelTooltip
            label="*Fabricante"
            tooltip="Selecciona el fabricante de la marca"
            htmlFor="fabricante"
          />
          <Autocomplete
            disablePortal
            options={fabricanteOptions}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            value={
              fabricanteOptions.find(
                (opt) =>
                  opt.value ===
                  (generalDataForm.watch("fabricante") ??
                    currentMarca?.fabricante ??
                    "")
              ) ?? null
            }
            onChange={(_, newValue) => {
              const selectedValue = newValue?.value ?? "";
              setValue("fabricante", selectedValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("fabricante");
            }}
            popupIcon={<DownArrow />}
            disabled={mode === "view"}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  checked={selected}
                  sx={{
                    padding: 0.5,
                    "& .MuiSvgIcon-root": {
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: "1.5px solid #5B6670",
                      backgroundColor: "transparent",
                      path: {
                        display: "none",
                      },
                    },
                    "&.Mui-checked": {
                      "& .MuiSvgIcon-root": {
                        backgroundColor: "#4197CB",
                        border: "none",
                      },
                    },
                  }}
                />
                {option.label}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                placeholder="Selecciona una opción"
                {...params}
                error={!!errors.fabricante}
                helperText={errors.fabricante?.message}
                sx={{
                  marginTop: "4px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    height: "4.5vh",
                    backgroundColor: mode === "view" ? "#E3E1E6" : "white",
                    color: mode === "view" ? "#949DA4" : "#5D6D7E",
                    "& fieldset": {
                      borderColor: "#C1C5C8",
                    },
                    "&:hover fieldset": {
                      borderColor: "#C1C5C8",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#C1C5C8",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#5D6D7D",
                  },
                  "& .Mui-focused": {
                    color: "#5D6D7D",
                  },
                }}
              />
            )}
            sx={{
              "& .MuiAutocomplete-inputRoot": {
                padding: "4px",
              },
            }}
          />
        </div>

        <div>
          <LabelTooltip
            label="Fecha de vigencia"
            tooltip="Fecha de vigencia de la marca"
            htmlFor="fecha"
          />
          <div className="relative">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                disabled={mode === "view"}
                format="DD/MM/YYYY"
                minDate={dayjs(today)}
                sx={{
                  marginTop: "4px",
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    height: "4.5vh",
                    backgroundColor: mode === "view" ? "#E3E1E6" : "white",
                    color: mode === "view" ? "#949DA4" : "#5D6D7E",
                    flexDirection: "row-reverse",
                    textTransform: "lowercase",
                  },
                  "& input": {
                    textTransform: "lowercase",
                  },
                }}
                slotProps={{
                  textField: {
                    placeholder: "dd/mm/aaaa",
                  },
                }}
                value={
                  generalDataForm.watch("fechaVigencia")
                    ? dayjs(generalDataForm.watch("fechaVigencia"))
                    : null
                }
                onChange={(newValue) => {
                  generalDataForm.setValue(
                    "fechaVigencia",
                    newValue ? newValue.format("YYYY-MM-DD") : ""
                  );
                }}
                slots={{
                  openPickerIcon: Calendar,
                }}
              />
            </LocalizationProvider>
          </div>
          {errors.fechaVigencia && (
            <span className="text-[#CF5459] text-xs">
              {errors.fechaVigencia?.message}
            </span>
          )}
        </div>
      </div>

      <span className="font-bold text-[#5D6D7E] text-sm">
        * Campos obligatorios
      </span>
    </>
  );
};

export default GeneralDataForm;
