"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RootState } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import AccordionFilters from "./AccordionFilters";
import BadgeFiltersList from "./BadgeFiltersList";
import DropdownButtons from "./DropdownButtons";
import FilterIcon from "@/components/ui/icons/Filter";
import searchIcon from "@/Asset/searchIcon.png";

import type { SellersParams } from "../../services/sellersTypes";
import { getSubZonas } from "@/app/configuracion/configuracion-modulos/generales/catalogos/sub-zonas/services/subZonasActions";
import Cookies from "js-cookie";
import { getColaboradores } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresActions";
import { getSellerTypes } from "../../../tipos-vendedores/services/sellersTypesActions";

const createClaim =
  "Configuración.Configuración de módulos.Ventas.Catálogos.Vendedores.Crear";

interface Props {
  searchParams: SellersParams;
  setSearchParams: Dispatch<SetStateAction<SellersParams>>;
}

const statusOptions = [
  { value: "true", label: "Activo" },
  { value: "false", label: "Inactivo" },
];
const comisionOptions = [
  { value: "global", label: "Global" },
  { value: "variable", label: "Variable" },
];

const SellersTypesTableFilters = ({ searchParams, setSearchParams }: Props) => {
  const [inputValue, setInputValue] = useState(""); // Valor del input sin debounce
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [zonaOptions, setZonaOptions] = useState<{ label: string; value: string }[]>([]);
  const [vendedorOptions, setVendedorOptions] = useState<{ label: string; value: string }[]>([]);
  const [colaboradoresOptions, setColaboradoresOptions] = useState<{ label: string; value: string }[]>([]);
  const [subZonaOptions, setSubZonaOptions] = useState<{ label: string; value: string }[]>([]);
  const [tipoVendedorOptions, setTipoVendedorOptions] = useState<{ label: string; value: string }[]>([]);
  const [allSubZonas, setAllSubZonas] = useState<any[]>([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string>("");
  const claims = useSelector((state: RootState) => state.claims.data);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((prev) => ({ ...prev, searchQuery: inputValue }));
    }, 500); // Retraso de 500ms

    return () => {
      clearTimeout(handler); // Limpia el timeout anterior si el valor cambia antes de que termine
    };
  }, [inputValue]); // Solo se ejecuta cuando inputValue cambia

  // Filtrar navegación según los claims
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  useEffect(() => {
    const fetchTypeSeller = async () => {
      try {
        const token = Cookies.get("auth-token");
        const resp = await getSellerTypes({
          token,
          params: { isActive: ["true"] }, // Solo activos
        });
        const options = (resp.tiposVendedor || []).map((tiv) => ({
          label: tiv.nombre,
          value: tiv.id,
        }));
        setTipoVendedorOptions(options);
      } catch (error) {
        setTipoVendedorOptions([]);
      }
    };
    fetchTypeSeller();
  }, []);

  useEffect(() => {
      const fetchColab = async () => {
        try {
          const token = Cookies.get("auth-token");
          const resp = await getColaboradores({
            token,
            params: { estatus: ["true"] }, // Solo activos
          });
          const options = (resp.colaboradores || []).map((colab) => ({
            label: colab.nombreCompleto ?? "", // Para el supervisor
            value: colab.id,
          }));
          setVendedorOptions(options);
          setColaboradoresOptions(options);
        } catch (error) {
          setVendedorOptions([]);
          setColaboradoresOptions([]);
        }
      };
      fetchColab();
    }, []);

  useEffect(() => {
    const fetchSubZona = async () => {
      try {
        const token = Cookies.get("auth-token");
        const resp = await getSubZonas({
          token,
          params: { isActive: ["true"] },
        });

        const subZonas = resp.subZonas || [];

        // Guardamos todas las subzonas para filtrar después
        setAllSubZonas(subZonas);

        // Extraer zonas únicas por zonaNombre
        const uniqueZonasMap = new Map();
        subZonas.forEach((subz) => {
          if (!uniqueZonasMap.has(subz.zonaNombre)) {
            uniqueZonasMap.set(subz.zonaNombre, {
              label: subz.zonaNombre,
              value: subz.zonaId,
            });
          }
        });
        const zonasUnicas = Array.from(uniqueZonasMap.values());
        setZonaOptions(zonasUnicas);
      } catch (error) {
        setZonaOptions([]);
        setSubZonaOptions([]);
      }
    };

    fetchSubZona();
  }, []);

    useEffect(() => {
      if (!zonaSeleccionada || allSubZonas.length === 0) {
        setSubZonaOptions([]);
        return;
      }
  
      // Filtra las subzonas que tengan el mismo zonaNombre
      const subZonasFiltradas = allSubZonas
        .filter((subz) => subz.zonaId === zonaSeleccionada)
        .map((subz) => ({
          label: subz.nombre, // o el campo que quieras mostrar
          value: subz.id,     // o subz.zonaId si aplica
        }));
  
      setSubZonaOptions(subZonasFiltradas);
    }, [zonaSeleccionada, allSubZonas]);
  return (
    <div className="px-4">
      <form
        className="flex flex-col items-center md:flex-row md:justify-between gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Primera sección de filtros */}
        <div className="flex w-full flex-wrap justify-center md:justify-start md:w-3/4 lg:w-4/6 gap-3">
          {/* Search */}
          <div className="flex-1 min-w-56 max-w-80">
            <div className="flex items-center gap-3 rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 h-[2.625rem]">
              <Image src={searchIcon} alt="Search" width={20} height={20} />
              <input
                id="search"
                type="search"
                placeholder="Buscar..."
                className="w-full p-2 placeholder:text-muted-foreground bg-white disabled:bg-gray-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>

          {/* Multi select Filter options */}
          <div className="w-auto">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-30 flex gap-2 py-5 px-3 border-gray-300"
                >
                  <div className="flex flex-row items-center justify-start gap-1">
                    <FilterIcon color="#5B6670" />
                    <span className="font-normal text-gray-700">Filtrar</span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[93vw] p-0 ml-4 mr-6 sm:w-[40vw] sm:ml-0 sm:mr-0 max-h-[500px] overflow-y-auto"
              >
                <AccordionFilters
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                  onClosePopover={() => setIsPopoverOpen(false)}
                  statusOptions={statusOptions}
                  zonaOptions = {zonaOptions}
                  subZonaOptions = {subZonaOptions}
                  vendedorOptions = {vendedorOptions}
                  tipoVendedorOptions = {tipoVendedorOptions}
                  colaboradoresOptions={colaboradoresOptions}
                  comisionOptions={comisionOptions}
                  setZonaSeleccionada={setZonaSeleccionada}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Options */}
        <div className="w-auto flex gap-2">
          {hasClaim(createClaim) && (
            <Link
              href={
                "/configuracion/configuracion-modulos/ventas/catalogos/vendedores/form?mode=new"
              }
              className="bg-[#3c98cb] text-white px-2 py-1 rounded-lg flex items-center justify-center w-[100px] space-x-2 hover:bg-[#3188b8] transition duration-300"
              aria-label="Crear nuevo departamento"
            >
              <Plus size={22} strokeWidth={3} />
              <div className="flex flex-rpw md:flex-col gap-1 md:gap-0 text-sm text-center">
                <span>Agregar</span>
              </div>
            </Link>
          )}

          <DropdownButtons />
        </div>
      </form>

      {/* Badge List */}
      <BadgeFiltersList
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        statusOptions={statusOptions}
        setInputValue={setInputValue}
        zonaOptions = {zonaOptions}
        subZonaOptions = {subZonaOptions}
        vendedorOptions = {vendedorOptions}
        colaboradoresOptions={colaboradoresOptions}
        comisionOptions={comisionOptions}
        tipoVendedorOptions = {tipoVendedorOptions}
      />
    </div>
  );
};

export default SellersTypesTableFilters;
