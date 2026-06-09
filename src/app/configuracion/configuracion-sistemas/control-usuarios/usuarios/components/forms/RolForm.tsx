"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/ui/select";
import { CardContent } from "@/ui/card";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUserForm } from "./UsersFormContext";
import { useSearchParams } from "next/navigation";

interface RolFormValues {
  rol: string;
}

export interface IndividualClaimsByRole {
  roleTemplateId: string
  roleTemplateName: string
  description: string
  active: boolean
  defaultRole: boolean
  createdAt: string
  companyIds: string[]
  claims: Claim[]
}

export type Claim = {
  claimType: string;
  claimValue: string;
};

interface Props {
  isCustomProfileSelected: boolean;
}

export const RolForm = ({ isCustomProfileSelected }: Props) => {
  const { rols, setClaims, claims, currentUser, isLoadingUser } = useUserForm();
  const [defaultValue, setDefaultValue] = useState<any>(undefined);
  const [selectKey, setSelectKey] = useState(0);

  const rolForm = useForm<RolFormValues>({
    defaultValues: {
      rol: defaultValue,
    },
  });

  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
    reset,
  } = rolForm;

  const rolValue = getValues("rol");

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  // Update roleTemplateId with rol selected value
  useEffect(() => {
    const rolSelected = rols.find((rol) => rol?.value === rolValue);
    console.log("SETTING CLAIMS RolForm", );
    setClaims((prevValue: any) => {
      return { ...prevValue, roleTemplateId: rolSelected?.value };
    });
  }, [rolValue]);

  useEffect(() => {
    if (isCustomProfileSelected) {
      reset();
      setDefaultValue(undefined);
      setSelectKey((prevKey) => prevKey + 1);
    }
  }, [isCustomProfileSelected]);

  // Set deafult value on edit o view
  useEffect(() => {
    if (isLoadingUser && !currentUser) return;
    if (!isLoadingUser && currentUser)
      setDefaultValue(currentUser?.roleTemplateId ?? undefined);
  }, [isLoadingUser, currentUser]);

  return (
    <CardContent className="space-y-4 bg-[#3C98CB] rounded-b-lg">
      <form className="max-w-[400px] text-slate-800">
        <div className="flex items-center space-x-2">
          <label className="text-white">Rol</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="flex items-center">
                  <HelpCircle className="mr-1 mt-1" color="#BDC3C7" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[260px] text-sm">
                <span>Rol.</span>{" "}
                {/*-------------------------------------------------------------- */}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Select
          key={selectKey}
          value={defaultValue}
          onValueChange={(newValue) => {
            setValue("rol", newValue);
            clearErrors("rol");
          }}
          {...register("rol", {
            required: "El tipo de usuario es requerido",
          })}
          disabled={mode === "view" || isCustomProfileSelected}
        >
          <SelectTrigger error={!!errors.rol}>
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {rols.map((rol) => (
                <SelectItem key={rol?.value} value={rol?.value}>
                  {rol?.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.rol && (
          <span className="text-[#CF5459] text-xs">{errors.rol?.message}</span>
        )}
      </form>
    </CardContent>
  );
};
