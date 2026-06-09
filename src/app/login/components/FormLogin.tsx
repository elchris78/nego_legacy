'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuth } from '@/lib/context/AppProvider';

import Loading from '@/Modals/LoadingModal'
import { 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Paper, 
  InputAdornment, 
  IconButton, 
  Link as MuiLink,
  ThemeProvider,
  createTheme,
  Alert,
  Box,
  Container
} from '@mui/material';
import { Visibility, VisibilityOff, Warning } from '@mui/icons-material';
import { selectCompany } from '@/app/companies/services/companyActions';
import { AppDispatch } from '@/lib/store/store';
import { useDispatch } from 'react-redux';
import { fetchClaims } from '@/lib/services/claims/claimsSlices';

// Crear un tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#3C98CB',
    },
    error: {
      main: '#CF5459',
    },
  },
});

interface Company {
  companyName: string;
}

export default function FormLogin() {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [usernameError, setUsernameError] = useState<boolean>(false)
  const [usernameInvalid, setUsernameInvalid] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [passwordIncorrect, setPasswordIncorrect] = useState<boolean>(false);
  const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false) 
  const [showPassword, setShowPassword] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const [selectedCompanyId, setSelectedCompany] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();

  const { login } = useAuth();

  useEffect(() => {
    Cookies.remove("auth-token");
    Cookies.remove("user-type");
    Cookies.remove("userName");
  }, []);

  useEffect(() => {
    if (invalidCredentials) {
      const timer = setTimeout(() => setInvalidCredentials(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [invalidCredentials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setInvalidCredentials(false);

    const existingToken = Cookies.get("auth-token");
    if (existingToken) {
        setMessage("Ya existe una sesión activa.");
        setInvalidCredentials(true);
        return;
    }
  
    const sanitizedPassword = password.trim();
    const sanitizedUsername = username.trim();
  
    const isPasswordTooShort = sanitizedPassword.length < 8;
    setPasswordError(isPasswordTooShort);
    setPasswordIncorrect(false);
  
    const isUsernameEmpty = sanitizedUsername === "";
    setUsernameError(isUsernameEmpty);
  
    if (sanitizedUsername.includes("@") || sanitizedUsername.includes(".com")) {
      const isEmailFormat =
        sanitizedUsername.includes("@") && sanitizedUsername.includes(".com");
      setUsernameInvalid(!isEmailFormat);
    }
  
    if (!usernameError && !passwordError && !usernameInvalid) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/api/Account/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            body: JSON.stringify({ username, password }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          login(data.token, data.user);
  
          localStorage.setItem("typeOfUser", data.typeOfUser);
          Cookies.set("user-type", data.typeOfUser, { secure: true });
          Cookies.set("userName", data.userName, { secure: true });
          Cookies.set("refresh-token", data.refreshToken, { secure: true });

          // Verificar el tipo de usuario
          const userType = data.typeOfUser;
          if (userType === 'Admin') {
            // Si es admin, redirigir a /admin
            router.push("/admin");
          } else {
            // Si no es admin, continuar con la obtención de empresas
            const fetchCompanies = async () => {
              const token = Cookies.get("auth-token");
              if (token) {
                try {
                  const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_AUTH_URL}api/Account/companies`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  const companies = response.data;
                  setCompanies(companies);
  
                  if (companies.length === 1) {
                    const singleCompany = companies[0];
                    console.log("Seleccionando única empresa:", singleCompany);
  
                    // Redirigir directamente a la ruta si solo hay una empresa
                    await selectCompany(
                      singleCompany.companyId, 
                      setSelectedCompany, 
                      setMessage, 
                      router 
                    );
                    dispatch(fetchClaims(token));
                  } else {
                    console.log("Varias empresas disponibles para seleccionar.");
                    router.push("/companies");
                  }
                } catch (error) {
                  console.error("Error al obtener las empresas:", error);
                }
              } else {
                console.error("Token no encontrado. Por favor inicia sesión.");
                router.push("/login");
              }
            };
  
            await fetchCompanies();
          }
        } else {
          setInvalidCredentials(true);
        }
      } catch (error) {
        console.error("Error de inicio de sesión:", error);
        setInvalidCredentials(true);
      } finally {
        setIsLoading(false);
      }
    }
};

  
  



  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 2, md: 0 } }}>
        {isLoading && <Loading />}
        <Paper elevation={5} sx={{ width: '100%', maxWidth: '1000px', height: { xs: 'auto', md: '500px' }, overflow: 'hidden' }}>
          <Grid container sx={{ height: '100%' }}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, md: 0 }, order: { xs: 1, md: 2 } }}>
              <Typography variant="h2" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
                NEGO
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ bgcolor: 'white', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', order: { xs: 2, md: 1 } }}>
              <Typography variant="h4" component="h2" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
                Iniciar sesión
              </Typography>
              <form onSubmit={handleSubmit} autoComplete="off">
                <Typography fontWeight={500} paddingBottom={1}>Nombre de usuario o correo electrónico</Typography>
                <TextField
                  fullWidth
                  placeholder="Nombre de usuario o correo electrónico"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={usernameError || usernameInvalid }
                  helperText={
                    usernameError ? "El nombre de usuario es obligatorio." :
                    usernameInvalid ? "Nombre de usuario o correo inválido." : ""
                  }
                  sx={{ mb: 2 }}
                />
                <Typography fontWeight={500} paddingBottom={1}>Contraseña</Typography>
                <TextField
                  fullWidth
                  placeholder="Ingresar contraseña"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError || passwordIncorrect}
                  helperText={
                    passwordError ? "La contraseña debe tener al menos 8 caracteres." :
                    passwordIncorrect ? "Contraseña incorrecta." : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <MuiLink component={Link} href="/login/recuperar-contrasenia-user" underline="hover">
                    ¿Olvidaste tu contraseña? Haz clic aquí
                  </MuiLink>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mb: 2 }}
                >
                  Iniciar sesión
                </Button>
              </form>
              {invalidCredentials && (
                <Alert 
                  severity="error" 
                  icon={<Warning />}
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0,
                    bgcolor: 'error.main',
                    color: 'white'
                  }}
                >
                  {message || "Error. Las credenciales de acceso ingresadas son incorrectas."} 
                </Alert>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  )
}
