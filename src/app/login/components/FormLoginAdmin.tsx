'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Loading from '@/Modals/LoadingModal'


// Login
import Cookies from 'js-cookie';
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
  Container,
  Link
} from '@mui/material';
import { Visibility, VisibilityOff, Warning } from '@mui/icons-material';
import { useAuth } from '@/lib/context/AppProvider';
import { useDispatch } from 'react-redux';

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

export default function FormLoginAdmin() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [usernameInvalid, setUsernameInvalid] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordIncorrect, setPasswordIncorrect] = useState<boolean>(false);
  const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notAdminError, setNotAdminError] = useState<boolean>(false); 
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { login } = useAuth();
  
  useEffect(() => {
    // Elimina cualquier token existente al cargar el componente de inicio de sesión
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
    
    const sanitizedPassword = password.trim();
    const sanitizedUsername = username.trim();
  
    const isPasswordTooShort = sanitizedPassword.length < 8;
    setPasswordError(isPasswordTooShort);
    setPasswordIncorrect(false);
  
    const isUsernameEmpty = sanitizedUsername === "";
    setUsernameError(isUsernameEmpty);
  
    const isEmailFormat = sanitizedUsername.includes("@") && sanitizedUsername.includes(".com");
    setUsernameInvalid(!isEmailFormat);
  
    if (isUsernameEmpty || isPasswordTooShort || usernameInvalid) return;
  
    try {
      setIsLoading(true);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/NegoAdmin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          username: sanitizedUsername,
          password: sanitizedPassword,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        login(data.token, data.user);
        localStorage.setItem("typeOfUser", data.typeOfUser);
        Cookies.set("user-type", data.typeOfUser, { secure: true });
        Cookies.set("userName", data.userName, { secure: true });
        Cookies.set("refresh-token", data.refreshToken, { secure: true });
        router.push("/admin");
      } else {
        setInvalidCredentials(true);
        if (!isPasswordTooShort) {
          setPasswordIncorrect(true);
        }
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      if (!isPasswordTooShort) {
        setPasswordIncorrect(true);
      }
      setInvalidCredentials(true);
    } finally {
      setIsLoading(false);
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
              {notAdminError && <p>Usuario no es admin</p>}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <MuiLink component={Link} href="/login/recuperar-contrasena" underline="hover">
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
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <MuiLink component={Link} href="/login" underline="hover">
                    Inicia sesión como usuario compartido/exclusivo
                  </MuiLink>
              </Box>
              
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
                Error. Las credenciales de acceso ingresadas son incorrectas.
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  </ThemeProvider>
  )
}