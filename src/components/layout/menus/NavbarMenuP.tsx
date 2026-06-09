"use client";
import React, { useRef, useEffect, useState } from "react";
import { AppBar, Typography } from "@mui/material";
import NavDesplegableRow3 from "@/components/layout/menus/nav-desplegable/NavDesplegableRow3";
import NavDesplegableRow2 from "@/components/layout/menus/nav-desplegable/NavDesplegableRow2";
import NavDesplegableRow1 from "@/components/layout/menus/nav-desplegable/NavDesplegableRow1";
import Cookies from "js-cookie";
import { filterNavigation } from "./config/FilterNavigation";
import {useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import Grid from '@mui/material/Grid';
import { getCompanies } from "@/app/admin/empresas/services/companySlices";
import { useRouter } from "next/navigation";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { TbCalculator } from "react-icons/tb";
import { HomeSharp, PaymentsOutlined, PointOfSale, RocketLaunchOutlined, ShoppingCartOutlined, WarehouseOutlined } from "@mui/icons-material";
    
const companyId = Cookies.get("companyId")
const NAVIGATION = [
  { route: `/home/${companyId}`, icon: <HomeSharp />},
  { label: "Compras", route:`/compras`, claimValue: "Compras", icon: <ShoppingCartOutlined /> },
  { label: "Almacenes", route: `/home/${companyId}`, claimValue: "Almacen", icon: <WarehouseOutlined /> },
  { label: "Ventas", route: `/home/${companyId}`, claimValue: "Ventas", icon: <PointOfSale  /> },
  { label: "Distribución", route: `/home/${companyId}`, claimValue: "Distribucion", icon: <LocalShippingOutlinedIcon /> },
  { label: "Finanzas", route: `/home/${companyId}`, claimValue: "Finanzas", icon: <PaymentsOutlined /> },
  { label: "Proyectos", route: `/home/${companyId}`, claimValue: "Proyectos", icon: <RocketLaunchOutlined /> },
  { label: "Contabilidad", route: `/home/${companyId}`, claimValue: "Contabilidad", icon: <TbCalculator /> },
];

// interface NavItem {
//   segment: string;
//   title: string;
//   icon?: React.ReactNode | StaticImageData;
//   src?: string;
//   children?: NavItem[];
// }

interface NavbarDesplegableProps {
  textPagina?: string;
  goBackPath?: string;
  navigation?: any[];
  onRow3Toggle?: (isOpen: boolean) => void;
  onDrawerWidthChange?: (width: number) => void;
}

export interface Company { 
  companyId: number;
  companyName: string;
}


const NavbarDesplegable: React.FC<NavbarDesplegableProps> = ({ textPagina, goBackPath = "/admin", navigation, onRow3Toggle, onDrawerWidthChange}) => {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);

  const [row1Height, setRow1Height] = useState<number | null>(null);
  const [row2Height, setRow2Height] = useState<number | null>(null);
  const [row3Height, setRow3Height] = useState<number | null>(null);
  const [totalHeight, setTotalHeight] = useState<number | null>(null);
  const userType = Cookies.get("user-type");
  const token = Cookies.get("auth-token");
  const [companiesUser, setCompaniess] = useState<Company[]>([]);
  const { companies, loading, error } = useSelector((state: RootState) => state.company);
  const router = useRouter();
  // Estados para controlar si los menús están abiertos
  const [isRow2MenuOpen, setIsRow2MenuOpen] = useState(false);
  const [isRow3MenuOpen, setIsRow3MenuOpen] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue.startsWith(claimValue)
    );
  };
  // Obtener claims del usuario al cargar el componente
  // useEffect(() => {
  //   if (!userType) return;

  //   const token = Cookies.get("auth-token") || "";  
    
  //     dispatch(fetchClaims(token));
    
  // }, [dispatch, userType]);

  // console.log('claims', claims);
  const isAdmin = userType !== "Admin";
  // Filtrar navegación según los claims
  const filteredNavigation = filterNavigation(NAVIGATION, claims, isAdmin);
  const calculateHeights = () => {
    setRow1Height(row1Ref.current?.offsetHeight || 0);
    setRow2Height(row2Ref.current?.offsetHeight || 0);
    setRow3Height(row3Ref.current?.offsetHeight || 0);
  };

  useEffect(() => {
    calculateHeights();
    const handleResize = () => calculateHeights();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setTotalHeight((row1Height ?? 0) + (row2Height ?? 0) + (row3Height ?? 0));
  }, [row1Height, row2Height, row3Height]
  );

  const handleRow2Toggle = () => {
    if(isRow2MenuOpen){
      setIsRow2MenuOpen(false);
    }
    else{
      setIsRow2MenuOpen(true);
    }
    setIsRow3MenuOpen(false);
    
  };

    const [negoWidth, setNegoWidth] = useState<number>(250); // Estado para drawerWidth

    const handleNegoWidthChange = (width: number) => {
      setNegoWidth(width); // Actualiza el estado con el valor recibido del hijo

      // console.log("width: en nego", negoWidth)
    };

  const handleRow3Toggle = () => {
    const newState = !isRow3MenuOpen;
    setIsRow3MenuOpen(newState);
    if (onRow3Toggle) {
      onRow3Toggle(newState);
    }
    if(isRow3MenuOpen){
      setIsRow3MenuOpen(false);
    }
    else{
      setIsRow3MenuOpen(true);
    }
    setIsRow2MenuOpen(false);

    // console.log("row3: ", isRow3MenuOpen)
  };

  useEffect(() => {
    const handleUserType = async () => {
      if (!token) {
        console.error("Token no encontrado. Por favor inicia sesión.");
        router.push("/login");
        return;
      }
  
      if (userType === "Admin") {
        // Lógica para Admin
        dispatch(getCompanies(token));
        return; // Termina la ejecución aquí si es Admin
      }
  
      if (userType?.toLowerCase() === "compartido" || userType === "exclusivo") {
        // Lógica para usuarios compartido o exclusivo
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_AUTH_URL}api/Account/companies`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (!response.ok) {
            throw new Error(
              `Error al obtener las empresas: ${response.statusText}`
            );
          }
  
          const data: Company[] = await response.json();
          setCompaniess(data); // Setea las empresas en el estado
        } catch (error) {
          console.error("Error al obtener las empresas:", error);
        }
      } else {
        // console.warn("Tipo de usuario no reconocido:", userType);
      }
    };
  
    handleUserType();
  }, [dispatch, token, userType, router]);

  return (
    <>
      <AppBar position="static" color="default" elevation={0} sx={{ padding: 0, bgcolor: 'white !important' }}>
      <Grid container sx={{ height: '100%' }} >
        <Grid item sx={{ 
          width: { xs: "100%",lg: "240px", xl:"300px"}, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          transition: "width 0.3s ease-in-out",
        }}>
          <Typography sx={{ 
            color: '#3C98CB',
            fontWeight: 'bold',
            letterSpacing: '1px',
            fontSize: {xs:'2.1rem', xl:'2.5rem'} ,
          }}>
            NEGO
          </Typography>
        </Grid>
        <Grid item xs>
          <div ref={row1Ref}>
            <NavDesplegableRow1 
              companyCount={companies.length}
              companiesMenu={companiesUser.length > 0 ? companiesUser : companies}
            />
          </div>
          <div ref={row2Ref}>
          <NavDesplegableRow2
            tabs={filteredNavigation}
            onMenuToggle={handleRow2Toggle}
            isMenuOpen={isRow2MenuOpen}
          />
        </div>
        <div ref={row3Ref}>
          <NavDesplegableRow3
            navigation={navigation}
            textPagina={textPagina}
            totalHeight={totalHeight ?? undefined}
            onMenuToggle={handleRow3Toggle}
            isMenuOpen={isRow3MenuOpen}
            onDrawerWidthChange={onDrawerWidthChange}
            onNegoWidthChange={handleNegoWidthChange}
          />
        </div>
        </Grid>
      </Grid>
        

      </AppBar>
    </>
  );
};

export default NavbarDesplegable;
