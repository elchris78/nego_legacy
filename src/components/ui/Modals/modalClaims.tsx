"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Paper,
  Chip,
} from "@mui/material"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "../button"

interface Claim {
  claimType: string
  claimValue: string
}

interface ModalPlantillaProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  claims: Claim[]
}

// Acciones comunes que se mostrarán como badges
const ACCIONES_COMUNES = ["Leer", "Crear", "Actualizar", "ToggleStatus", "Eliminar", "Imprimir"]

export const ModalPlantilla = ({ open, onClose, onConfirm, claims }: ModalPlantillaProps) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})

  // Función para construir la estructura jerárquica
  const buildHierarchy = (claims: Claim[]) => {
    const hierarchy: any = {}

    claims.forEach((claim) => {
      if (!claim.claimValue) return

      const parts = claim.claimValue.split(".")
      let current = hierarchy

      // Construir la estructura anidada
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]
        if (!current[part]) {
          current[part] = {}
        }
        current = current[part]
      }

      // Añadir la acción final
      const lastPart = parts[parts.length - 1]
      if (ACCIONES_COMUNES.includes(lastPart)) {
        if (!current._actions) {
          current._actions = []
        }
        current._actions.push(lastPart)
      } else {
        if (!current[lastPart]) {
          current[lastPart] = {}
        }
      }
    })

    return hierarchy
  }

  const hierarchy = buildHierarchy(claims)

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Renderizar la estructura jerárquica de forma recursiva
  const renderHierarchy = (data: any, level = 0, path = "") => {
    return Object.entries(data).map(([key, value]: [string, any]) => {
      if (key === "_actions") return null

      const currentPath = path ? `${path}.${key}` : key
      const isExpanded = expandedSections[currentPath] ?? true
      const hasChildren = Object.keys(value).length > 0
      const actions = value._actions || []

      return (
        <Box key={currentPath} sx={{ pl: level * 2, mb: 2 }}>
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              borderRadius: 1,
              backgroundColor: level === 0 ? "#f8fafc" : "#ffffff",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant={level === 0 ? "h6" : level === 1 ? "subtitle1" : "body1"}
                sx={{
                  fontWeight: level < 2 ? "bold" : "medium",
                  flexGrow: 1,
                  fontSize: level === 0 ? 18 : level === 1 ? 16 : 14,
                }}
              >
                {key}
              </Typography>

              {hasChildren && (
                <IconButton onClick={() => toggleSection(currentPath)} size="small">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </IconButton>
              )}
            </Box>

            {actions.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                {ACCIONES_COMUNES.filter((commonAction) => actions.includes(commonAction)).map((action) => (
                  <Chip
                    key={action}
                    label={action}
                    size="small"
                    variant="outlined"
                    sx={{
                      backgroundColor:
                        action === "Leer"
                          ? "#e3f2fd"
                          : action === "Crear"
                            ? "#e8f5e9"
                            : action === "Actualizar"
                              ? "#fff8e1"
                              : action === "Eliminar"
                                ? "#ffebee"
                                : action === "ToggleStatus"
                                  ? "#f3e5f5"
                                  : action === "Imprimir"
                                    ? "#e0f7fa"
                                    : "#f5f5f5",
                    }}
                  />
                ))}
              </Box>
            )}
          </Paper>

          {hasChildren && isExpanded && <Box sx={{ mt: 1 }}>{renderHierarchy(value, level + 1, currentPath)}</Box>}
        </Box>
      )
    })
  }

  // Inicializar todas las secciones como expandidas al abrir el modal
  useEffect(() => {
    if (open) {
      const initialExpanded: { [key: string]: boolean } = {}

      const initExpandedState = (obj: any, path = "") => {
        Object.keys(obj).forEach((key) => {
          if (key === "_actions") return

          const currentPath = path ? `${path}.${key}` : key
          initialExpanded[currentPath] = true

          if (typeof obj[key] === "object") {
            initExpandedState(obj[key], currentPath)
          }
        })
      }

      initExpandedState(hierarchy)
      setExpandedSections(initialExpanded)
    }
  }, [open, claims])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: "1px solid #e0e0e0", py: 2 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
          Valores de la plantilla
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ maxHeight: "calc(80vh - 120px)", overflowY: "auto", pr: 1 }}>
          {Object.keys(hierarchy).length > 0 ? (
            renderHierarchy(hierarchy)
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No hay permisos configurados en esta plantilla.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
        {/* <Button onClick={onClose}>Cerrar</Button> */}
        <Button onClick={onConfirm}>Continuar</Button>
      </DialogActions>
    </Dialog>
  )
}
