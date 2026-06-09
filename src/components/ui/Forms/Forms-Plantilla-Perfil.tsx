import { useState } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Switch } from "@/ui/switch"
import { ChevronDown, ChevronRight, Info } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FormularioPlantillaPerfil() {
  const [permisosGlobales, setPermisosGlobales] = useState(false)
  const [permisosPlantillas, setPermisosPlantillas] = useState(false)
  const [permisosUsuarios, setPermisosUsuarios] = useState(false)
  const [configuracionExpanded, setConfiguracionExpanded] = useState(true)
  const [plantillasExpanded, setPlantillasExpanded] = useState(true)
  const [usuariosExpanded, setUsuariosExpanded] = useState(true)

  const router = useRouter();

  const handleCancel = () => {
    router.push('/configuracion/configuracion-sistemas/control-usuarios/plantillas-usuarios');
  };

  return (
    <div className="w-full max-w-3xl p-4 space-y-6">
      <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-semibold text-gray-800">Crear plantilla de perfil</h1>

        <hr className="border-t border-gray-200 w-full" />

        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-medium text-gray-700">Datos Generales</h2>
            <Info className="text-gray-400" size={16} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fechaCreacion" className="text-sm text-gray-600">Fecha de creación</Label>
              <Input
                id="fechaCreacion"
                type="text"
                value="15 julio 2024"
                disabled
                className="bg-gray-100 text-gray-700 text-sm h-9"
              />
            </div>
            <div>
              <Label htmlFor="estatus" className="text-sm text-gray-600">Estatus</Label>
              <Select defaultValue="activo" required>
                <SelectTrigger id="estatus" className="h-9">
                  <SelectValue placeholder="Seleccionar estatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">
                    <div className="pl-3">Activo</div>
                  </SelectItem>
                  <SelectItem value="inactivo">
                    <div className="pl-3">Inactivo</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nombrePlantilla" className="text-sm text-gray-600">Nombre de la plantilla</Label>
              <Input id="nombrePlantilla" type="text" placeholder="Base de plantilla para Director Ejecutivo" className="h-9 text-sm" required/>
            </div>
            <div>
              <Label htmlFor="descripcion" className="text-sm text-gray-600">Descripción</Label>
              <Input id="descripcion" type="text" placeholder="Perfil para trabajo en gestión de usuarios" className="h-9 text-sm" required/>
            </div>
          </div>
        </section>

        <hr className="border-t border-gray-200 w-full" />

        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-medium text-gray-700">Permisos</h2>
            <Info className="text-gray-400" size={16} />
          </div>

          <div className="space-y-2">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setConfiguracionExpanded(!configuracionExpanded)}
            >
              <div className="flex items-center space-x-2">
                <div className="bg-[#3C98CB] rounded-sm p-0.5">
                  {configuracionExpanded ? <ChevronDown size={16} className="text-white" /> : <ChevronRight size={16} className="text-white" />}
                </div>
                <span className="text-sm font-medium">Configuración</span>
              </div>
              <Switch
                checked={permisosGlobales}
                onCheckedChange={setPermisosGlobales}
                aria-label="Configuración"
              />
            </div>

            {configuracionExpanded && (
              <div className="ml-6 space-y-2">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setPlantillasExpanded(!plantillasExpanded)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="bg-[#3C98CB] rounded-sm p-0.5">
                      {plantillasExpanded ? <ChevronDown size={16} className="text-white" /> : <ChevronRight size={16} className="text-white" />}
                    </div>
                    <span className="text-sm font-medium">Plantillas de perfiles</span>
                  </div>
                  <Switch
                    checked={permisosPlantillas}
                    onCheckedChange={setPermisosPlantillas}
                    aria-label="Permisos de plantillas"
                  />
                </div>

                {plantillasExpanded && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="space-y-1">
                      {["Agregar", "Editar", "Eliminar", "Cambiar estatus"].map((permiso) => (
                        <div key={permiso} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{permiso}</span>
                          <Switch aria-label={`Permiso de ${permiso.toLowerCase()}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setUsuariosExpanded(!usuariosExpanded)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="bg-[#3C98CB] rounded-sm p-0.5">
                      {usuariosExpanded ? <ChevronDown size={16} className="text-white" /> : <ChevronRight size={16} className="text-white" />}
                    </div>
                    <span className="text-sm font-medium">Usuarios</span>
                  </div>
                  <Switch
                    checked={permisosUsuarios}
                    onCheckedChange={setPermisosUsuarios}
                    aria-label="Permisos de usuarios"
                  />
                </div>

                {usuariosExpanded && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="space-y-1">
                      {["Agregar", "Editar", "Eliminar", "Cambiar estatus"].map((permiso) => (
                        <div key={permiso} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{permiso}</span>
                          <Switch aria-label={`Permiso de ${permiso.toLowerCase()}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-between">
          <Button
            className='p-6 bg-white border border-[#3C98CB] text-[#3C98CB] w-44'
            onClick={handleCancel} >
            Cancelar
          </Button>
          <Button className='p-6 bg-[#3C98CB] w-44'>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  )
}
