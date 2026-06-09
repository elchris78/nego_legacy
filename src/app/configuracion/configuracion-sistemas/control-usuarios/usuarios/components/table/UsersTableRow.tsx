"use client";

import { useState } from "react";

import { EllipsisIcon, PencilLine, Trash2, UserCog } from "lucide-react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ComicTooltip } from "@/components/ui/LabelTooltip";
import { DeleteUserModal } from "./DeleteUserModal";
import { fetchToggleUserStatus } from "../../services/usersActions";
import { RootState } from "@/lib/store/store";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { transformDate } from "@/lib/utils/dates";

import type { GetCompanyUserResponse } from "../../services/companyUsersTypes";

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

interface Props {
  index: number;
  user: GetCompanyUserResponse;
  getUsers: () => Promise<void>;
  startIndex: number;
  companyName: string;
}

export const UsersTableRow = ({
  user,
  getUsers,
  index,
  startIndex,
  companyName,
}: Props) => {
  const token = Cookies.get("auth-token");
  const id = Cookies.get("idUser") || "";

  const [isActive, setisActive] = useState<boolean>(user?.isActive ?? false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const claims = useSelector((state: RootState) => state.claims.data);
  if (user?.userId === id) {
    return null; // No renderiza la fila si el id coincide
  }

  // Filtrar navegación según los claims
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const handleToggleStatus = async (newState: boolean) => {
    try {
      // Verifica si el usuario tiene el claim necesario
      if (
        !navigator.onLine ||
        (!hasClaim(
          "Configuración.Configuración del sistema.Usuarios.Usuario.ToggleStatus"
        ) &&
          !hasClaim("Configuración.Usuarios.ToggleStatus"))
      ) {
        Swal.fire({
          title: "¡ERROR!",
          text: "Solicita el permiso con tu superior para realizar esta acción.",
          icon: "error",
          confirmButtonText: "Cerrar",
          customClass: customClassesError,
        });
        return; // Salir de la función si no tiene el claim
      }

      setisActive(newState);
      const resp = await fetchToggleUserStatus({ token, id: user?.userId });
      if (resp?.success) {
        Swal.fire({
          title: "¡ÉXITO!",
          text:
            resp.message ||
            "Estado del usuario actualizado correctamente en la empresa seleccionada.",
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: customClassesSuccess,
        });
        await getUsers();
      }
    } catch (error) {
      console.log("🚀 ~ handleToggleStatus ~ error:", error);
      Swal.fire({
        title: "¡ERROR!",
        text: "Ocurrió un error al cambiar el estatus del usuario.",
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: customClassesError,
      });
      setisActive(!newState);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
        <TableCell className="text-center">{user?.userId}</TableCell>
        <TableCell className="font-semibold text-[#3C98CB] text-start underline">
          {user?.fullName.length > 20 ? (
            <ComicTooltip title={user?.fullName} placement="top-start">
              <Link
                className="cursor-pointer hover:underline"
                href={`/configuracion/configuracion-sistemas/control-usuarios/usuarios/formUser?mode=view&id=${user?.userId}`}
              >
                {user?.fullName.slice(0, 20) + "..."}
              </Link>
            </ComicTooltip>
          ) : (
            <Link
              className="cursor-pointer hover:underline"
              href={`/configuracion/configuracion-sistemas/control-usuarios/usuarios/formUser?mode=view&id=${user?.userId}`}
            >
              {user?.fullName &&
                `${user?.fullName.charAt(0).toUpperCase()}${user?.fullName.slice(1)}`}
            </Link>
          )}
        </TableCell>
        <TableCell>{user?.userName}</TableCell>
        <TableCell>{companyName}</TableCell>
       <TableCell>
          {user?.claims?.length >= 1763
            ? "Rol Administrador"
            : Array.isArray(user?.roleTemplateNames) && user.roleTemplateNames.length > 0
              ? user.roleTemplateNames.join(", ")
              : user?.claims?.length > 0
                ? "Permiso personalizado"
                : "Sin permisos"}
        </TableCell>

        <TableCell className="text-center">
          {transformDate(user?.createdAt!)}
        </TableCell>
        <TableCell className="flex justify-center">
          <Switch
            checked={isActive}
            onCheckedChange={(newState) => handleToggleStatus(newState)}
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
                {(hasClaim(
                  "Configuración.Configuración del sistema.Usuarios.Usuario.Actualizar"
                ) ||
                  hasClaim("Configuración.Usuarios.Actualizar")) &&
                  user.userType !== "Externo" && (
                    <Link
                      href={`/configuracion/configuracion-sistemas/control-usuarios/usuarios/formUser?mode=edit&id=${user?.userId}`}
                      className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                    >
                      <PencilLine size={18} />
                    </Link>
                  )}
                <Link
                  href={`/configuracion/configuracion-sistemas/control-usuarios/usuarios/formPermissions?mode=editw&id=${user?.userId}`}
                  className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                >
                  <UserCog size={18} />
                </Link>
                {(hasClaim(
                  "Configuración.Configuración del sistema.Usuarios.Usuario.Eliminar"
                ) ||
                  hasClaim("Configuración.Usuarios.Eliminar")) &&
                  user?.userType === "Interno" && (
                    <Trash2
                      size={18}
                      className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                      onClick={() => setIsDeleteModalOpen(true)}
                    />
                  )}
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>

      {/* Delete modal */}
      {isDeleteModalOpen && (
        <DeleteUserModal
          isOpenModal={isDeleteModalOpen}
          onCloseModal={() => setIsDeleteModalOpen(false)}
          id={user?.userId}
          getUsers={getUsers}
        />
      )}
    </>
  );
};
