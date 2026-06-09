import React, { useState } from 'react'
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Switch } from "@/ui/switch"
import { Eye, EyeOff, ChevronUp } from 'lucide-react'

const FormularioUsuarios = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [configuracionPersonalizada, setConfiguracionPersonalizada] = useState(false)

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const isPasswordMismatch = confirmPassword !== password;

  return (
    <div className="w-full sm:w-[100%] p-4   ">
      <h1 className="text-2xl font-bold mb-6">Usuarios</h1>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="userId">ID de Usuario</Label>
            <Input id="userId" readOnly/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="creationDate">Fecha de creación</Label>
            <Input id="creationDate" readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Estatus</Label>
            <Select required>
              <SelectTrigger id="status">
                <SelectValue placeholder="Estatus" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input id="fullName" required/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input id="username" required/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" required/>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="space-y-2 w-full sm:w-1/3">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                required 
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                type="button"
                variant="ghost" 
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2 w-full sm:w-1/3">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <div className="relative">
              <Input 
                id="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                isError={isPasswordMismatch}
              />
              <Button 
                type="button"
                variant="ghost" 
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
            <div>
                <Label>Permisos</Label>
            </div>
            <div>
                <Label>Rol y Permisos</Label>
            </div>
          
          <div className='w-full sm:w-1/3'>
          <Select onValueChange={(value) => setConfiguracionPersonalizada(value === 'personalizada')}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rol y permisos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personalizada">Configuración personalizada</SelectItem>
              <SelectItem value="admin">Administrador de empresa</SelectItem>
            </SelectContent>
          </Select>

          {configuracionPersonalizada && (
            <div className="space-y-4 p-5">
              <div className="flex items-center  space-x-2">
                    <div className='bg-[#3C98CB] rounded-sm'>
                        <ChevronUp className="h-4 w-4" color='white' />
                    </div>
                    <Label>Configuración</Label>
                    <Switch />
              </div>
              <div className="flex items-center space-x-2 p-3">
                <div className='flex flex-1 space-x-2'>
                    <div className='bg-[#3C98CB] rounded-sm'>
                        <ChevronUp className="h-4 w-4" color='white' />
                    </div>
                        <Label>Plantillas de perfiles</Label>
                    </div>
        
                    <div className='flex  flex-1 justify-end'>
                        <Switch />
                    </div>
                </div>
                <div className='flex justify-end'>
                <div className="space-y-3 border-[2px] border-solid border-[#EDEDED] p-3 rounded-lg w-[95%]">
                {['Agregar', 'Editar', 'Eliminar', 'Cambiar estatus'].map((option) => (
                  <div key={option} className="flex justify-between items-center">
                    <Label>{option}</Label>
                    <Switch />
                  </div>
                ))}
              </div>

                </div>
              
              <div className="flex items-center  space-x-2w-[98%]">
                    <div className='bg-[#3C98CB] rounded-sm'>
                        <ChevronUp className="h-4 w-4" color='white' />
                    </div>
                    <span>Usuarios</span>
                    <div className='flex  flex-1 justify-end'>
                        <Switch />
                    </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-start space-x-4 ">
          <Button className='p-6 bg-[#1E2945] w-44'>Cancelar</Button>
          <Button className='p-6 bg-[#3C98CB] w-44'>Guardar</Button>
        </div>
          </div>
          
      </form>
    </div>
  )
}

export default FormularioUsuarios