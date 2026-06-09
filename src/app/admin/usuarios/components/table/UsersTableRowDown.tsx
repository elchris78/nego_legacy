"use client";

import { DeleteUserModal } from "./DeleteUserModal";
import { Ellipsis, PencilLine, Trash2, UserCog } from "lucide-react";
import { es } from "date-fns/locale";
import {
  fetchDeleteUser,
  fetchToggleUserStatus,
} from "../../services/usersActions";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import { ToastErrorMsg } from "@/components/ui/Toast/ToastErrorMsg";
import { ToastSuccessMsg } from "@/components/ui/Toast/ToastSuccessMsg";
import { Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";
import alerta from "@/Asset/alerta 1.png";
interface Props {
  index: number;
  user: any;
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

export const UsersTableRowDown = ({ user, getUsers, index, startIndex }: Props) => {
  const token = Cookies.get("auth-token");
  const [isActive, setisActive] = useState<boolean>(user?.isActive ?? false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const userId = Cookies.get("idAdmin") || "";

  const menuRef = useRef<HTMLDivElement>(null);
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  if (user?.userId === userId) { 
    return null; // No renderiza la fila si el id coincide
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsActionsVisible(false); // Cierra el menú si el clic es fuera
      }
    };

    // Escucha el clic en el documento
    document.addEventListener("mousedown", handleClickOutside);

    // Limpia el evento al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const companyNames: string = user?.companies
  .map((company: any) => company.name)
  .join(", ");

  const templatecompanyNames: string =
  user?.companies
  ?.map((company: any) => {
    const hasRoleTemplateNames = Array.isArray(company.roleTemplateNames) && company.roleTemplateNames.length > 0;
    const hasIndividualClaims = Array.isArray(company.individualClaims) && company.individualClaims.length > 0;

    if (hasIndividualClaims && company.individualClaims.length > 1628) {
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

  

  return (
    <>
      <TableRow>
        <TableCell className="border-r border-[#EDEDED] text-center">
          {startIndex + index + 1}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-center">
          {user?.id}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] font-semibold text-[#3C98CB] text-start underline">
          {user?.fullName.length > 20 ? (
            <Tooltip title={user?.fullName} arrow>
              <Link
                className="cursor-pointer hover:underline"
                href={`/configuracion/configuracion-sistemas/control-usuarios/usuarios/forms?mode=view&id=${user?.userId}`}
              >
                {user?.fullName.slice(0, 20) + "..."}
              </Link>
            </Tooltip>
          ) : (
            <Link
              className="cursor-pointer hover:underline"
              href={`/configuracion/configuracion-sistemas/control-usuarios/usuarios/forms?mode=view&id=${user?.userId}`}
            >
              {user?.fullName}
            </Link>
          )}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED]">
          {user?.userName}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED]">
          {companyNames}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-center">
          {templatecompanyNames}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-center">
          {transformDate(user?.createdAt)}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] flex justify-center">
          <Switch
            checked={isActive}
            className={`data-[state=checked]:bg-[#3C98CB] ${
              isCurrentUser ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isCurrentUser} // Deshabilita el switch si es el usuario actual
          />
        </TableCell>
      </TableRow>
    </>
  );
};
