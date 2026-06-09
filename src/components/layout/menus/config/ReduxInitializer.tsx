"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NavbarHome from "@/menus/NavbarMenuP"; 
import { NavBar2 } from '@/menus/Nav';
import { Box } from "@mui/material";
import { filterNavigation, getNavigationByPath } from "@/components/layout/menus/config/FilterNavigation";
import { AppDispatch, RootState } from "@/lib/store/store";
import { fetchClaims } from "@/lib/services/claims/claimsSlices";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { getBreadcrumb } from "./getBreadcrumb";
import Loading from '@/Modals/LoadingModal'
import { configuracionActions } from "@/app/configuracion/services/sliceConfig";
import { useRouter } from "next/navigation";

export function ReduxInitializer({ children }: { children: React.ReactNode }) {
  const dispatch: AppDispatch = useDispatch();
  const userType = Cookies.get("user-type");
  const claims = useSelector((state: RootState) => state.claims.data);
  const pathname = usePathname();
  const loading = useSelector((state: RootState) => state.claims.loading);
  const [fullPath, setFullPath] = useState(pathname); // Estado para la ruta completa
  const [isRow3MenuOpen, setIsRow3MenuOpen] = useState(false);
  const companyId = Cookies.get("companyId")
  const token = Cookies.get("auth-token");
  const isConfigured = useSelector((state: RootState) => state.configuracion.isConfigured);
  const router = useRouter();
  useEffect(() => {
    if (token && companyId) {
      dispatch(
        configuracionActions.getCompanyIsConfigured({
          companyId: Number(companyId),
          token,
        }) as any
      );
    }
  }, [token, companyId, dispatch]);

  useEffect(() => {
    if (!userType) return;
    const token = Cookies.get("auth-token") || "";
    dispatch(fetchClaims(token));
  }, [dispatch, userType]);

  useEffect(() => {
    if (isConfigured === false) {
      const allowedRoutes = [
        "/configuracion",
        "/configuracion/configuracion-empresa/informacion-empresa/empresa"
      ];

      if (
        pathname?.startsWith("/configuracion") &&
        !allowedRoutes.includes(pathname)
      ) {
        router.replace("/configuracion");
      }
    }
  }, [isConfigured, pathname, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const mode = searchParams.get("mode");

      let trimmedPath = pathname;
      if (mode) {
        trimmedPath += `?mode=${mode}`;
      }

      setFullPath(trimmedPath);
    }, 500); 

    return () => clearInterval(interval);
  }, [pathname]);

  

  const breadcrumb = getBreadcrumb(fullPath || "");
  const shouldHideMenu = pathname?.startsWith("/admin")|| pathname === "/companies";
  const hideBothMenusRoutes = [
    "/login",
    "/login/recuperar-contrasenia-user",
    "/recuperar-contrasenia-user/nueva-contrasenia"
  ];
  const homeRute = [
    `/home/${companyId}`,
    "/cambiar-contrasenia",
    "/datos-perfil"
  ];
  const shouldHideBothMenus = hideBothMenusRoutes.includes(pathname || "");


  
  const navigation = getNavigationByPath(pathname);
  const filteredNavigation = filterNavigation(navigation, claims);

  const handleRow3Toggle = (isOpen: boolean) => {
    setIsRow3MenuOpen(isOpen);
  };

  const shouldRemoveMargin =
    shouldHideMenu ||
    hideBothMenusRoutes.includes(pathname) ||
    homeRute.includes(pathname);

  // if (loading) {
  //   return <>  </>;  
  // }
  return (
    <>
      {loading && <Loading />}
      {!shouldHideBothMenus && (
        !shouldHideMenu ? (
          homeRute.includes(pathname || "") ? (
            <NavbarHome textPagina={breadcrumb} />
          ) : (
            <NavbarHome
              textPagina={breadcrumb}
              navigation={filteredNavigation}
              onRow3Toggle={handleRow3Toggle}
            />
          )
        ) : (
          <NavBar2 textPagina={breadcrumb || ''} />
        )
      )}
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        sx={{
          ml: shouldRemoveMargin
            ? "0px"
            : {
                xs: "0px",
                md: isRow3MenuOpen ? "380px" : "0px",
                lg: isRow3MenuOpen ? "250px" : "60px",
                xl: isRow3MenuOpen ? "335px" : "60px"
              },
          transition: { lg: "margin-left 0.3s" }
        }}
      >
        {children}
      </Box>
    </>
  );
}
