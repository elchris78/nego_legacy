"use client";

import { useEffect, useState } from "react";
import NavbarHome from "@/menus/NavbarMenuP";
import { NAVIGATION } from "@/components/layout/menus/config/rutasConfiguracion";
import { WelcomePlantillas } from "@/admin/plantillas/components/WelcomePlantilla";
import { PlantillaTable } from "./components/table/SucursalTable";
import { PlantillaTableFilter } from "./components/table/SucursalTableFilter";
import { PlantillaTableTitle } from "./components/table/SucursalTableTitle";
import { PlantillaTablePagination } from "./components/table/SucursalTablePagination";
import { sucursales } from "./data/sucursales";
import Cookies from "js-cookie";
import { AppDispatch } from "@/lib/store/store";
import { useDispatch } from "react-redux";
import { getBranches } from "@/lib/services/branches/branchesSlice";
import { Box } from "@mui/material";
import { useFilteredNavigation } from "@/components/layout/menus/config/rutasConfiguracionClaims";
const title = "Sucursales de la empresa";
const textButton = "Crear nueva sucursal";
const subtitle = "Aún no has creado sucursales de la empresa.\n Da click en ";
const itemsPerPage = 10;

export default function Page() {
  const token = Cookies.get("auth-token");
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [departamentosFiltered, setDepartamentosFiltered] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch: AppDispatch = useDispatch();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = departamentosFiltered.slice(startIndex, endIndex);
  const filteredNavigation = useFilteredNavigation();
  const totalPages = Math.ceil(departamentosFiltered.length / itemsPerPage);
  const maxPage = departamentosFiltered.length === 0 ? 1 : totalPages;
  const [isRow3MenuOpen, setIsRow3MenuOpen] = useState(false);

  const handleRow3Toggle = (isOpen: boolean) => {
    setIsRow3MenuOpen(isOpen);
  };

  useEffect(() => {
    if (!token) return;
    getDepartamentos();
  }, [token]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const token = Cookies.get("auth-token") || "";
    console.log("Token obtenido:", token); // Log del token
  
    dispatch(getBranches({ token }))
      .then((action: any) => {
        // Verifica los datos recibidos
        console.log("Datos recibidos del dispatch:", action.payload);
  
        // Si el payload tiene los departamentos, actualiza el estado
        if (action.payload && action.payload.
          branches) {
          setDepartamentos(action.payload.
            branches);
          setDepartamentosFiltered(action.payload.
            branches);
          console.log("Departamentos actualizados:", action.payload.
            branches);
        }
      })
      .catch((error: any) => {
        // Si ocurre un error, haz un log del mismo
        console.error("Error al obtener departamentos:", error);
      });
  }, [dispatch]);

  const getDepartamentos = () => { 
    
    setDepartamentosFiltered(departamentos);
  };

  console.log("Departamentos por empresa",departamentos);

  return (
    <>
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-100"> 
        <NavbarHome textPagina="Inicio" navigation={filteredNavigation} onRow3Toggle={handleRow3Toggle}/>
      </header>

      <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          sx={{
            ml: { xs: "0px", lg: isRow3MenuOpen ? `335px` : "60px" },
            transition: { lg: "margin-left 0.3s" },
          }}
        >

      <div className="lg:ml-14">
      {departamentos.length === 0 ? (
        <div className="flex flex-col">
          <WelcomePlantillas
            title={title}
            subtitle={subtitle}
            textButton={textButton}
            showTooltip={false}
            tooltipPlacement="end"
            pathDimamic="/configuracion/configuracion-sistemas/catalogos-generales/sucursales/form?mode=new"
          />
        </div>
      ) : (
        <div className="p-6">
          <PlantillaTableTitle title={title} 
            sucursales={departamentos}
          />
          <PlantillaTableFilter
            sucursales={departamentos}
            setSucursalesFiltered={setDepartamentosFiltered}
            />
          <PlantillaTable
            paginatedData={paginatedData}
            getDepartamentos={getDepartamentos}
            />
          <PlantillaTablePagination
            handleNextPage={handleNextPage}
            currentPage={currentPage}
            handlePrevPage={handlePrevPage}
            totalPages={totalPages}
            total={departamentosFiltered.length}
            maxPage={maxPage}
            />
        </div>
      )}
      </div>
      </Box>
    </div>
    </>
  );
}

