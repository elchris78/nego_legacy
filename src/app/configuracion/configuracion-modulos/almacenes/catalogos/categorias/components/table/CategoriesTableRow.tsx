import { useEffect, useState } from "react";

import { ChevronRight, ChevronDown, EllipsisIcon, PencilLine, Trash2, Plus } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";

import type { Categories } from "../../services/categoriesTypes"; 
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { toggleCategoriesStatus, getCategoriesById } from '../../services/categoriesAction';
import DeleteCategoriesModal from "./DeleteCategoriesModal";
import AlertCategoriesModal from "./AlertCategoriesModal";
import { useRouter } from "next/navigation";
import AlertStatusCategoriesModal from "./AlertStatusCategoriesModal";

const toggleStatusClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Categorías.ToggleStatus";
const createClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Categorías.Crear";
const deleteClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Categorías.Eliminar";
const updateClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Categorías.Actualizar";

interface Props {
  index: number
  startIndex: number
  categories: Categories
  getCategories: () => Promise<void>
  indentLevel?: number
  onToggleExpand?: (id: string) => void
  isExpanded?: boolean
  expandedRows?: Set<string>
  collapseAll?: () => void
}

const CategoriesTableRow = ({ 
    index,
  startIndex,
  categories,
  getCategories,
  indentLevel = 0,
  onToggleExpand,
  isExpanded = false,
  expandedRows = new Set(),
  collapseAll
 }: Props) => {
  const token = Cookies.get("auth-token") || "";
  const router = useRouter();
  const [isActive, setisActive] = useState<boolean>(categories?.estatus ?? false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isAlertStatus, setIsAlertStatus] = useState(false);
  const [targetRoute, setTargetRoute] = useState<string>("");
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);
  const [subCategorias, setSubCategorias] = useState<Categories[]>(categories.subcategorias ?? []);
  const claims = useSelector((state: RootState) => state.claims.data);
  
  const [activateSubcategories, setActivateSubcategories] = useState<boolean>(false);
  const handlePlusClick = (route: string) => {
    setTargetRoute(route);
    setIsAlertOpen(true);
  };

  const handleAlertAccept = () => {
    setIsAlertOpen(false);
    if (targetRoute) {
      router.push(targetRoute);
    }
  };

  // Función para cerrar el modal sin acción
  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  useEffect(() => {
    setisActive(categories.estatus);
  }, [categories.estatus]);


  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const handleToggleExpand = async () => {
    if (onToggleExpand) {
      onToggleExpand(categories.id);
    }

    if (!isExpanded && categories?.id) {
      try {
        const response = await getCategoriesById({
          token,
          id: categories.id
        });

        if (response && response.success) {
          //console.log("Categoría expandida:", response.categoria);
          setSubCategorias(response.categoria.subcategorias ?? []);
        } else {
          console.error("Error: Categoría no encontrada o success = false");
        }
      } catch (error) {
        console.error("Error al obtener la categoría:", error);
      }
    }
  };

  const handleToggleStatus = async (newState: boolean, activate: boolean) => {
  try {
    if (!navigator.onLine) {
      Swal.fire({
        title: "¡ERROR!",
        text: "Solicita el permiso con tu superior para realizar esta acción.",
        icon: "error",
        confirmButtonText: "Cerrar",
        customClass: {
          container: "swal2-container",
          popup: "swal-popup-error",
          confirmButton: "swal-confirm-button",
          title: "swal-title",
          actions: 'swal-actions',
        },
      });
      return;
    }

    setisActive(newState);

    const resp = await toggleCategoriesStatus({
      token,
      id: categories?.id,
      isActive: !categories?.estatus,
      activateSubcategories: activate,
    });

    if (resp?.success) {
      Swal.fire({
        title: "¡ÉXITO!",
        text: resp.message || "Estado de la categoría actualizado correctamente.",
        icon: "success",
        confirmButtonText: "Cerrar",
        customClass: {
          container: "swal2-container",
          popup: "swal-popup-succes",
          confirmButton: "swal-confirm-button",
          title: "swal-title",
          actions: 'swal-actions',
        },
      });

      await getCategories();

      // 👇 Colapsar categoría si estaba expandida
      if (collapseAll) {
        collapseAll();
      }
    }
  } catch (error) {
    console.log("🚀 ~ handleToggleStatus ~ error:", error);
    Swal.fire({
      title: "¡ERROR!",
      text: "Ocurrió un error al cambiar el estatus.",
      icon: "error",
      confirmButtonText: "Volver a intentar",
      customClass: {
        container: "swal2-container",
        popup: "swal-popup-error",
        confirmButton: "swal-confirm-button",
        title: "swal-title",
        actions: 'swal-actions',
      },
    });
    setisActive(!newState);
  }
};



