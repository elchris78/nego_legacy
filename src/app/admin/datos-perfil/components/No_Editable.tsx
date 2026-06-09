import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import React from 'react'
import InputText from './inputText'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface PropsNoEditable {
    datosUsuario: any
}

const No_Editable:React.FC<PropsNoEditable> = ({datosUsuario}) => {

    const formattedDate = datosUsuario?.createdDate
        ? new Date(datosUsuario.createdDate).toISOString().split('T')[0]
        : '';

    const statusText = datosUsuario?.isActive ? 'Activo' : 'Inactivo';

  return (
    <>
        <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={2} xl={2} display={'flex'}alignItems={'center'}  justifyContent={'center'} padding={2}>
                    <Box width={{xs:'100%', sm:'100%', md:'100%', lg:'100%', xl:'60%'}} display={'flex'}>
                        <Typography variant='h3' color='#5D6D7E'>
                            Datos no editables
                        </Typography>
                        <Tooltip title="Información sobre datos editables" placement="top" arrow>
                        <IconButton sx={{ ml: 1 }}>
                            <HelpOutlineIcon fontSize="small" color="action" />
                        </IconButton>
                    </Tooltip>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={10} xl={10} padding={2}>
                    <Box >                    
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <InputText
                                    tooltip='este es tu Id de usuario'
                                    label='ID de Usuario'
                                    readonly
                                    value={datosUsuario.id || ''}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                <InputText
                                    tooltip='fecha de tu creación de usuario'
                                    label='Fecha de creación'
                                    readonly
                                    value={formattedDate || ''} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                <InputText
                                    tooltip='este es tu estatus, activo o inactivo'
                                    label='Estatus'
                                    readonly
                                    value={statusText || ''}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                <InputText
                                    tooltip='este es tu nombre de usuario'
                                    label='Usuario'
                                    readonly
                                    value={datosUsuario.userName || ''}
                                />
                            </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                    <InputText
                                        tooltip='correo registrado'
                                        label='Correo electrónico'
                                        readonly
                                        value={datosUsuario.email || ''}
                                    />
                                </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid> 
    </>
  )
}

export default No_Editable
