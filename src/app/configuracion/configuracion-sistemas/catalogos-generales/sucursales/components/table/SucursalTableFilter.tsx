"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SearchIcon, Plus } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { fetchClaims } from "@/lib/services/claims/claimsSlices";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import filtroIcono from "@/Asset/Filtro.svg"
import { ChevronDown } from 'lucide-react';
import Image from "next/image";

interface SearchForm {
  estado: string;
  estatus: string;
  search: string;
}

interface Props {
  sucursales: any[];
  setSucursalesFiltered: Dispatch<SetStateAction<any[]>>;
}

export const PlantillaTableFilter = ({
  sucursales,
  setSucursalesFiltered,
}: Props) => {
  const filterForm = useForm<SearchForm>();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    resetField,
  } = filterForm;
  const formValues = watch();

  const [previousFilters, setPreviousFilters] = useState<SearchForm>();

  const estadosUnicos = Array.from(new Set(sucursales.map((sucursal) => sucursal.estado)));
  estadosUnicos.sort();
  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claims.data);

  useEffect(() => {
    const token = Cookies.get("auth-token") || "";
    dispatch(fetchClaims( token));
  }, [dispatch]);

  const hasClaim = (claimValue: string) => {
    return claims?.some((claim: { claimValue: string }) => claim.claimValue === claimValue);
  };
  

  useEffect(() => {
    const { estado, estatus, search } = formValues;

    if (
      previousFilters?.estado !== estado ||
      previousFilters?.estatus !== estatus ||
      previousFilters?.search !== search
    ) {
      onSubmit(formValues);
      setPreviousFilters(formValues);
    }
  }, [formValues]);

  const onSubmit = (data: SearchForm) => {
    const { estado, estatus, search } = data;

    let newSucursalesFiltered = sucursales;
    newSucursalesFiltered = filterByEstado(newSucursalesFiltered, estado);
    newSucursalesFiltered = filterByEstatus(newSucursalesFiltered, estatus);
    newSucursalesFiltered = filterBySearch(newSucursalesFiltered, search);
    setSucursalesFiltered(newSucursalesFiltered);
  };

  const filterByEstatus = (sucursales: any[], estatusString: string) => {
    if (!estatusString || estatusString === "undefined") return sucursales;
    const estatus = estatusString === "true";
    return sucursales.filter((sucursal) => sucursal.estatus === estatus);
  };

  const filterByEstado = (sucursales: any[], estado: string) => {
    if (!estado || estado === "undefined") return sucursales;
    return sucursales.filter((sucursal) => sucursal.estado === estado);
  };

  const filterBySearch = (sucursales: any[], search: string) => {
    if (!search) return sucursales;
    return sucursales.filter(
      (sucursal) =>
        sucursal.sucursal.toLowerCase().includes(search.toLowerCase()) ||
        sucursal.estado.toLowerCase().includes(search.toLowerCase()) ||
        sucursal.fechaCreacion.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
<div className="px-4">
  <form className="flex flex-wrap items-center justify-between gap-3" onSubmit={handleSubmit(onSubmit)}>
    {/* Contenedor para los inputs de búsqueda y filtro */}
    <div className="flex flex-wrap items-center gap-3">
      {/* Input de búsqueda */}
      <div className="flex my-1 items-center gap-3 rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2">
        <SearchIcon className="h-[16px] w-[16px] text-[#3C98CB]" />
        <div className="h-7 border-l-2 border-[#C1C5C8]/40"></div>
        <input
          id="search"
          type="search"
          placeholder="Buscar"
          className="w-[300px] p-2 placeholder:text-muted-foreground bg-white disabled:bg-gray-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          {...register("search", {
            required: false,
          })}
        />
      </div>

      {/* Botón de filtrar */}
      <div>
        <button
          type="button"
          className="flex w-[300px] items-center justify-between gap-2 px-4 py-2 rounded-md border border-input bg-white hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <Image
              src={filtroIcono}
              alt="Filtrar"
              width={20}
              height={20}
            />
            <span className="text-[#5D6D7E]">Filtrar</span>
          </div>
          <ChevronDown className="h-5 w-5 text-white bg-[#3C98CB] rounded" />
        </button>
      </div>
    </div>

    {/* Botón de Crear nueva sucursal */}
    <div>
      {hasClaim("Configuración.Sucursales.Crear") && (
        <Link
          href="/configuracion/configuracion-sistemas/catalogos-generales/sucursales/form?mode=new"
          className="bg-[#3c98cb] text-white px-6 py-3 rounded-md flex items-center space-x-2 hover:bg-[#3188b8] transition duration-300"
          aria-label="Crear nueva sucursal"
        >
          <Plus className="mr-2" />
          <span>Crear nueva sucursal</span>
        </Link>
      )}
    </div>
  </form>
</div>

  );
};
