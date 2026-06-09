import { Box, Grid, IconButton, MenuItem, Select, Tooltip, Typography } from '@mui/material'
import React, {useState} from 'react'
import InputText from './inputText'
import InfoIcon from '@mui/icons-material/Info'
import dayjs from 'dayjs'
import { LabelTooltip } from '@/components/ui/LabelTooltip'
interface PropsDatos {
    datosUsuario: any
    formData: any
    error?: { [key: string]: string };
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Datos:React.FC<PropsDatos> = ({datosUsuario, handleChange, formData, error}) => {

    const { gender } = formData;
    

    const formattedDate = 
    (datosUsuario?.createdAt || datosUsuario?.createdDate) 
      ? new Date(datosUsuario.createdAt || datosUsuario.createdDate).toISOString().split('T')[0] 
      : '';

 
   
    
    
    const statusText = datosUsuario?.isActive ? 'Activo' : 'Inactivo';

    console.log(datosUsuario?.dateOfBirth)

  return (
    <>
        <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} padding={2} alignItems={'center'} justifyContent={'center'}>
                    <Box >                    
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                <InputText
                                    type="text"
                                    name="userName"
                                    tooltip="Debe contener mínimo 3 caracteres y empezar con mayúscula."
                                    label="Nombre completo"
                                    placeholder="Ingresa tu nombre completo"
                                    value={formData.userName ?? datosUsuario.fullName ?? ''} // Ajustar prioridad del valor
                                    onChange={handleChange}
                                    sx={{
                                        "& .MuiInputBase-input::placeholder": {
                                            color: "black",
                                            opacity: 1,
                                        },
                                    }}
                                />
                                {error?.userName && <p style={{ color: 'red', marginTop: '4px' }}>{error.userName}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                <LabelTooltip
                                label='Género'
                                tooltip='Selecciona el genero"Puedes editar tu género'
                                />
                                <Select
                                    name="gender"
                                    value={gender || datosUsuario.gender}
                                    onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                                    fullWidth
                                    displayEmpty
                                    variant="outlined"
                                    sx={{
                                        textTransform: 'capitalize',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(0, 0, 0, 0.23)',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(0, 0, 0, 0.87)',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'primary.main',
                                        },
                                        borderRadius: 2,
                                        '& .MuiSelect-select': {
                                        padding: '10px 14px',
                                        },
                                        marginTop:0.5
                                    }}
                                    >
                                    <MenuItem value='' >
                                    Seleccione una opción
                                    </MenuItem>
                                    <MenuItem value="Masculino">Masculino</MenuItem>
                                    <MenuItem value="Femenino">Femenino</MenuItem>
                                    </Select>

                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                <InputText
                                    type="date"
                                    name="fechaNacimiento"
                                    tooltip="Puedes editar tu fecha de nacimiento"
                                    label="Fecha de nacimiento"
                                    placeholder="dd/mm/aaaa"
                                    value={
                                        formData.fechaNacimiento
                                        ? dayjs(formData.fechaNacimiento).format('YYYY-MM-DD') // Formatea la fecha del formulario
                                        : datosUsuario.dateOfBirth 
                                        ? dayjs(datosUsuario.dateOfBirth).format('YYYY-MM-DD') // Formatea la fecha del usuario
                                        : ''
                                    } // Ajustar prioridad del valor
                                    onChange={handleChange}
                                    dynamicType={true}
                                    max="2006-12-31"
                                    
                                />
                                {error?.fechaNacimiento && <p style={{ color: 'red', marginTop: '4px' }}>{error.fechaNacimiento}</p>}
                            </Grid>

                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                            <InputText
                                name="telefono"
                                tooltip="Puedes editar tu número de teléfono"
                                label="Teléfono"
                                placeholder="Ingresa tu número de teléfono"
                                value={formData.telefono ??  datosUsuario.phoneNumber ?? ''} // Ajustar prioridad del valor
                                onChange={(e: any) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                                sx={{
                                    "& .MuiInputBase-input::placeholder": {
                                    color: "black",
                                    opacity: 1,
                                    },
                                }}
                                />
                                {error?.telefono && <p style={{ color: 'red', marginTop: '4px' }}>{error.telefono}</p>}
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <InputText
                                    tooltip='Este es tu usuario'
                                    label='Usuario'
                                    value={datosUsuario.userName || ''}
                                    sx={{background:"#E3E1E6", borderRadius:2}}
                                    readonly
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                <InputText
                                    tooltip='Correo registrado'
                                    label='Correo electrónico'
                                    value={datosUsuario.email || ''}
                                    sx={{background:"#E3E1E6", borderRadius:2}}
                                    readonly
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                <InputText
                                    tooltip='Este es tu estatus, activo o inactivo'
                                    label='Estatus'
                                    value={statusText || ''}
                                    sx={{background:"#E3E1E6", borderRadius:2}}
                                    readonly
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                <InputText
                                    tooltip='Fecha de tu creación de usuario'
                                    label='Fecha de creación'
                                    value={formattedDate || ''}
                                    sx={{background:"#E3E1E6", borderRadius:2}} 
                                    readonly
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid> 
    </>
  )
}

export default Datos
