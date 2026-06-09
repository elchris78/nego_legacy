// Librerías de React y Next.js
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Material UI – componentes
import {
  AppBar,
  Box,
  Button,
  Grid,
  Menu,
  MenuItem,
  styled,
  Typography,
} from "@mui/material";

// Material UI – iconos
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import StoreIcon from "@mui/icons-material/Store";

// Íconos y utilidades de terceros
import { Search } from "lucide-react";
import Cookies from "js-cookie";

// Contextos y hooks personalizados
import { useAuth } from "@/lib/context/AppProvider";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchClaims } from "@/lib/services/claims/claimsSlices";

// Servicios y utilidades de la app
import { getMenuItemsByUserType } from "../config/rutasNav";
import { selectCompany } from "@/app/companies/services/companyActions";

// Componentes internos
import CerrarSesion from "@/components/ui/Modals/CerrarSesionModal";
import Loading from "@/components/ui/Modals/LoadingModal";

// Datos y tipos
import { avatarsArray } from "@/app/admin/datos-perfil/service/Avatar";

// Imágenes y assets
import HelpCircle from "@/assets/HelpCircle.png";
import Settings from "@/assets/Settings.png";
import User from "@/assets/User.png";
import poligon from "@/assets/Polygon 3.png";
import setBlue from "@/assets/setBlue.png";


const StyledAppBar = styled(AppBar)({
  backgroundColor: 'white',
  boxShadow: 'none',
  height: 'auto',
  marginTop: 0,
});

interface MenuItemm {
  companyCount: number | null;
  companiesMenu: any[];
}

