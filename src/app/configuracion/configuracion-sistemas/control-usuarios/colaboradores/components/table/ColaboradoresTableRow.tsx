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
import { AppDispatch, RootState } from "@/lib/store/store";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteItemModal from "@/components/ui/Tables/DeleteItemModal";
import ModalView from "./ModalView";

import { colaboradoresActions } from "../../services/colaboradoresSlice";
import { getUsersById } from "../../services/colaboradoresActions";
import showAlert from "@/lib/utils/alerts";
import type { Colaborador } from "../../services/colaboradoresTypes";

const updateClaim =
  "Configuración.Configuración del sistema.Usuarios.Colaboradores.Actualizar";
const deleteClaim =
  "Configuración.Configuración del sistema.Usuarios.Colaboradores.Eliminar";
const toggleStatusClaims =
  "Configuración.Configuración del sistema.Usuarios.Colaboradores.ToggleStatus";

interface Props {
  index: number;
  startIndex: number;
  colaborador: Colaborador;
  getData: () => Promise<void>;
}

const ColaboradoresTableRow = ({
  colaborador,
  startIndex,
  index,
  getData,
}: Props) => {
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();

  const [isActive, setisActive] = useState<boolean>(
    colaborador?.estatus ?? false
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isModalUserOpen, setModalUserOpen] = useState(false);
  const [userSelected, setUserSelected] = useState<any>(null);

  const isPending = useSelector(
    (state: RootState) => state.colaboradores.isPending
  );

  // Check if the user has the necessary claims
  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  useEffect(() => {
    setisActive(colaborador?.estatus);
  }, [colaborador?.estatus]);

  // Function to handle the toggle of collaborator status
  const handleToggleStatus = async (newState: boolean) => {
    try {
      const resultAction = await dispatch(
        colaboradoresActions.toggleColaboradorStatus({
          token,
          id: colaborador?.id,
        })
      );
      if (
        colaboradoresActions.toggleColaboradorStatus.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }
      setisActive(newState);

      // Show success message
      showAlert({
        success: true,
        message: resultAction.payload.message,
      });
    } catch (error: any) {
      console.log("🚀 ~ handleToggleStatus ~ error:", error);
      setisActive(!newState);

      // Show error message
      showAlert({
        success: false,
        message: error.message || "Error al cambiar el estado del colaborador",
      });
    }
  };

  // Function to handle the deletion of a collaborator
  const handleDeleteItem = async () => {
    try {
      const resultAction = await dispatch(
        colaboradoresActions.deleteColaborador({ token, id: colaborador?.id })
      );
      if (colaboradoresActions.deleteColaborador.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      // Show success message
      showAlert({
        success: true,
        message: resultAction.payload.message,
      });

      setIsOpenModal(false);
      await getData(); // Refresh the data after deletion
    } catch (error: any) {
      console.log("🚀 ~ handleDeleteItem ~ error:", error);

      showAlert({
        success: false,
        message:
          error.message ||
          "Error al eliminar el colaborador, inténtalo más tarde",
      });
    }
  };

  const handleGetUser = async () => {
    try {
      const token = Cookies.get("auth-token"); // Asegúrate de manejar bien el token
      if (!token) return;

      const userData = await getUsersById({
        token,
        userId: colaborador?.usuarioSistemaId ?? "",
      });
      setUserSelected(userData);
      setModalUserOpen(true);
    } catch (error: any) {
      console.error("Error al obtener colaborador:", error);
      showAlert({
        success: false,
        message: error?.message || "Error al obtener el colaborador.",
      });
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
        <TableCell className="text-center">
          <Link
            href={`/configuracion/configuracion-sistemas/control-usuarios/colaboradores/form?mode=view&id=${colaborador?.id}`}
            className="cursor-pointer text-[#3C98CB] hover:underline"
          >
            {colaborador?.id}
          </Link>
        </TableCell>
        <TableCell className="text-center capitalize">
          {colaborador?.tipoColaborador}
        </TableCell>
        <TableCell className="text-center">
          {colaborador?.tieneUsuarioSistema &&
          colaborador?.usuarioSistemaId &&
          colaborador?.usuarioSistemaNombre ? (
            <span
              className="text-[#3C98CB] cursor-pointer hover:underline"
              onClick={handleGetUser}
            >
              {colaborador?.usuarioSistemaNombre}
            </span>
          ) : (
            <span>{colaborador?.nombreCompleto}</span>
          )}
        </TableCell>
        <TableCell className="text-center">{colaborador?.telefono}</TableCell>
        <TableCell className="text-center text-[#3C98CB]">
          {colaborador?.correoElectronico}
        </TableCell>
        <TableCell className="text-center">{colaborador?.curp}</TableCell>
        <TableCell className="text-center">
          {colaborador?.departamento}
        </TableCell>
        <TableCell className="text-center">{colaborador?.puesto}</TableCell>
        <TableCell className="flex justify-center">
          <Switch
            checked={isActive}
            onCheckedChange={(newState) => handleToggleStatus(newState)}
            disabled={!hasClaim(toggleStatusClaims) || isPending}
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
                    href={`/configuracion/configuracion-sistemas/control-usuarios/colaboradores/form?mode=edit&id=${colaborador?.id}`}
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
        onHandleDelete={handleDeleteItem}
        isLoading={isPending}
        label="¿Estás seguro que deseas eliminar este colaborador?"
      />

      {/* Modal to view user details */}
      {isModalUserOpen && (
        <ModalView
          title="Datos Usuario"
          selectedUser={userSelected}
          isOpenModal={isModalUserOpen}
          onCloseModal={() => setModalUserOpen(false)}
        />
      )}
    </>
  );
};

export default ColaboradoresTableRow;
