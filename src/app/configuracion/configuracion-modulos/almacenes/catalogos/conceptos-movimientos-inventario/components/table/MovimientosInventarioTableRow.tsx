import { useEffect, useState } from "react";

import { EllipsisIcon, PencilLine, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { movimientosInventarioActions } from "../../services/movimientosInventariosSlice";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteItemModal from "@/components/ui/Tables/DeleteItemModal";
import showAlert from "@/lib/utils/alerts";

import { AppDispatch, RootState } from "@/lib/store/store";
import type { MovimientoInventario } from "../../services/movimientosInventarioTypes";

const toggleStatusClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Conceptos de movimientos al inventario.ToggleStatus";
const deleteClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Conceptos de movimientos al inventario.Eliminar";
const updateClaim =
  "Configuración.Configuración de módulos.Almacenes.Catálogos.Conceptos de movimientos al inventario.Actualizar";

interface Props {
  index: number;
  startIndex: number;
  movimiento: MovimientoInventario;
  getData: () => Promise<void>;
}

const MovimientosInventarioTableRow = ({
  index,
  startIndex,
  movimiento,
  getData,
}: Props) => {
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();

  const [isActive, setisActive] = useState<boolean>(
    movimiento?.estatus ?? false
  );
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    setisActive(movimiento?.estatus);
  }, [movimiento?.estatus]);

  const isPending = useSelector(
    (state: RootState) => state.movimientosInventario.pending
  );

  // Claims
  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const handleToggleStatus = async (newState: boolean) => {
    try {
      const resultAction = await dispatch(
        movimientosInventarioActions.toggleMovimientoInventarioStatus({
          token,
          id: movimiento?.id,
        })
      );
      if (
        movimientosInventarioActions.toggleMovimientoInventarioStatus.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }

      getData(); // Refresh data after status change
      setisActive(newState); // Update local state

      // Show success message
      showAlert({
        success: true,
        message: resultAction.payload.message,
      });
    } catch (error: any) {
      console.error("Error al cambiar el estatus", error);
      setisActive(!newState); // Revertir el estado en caso de error

      // Show error message
      showAlert({
        success: false,
        message: error.message || "Error al cambiar el estatus",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const resultAction = await dispatch(
        movimientosInventarioActions.deleteMovimientoInventario({
          token,
          id: movimiento?.id,
        })
      );
      if (
        movimientosInventarioActions.deleteMovimientoInventario.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }

      // Show success message
      showAlert({
        success: true,
        message: resultAction.payload.message,
      });

      // Refresh data
      await getData();
    } catch (error: any) {
      console.log("🚀 ~ handleDelete ~ error:", error);

      // Show error message
      showAlert({
        success: false,
        message:
          error.message || "Error al eliminar el movimiento de inventario",
      });
    } finally {
      setIsOpenModal(false);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
        <TableCell className="text-center">{movimiento?.id}</TableCell>
        <TableCell className="text-[#3C98CB] text-center">
          <Link
            className="text-center cursor-pointer hover:underline"
            href={`/configuracion/configuracion-modulos/almacenes/catalogos/conceptos-movimientos-inventario/form?mode=view&id=${movimiento?.id}`}
          >
            {movimiento?.concepto}
          </Link>
        </TableCell>
        <TableCell className="text-center">{movimiento?.origen}</TableCell>
        <TableCell className="text-center">{movimiento?.aplicaPara}</TableCell>
        <TableCell className="text-center">
          {movimiento?.tipoMovimiento}
        </TableCell>
        <TableCell className="text-center">{movimiento?.folio}</TableCell>
        <TableCell className="flex justify-center">
          <Switch
            checked={isActive}
            onCheckedChange={(newState) => handleToggleStatus(newState)}
            disabled={!hasClaim(toggleStatusClaim) || isPending}
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
                {hasClaim(updateClaim) && (
                  <Link
                    href={`/configuracion/configuracion-modulos/almacenes/catalogos/conceptos-movimientos-inventario/form?mode=edit&id=${movimiento?.id}`}
                    className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                  >
                    <PencilLine size={18} />
                  </Link>
                )}
                {hasClaim(deleteClaim) && (
                  <Trash2
                    size={18}
                    className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                    onClick={() => setIsOpenModal(true)}
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
      <DeleteItemModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        isLoading={isPending}
        onHandleDelete={handleDelete}
        label="¿Estás seguro que deseas eliminar este Concepto de movimiento al inventario?"
      />
    </>
  );
};

export default MovimientosInventarioTableRow;
