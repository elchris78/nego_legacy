import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/ui/select";
import { es } from "date-fns/locale";
import { Eye, EyeOff } from "lucide-react";
import { fetchAllCompanies } from "@/admin/empresas/services/companyActions";
import { format } from "date-fns";
import { Input } from "@/ui/input";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserForm } from "./UserFormContext";
import Cookies from "js-cookie";
import MultipleSelector, { Option } from "@/ui/multiselect";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { Label } from "@/components/ui/label";

interface Company {
  companyId: number;
  name: string;
  normalizedName: string;
  success: true;
  message: string;
}
const selectAllValue = {
  label: "Todas",
  value: "select-all-companies",
};

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

  const { generalDataForm, currentUser } = useUserForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    getValues,
    resetField,
  } = generalDataForm;

  const [companiesValue, setCompaniesValue] = useState<Option[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [companies, setCompanies] = useState<Option[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  // Se desestructura la referencia y las props para poder colocarlas en el componente multiselect
  const { ref: companiesRef, ...companiesInputProps } = register("companies", {
    required: "Las empresas son requeridas.",
  });

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

  // Asign default values anly on editing user
  useEffect(() => {
    if (mode === "new") {
      setValue("isActive", "true");
    } else if (
      (mode === "edit" || mode === "view") &&
      (currentUser || companies.length !== 0)
    ) {
      setValue("isActive", currentUser?.user.isActive === true ? "true" : "false");
      setValue("fullName", currentUser?.user.fullName);
      setValue("userName", currentUser?.user.userName);
      setValue("email", currentUser?.user.email);

      const userTypeValue = currentUser?.user.typeOfUser?.toLowerCase();
      if (userTypeValue === "compartido" || userTypeValue === "exclusivo")
        setValue("userType", currentUser?.user.typeOfUser?.toLowerCase());

      const companiesFiltered = companies?.filter((c) =>
        currentUser?.user.companies?.some(
          (saved: any) => saved.companyId.toString() === c.value
        )
      );
      setCompaniesValue(companiesFiltered);
    }
  }, [currentUser, mode, companies]);

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
      console.log("🚀 ~ getAllCompanies ~ error:", error);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const handleChangeCompany = (companiesSelected: Option[]) => {
    const userType = getValues("userType");
  
    // Si el usuario es "exclusivo", no debe permitir seleccionar "Todas"
    const allCompaniesSelected = companiesSelected.find(
      (company) => company.value === "select-all-companies"
    );
  
    if (userType === "exclusivo" && allCompaniesSelected) {
      setError("companies", {
        type: "manual",
        message: "No puedes seleccionar 'Todas' en el modo exclusivo.",
      });
      return;
    }
  
    // Si seleccionó "Todas", se asignan todas las empresas
    if (allCompaniesSelected) {
      const allCompanies = companies.filter(
        (company) => company.value !== "select-all-companies"
      );
      setCompaniesValue(allCompanies);
    } else {
      setCompaniesValue(companiesSelected);
      clearErrors("companies"); // Borra errores si la selección es válida
    }
  };
  
  return (
    <div className="grid gap-4">
      {/* User ID field */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="w-full md:w-11/12">
            {mode === "view" ? (
              <Label>ID de usuario</Label>
            ) : (
              <LabelTooltip
                label="ID de usuario"
                tooltip="Se genera de forma automática en la base de datos al agregar un nuevo usuario, este no se puede modificar por el usuario."
                htmlFor="user-id"
              />
            )}
            <Input
              id="user-id"
              type="text"
              placeholder="ID de usuario"
              value={mode !== "new" ? currentUser?.user.userId : ""}
              disabled
            />
          </div>

        {/* Creation date field */}
        <div className="w-full md:w-11/12">
          <Label className="font-normal text-md">Fecha de creación</Label>
          <Input
            id="creation-date"
            type="text"
            placeholder="Fecha de creación"
            disabled
            className="text-gray-400"
            value={
              mode !== "new"
                ? transformDate(currentUser?.user.createdDate)
                : transformDate()
            }
          />
        </div>

        {/* status field */}
        <div className="w-full md:w-11/12">
          <Label className="font-normal text-md">*Estatus</Label>
          <Select
            onValueChange={(newValue) => {
              setValue("isActive", newValue);
              clearErrors("isActive");
            }}
            {...register("isActive", {
              required: "El estatus del usuario es requerido",
            })}
            value={undefined}
            defaultValue={
              (() => {
                if (mode !== "new") {
                  return currentUser?.user.isActive ? "true" : "false";
                }
                return "true";
              })()
            }
            disabled={mode === "view"}
          >
            <SelectTrigger error={!!errors.isActive}>
              <SelectValue placeholder="Selecciona un estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"true"}>Activo</SelectItem>
                <SelectItem value={"false"}>Inactivo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.isActive && (
            <span className="text-[#CF5459] text-xs">
              {errors.isActive?.message}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="w-full md:w-11/12">
          <LabelTooltip
            label="*Nombre completo"
            tooltip="Mínimo 3 caracteres y debe empezar con mayúscula."
            htmlFor="fullName"
          />
          <Input
            id="fullName"
            type="text"
            placeholder="Ingresa el nombre completo"
            className="bg-white disabled:bg-[#E3E1E6]"
            disabled={mode === "view"}
            {...register("fullName", {
              required: "El nombre completo es requerido",
              minLength: {
                value: 3,
                message: "El nombre completo no puede contener menos de 3 caracteres.",
              },
              maxLength: {
                value: 150,
                message: "El nombre completo no puede contener más de 150 caracteres.",
              },
              pattern: {
                value: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s]*$/,
                message: "El nombre debe comenzar con mayúscula y solo contener letras.",
              },
            })}          
            isError={!!errors.fullName}
          />
          {errors.fullName && (
            <span className="text-[#CF5459] text-xs">
              {errors.fullName?.message}
            </span>
          )}
        </div>

        {/* userName field */}
        <div className="w-full md:w-11/12">
          <Label className="font-normal text-md">*Usuario</Label>
          <Input
            id="userName"
            type="text"
            placeholder="Ingresa el usuario"
            className="bg-white disabled:bg-[#E3E1E6]"
            disabled={mode === "view"}
            {...register("userName", {
              required: "El usuario es requerido",
              minLength: {
                value: 5,
                message: "El usuario no puede contener menos de 5 caracteres.",
              },
              maxLength: {
                value: 10,
                message: "El usuario no puede contener más de 10 caracteres.",
              },
              pattern: {
                value: /^[a-zA-Z][a-zA-Z0-9]*$/,
                message:
                  "Sólo se permiten letras y números en este campo. No se aceptan espacios ni caracteres especiales. El primer caracter debe ser una letra.",
              },
            })}
            isError={!!errors.userName}
          />
          {errors.userName && (
            <span className="text-[#CF5459] text-xs">
              {errors.userName?.message}
            </span>
          )}
        </div>

        {/* email field */}
        <div className="w-full md:w-11/12">
          <Label className="font-normal text-md">*Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="Ingresa el correo electrónico"
            className="bg-white disabled:bg-[#E3E1E6]"
            disabled={mode === "view"}
            {...register("email", {
              required: "El correo electrónico es requerido",
              maxLength: {
                value: 50,
                message:
                  "El correo electrónico no puede contener más de 50 caracteres.",
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Debe tener formato de correo electrónico",
              },
            })}
            isError={!!errors.email}
          />
          {errors.email && (
            <span className="text-[#CF5459] text-xs">
              {errors.email?.message}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="w-full md:w-11/12">
          <Label className="font-normal text-md">*Tipo de usuario</Label>
          <Select
            onValueChange={(newValue) => {
              setValue("userType", newValue);
              clearErrors("userType");
              resetField("companies");
              setCompaniesValue([]);

            }}
            {...register("userType", {
              required: "El tipo de usuario es requerido",
            })}
            value={getValues("userType")}
            defaultValue={undefined}
            disabled={mode === "view"}
          >
            <SelectTrigger error={!!errors.userType}>
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="compartido">Compartido</SelectItem>
                <SelectItem value="exclusivo">Exclusivo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.userType && (
            <span className="text-[#CF5459] text-xs">
              {errors.userType?.message}
            </span>
          )}
        </div>

        {/* Companies field */}
        <div className="w-full md:w-11/12">
          <Label className="font-normal text-md">Empresa(s) asignadas</Label>
          <MultipleSelector
            value={companiesValue}
            onChange={handleChangeCompany}
            options={companies}
            ref={companiesRef}
            inputProps={companiesInputProps}
            maxSelected={getValues("userType") === "exclusivo" ? 1 : undefined}
            disabled={
              !getValues("userType") || isLoadingCompanies || mode === "view"
            }
            error={!!errors.companies}
            placeholder="Selecciona una empresa"
            className="mt-1 w-full  disabled:bg-[#E3E1E6]"
            badgeClassName="text-white bg-[#3C98CB] hover:bg-[#69aacc] h-8 text-sm"
            hidePlaceholderWhenSelected
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                No hay resultados
              </p>
            }
          />
          {errors.companies && (
            <span className="text-[#CF5459] text-xs">
              {errors.companies?.message}
            </span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="w-full md:w-11/12">
          <LabelTooltip
            label="*Contraseña"
            tooltip="Mínimo 8 caracteres, debe contener por lo menos un número,
                      mayúscula y algún caracter especial."
            htmlFor="password"
          />
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`appearance-none relative block w-full px-3 py-2 border bg-white disabled:bg-[#E3E1E6] ${
                errors.password ? "border-red-500" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#3C98CB] focus:border-[#3C98CB] sm:text-sm pr-10`}
              placeholder="Ingresar contraseña"
              isError={!!errors.password}
              disabled={mode === "view"}
              {...register("password", {
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                  message:
                    "La contraseña necesita mínimo 8 caracteres, al menos 1 mayúscula, 1 carácter especial, y un número.",
                },
                validate: (value) => {
                  // Requerido solo en modo "new"
                  if (mode === "new" && !value) {
                    return "La contraseña es requerida";
                  }

                  // Validación de coincidencia con la confirmación de contraseña
                  const confPassValue = getValues("confirmPassword");
                  if (value !== confPassValue) {
                    if (confPassValue !== "") {
                      setError("confirmPassword", {
                        message: "Las contraseñas no coinciden",
                      });
                      return "Las contraseñas no coinciden";
                    }
                  } else {
                    clearErrors("confirmPassword");
                  }

                  return true; // Validación exitosa si no hay errores
                },
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowPassword(!showPassword)}
              disabled={mode === "view"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-[#3C98CB]" />
              ) : (
                <Eye className="h-5 w-5 text-[#3C98CB]" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-[#CF5459] text-xs">
              {errors.password?.message}
            </span>
          )}
        </div>

        {/* confirm password field */}
        {mode === "view" ? (
            <></>
        ): (
          <div className="w-full md:w-11/12">
            <Label className="font-normal text-md">*Confirmar Contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`appearance-none relative block w-full px-3 py-2 border bg-white disabled:bg-gray-100 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#3C98CB] focus:border-[#3C98CB] sm:text-sm pr-10`}
                placeholder="Ingresar de nuevo la contraseña"
                disabled={mode === "view"}
                isError={!!errors.confirmPassword}
                {...register("confirmPassword", {
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                    message:
                      "La contraseña necesita mínimo 8 caracteres, al menos 1 mayúscula, 1 carácter especial, y un número.",
                  },
                  validate: (value: string) => {
                    // Requerido solo en modo "new"
                    if (mode === "new" && !value) {
                      return "La contraseña es requerida";
                    }

                    // Match password
                    const passValue = getValues("password");
                    if (value !== passValue) {
                      if (passValue !== "") {
                        setError("password", {
                          message: "Las contraseñas no coinciden",
                        });
                        return "Las contraseñas no coinciden";
                      }
                    } else {
                      clearErrors("password");
                    }

                    return true; // Validación exitosa si no hay errores
                  },
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={mode === "view"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-[#3C98CB]" />
                ) : (
                  <Eye className="h-5 w-5 text-[#3C98CB]" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-[#CF5459] text-xs">
                {errors.confirmPassword?.message}
              </span>
            )}
          </div>
        )}
      </div>
      <span className="font-semibold text-md text-slate-600">* Campos obligatorios</span>
    </div>
  );
};
