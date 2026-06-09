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
import DeleteSellersModal from "./DeleteSellersModal";
import { sellersActions } from "../../services/sellersSlice";

import { AppDispatch, RootState } from "@/lib/store/store";
import type { Sellers } from "../../services/sellersTypes";
import AlertStatusSellerModal from "./AlertStatusSellerModal";
import ModalView from "./ModalView";
import { getColaboradorById } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresActions";
import { GetColaboradorResponse } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresTypes";

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
  "Configuración.Configuración de módulos.Ventas.Catálogos.Vendedores.ToggleStatus";
const deleteClaim =
  "Configuración.Configuración de módulos.Ventas.Catálogos.Vendedores.Eliminar";
const updateClaim =
  "Configuración.Configuración de módulos.Ventas.Catálogos.Vendedores.Actualizar";

interface Props {
  index: number;
  startIndex: number;
  sellers: Sellers;
} 

const SellersTypesTableRow = ({ index, startIndex, sellers }: Props) => {
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState<GetColaboradorResponse | null>(null);
  const [isActive, setisActive] = useState<boolean>(
    sellers?.estatus ?? false
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);

  useEffect(() => {
    setisActive(sellers?.estatus);
  }, [sellers?.estatus]);

  const handleToggleStatus = async (newState: boolean) => {
    try {
      const resultAction = await dispatch(
        sellersActions.toggleSellersStatus({
          token,
          id: sellers?.id,
        })
      );
      if (
        sellersActions.toggleSellersStatus.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }

      setisActive(newState);

      // Show success message
      Swal.fire({
        title: "¡Éxito!",
        text: resultAction.payload.message,
        icon: "success",
        customClass: customClassesSuccess,
      });
    } catch (error: any) {
      console.error("Error al cambiar el estatus", error);
      setisActive(!newState); // Revertir el estado en caso de error

      // Show error message
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
    setIsOpenModalDelete(true);
  };

  const claims = useSelector((state: RootState) => state.claims.data);

  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const handleUserClick = async () => {
    try {
      const token = Cookies.get("auth-token"); 
      if (!token) throw new Error("Token no disponible");  
      const userData = await getColaboradorById({ token, id: sellers.colaboradorId});
      setSelectedUser(userData);
      setIsOpenModal(true);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    }
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  return (
    <>
      <TableRow>
        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
        <TableCell className="text-center text-[#3C98CB]">
          <Link
            className="cursor-pointer hover:underline"
            href={`/configuracion/configuracion-modulos/ventas/catalogos/vendedores/form?mode=view&id=${sellers?.id}`}
          >
            {sellers?.id}
          </Link>
        </TableCell>
        <TableCell className="text-center">
            {sellers?.tipoVendedor}
        </TableCell>
        <TableCell className="text-center text-[#3C98CB]">
          <Link
            className="cursor-pointer hover:underline"
            onClick={handleUserClick}
            href={"#"}
          >
            {sellers.colaboradorNombre}
          </Link>
        </TableCell>
        <TableCell className="text-center">
          {sellers.colaboradorCorreo}
        </TableCell>
        <TableCell className="text-center">
          {sellers.colaboradorTelefono}
        </TableCell>
        <TableCell className="text-center">
          {sellers.supervisor}
        </TableCell>
        <TableCell className="text-center">
          {sellers.zona}
        </TableCell>
        <TableCell className="text-center">
          {sellers.subzona}
        </TableCell>
        <TableCell className="text-center">
          {sellers.tipoComision}
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
                    href={`/configuracion/configuracion-modulos/ventas/catalogos/vendedores/form?mode=edit&id=${sellers?.id}`}
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
      <DeleteSellersModal
        isOpenModal={isOpenModalDelete}
        onCloseModal={() => setIsOpenModalDelete(false)}
        id={sellers?.id}
      />

      <ModalView
        selectedUser={selectedUser}
        isOpenModal={isOpenModal}
        onCloseModal={handleCloseModal}
        title="Datos colaborador"
      />
    </>
  );
};

export default SellersTypesTableRow;
