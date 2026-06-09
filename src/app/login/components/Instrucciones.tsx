'use client'
import { 
  Button, 
  Typography, 
  Grid, 
  Paper, 
  ThemeProvider,
  createTheme,
  Box,
  Container
} from '@mui/material';
import Link from 'next/link';

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

interface Iinstrucciones {

    Navigate: () => void;
    handleNavigate: () => void;
}
const Instrucciones: React.FC <Iinstrucciones> = ({Navigate, handleNavigate}) => {
  return (
<ThemeProvider theme={theme}>
        <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 2, md: 0 } }}>
        <Paper elevation={5} sx={{ width: '100%', maxWidth: '1000px', height: { xs: 'auto', md: '500px' }, overflow: 'hidden' }}>
          <Grid container sx={{ height: '100%' }}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, md: 0 }, order: { xs: 1, md: 2 } }}>
              <Typography variant="h2" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
                NEGO
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ bgcolor: 'white', p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h4" component="h2" sx={{ color: 'primary.main', fontWeight: 500, mb: 4, textAlign: 'center' }}>
                ¡Instrucciones enviadas con éxito!
              </Typography>
              <Typography variant='h6' fontWeight={400} paddingBottom={4}>
                Te enviamos un mensaje a tu correo electrónico con las instrucciones para recuperar tu contraseña.
              </Typography>
              <Box>
                <Grid container>
                    <Grid item xs={12} paddingTop={2}>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                borderRadius: '12px',
                                backgroundColor: '#329FD8',
                                color: 'white',
                                '&:hover': {
                                backgroundColor: '#2980B9',
                                },
                                padding: '10px',
                                fontSize: '1rem',
                            }}
                            onClick={Navigate}
                    >
                            Aceptar
                        </Button>
                    </Grid>
                    
                    <Grid item xs={12} display={'flex'} justifyContent={'center'} paddingTop={5}>
                        <Box width={'80%'} >
                            <Typography textAlign={'center'} variant='subtitle1'>
                                ¿No recibiste el correo electrónico?
                            </Typography>
                            <Typography textAlign={'center'} variant='subtitle1'>
                                Revisa tu filtro de spam o
                            </Typography>
                            <Box display={'flex'} justifyContent={'center'}>
                            <Button  onClick={handleNavigate} style={{ color:'#3C98CB', textDecoration:"underline"}}>
                                inténtalo de nuevo
                            </Button>
                            </Box>
                            
                        </Box>
                        
                    </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        </Container>
    </ThemeProvider>
  )
}

export default Instrucciones
