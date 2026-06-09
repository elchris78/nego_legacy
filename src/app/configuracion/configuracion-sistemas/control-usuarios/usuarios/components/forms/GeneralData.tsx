"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/ui/label'
import { es } from "date-fns/locale";
import { Eye, EyeOff, HelpCircle } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserForm } from "./UsersFormContext";
import Cookies from "js-cookie";

const transformDate = (date?: string) => {
  const newDate = date ? new Date(date) : new Date();
  return format(newDate, "d MMMM yyyy", {
    locale: es,
  });
};

export const GeneralData = () => {
  const router = useRouter();
  const token = Cookies.get("auth-token");
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const isExternalUser = currentUser?.userType === "Externo";

  // Asign default values anly on editing user
  useEffect(() => {
    if (mode === "new") {
      setValue("isActive", "true");
    } else if ((mode === "edit" || mode === "view") && currentUser) {
      setValue("isActive", currentUser?.isActive === true ? "true" : "false");
      setValue("fullName", currentUser?.fullName);
      setValue("userName", currentUser?.userName);
      setValue("email", currentUser?.email);
    }
  }, [currentUser, mode]); 

  return (
    <>
    <div>
      {/* <div className="flex justify-start items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-[#4197CB] text-xl font-semibold antialiased mr-3">
            Datos generales
          </h1>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                <span>
                  <HelpCircle className="mr-1 mt-1" color="#BDC3C7" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>Datos generales</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div> */}

      <form className="grid grid-cols-1 grid-rows-8 gap-2 md:grid-cols-2 md:grid-rows-4 lg:grid-cols-3 lg:grid-rows-3">
        {/* User ID field */}
        <div className=" w-11/12">
          <div className="text-[#5D6D7E] font-semibold">
            <LabelTooltip
              label="ID de usuario"
              tooltip="Se genera de forma automática en la base de datos al agregar
              un nuevo usuario, este no se puede modificar por el usuario."
              htmlFor="user-id"
              />
          </div>
          <Input
            id="user-id"
            type="text"
            placeholder="ID de usuario"
            value={mode !== "new" ? currentUser?.userId : null}
            disabled
          />
        </div>

        {/* Creation date field */}
        <div className=" w-11/12">
          <Label className="text-[#5D6D7E] font-semibold text-md"> Fecha de creación </Label>
          
          <Input
            id="creation-date"
            type="text"
            placeholder="Fecha de creación"
            disabled
            className="text-gray-400"
            value={
              mode !== "new"
                ? transformDate(currentUser?.createdDate)
                : transformDate()
            }
          />
        </div>

        {/* status field */}
        <div className=" w-11/12">
          <Label className="text-[#5D6D7E] font-semibold">*Estatus</Label>
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
              mode !== "new" 
                ? currentUser?.isActive === true
                  ? "true"
                  : "false"
                : "true"
            }
            disabled={mode === "view" || isExternalUser}
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

        {/* Fullname field tooltip */}
        <div className=" w-11/12">
          <div className="text-[#5D6D7E] font-semibold">
            <LabelTooltip
              label="*Nombre completo"
              tooltip="Mínimo 3 caracteres y debe empezar con mayúscula."
              htmlFor="fullName"
            />
          </div>
          <Input
            id="fullName"
            type="text"
            placeholder="Ingresa el nombre completo"
            className="bg-white disabled:bg-gray-100"
            disabled={mode === "view" || isExternalUser}
            {...register("fullName", {
              required: "El nombre completo es requerido",
              minLength: {
                value: 3,
                message:
                  "El nombre completo no puede contener menos de 3 caracteres.",
              },
              maxLength: {
                value: 150,
                message:
                  "El nombre completo no puede contener más de 150 caracteres.",
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
        <div className=" w-11/12">
          <Label className="text-[#5D6D7E] font-semibold">*Usuario</Label>
          <Input
            id="userName"
            type="text"
            placeholder="Ingresa el usuario"
            className="bg-white disabled:bg-gray-100"
            disabled={mode === "view"  || isExternalUser}
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
        <div className=" w-11/12">
          <Label className="text-[#5D6D7E] font-semibold">*Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="Ingresa el correo electrónico"
            className="bg-white disabled:bg-gray-100"
            disabled={mode === "view" || isExternalUser}
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

        {/* password field tooltip */}
        <div className=" w-11/12">
          <div className="text-[#5D6D7E] font-semibold">
            <LabelTooltip
              label="*Contraseña"
              tooltip="Mínimo 8 caracteres, debe contener por lo menos un número,
                      mayúscula y algún caracter especial."
              htmlFor="password"
            />  
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`appearance-none relative block w-full px-3 py-2 border bg-white disabled:bg-gray-100 ${
                !!errors.password ? "border-red-500" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#3C98CB] focus:border-[#3C98CB] sm:text-sm pr-10`}
              placeholder="Ingresar contraseña"
              isError={!!errors.password}
              disabled={mode === "view" || isExternalUser}
              {...register("password", {
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
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
        <div className=" w-11/12">
          <Label className="text-[#5D6D7E] font-semibold">*Confirmar contraseña</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className={`appearance-none relative block w-full px-3 py-2 border bg-white disabled:bg-gray-100 ${
                !!errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#3C98CB] focus:border-[#3C98CB] sm:text-sm pr-10`}
              placeholder="Ingresar de nuevo la contraseña"
              disabled={mode === "view"|| isExternalUser}
              isError={!!errors.confirmPassword}
              {...register("confirmPassword", {
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                  message:
                    "La contraseña necesita mínimo 8 caracteres, al menos 1 mayúscula, 1 carácter especial, y un número.",
                },
                validate: (value: string | undefined) => {
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
      </form>
    </div>
    <span className="font-semibold text-sm text-slate-600">* Campos obligatorios</span>
    </>
  );
};
