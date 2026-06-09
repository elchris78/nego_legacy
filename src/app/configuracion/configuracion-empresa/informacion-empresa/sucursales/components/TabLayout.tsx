"use client"

import React, { useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store/store"

// MUI
import Tooltip, { type TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import { styled } from "@mui/material/styles"

export const ComicTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "#3C98CB", // Azul más claro
    border: "2px solid #BDC3C7", // Borde gris más oscuro
    padding: "12px 20px",
    fontSize: "0.875rem",
    maxWidth: 300,
    position: "relative",
    borderRadius: "20px",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    "&::before": {
      content: '""',
      position: "absolute",
      width: "15px",
      height: "15px",
      background: "white",
      border: "1px solid #BDC3C7",
      borderRight: "none",
      borderTop: "none",
      top: "85%",
      left: "-8px",
      transform: "translateY(-50%) rotate(25deg)",
      transformOrigin: "center",
    },
  },
}))
interface TabLayoutProps {
  exists?: boolean
  disabledValTab?: boolean
  tab: "informacion" | "documentacion"
  valueName?: string
  showAddSection?: boolean
  mode?: string
  spacingClasses?: {
    informacion?: string
    documentacion?: string
  }
}

const textoPorModo: Record<"new" | "edit" | "view", string> = {
  new: "Agregar valor de atributo",
  edit: "Editar valor de atributo",
  view: "Consultar valor de atributo",
};

const TabLayout: React.FC<TabLayoutProps> = ({
  exists = true,
  disabledValTab = false,
  tab,
  valueName,
  showAddSection = false,
  mode,
  spacingClasses = {},
}) => {
  const { sucursalId } = useParams() as { sucursalId: string };
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const currentSucursalId = useSelector(
    (state: RootState) => state.sucursales.currentSucursal?.id
  )
  const savedSucursalMode = useSelector(
    (state: RootState) => state.sucursales.savedSucursalMode
  )

  if (!exists) return null
  if (!exists && !currentSucursalId) return null

  const titulo = useMemo(
    () => `${textoPorModo[mode as "new" | "edit" | "view"] ?? ""}:`,
    [mode]
  )

  const createURL = (newTab: "informacion" | "documentacion") => {
    if (newTab === "informacion") {
      return `/configuracion/configuracion-empresa/informacion-empresa/sucursales/form?mode=${savedSucursalMode != "new" ? savedSucursalMode : "view"}&id=${currentSucursalId}`
    }
    return `/configuracion/configuracion-empresa/informacion-empresa/sucursales/${currentSucursalId ??  sucursalId}/documentacion`
  }

  const activeTab = tab
  const valoresLabel =
    activeTab === "documentacion" && valueName
      ? `Documentación adicional: ${valueName}`
      : "Documentación adicional"

  const handleTabClick = (newTab: "informacion" | "documentacion") => {
    if (newTab === activeTab) return
    router.push(createURL(newTab))
  }

  const appliedSpacing =
    spacingClasses[
      activeTab === "documentacion" ? "documentacion" : "informacion"
    ] || ""

  return (
    <div className={`w-full ${appliedSpacing}`}>
      {/* Pestaña Atributois */}
      <div className="flex flex-col md:flex-row border-b border-gray-200">
        <button
          onClick={() => handleTabClick("informacion")}
          disabled={activeTab === "informacion"}
          className={`flex-1 py-3 px-4 text-center relative transition-colors duration-200 ${
            activeTab === "informacion"
              ? "text-[#4197CB] font-semibold cursor-default"
              : "text-[#9D9D9C] font-normal hover:text-[#4197CB] cursor-pointer"
          }`}
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "20px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Información de la sucursal
          {activeTab === "informacion" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4197CB]" />
          )}
        </button>
        {/* Pestaña "Documentación" con disabledValTab */}
        {disabledValTab ? (
          <ComicTooltip
            title="Guarda primero la sucursal para habilitar esta sección"
            arrow={false}
            placement="top-end"
          >
            <span
              className="flex-1 py-3 px-4 text-center relative transition-colors duration-200 select-none"
              style={{
                opacity: 0.5,
                cursor: "not-allowed",
                fontFamily: "Roboto, sans-serif",
                fontSize: "20px",
                lineHeight: "100%",
                letterSpacing: "0%",
                display: "inline-block",
              }}
            >
              {valoresLabel}
            </span>
          </ComicTooltip>
        ) : (
          <button
            onClick={() => handleTabClick("documentacion")}
            className={`flex-1 py-3 px-4 text-center relative transition-colors duration-200 ${
              activeTab === "documentacion"
                ? "text-[#4197CB] font-semibold cursor-default"
                : "text-[#9D9D9C] font-normal hover:text-[#4197CB] cursor-pointer"
            }`}
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "20px",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            {valoresLabel}
            {activeTab === "documentacion" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4197CB]" />
            )}
          </button>
        )}
        
      </div>
      {/* Diseño exclusivo de pestaña valores edit - view - create */}
      {showAddSection && valueName && (
        <div className="w-full py-4 px-4 mt-2 mb-2">
          <p
            className="text-gray-700 flex items-center"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "28px",
              fontWeight: "500",
              lineHeight: "100%",
              letterSpacing: "0%",
              verticalAlign: "middle",
            }}
          >
            {titulo}&nbsp;
            <span style={{ color: "#4197CB" }}>{valueName}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default TabLayout