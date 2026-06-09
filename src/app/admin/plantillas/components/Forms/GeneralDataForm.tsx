import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/ui/select";
import { Input } from "@/ui/input";
import MultipleSelector, { Option } from "@/ui/multiselect";

import { format } from "date-fns";
import { es } from "date-fns/locale";

import { fetchAllCompanies } from "@/app/admin/empresas/services/companyActions";
import { useEffect, useState } from "react";
import { usePlantillaForm } from "./PlantillaFormContext";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { Label } from '@/ui/label'
import xPlantillas from '@/assets/xPlantillas.png'
import { Box } from "@mui/material";
import { Textarea } from "@/components/ui/textarea";

interface Company {
  companyId: number;
  name: string;
  normalizedName: string;
  success: true;
  message: string;
}

const transformDate = (date?: string) => {
  const newDate = date ? new Date(date) : new Date();
  return format(newDate, "d MMMM yyyy", {
    locale: es,
  });
};

const selectAllValue = {
  label: "Todas",
  value: "select-all-companies",
};



export const GeneralDataForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const token = Cookies.get("auth-token");

  const { generalDataForm, currentPlantilla } = usePlantillaForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
  } = generalDataForm;

  const [companiesValue, setCompaniesValue] = useState<Option[]>([]);
  const [companies, setCompanies] = useState<Option[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  useEffect(() => {
    setValue("companies", companiesValue);
    if (companiesValue.length !== 0) clearErrors("companies");
  }, [companiesValue]);

  useEffect(() => {
    if (!token) {
      router.push("/not-authorized");
      return;
    }
    getAllCompanies();
  }, [token]);

  useEffect(() => {
    if (mode === "new") {
      setValue("isActive", "true");
    } else if (
      (mode === "edit" || mode === "view") &&
      (currentPlantilla || companies.length !== 0)
    ) { 
      setValue(
        "isActive",
        currentPlantilla?.active === true ? "true" : "false"
      );
      setValue("name", currentPlantilla?.roleTemplateName);
      setValue("description", currentPlantilla?.description);

      const companiesFiltered = companies?.filter((c) =>
        currentPlantilla?.companyIds?.some(
          (companyId: string) => companyId === c.value
        )
      );

      setCompaniesValue(companiesFiltered);
    }
  }, [currentPlantilla, mode, companies]);

  // Get all companies and set value on state
  const getAllCompanies = async () => {
    try {
      setIsLoadingCompanies(true);
      const data: Company[] = await fetchAllCompanies({ token });
      const companiesOptions = data.map((value) => ({
        label: value.name,
        value: String(value.companyId),
      }));

      setCompanies([selectAllValue, ...companiesOptions]);
    } catch (error) {
      console.log("馃殌 ~ getAllCompanies ~ error:", error);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  // Se desestructura la referencia y las props para poder colocarlas en el componente multiselect
  const { ref: companiesRef, ...companiesInputProps } = register("companies", {
    required: "Las empresas son requeridas.",
  });

  useEffect(() => {
    setValue("companies", companiesValue);
    if (companiesValue.length !== 0) clearErrors("companies");
  }, [companiesValue]);

  const handleChangeCompany = (companiesSelected: Option[]) => {
    // Validar si seleccion贸 la opci贸n Todos
    const allCompaniesValuewSelected = companiesSelected?.find(
      (company) => company.value === "select-all-companies"
    );

    if (allCompaniesValuewSelected !== undefined) {
      const allCompanies = companies?.filter(
        (company) => company.value !== "select-all-companies" 
      );
      setCompaniesValue(allCompanies); // Llenar con todas las empresas
    } else {
      setCompaniesValue(companiesSelected); // Llenar solo con las empresas seleccionadas
    }
  };

  return (
<Box
      display="grid"
      gridTemplateColumns={{ xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
      gap={2}
    >
      {/* name field */}
      <div>
        <LabelTooltip
          label="*Nombre de la plantilla"
          tooltip="Mínimo 3 caracteres, debe empezar con mayúscula."
          htmlFor="name"
        />
        <Input
          id="name"
          type="text"
          placeholder="Nombre de la plantilla"
          className="bg-white disabled:bg-[#E3E1E6] w-3/4"
          disabled={mode === "view"}
          {...register("name", {
            required: "El nombre de la plantilla es requerido",
            minLength: {
              value: 3,
              message:
                "El nombre de la plantilla no puede contener menos de 3 caracteres.",
            },
            maxLength: {
              value: 50,
              message:
                "El nombre de la plantilla no puede contener más de 50 caracteres.",
            },
            validate: {
              firstLetterUppercase: (value) =>
                /^[A-ZÁÉÍÓÚÑ]/.test(value) || "La primera letra debe ser mayúscula.",
              validCharacters: (value) =>
              /^[A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s.,;:]+$/.test(value) ||
                "Solo se permiten letras, números y caracteres válidos.",
            },
          })}
          isError={!!errors.name}
        />
        
        {errors.name && <span className="text-[#CF5459] text-xs">{errors.name?.message}</span>}
      </div>

      {/* Creation date field */}
      <div>
        <Label className="font-bold text-[#5D6D7E] text-md">Fecha de creación</Label>
        <Input
          id="creation-date"
          type="text"
          placeholder="Fecha de creación"
          className="text-gray-400 disabled:bg-[#E3E1E6] w-3/4"
          disabled
          value={mode !== "new" ? transformDate(currentPlantilla?.createdDate) : transformDate()}
        />
      </div>

      {/* description field */}
      <div className="relative flex flex-col md:min-h-[50px]">
        <Label className="font-bold text-[#5D6D7E] text-md">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Descripción"
          className="bg-white disabled:bg-[#E3E1E6] rounded-md border-[1px] border-gray-300 w-full p-2 max-[900px]:mt-1 min-[900px]:mt-7 max-[900px]:relative min-[900px]:absolute"
          disabled={mode === "view"}
          {...register("description", {
            maxLength: {
              value: 250,
              message:
                "La descripción no puede contener más de 250 caracteres.",
            },
          })}
          style={{
            minHeight: "2.6rem",
            maxHeight: "150px",
            // position: "relative",
            width: "75%",
            zIndex: 10,
          }}
        />
        {errors.description && (
          <span className="text-[#CF5459] text-xs absolute bottom-0">{errors.description?.message}</span>
        )}
      </div>

      {/* status field */}
      <div className="xs:mt-2">
        <Label className="font-bold text-[#5D6D7E] text-md">Estatus</Label>
        <Select
          onValueChange={(newValue) => {
            console.log("🚀 ~ GeneralDataForm ~ newValue:", newValue)
            setValue("isActive", newValue);
            clearErrors("isActive");
          }}
          {...register("isActive", {
            required: "El estatus del usuario es requerido",
          })}
          value={undefined}
          defaultValue={
            mode !== "new"
              ? currentPlantilla?.active === true
                ? "true"
                : "false"
              : "true"
          }
          disabled={mode === "view"}
        >
          <SelectTrigger className="w-3/4">
            <SelectValue placeholder="Selecciona un estatus" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={"true"}>Activo</SelectItem>
              <SelectItem value={"false"}>Inactivo</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.isActive && <span className="text-[#CF5459] text-xs">{errors.isActive?.message}</span>}
      </div>

      {/* Companies field */}
      <div>
        <Label className="font-bold text-[#5D6D7E] text-md">Compartir con:</Label>
        <MultipleSelector
          value={companiesValue}
          onChange={handleChangeCompany}
          options={companies}
          disabled={isLoadingCompanies || mode === "view"}
          placeholder="Selecciona una empresa"
          className="mt-1 w-3/4 disabled:bg-[#E3E1E6]"
          badgeClassName="text-white bg-[#3C98CB] hover:bg-[#69aacc] rounded-md disable:bg-[#C1C5C8] disable:text-white h-7"
          hidePlaceholderWhenSelected
          emptyIndicator={
            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">No hay resultados</p>
          }
        />
        {errors.companies && <span className="text-[#CF5459] text-xs">{errors.companies?.message}</span>}
      </div>
    </Box>
  );
};