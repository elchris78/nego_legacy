import { useEffect, useState } from "react";

import { EllipsisIcon, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";

import type { TypesWarehouses } from "../../services/typesWarehousesTypes"; 
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import alerta from "@/Asset/alerta 1.png";
import { toggleTypesWarehousesStatus } from "../../services/typesWarehousesAction";
import { ComicTooltip } from "@/components/ui/LabelTooltip";
import DeleteTypesWarehousesModal from "./DeleteTypesWarehousesModal";
import { typesWarehousesActions } from "../../services/typesWarehousesSlice";

const customClassesSuccess = {
  container: "swal2-container",
  popup: "swal-popup-succes",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};
const customClassesError = {
  container: "swal2-container",
  popup: "swal-popup-error",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

const toggleStatusClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Tipo de almacén.ToggleStatus";
const deleteClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Tipo de almacén.Eliminar";
const updateClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Tipo de almacén.Actualizar";

interface Props {
  index: number;
  startIndex: number;
  typesWarehouses: TypesWarehouses;
  getTypesWarehouses: () => Promise<void>;
}

const TypesWarehousesTableRow = ({ index, startIndex, typesWarehouses, getTypesWarehouses }: Props) => {
  const token = Cookies.get("auth-token") || "";
  const router = useRouter();

  const [isActive, setisActive] = useState<boolean>(typesWarehouses?.estatus ?? false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    setisActive(typesWarehouses.estatus);
  }, [typesWarehouses.estatus]);



  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claims.data);

  // Filtrar navegación según los claims
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const handleToggleStatus = async (newState: boolean) => {
    try {
        const resultAction = await dispatch(
          typesWarehousesActions.toggleTypesWarehousesStatus({
            token,
            id: typesWarehouses?.id, isActive: !typesWarehouses?.estatus,
          })
        );
    
        if (
          typesWarehousesActions.toggleTypesWarehousesStatus.rejected.match(resultAction)
        ) {
          throw resultAction.payload;
        }
      getTypesWarehouses();
      setisActive(newState);

      Swal.fire({
        title: "¡Éxito!",
        text: resultAction.payload.message,
        icon: "success",
        customClass: customClassesSuccess,
      });
      } catch (error: any) {
          console.error("Error al cambiar el estatus", error);
          setisActive(!newState); // revertir si hubo error
      
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonText: "Cerrar",
            customClass: customClassesError,
          });
        }
      };

  const handleDeletePuestos = async () => {
    setIsOpenModal(true);
  };
  

  return (
    <> 
      <TableRow>
        <TableCell className="text-center">
          {startIndex + index + 1}
        </TableCell>
        <TableCell className="text-center">
          {typesWarehouses?.id}
        </TableCell>
        <TableCell className="text-[#3C98CB] text-center">
          {typesWarehouses.nombre.length > 20 ? (
            <ComicTooltip title={typesWarehouses?.nombre} placement="top-start">
              <Link
                className="cursor-pointer hover:underline"
                href={`/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes/form?mode=view&id=${typesWarehouses?.id}`}
              >
                {typesWarehouses?.nombre.slice(0, 20) + "..."}
              </Link>
            </ComicTooltip>
          ):(
          <Link
            className="cursor-pointer hover:underline"
            href={`/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes/form?mode=view&id=${typesWarehouses?.id}`}
          >
            {typesWarehouses?.nombre}
          </Link>
          )}
        </TableCell>
        <TableCell className="text-center">
          {typesWarehouses.origen}
        </TableCell>
        <TableCell className="flex justify-center">
          <Switch
            checked={isActive}
            onCheckedChange={(newState) => handleToggleStatus(newState)}
            disabled={!hasClaim(toggleStatusClaim)}
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
                    href={`/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes/form?mode=edit&id=${typesWarehouses?.id}`}
                    className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                  >
                    <PencilLine size={18} />
                  </Link>
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

      {/* Delete modal */}
      <DeleteTypesWarehousesModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        id={typesWarehouses?.id}
        getTypesWarehouses={getTypesWarehouses}
      />
    </>
  );
};

export default TypesWarehousesTableRow;
