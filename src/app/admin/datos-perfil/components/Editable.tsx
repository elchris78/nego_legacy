import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import React from 'react'
import InputText from './inputText'
import Image from 'next/image'
import userimg from '@/Asset/userNego.png'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


interface PropsEditable {
    datosUsuario: any
    user: any
    avatar: any
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Editable: React.FC<PropsEditable> = ({datosUsuario, user, avatar, handleChange}) => {
  return (
    <>

    
        <Grid container >
                <Grid item xs={12} sm={12} md={12} lg={2} xl={2} padding={2}  display={'flex'}alignItems={'center'} justifyContent={'center'}> 
                <Box width={{ xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '60%' }} display={'flex'}>
                    <Typography variant='h3' color='#5D6D7E'>
                        Datos editables
                    </Typography>
                    <Tooltip title="Información sobre datos editables" placement="top" arrow>
                        <IconButton sx={{ ml: 1 }}>
                            <HelpOutlineIcon fontSize="small" color="action" />
                        </IconButton>
                    </Tooltip>
                </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={10} xl={10} paddingBlock={5} padding={2}>
                        <Box width={'100%'}>
                            <Grid container spacing={5} display={'flex'} alignItems={'center'}>
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                    <InputText
                                        tooltip='puedes editar tu nombre completo'
                                        label='Nombre completo'
                                        placeholder={datosUsuario?.fullName ?? ''}
                                        value={user}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                    <InputText
                                        tooltip='Selecciona un avatar'
                                        label='Avatar'
                                        placeholder='Buscar imagen'
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={3.5} xl={4}>
                                    <Grid container gap={1}display={'flex'}>
                                        <Grid item display={'flex'}  alignItems={'center'}>
                                            <Typography variant="h6">Vista Previa</Typography>
                                            <Tooltip title='este es tu avatar' arrow>
                                                <IconButton sx={{ ml: 1 }}>
                                                    <HelpOutlineIcon fontSize="small" color="action" />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item>
                                            <Box display="flex" alignItems="center" ml={1} border={'1px solid #5D6D7E'} borderRadius={4}  padding={2} >
                                                <Image src={userimg} alt="user" width={100} height={100} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            
                        </Box>
                </Grid>
            </Grid> 
    </>
  )
}

export default Editable
