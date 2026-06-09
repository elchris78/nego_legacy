"use client";

import { useState } from "react";

import Cookies from "js-cookie";
import Link from "next/link";

import { getUser } from "@/app/admin/usuarios/services/usersActions";
import { TableCell, TableRow } from "@/components/ui/table";
import { transformDate, transformToTime } from "@/lib/utils/dates";
import ModalView from "../../usuarios-sistema/components/table/ModalView";

interface Props {
  index: number;
  user: any;
  startIndex: number;
}

export const BitacoraEmpresaTableRow = ({ user, index, startIndex }: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = async () => {
    try {
      const token = Cookies.get("auth-token"); // Asegúrate de manejar bien el token
      if (!token) throw new Error("Token no disponible");

      const userData = await getUser({ token, id: user.userId });
      setSelectedUser(userData);
      setIsOpenModal(true);
      console.log("Usuario obtenido:", userData);
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
        <TableCell className="text-center">{user?.folio}</TableCell>
        <TableCell
          className="text-start font-semibold underline text-[#3C98CB] cursor-pointer"
          onClick={handleUserClick}
        >
          <Link className="cursor-pointer" href={"#"}>
            {user.userName}
          </Link>
        </TableCell>
        <TableCell className="text-start">{user?.module}</TableCell>
        <TableCell className="text-start">{user?.subModule}</TableCell>
        <TableCell className="text-start">{user?.activity}</TableCell>
        <TableCell className="text-center underline">
          {user?.idDocumento}
        </TableCell>
        <TableCell className="text-start">
          {user?.deviceType && <>{user.deviceType} </>}
          {user?.ipAddress && <>{user.ipAddress}</>}
        </TableCell>
        <TableCell className="text-center">
          {transformDate(user?.date)}
        </TableCell>
        <TableCell className="text-center">
          {transformToTime(user?.date)}
        </TableCell>
      </TableRow>
      <ModalView
        selectedUser={selectedUser}
        isOpenModal={isOpenModal}
        onCloseModal={handleCloseModal}
      />
    </>
  );
};