const handleCancelToggleStatus = async () => {
  setIsAlertStatus(false);
  setPendingStatus(null);

  try {
    const resp = await toggleCategoriesStatus({
      token,
      id: categories?.id,
      isActive: !categories?.estatus,
      activateSubcategories: false,
    });

    if (resp?.success) {
      Swal.fire({
        title: "¡ÉXITO!",
        text: resp.message || "Estado actualizado sin subcategorías.",
        icon: "success",
        confirmButtonText: "Cerrar",
        customClass: {
          container: "swal2-container",
          popup: "swal-popup-succes",
          confirmButton: "swal-confirm-button",
          title: "swal-title",
          actions: 'swal-actions',
        },
      });

      if (indentLevel > 0 && categories.id) {
        // 👇 Si es subcategoría, recarga sus datos directamente
        const response = await getCategoriesById({ token, id: categories.id });
        if (response && response.success) {
          setSubCategorias(response.categoria.subcategorias ?? []);
          setisActive(response.categoria.estatus ?? false); // Actualiza estatus si cambia
        }
      } else {
        await getCategories(); // si es categoría principal
      }
    }
  } catch (error) {
    console.error("Error al cancelar y cambiar el estado:", error);
    Swal.fire({
      title: "¡ERROR!",
      text: "Ocurrió un error al cambiar el estatus.",
      icon: "error",
      confirmButtonText: "Volver a intentar",
      customClass: {
        container: "swal2-container",
        popup: "swal-popup-error",
        confirmButton: "swal-confirm-button",
        title: "swal-title",
        actions: 'swal-actions',
      },
    });
  }
};






  const handleDeletePuestos = async () => {
    setIsOpenModal(true);
  };
  
  const getSymbolByIndentLevel = (level: number): string => {
    if (level === 0) return "❖";
    if (level === 1) return "○";
    if (level === 2) return "●";
    if (level === 3) return "■";
    if (level >= 4) return ".".repeat(level - 4);
    return "";
  };

  return (
    <> 
      <TableRow>
        <TableCell className="text-center">
          {startIndex + index + 1}
        </TableCell>
        <TableCell className="text-center">
          {categories?.id}
        </TableCell>
        <TableCell className="text-sm">
          <div className="flex items-center justify-between gap-2" style={{ paddingLeft: `${indentLevel * 24}px` }}>
          
            <Link
              className="text-[#3C98CB] hover:underline cursor-pointer flex items-center gap-1"
                href={
                  indentLevel > 0
                    ? `/configuracion/configuracion-modulos/almacenes/catalogos/categorias/form?mode=viewsubcat&id=${categories?.id}`
                    : `/configuracion/configuracion-modulos/almacenes/catalogos/categorias/form?mode=view&id=${categories?.id}`
                }
            >
              {indentLevel > 0 && (
                <span className="text-gray-500">{getSymbolByIndentLevel(indentLevel - 1)}</span>
              )}
              {categories?.nombre}
            </Link>

              <button onClick={handleToggleExpand} className="p-1 hover:bg-gray-100 rounded transition-colors">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>

          </div>
        </TableCell>
        <TableCell className="flex justify-center">
          <Switch
            checked={isActive}
            onCheckedChange={(newState) => {
              setPendingStatus(newState); 
              setIsAlertStatus(true);    
            }}
            disabled={!hasClaim(toggleStatusClaim) || categories.hasSubcategories === false}
            className="data-[state=checked]:bg-[#3C98CB]"
          />
        </TableCell>
        <TableCell>
          <Popover>
            <PopoverTrigger
              className="flex items-center justify-center w-full cursor-pointer"
              asChild
            >
              <EllipsisIcon className="mr-1 mt-1" color="#BDC3C7" />
            </PopoverTrigger>
            <PopoverContent align="center" className="p-2 w-fit">
              <div className="flex flex-row gap-2">
                { hasClaim(updateClaim) && (
                  <Link
                      href={
                          indentLevel > 0
                            ? `/configuracion/configuracion-modulos/almacenes/catalogos/categorias/form?mode=editsubcat&id=${categories?.id}`
                            : `/configuracion/configuracion-modulos/almacenes/catalogos/categorias/form?mode=edit&id=${categories?.id}`
                        }
                    className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                  >
                    <PencilLine size={18} />
                  </Link>
                )}
                {hasClaim(createClaim) && (
                  
                  <button
                    onClick={() =>
                      handlePlusClick(
                        `/configuracion/configuracion-modulos/almacenes/catalogos/categorias/form?mode=newsubcat&id=${categories?.id}`
                      )
                    }
                    className="text-[#5B6670] hover:text-[#3C98CB]"
                    aria-label="Agregar subcategoría"
                  >
                    <Plus size={18} />
                  </button>
                )}
                {hasClaim(deleteClaim) && (
                  <Trash2
                    size={18}
                    className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                    onClick={handleDeletePuestos}
                  />
                )}
                {!hasClaim(updateClaim) && !hasClaim(deleteClaim) && (
                  <span className="text-gray-500 text-sm">Sin permisos</span> 
                )}
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <>
          {subCategorias.length > 0 ? (
            subCategorias.map((subCategoria, subIndex) => (
              <CategoriesTableRow
                key={subCategoria.id}
                index={subIndex}
                startIndex={0}
                categories={subCategoria}
                getCategories={getCategories}
                indentLevel={indentLevel + 1}
                onToggleExpand={onToggleExpand}
                isExpanded={expandedRows.has(subCategoria.id)}
                expandedRows={expandedRows}
                collapseAll={collapseAll}
              />
            ))
          ) : (
            <TableRow className="hover:bg-gray-50">
              <TableCell className="text-center text-sm text-gray-400">-</TableCell>
              <TableCell className="text-center text-sm text-gray-400">-</TableCell>
              <TableCell className="text-sm">
                <div
                  className="flex items-center gap-2"
                  style={{ paddingLeft: `${(indentLevel + 1) * 24 + 24}px` }}
                >
                    <span className="text-gray-500 text-sm">
                      No se encontraron subcategorías
                    </span>
                </div>
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          )}
        </>
      )}


      {/* Delete modal */}
      <DeleteCategoriesModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        id={categories?.id}
        getCategories={getCategories}
      />

      <AlertCategoriesModal
        isOpenModal={isAlertOpen}
        onCloseModal={handleAlertClose}
        hanldleNavegation={handleAlertAccept}
      />

      <AlertStatusCategoriesModal
        isOpenModal={isAlertStatus}
        onCloseModal={handleCancelToggleStatus}
        hanldleStatus={() => {
          if (pendingStatus !== null) {
            setActivateSubcategories(true); // Se activa si el usuario acepta
            handleToggleStatus(pendingStatus, true);
          }
          setIsAlertStatus(false);
          setPendingStatus(null);
        }}
        isActive={isActive}
      />

    </>
  );
};

export default CategoriesTableRow;