const NavDesplegableRow1:React.FC<MenuItemm> = ({companiesMenu, companyCount}) => {
  // Rutas y navegación
  const pathname = usePathname();
  const router = useRouter();

  // Autenticación y usuario
  const { logout } = useAuth();
  const token = Cookies.get("auth-token") || "";
  const userType = Cookies.get("user-type") || "";

  // dispatch
  const dispatch: AppDispatch = useDispatch();

  // Estados del menú y modales
  const [menuUser, setMenuUser] = useState<null | HTMLElement>(null);
  const [menuSettings, setMenuSettings] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [cerrarSesion, setCerrarSesion] = useState<boolean>(false);

  // Datos desde Redux
  const claims = useSelector((state: RootState) => state.claims.data);
  const fullName = useSelector((state: RootState) => state.claims.fullName);
  const profilePicture = useSelector((state: RootState) => state.claims.profilePicture);

  // Estados de empresas y carga
  const [companies, setCompanies] = useState(companiesMenu);
  const [empresa, setEmpresa] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [isloading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Formulario y avatar
  const [formData, setFormData] = useState({ avatar: '' });

  // Helpers
  const hasClaim = (claimValue: string) =>
    claims?.some(
      (claim: { claimValue: string }) => claim.claimValue.startsWith(claimValue)
    );

  const getAvatarSrc = (name: string) => {
    const avatar = avatarsArray.find((a) => a.name === name);
    return avatar ? avatar.src : User;
  };

  // Menú y navegación de usuario
  const handleMenuUser = (event: React.MouseEvent<HTMLElement>) => setMenuUser(event.currentTarget);
  const handleMenuCloseUser = () => setMenuUser(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Logout
  const handleLogout = () => setCerrarSesion(true);
  const handleConfirm = () => logout();

  // Items de menú según tipo de usuario
  const menuItems = getMenuItemsByUserType(userType, handleLogout);

  // Cambio de empresa
  const handleCompanyClick = async (index: number) => {
    if (index === selectedCompany) return;
    const clickedCompany = companies[index];

    setIsLoading(true);
    setEmpresa(clickedCompany.companyName || clickedCompany.name);
    setSelectedCompany(index);

    try {
      await selectCompany(
        clickedCompany.companyId,
        setSelectedCompany,
        setMessage,
        router
      );
    } catch (error) {
      console.error("Error al cambiar de empresa:", error);
      setMessage("Error al cambiar de empresa");
    } finally {
      setIsLoading(false);
    }
  };

  // UseEffects
  // Obtener claims al montar
  useEffect(() => {
    if (!token) return;
    if (!selectedCompany) return;
    dispatch(fetchClaims(token));
  }, [selectedCompany]);

  // Leer empresa de cookies al montar
  useEffect(() => {
    const storedCompany = Cookies.get('company');
    setEmpresa(storedCompany ?? null);
  }, []);

  // Vigilar cambios en cookies de empresa
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = Cookies.get('company');
      if (stored !== empresa) {
        setEmpresa(stored ?? null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [empresa]);

  // Sincronizar lista de companies
  useEffect(() => {
    setCompanies(companiesMenu);
  }, [companiesMenu]);

  // Páginas de configuración activas
  const isActive = pathname === "/configuracion";
  const isConfigPage = pathname.includes("/configuracion/");

  return (
    <StyledAppBar position="static">
        <Box sx={{
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: "center",
          paddingBlock: 1,
          padding:1
          // mt: 0.5
        }}>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6} display={'flex'} justifyContent={{xs:'center', sm:'center', md:'center', lg:'start', xl:'start'}} flexDirection={{xs:'column', sm:'row', md:'row', lg:'row', xl:'row'}}>
              <Box marginInlineEnd={2}>
                {isloading && <Loading />}
                {companies && companies.length > 0 ? (
                  <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{color:'#232E4F'}} variant="h6" fontWeight={700}>
                    {empresa || "Selecciona una empresa"}
                  </Typography>
                  <Box 
                    onClick={handleMenuOpen} 
                    sx={{
                      padding: '5px',
                    }}
                  >
                    <Image src={poligon} alt='poligon'/>
                  </Box>
                </Box>
                ) : (
                  <Typography  sx={{color:'#232E4F', ml: 1 }}  variant="h6" fontWeight={700}>{empresa || 'No hay empresas disponibles' } </Typography>
                )}

                {/* Menú desplegable */}
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  PaperProps={{
                    style: {
                      maxHeight: "25vh",
                      overflowY: "auto",
                      borderRadius: "8px",
                    },
                  }}
                >
                  {companies?.map((company, index) => (
                    <MenuItem
                      key={company.companyId}
                      onClick={() => {
                        handleCompanyClick(index);
                        handleMenuClose();
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        "&:hover": {
                          backgroundColor: "#4197CB42",
                        },
                      }}
                    >
                      <StoreIcon sx={{ color: "#1E2337" }} />
                      <Typography>{company.companyName || company.name}</Typography>
                    </MenuItem>
                  ))}

                  {/* Opción de ir a la pantalla de inicio */}
                  {(userType === "Admin" ? companies?.length >= 1 : companies?.length > 1) && (
                    <MenuItem
                      component={Link}
                      href={userType === "Admin" ? "/admin/home" : "/companies"}
                      sx={{
                        color: "black",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <MeetingRoomIcon sx={{ color: "red" }} />
                      Pantalla de inicio
                    </MenuItem>
                  )}
                </Menu>
              </Box>
            <div className="flex gap-2 items-center text-nowrap">
              <span className="font-semibold text-lg text-[#232E4F] sm:text-2xl">
                Bienvenido,
              </span>
              <span className="font-semibold text-lg text-[#3C98CB] sm:text-2xl">
                {fullName}
              </span>
            </div>
            </Grid>
            <Grid  xs={12} sm={12}  md={12} lg={6} xl={6} display={'flex'} alignItems={'end'} justifyContent={{xs:'center', sm:'center', md:'center', lg:'end'}}>
              <Box display="flex" alignItems="center" justifyContent={{sm:"center",md:'center',lg:'end'}} sx={{mb: 0}}  width={'100%'} >
                  <div className="relative w-[300px] flex items-center">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5D6D7D] h-3 w-3" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-8 py-0.5 bg-white border-2 text-black border-[#5D6D7D] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm placeholder:text-[#5D6D7D] shadow-sm"
                      placeholder="Buscar tema"
                    />
                  </div>
                  <Button variant="text" size="small">
                    <Image 
                      src={HelpCircle} 
                      alt="HelpCircle"
                      width={30}
                      height={30}
                    />
                  </Button>
                  { hasClaim('Configuración') && (
                    <Link href="/configuracion">
                      <Button variant="text" size="small">
                        <Image 
                          src={isActive ? setBlue : Settings && isConfigPage ? setBlue : Settings} 
                          alt="Settings" 
                          width={30}
                          height={30}
                        />
                      </Button>
                    </Link>
                  )}
                    {/* <Link href="/configuracion">
                      <Button variant="text" size="small">
                        <Image 
                          src={isActive ? setBlue : Settings && isConfigPage ? setBlue : Settings} 
                          alt="Settings" 
                          width={33}
                          height={33}
                        />
                      </Button>
                    </Link> */}
                  <Button onClick={handleMenuUser} variant="text" size="small">
                  <Image alt="Usuario" src={
                      formData.avatar
                        ? getAvatarSrc(formData.avatar) // Prioriza el avatar seleccionado
                        : getAvatarSrc(profilePicture) || User // Usa el avatar del usuario o una predeterminada
                    } 
                    width={30}
                    height={30} 
                  />
                  </Button>
                  <Menu
                    anchorEl={menuUser}
                    open={Boolean(menuUser)}
                    onClose={handleMenuCloseUser}
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

        {/* Modal de cierre de sesión */}
        {cerrarSesion && <CerrarSesion open={cerrarSesion} setOpen={setCerrarSesion} handleConfirm={handleConfirm}/>}
    </StyledAppBar>
    )
}

export default NavDesplegableRow1

