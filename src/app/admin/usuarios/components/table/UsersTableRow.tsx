"use client";

import { useState } from "react";

import { EllipsisIcon, PencilLine, Trash2, UserCog } from "lucide-react";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchToggleUserStatus } from "../../services/usersActions";
import { ComicTooltip } from "@/components/ui/LabelTooltip";
import { DeleteUserModal } from "./DeleteUserModal";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";

import { GetAdminUserResponse } from "../../services/adminUsersTypes";

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
  user: GetAdminUserResponse;
  getUsers: () => Promise<void>;
  startIndex: number;
}

const transformDate = (date?: string) => {
  if (date) {
    const newDate = new Date(date);
    return format(newDate, "dd/MM/yyyy", {
      locale: es,
    });
  }
};

export const UsersTableRow = ({ user, getUsers, index, startIndex }: Props) => {
  const token = Cookies.get("auth-token");
  const userId = Cookies.get("idAdmin") || "";

  const [isActive, setisActive] = useState<boolean>(user?.isActive ?? false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (user?.id === userId) {
    return null; // No renderiza la fila si el id coincide
  }

  const companyNames: string = user?.companies
    .map((company: any) => company.name)
    .join(", ");

  const templatecompanyNames: string =
    user?.companies
      ?.map((company: any) => {
        const hasRoleTemplateNames =
          Array.isArray(company.roleTemplateNames) &&
          company.roleTemplateNames.length > 0;
        const hasIndividualClaims =
          Array.isArray(company.individualClaims) &&
          company.individualClaims.length > 0;

        if (hasIndividualClaims && company.individualClaims.length >= 1763) {
          return "Rol Administrador";
        }

        if (hasRoleTemplateNames) {
          return company.roleTemplateNames.join(", ");
        }

        if (hasIndividualClaims) {
          return "Perfil Personalizado";
        }

        return "No cuenta con permisos";
      })
      .join(" / ") || "No cuenta con permisos";

  const isCurrentUser = user?.id === userId;

  const handleToggleStatus = async (newState: boolean) => {
    try {
      setisActive(newState);
      const resp = await fetchToggleUserStatus({ token, id: user?.id });
      if (resp?.success) {
        Swal.fire({
          title: "¡ÉXITO!",
          text: resp?.message ?? "Se ha editado el usuario de forma exitosa.",
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: customClassesSuccess,
        });
        await getUsers();
      }
    } catch (error: any) {
      Swal.fire({
        title: "¡ERROR!",
        text:
          error?.message ??
          "Ocurrió un error al cambiar el estatus del usuario.",
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
        <TableCell className="text-center">{user?.id}</TableCell>
        <TableCell className="font-semibold text-[#3C98CB] text-start underline">
          {user?.fullName?.length > 20 ? (
            <ComicTooltip title={user.fullName} placement="top-start">
              <Link
                className="cursor-pointer hover:underline"
                href={`/admin/usuarios/form?mode=view&id=${user?.id}`}
              >
                {user.fullName.slice(0, 20) + "..."}
              </Link>
            </ComicTooltip>
          ) : (
            <Link
              className="cursor-pointer hover:underline"
              href={`/admin/usuarios/form?mode=view&id=${user?.id}`}
            >
              {user?.fullName
                ? `${user.fullName.charAt(0).toUpperCase()}${user.fullName.slice(1)}`
                : "Sin nombre"}
            </Link>
          )}

        </TableCell>
        <TableCell>{user?.userName}</TableCell>
        <TableCell>{companyNames}</TableCell>
        <TableCell className="text-center">{templatecompanyNames}</TableCell>
        <TableCell className="text-center">
          {transformDate(user?.createdAt)}
        </TableCell>
        <TableCell className="flex justify-center">
          <Switch
            checked={isActive}
            disabled={isCurrentUser} // Deshabilita el switch si es el usuario actual
            onCheckedChange={(newState) =>
              !isCurrentUser && handleToggleStatus(newState)
            }
            className={`data-[state=checked]:bg-[#3C98CB] ${
              isCurrentUser ? "opacity-50 cursor-not-allowed" : ""
            }`}
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
                <Link
                  href={`/admin/usuarios/form?mode=edit&id=${user?.id}`}
                  className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                >
                  <PencilLine size={18} />
                </Link>
                <Link
                  href={`/admin/usuarios/formPermissions?mode=editw&id=${user?.id}`}
                  className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                >
                  <UserCog size={18} />
                </Link>
                <Trash2
                  size={18}
                  className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                  onClick={() => setIsDeleteModalOpen(true)}
                />
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>

      {/* Delete modal */}
      <DeleteUserModal
        isOpenModal={isDeleteModalOpen}
        onCloseModal={() => setIsDeleteModalOpen(false)}
        id={user?.id}
        getUsers={getUsers}
      />
    </>
  );
};
