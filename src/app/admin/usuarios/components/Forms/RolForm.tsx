"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CardContent } from "@/ui/card";
import { fetchGetRolesByCompanyId } from "../../services/usersActions";
import { Option } from "@/ui/multiselect";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useUserForm } from "./UserFormContext";
import Cookies from "js-cookie";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { HelpCircle } from "lucide-react";
import { Claim } from "../../services/claimsSlices";

interface RolFormValues {
  rol: string;
}

interface Props {
  company: Option;
  isCustomProfileSelected: boolean;
}

export interface RolByCompany {
  success: boolean;
  message: string;
  roles: Role[];
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

export interface Role {
  roleTemplateId: string;
  roleTemplateName: string;
  description: string;
  active: boolean;
  createdAt: Date;
  defaultRole: boolean;
}

export const RolForm = ({ company, isCustomProfileSelected }: Props) => {
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const { setCompaniesWithClaims, companiesWithClaims } = useUserForm();
  const [defaultValue, setDefaultValue] = useState(
    companiesWithClaims?.find((value) => value?.id === company?.value)
      ?.roleTemplateId ?? undefined
  );
  const [selectKey, setSelectKey] = useState(0);
  const [rolesByCompany, setRolesByCompany] = useState<Option[] | null>(null);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

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

  useEffect(() => {
    if (!company && !token) return;
    getRolesByCompany();
  }, [company]);

  // Update roleTemplateId & individualClaims with rol selected value
  useEffect(() => {
    if (rolesByCompany !== null) {
      const rolSelected = rolesByCompany?.find(
        (rol) => rol?.value === rolValue
      );
      setCompaniesWithClaims((prevValue) =>
        prevValue.map((companyValue) =>
          companyValue.id === company.value
            ? {
                ...companyValue,
                roleTemplateId: rolSelected?.value,
              }
            : companyValue
        )
      );
    }
  }, [rolValue]);

  useEffect(() => {
    if (isCustomProfileSelected) {
      reset();
      setDefaultValue(undefined);
      setSelectKey((prevKey) => prevKey + 1);
    }
  }, [isCustomProfileSelected]);

  // Set deafult default value
  useEffect(() => {
    setDefaultValue(
      companiesWithClaims?.find((value) => value?.id === company?.value)
        ?.roleTemplateId ?? undefined
    );
  }, [companiesWithClaims, company]);

  const getRolesByCompany = async () => {
    try {
      setIsLoadingRoles(true);
      const data = await fetchGetRolesByCompanyId({
        token,
        id: company?.value,
      });
      const rolsMap = data.roles.map((value: any) => ({
        label: value.roleTemplateName,
        value: value.roleTemplateId,
      }));
      setRolesByCompany(rolsMap);
      // console.log("🚀 ~ getRolesByCompany ~ data:", rolsMap);
    } catch (error) {
      // console.log("🚀 ~ getRolesByCompany ~ error:", error);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  return (
    <CardContent className="space-y-4 bg-[#3C98CB] rounded-b-lg">
      <form className="max-w-[400px] text-slate-800">
        <div className="flex items-center space-x-2">
          <label className="text-white">Rol</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="flex items-center">
              <button type="button" className="flex items-center">
                  <HelpCircle className="text-white" size={16} />
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
          disabled={
            mode === "view" || isCustomProfileSelected || isLoadingRoles
          }
        >
          <SelectTrigger error={!!errors.rol}>
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {rolesByCompany?.map((rol) => (
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
