import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Grid,
  styled,
} from "@mui/material";
import Image from "next/image";
import User from "@/assets/User.png";
import ChevronDown from "@/assets/ChevronDown.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AppProvider";
import CerrarSesion from "@/components/ui/Modals/CerrarSesionModal";
import useUserType from "@/lib/hooks/useUserType";
import { getMenuItemsByAdmin, getMenuItemsByUserType } from "../config/rutasNav";
import Cookies from "js-cookie";
import { avatarsArray } from "@/app/admin/datos-perfil/service/Avatar";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";

const StyledAppBar = styled(AppBar)({
  backgroundColor: 'white',
  boxShadow: 'none',
  height: 'auto',
  marginTop: 0,
});

export const NavFila1 = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = useAuth();
  const [cerrarSesion, setCerrarSesion] = useState<boolean>(false);
  const userType = Cookies.get("user-type") || "";
  const [userName, setUserName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    avatar: '',
  });
  const fullName = useSelector((state: RootState) => state.claims.fullName);
  const profilePicture = useSelector((state: RootState) => state.claims.profilePicture);
  

  useEffect(() => {
    const storedUserName = Cookies.get("userName"); 
    setUserName(storedUserName || "Usuario"); 
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    setCerrarSesion(true);
  };

  const handleConfirm = () => {
    logout();
  };

  const menuItems = getMenuItemsByAdmin(userType, handleLogout);

  const getAvatarSrc = (name: string) => {
    const avatar = avatarsArray.find((a) => a.name === name);
    return avatar ? avatar.src : User;
  };

  return (
    <StyledAppBar position="static">
      <Box
        sx={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          paddingBlock: 1.5
        }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid
            item
            xs={12}
            sm={6}
            display={"flex"}
            alignItems={"center"}
            paddingInlineStart={{ xs: 0, sm: 0, md: 0, lg: 4 }}
            justifyContent={{ xs: "center", sm: "flex-start", md: "flex-start", lg: "flex-start" }}
            sx={{
              paddingInlineStart: { xs: -1 }
            }}
          >
            <div className="flex gap-2 items-center text-nowrap">
              <span className="font-semibold text-lg text-[#232E4F] sm:text-2xl">
                Bienvenido,
              </span>
              <span className="font-semibold text-lg text-[#3C98CB] sm:text-2xl">
                {fullName}
              </span>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            display={"flex"}
            alignItems={"end"}
            justifyContent={{ xs: "center", sm: "end", md: "end", lg: "end" }}
          >
            <Box display="flex" alignItems="center" sx={{ marginBottom: { xs: 2, md: 0 }, marginRight: {md: 3} }}>
              <Image alt="Usuario" src={
                formData.avatar
                  ? getAvatarSrc(formData.avatar) // Prioriza el avatar seleccionado
                  : getAvatarSrc(profilePicture) || User // Usa el avatar del usuario o una predeterminada
              } 
              width={30}
              height={30} />
              <Typography  sx={{ ml: 1, color: "#5D6D7D", fontSize:"13px" }}>
                {userName}
              </Typography>
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Image src={ChevronDown} alt="Configuración"  />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ style: { width: "200px" } }}
              >
                {menuItems.map((item, index) => (
                  <MenuItem key={index} onClick={item.action ? item.action : undefined}>
                    {item.href ? (
                      <Link href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
                        {item.label}
                      </Link>
                    ) : (
                      item.label
                    )}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {cerrarSesion && <CerrarSesion open={cerrarSesion} setOpen={setCerrarSesion} handleConfirm={handleConfirm} />}
    </StyledAppBar>
  );
};

export default NavFila1;
