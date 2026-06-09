"use client";
import { useEffect, useState } from "react";
import { AppBar, Typography } from "@mui/material";
import CerrarSesion from "@/components/ui/Modals/CerrarSesionModal";
import NavFila1 from "@/components/layout/menus/nav/NavRow1";
import NavFila2Admin from "./nav/NavRow2Admin";
import NavFila2User from "./nav/NavRow2User";
import NavRow3 from "./nav/NavRow3";
import { useAuth } from "@/lib/context/AppProvider";
import useUserType from "@/lib/hooks/useUserType";
import Grid from "@mui/material/Grid";
import Cookies from "js-cookie";
import Image from "next/image";

import empreasmenu from "@/assets/empresasmenu.png";
import usermenu from "@/assets/usermenu.png";
import inicio from "@/assets/inicio.png";
import plantillas from "@/assets/plantillasmenu.png";

interface ButtonProps {
  label: string;
  route: string;
  imgSrc?: string;
}

interface NavBar2Props {
  textPagina?: string;
  goBackPath?: string;
  tabs?: any[];
  companiesL?: number;
}

export const NavBar2 = ({
  textPagina = "",
  goBackPath = "/admin",
  tabs,
  companiesL,
}: NavBar2Props) => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = useAuth();
  const [cerrarSesion, setCerrarSesion] = useState<boolean>(false);
  const [menu, setMenu] = useState<
    { label: string; route: string; imgSrc: any }[]
  >([]);

  const userType = Cookies.get("user-type");

  // console.log(userType)

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setCerrarSesion(true);
  };

  const handleConfirm = () => {
    logout();
  };

  useEffect(() => {
    if (userType) {
      if (userType === "Admin") {
        setMenu([
          { label: "", route: "/admin", imgSrc: inicio },
          { label: "Empresas", route: "/admin/empresas", imgSrc: empreasmenu },
          { label: "Usuarios", route: "/admin/usuarios", imgSrc: usermenu },
          {
            label: "Plantillas",
            route: "/admin/plantillas",
            imgSrc: plantillas,
          },
        ]);
      } else if (userType === "compartido") {
        setMenu([{ label: "Inicio", route: "/companies", imgSrc: inicio }]);
      } else {
        setMenu([{ label: "Inicio", route: "/companies", imgSrc: inicio }]);
      }
    }
  }, [userType]);

  if (!userType || menu?.length === 0) return null; // Evitar problemas con el SSR

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ padding: 0, bgcolor: "white !important" }}
    >
      <Grid container sx={{ height: "100%" }}>
        <Grid
          item
          sx={{
            width: { xs: "100%",lg: "200px", xl:"300px"},
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              color: "#3C98CB",
              fontWeight: "bold",
              letterSpacing: "1px",
              fontSize: {xs:'2.1rem', xl:'2.5rem'} ,
            }}
          >
            NEGO
          </Typography>
        </Grid>
        <Grid item xs>
          <NavFila1 />
          {userType === "Admin" ? (
            <NavFila2Admin tabs={menu} companiesL={companiesL} />
          ) : (
            <NavFila2User tabs={menu} companiesL={companiesL} />
          )}
          <NavRow3 textPagina={textPagina} goBackPath={goBackPath} />
          {cerrarSesion && (
            <CerrarSesion
              open={cerrarSesion}
              setOpen={setCerrarSesion}
              handleConfirm={handleConfirm}
            />
          )}
        </Grid>
      </Grid>
    </AppBar>
  );
};
