"use client";
import VendedorModal from "@/Modals/Modal_Ventas"
import { Button } from "@/ui/button"
import { DatePicker } from "@/ui/datePicker"
import { Input } from "@/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import { CalendarIcon, SearchIcon, TrashIcon } from "lucide-react"
import { useState } from "react"

export default function VendedoresPage() {
    const [isModalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<"Agregar" | "Editar">("Agregar")

    const handleOpenModal = (mode: "Agregar" | "Editar") => {
        setModalMode(mode)
        setModalOpen(true)
      }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <nav className="flex justify-between items-center">
          {['Inicio', 'Compras', 'Almacen', 'Ventas', 'Distribucion', 'Finanzas', 'Configuracion', 'Usuario', 'Salir'].map((item) => (
            <Button key={item} variant="ghost" className="text-primary-foreground hover:text-primary hover:bg-primary-foreground">
              {item}
            </Button>
          ))}
        </nav>
      </header>

      {/* Main */}
      <main className="flex-grow p-6 bg-background overflow-auto">
        <div className="space-y-6">
          {/* Título */}
          <h1 className="text-3xl font-bold">Vendedores</h1>

          {/* Botones de acción */}
          <div className="flex space-x-4">
            <Button onClick={() => handleOpenModal("Agregar")}>Agregar</Button>
            <Button variant="outline" onClick={() => handleOpenModal("Editar")}>Editar</Button>
          </div>

          {/* Filtros */}
          <div className="flex space-x-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar" className="pl-8" />
            </div>
            <DatePicker tilte="seleccionar fecha"/>
          </div>

          {/* Tabla de datos */}
          <Table>
            <TableHeader>
              <TableRow>
                {['ID', 'Nombre', 'RFC', 'Teléfono', 'Cónyuge', 'Zona', 'Cuota Mensual', 'Ref. Bancaria', 'Aval', 'Referencia', 'Acción'].map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Aquí puedes agregar filas de datos dinámicamente */}
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>Juan Pérez</TableCell>
                <TableCell>PERJ800101ABC</TableCell>
                <TableCell>555-1234</TableCell>
                <TableCell>María Gómez</TableCell>
                <TableCell>Norte</TableCell>
                <TableCell>$5000</TableCell>
                <TableCell>1234567890</TableCell>
                <TableCell>Pedro Sánchez</TableCell>
                <TableCell>Ref123</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              {/* Puedes agregar más filas aquí */}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground p-4 text-center">
        © 2023 Tu Empresa. Todos los derechos reservados.
      </footer>
      <VendedorModal open={isModalOpen} setOpen={setModalOpen} mode={modalMode} />
    </div>
  )
}