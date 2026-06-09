import { useState } from 'react'
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog"


interface VendedorModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    mode: "Agregar" | "Editar"
  }

  export default function VendedorModal({ open, setOpen, mode }: VendedorModalProps) {

  const handleSave = () => {
    console.log('Guardando datos...')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >

      <DialogContent className="lg:max-w-[80%] h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className='text-center'>Vendedor</DialogTitle>
        </DialogHeader>
        
            
        <div className="grid gap-4 py-4">
        <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-semibold">Datos personales</legend>
            <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Nombre</Label>
                    <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rfc" className="text-right">RFC</Label>
                    <Input id="rfc" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="telefono" className="text-right">Teléfono</Label>
                    <Input id="telefono" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="conyuge" className="text-right">Cónyuge</Label>
                    <Input id="conyuge" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="zona" className="text-right">Zona</Label>
                    <Input id="zona" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cuota_Mensual" className="text-right">Cuota Mensual</Label>
                    <Input id="cuota_Mensual" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ref_Bancaria" className="text-right">Ref. Bancaria</Label>
                    <Input id="ref_Bancaria" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">Contraseña</Label>
                    <Input id="password" type="password" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="aval" className="text-right">Aval</Label>
                    <Input id="aval" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="referencias" className="text-right">Referencias</Label>
                    <Input id="referencias" className="col-span-3" />
                </div>
            </div>
        </fieldset>

          <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-semibold">Domicilio Particular</legend>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dp_calleNumero" className="text-right">Calle y Número</Label>
                <Input id="dp_calleNumero" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dp_colonia" className="text-right">Colonia</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una colonia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colonia1">Colonia 1</SelectItem>
                    <SelectItem value="colonia2">Colonia 2</SelectItem>
                    <SelectItem value="colonia3">Colonia 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dp_codigoPostal" className="text-right">Código Postal</Label>
                <Input id="dp_codigoPostal" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dp_ciudad" className="text-right">Ciudad</Label>
                <Input id="dp_ciudad" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dp_estado" className="text-right">Estado</Label>
                <Input id="dp_estado" className="col-span-3" />
              </div>
            </div>
          </fieldset>

          <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-semibold">Domicilio Fiscal</legend>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="df_calleNumero" className="text-right">Calle y Número</Label>
                <Input id="df_calleNumero" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="df_colonia" className="text-right">Colonia</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una colonia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colonia1">Colonia 1</SelectItem>
                    <SelectItem value="colonia2">Colonia 2</SelectItem>
                    <SelectItem value="colonia3">Colonia 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="df_codigoPostal" className="text-right">Código Postal</Label>
                <Input id="df_codigoPostal" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="df_ciudad" className="text-right">Ciudad</Label>
                <Input id="df_ciudad" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="df_estado" className="text-right">Estado</Label>
                <Input id="df_estado" className="col-span-3" />
              </div>
            </div>
          </fieldset>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}