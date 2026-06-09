import { useEffect, useState } from "react";

import { EllipsisIcon, PencilLine, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteTransaccionesDXCModal from "./DeleteTransaccionesDXCModal";
import { transaccionesDXCActions } from "../../services/transaccionesDXCSlice";

import { AppDispatch, RootState } from "@/lib/store/store";
import type { TransaccionesDXC } from "../../services/transaccionesDXCTypes";
import AlertStatusSellerModal from "./AlertStatusSellerModal";
import ModalView from "./ModalView";

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
  "Configuración.Configuración de módulos.Finanzas.Catálogos.Conceptos transacciones CXC.ToggleStatus";
const deleteClaim =
  "Configuración.Configuración de módulos.Finanzas.Catálogos.Conceptos transacciones CXC.Eliminar";
const updateClaim =
  "Configuración.Configuración de módulos.Finanzas.Catálogos.Conceptos transacciones CXC.Actualizar";

interface Props {
  index: number;
  startIndex: number;
  transaccionesDXC: TransaccionesDXC;
} 

const TransaccionesDXCTableRow = ({ index, startIndex, transaccionesDXC }: Props) => {
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();
  const [isAlertStatus, setIsAlertStatus] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null)
  const [selectedUser, setSelectedUser] = useState(null);
  const [isActive, setisActive] = useState<boolean>(
    transaccionesDXC?.estatus ?? false
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  useEffect(() => {
    setisActive(transaccionesDXC?.estatus);
  }, [transaccionesDXC?.estatus]);

  const handleToggleStatus = async (newState: boolean) => {
  try {
    const resultAction = await dispatch(
      transaccionesDXCActions.toggleTransaccionesDXCStatus({
        token,
        id: transaccionesDXC?.id,
      })
    );

    if (
      transaccionesDXCActions.toggleTransaccionesDXCStatus.rejected.match(resultAction)
    ) {
      throw resultAction.payload;
    }

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



  const handleReturnConcept = () => {
    setIsOpenModal(true);
  };

  const claims = useSelector((state: RootState) => state.claims.data);

  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };
  const handleAlertClose = () => {
    setIsAlertStatus(false);
  };

  
  return (
    <>
      <TableRow>
        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
        <TableCell className="text-center">
            {transaccionesDXC?.id}
        </TableCell>
        <TableCell className="text-center">
          {transaccionesDXC.origen}
        </TableCell>
        <TableCell className="text-center  text-[#3C98CB]">
          <Link
            className="cursor-pointer hover:underline"
            href={`/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxc/form?mode=view&id=${transaccionesDXC?.id}`}
          >
          {transaccionesDXC.conceptoTransaccion}
          </Link>
        </TableCell>
        <TableCell className="text-center">
          {transaccionesDXC.contrapartidaNombre || "Sin Contrapartida"}
        </TableCell>
        <TableCell className="text-center">
          {transaccionesDXC.tipoTransaccion}
        </TableCell>
        <TableCell className="text-center">
          {transaccionesDXC.tipoRelacionSatNombre}
        </TableCell>
        <TableCell className="text-center">
          {transaccionesDXC.formaPagoNombre}
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
                {hasClaim(updateClaim) && (
                  <Link
                    href={`/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxc/form?mode=edit&id=${transaccionesDXC?.id}`}
                    className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                  >
                    <PencilLine size={18} />
                  </Link>
                )}
                {hasClaim(deleteClaim) && (
                  <Trash2
                    size={18}
                    className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                    onClick={handleReturnConcept}
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
      <DeleteTransaccionesDXCModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        id={transaccionesDXC?.id}
      />
      
    </>
  );
};

export default TransaccionesDXCTableRow;
