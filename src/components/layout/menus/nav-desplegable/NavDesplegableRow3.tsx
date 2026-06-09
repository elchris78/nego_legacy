"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import {
  AppBar,
  Button,
  Typography,
  Drawer,
  styled,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import menuDrawer from "@/assets/menuDrawer.png";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import DrawerContent from "./components/DrawerContent";
import DrawerButton from "./components/DrawerButton";
import type { MenuItemType } from "./components/types";
import type { Company } from "@/app/companies/page";
import { getCompanies } from "@/app/admin/empresas/services/companySlices";
import type { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";

interface NavDesplegableRow3Props {
  goBackPath?: string;
  textPagina?: string;
  navigation?: MenuItemType[];
  totalHeight?: number;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onDrawerWidthChange?: (width: number) => void;
  onNegoWidthChange?: (width: number) => void;
}

const StyledAppBar = styled(AppBar)({
  backgroundColor: "white",
  boxShadow: "none",
  height: "auto",
  marginTop: 0,
  zIndex: 1100,
});

const NavDesplegableRow3 = ({
  goBackPath = "/admin",
  textPagina,
  navigation = [],
  totalHeight = 48,
  onMenuToggle,
  isMenuOpen,
  onDrawerWidthChange,
  onNegoWidthChange,
}: NavDesplegableRow3Props) => {
  const token = Cookies.get("auth-token");
  const userType = Cookies.get("user-type");
  const [companiesUser, setCompanies] = useState<Company[]>([]);
  const { companies } = useSelector((state: RootState) => state.company);
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [drawerHeight, setDrawerHeight] = useState(0);
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();
  const isBelow1336 = useMediaQuery("(max-width:1201px)");

  // Estado para controlar el montaje del componente y evitar problemas de hidratación
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const calculateHeight = () => {
      const totalHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight
      );
      setDrawerHeight(totalHeight);
    };

    if (isMenuOpen) {
      setTimeout(calculateHeight, 300);
    } else {
      calculateHeight();
    }
  
    window.addEventListener("resize", calculateHeight);
    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, [isMenuOpen]);
  

  const mtValue = isBelow1336 ? `${totalHeight + 50}px` : `${totalHeight}px`;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  //const adjustedMtValue = isMobile ? `${parseInt(mtValue) + 24}px` : mtValue;

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
        return;
      }

      if (
        userType?.toLowerCase() === "compartido" ||
        userType?.toLowerCase() === "exclusivo"
      ) {
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
          setCompanies(data);
        } catch (error) {
          console.error("Error al obtener las empresas:", error);
        }
      } else {
        console.warn("Tipo de usuario no reconocido:", userType);
      }
    };

    handleUserType();
  }, [dispatch, token, userType, router]);

  const handleToggle = (segment: string) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [segment]: !prevState[segment],
    }));
  };

  const calculateMaxDepth = useCallback(
    (items: MenuItemType[], currentDepth = 0): number => {
      let maxDepth = currentDepth;
      items.forEach((item) => {
        if (
          item.children &&
          item.children.length > 0 &&
          openMenus[item.segment!]
        ) {
          const childDepth = calculateMaxDepth(item.children, currentDepth + 1);
          maxDepth = Math.max(maxDepth, childDepth);
        }
      });
      return maxDepth;
    },
    [openMenus]
  );

  const shouldShowDrawerContent = () => {
    if (userType === "Admin") {
      return true;
    }

    if (userType?.toLowerCase() === "compartido" && companiesUser.length >= 1) {
      return true;
    }
    if (userType?.toLowerCase() === "exclusivo" && companiesUser.length === 1) {
      return true;
    }

    return false;
  };
  const [initialized, setInitialized] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const screenWidth = window.innerWidth;

    if (
      pathname.startsWith("/configuracion") &&
      !initialized
    ) {
      if (screenWidth > 850 && !isMenuOpen) {
        onMenuToggle(); 
      }
      setInitialized(true);
    }
  }, [pathname, isMenuOpen, initialized, onMenuToggle]);

  return (
    <>
      <StyledAppBar position="static">
        <Box
          sx={{
            backgroundColor: "#3C98CB",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
            display: "flex",
            flexDirection: "row",
            padding: 0.5,
          }}
        >
          {navigation.length > 0 && (
              <Button
                onClick={onMenuToggle}
                sx={{
                  color: "white",
                  display: { xs: "block", lg: "none" },
                  mr: 0,
                }}
              >
              {isMenuOpen && !isMobile ? (
                <Image
                  src={menuDrawer || "/placeholder.svg"}
                  alt="Cerrar menú"
                  style={{
                    transform: "rotate(0deg)",
                    transition: "transform 0.3s",
                    width: "19px",
                    height: "29px",
                  }}
                />
              ) : (
                <Image
                  src={menuDrawer || "/placeholder.svg"}
                  alt="Abrir menú"
                  style={{
                    transform: "rotate(180deg)",
                    transition: "transform 0.3s",
                    width: "19px",
                    height: "29px",
                  }}
                />
              )}
            </Button>
          )}
          <Box width="100%" display="flex" alignItems="center">
            <Typography sx={{ my: 0.02, ml: 1, fontSize: "12px" }}>
              {textPagina}
            </Typography>
          </Box>
        </Box>
      </StyledAppBar>

      {/* Renderizamos los Drawers solo cuando el componente ya se montó en el cliente */}
      {mounted && navigation.length > 0 && (
        <>
          <Drawer
            anchor="left"
            open={true}
            onClose={onMenuToggle}
            variant="persistent"
            PaperProps={{
              sx: {
                display: { xs: "none", lg: "block" },
                position: "absolute",
                background: "white",
                height: { xs: "100vh", lg: "80vh" },
                width: "60px",
                maxWidth: "100%",
                mt: mtValue,
                borderRight: "0px solid black",
                zIndex: 1000,
              },
            }}
          >
            {shouldShowDrawerContent() && (
              <DrawerButton
                navigation={navigation}
                openMenus={openMenus}
                onToggle={handleToggle}
                onMenuToggle={onMenuToggle}
                userType={userType ?? "unknown"}
                companyCount={companies.length}
                companiesMenu={
                  companiesUser.length > 0 ? companiesUser : companies
                }
              />
            )}
          </Drawer>

            <Drawer
            anchor="left"
            open={isMenuOpen}
            onClose={onMenuToggle}
            variant="persistent"
            PaperProps={{
              sx: {
              position: "absolute",
              background: "white",
              height: { xs: "100vh", lg: "80vh" },
              maxWidth: "100%",
              mt: isMobile ? "0px" : mtValue, // Remove mtValue on mobile
              borderBottom: "0px solid black",
              zIndex: 1000,
              },
            }}
            >
            {shouldShowDrawerContent() && (
              <Box
                sx={{
                  width: { xs: "100%", lg: "240px", xl: "300px" },
                  height: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  transition: "width 0.3s ease-in-out",
                  position: "relative",
                }}
              >
                {isMobile && (
                  <Button
                    onClick={onMenuToggle}
                    sx={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      color: "white",
                      zIndex: 2000,
                      minWidth: "auto",
                      padding: 0,
                    }}
                  >
                    <Image
                      src={menuDrawer || "/placeholder.svg"}
                      alt="Cerrar menú"
                      style={{
                        transform: "rotate(0deg)",
                        transition: "transform 0.3s",
                        width: "19px",
                        height: "29px",
                      }}
                    />
                  </Button>
                )}
                <Box sx={{ mt: isMobile ? "40px" : "0px" }}>
                  <DrawerContent
                    navigation={navigation}
                    openMenus={openMenus}
                    onToggle={handleToggle}
                    onMenuToggle={onMenuToggle}
                    userType={userType ?? "unknown"}
                    companyCount={companies.length}
                    companiesMenu={
                      companiesUser.length > 0 ? companiesUser : companies
                    }
                  />
                </Box>
              </Box>
            )}
          </Drawer>
        </>
      )}
    </>
  );
};

export default NavDesplegableRow3;
