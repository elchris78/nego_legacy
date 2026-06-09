"use client";

import { useEffect, useState } from "react";

import Cookies from "js-cookie";

import { disconnectUsers } from "@/lib/services/userActivity/disconnect";
import { getUser } from "@/app/admin/usuarios/services/usersActions";
import { StatusConnection } from "./StatusConnection";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { transformDate } from "@/lib/utils/dates";
import Loading from "@/components/ui/Modals/loading";
import ModalView from "./ModalView";

import type { UserActivityHistoryDto } from "@/lib/services/userActivity/userActivityTypes";

interface Props {
  index: number;
  user: UserActivityHistoryDto;
  startIndex: number;
  getUsuariosSistema: () => Promise<void>;
}

function formatActiveTime(activeTime: number) {
  const hours = Math.floor(activeTime); // Parte entera = horas
  const decimalPart = activeTime - hours; // Parte decimal

  const totalMinutes = decimalPart * 60; // Convertir a minutos
  const minutes = Math.floor(totalMinutes); // Parte entera = minutos
  const seconds = Math.round((totalMinutes - minutes) * 60); // Parte decimal de minutos a segundos

  return `${hours}h ${minutes}m ${seconds}s`;
}

export const UsuariosSistemaTableRow = ({
  index,
  user,
  startIndex,
  getUsuariosSistema,
}: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loader, setLoader] = useState(false);
  // Determinar si el switch debe estar activo basado en el estado de conexión
  const [isSwitchChecked, setIsSwitchChecked] = useState(
    user.connectionStatus === "Activo" || user.connectionStatus === "Ausente"
  );

  useEffect(() => {
    if (user.connectionStatus === "No disponible") {
      setIsSwitchChecked(false);
    } else {
      setIsSwitchChecked(
        user.connectionStatus === "Activo" ||
          user.connectionStatus === "Ausente"
      );
    }
  }, [user.connectionStatus]);

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

  const handleSwitchChange = async (checked: boolean) => {
    setLoader(true);
    setIsSwitchChecked(checked); // Cambiamos el estado del switch

    if (!checked) {
      // Si el switch se apaga, ejecutamos la función de desconectar
      try {
        await disconnectUsers({ userId: user.userId });
        console.log("Usuario desconectado");
        getUsuariosSistema();
        setLoader(false);
      } catch (error) {
        setLoader(false);
        console.error("Error al desconectar usuario:", error);
      }
    }
  };

  return (
    <>
      {loader && <Loading />}
      <TableRow>
        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
        <TableCell className="text-center">{user.userId}</TableCell>
        <TableCell
          className="text-[#3C98CB] underline text-start cursor-pointer"
          onClick={handleUserClick}
        >
          {user.fullName}
        </TableCell>
        <TableCell className="text-start">{user.userName}</TableCell>
        <TableCell className="text-start">{user.email}</TableCell>
        <TableCell className="text-center">
          <StatusConnection status={user.connectionStatus} />
        </TableCell>
        <TableCell className="text-center">
          {transformDate(user.lastCheckIn, "dd/MM/yyyy HH:mm:ss")}
        </TableCell>
        <TableCell className="text-center">
          {transformDate(user.lastCheckOut, "dd/MM/yyyy HH:mm:ss")}
        </TableCell>
        <TableCell className="text-start">{user.lastCheckOutReason}</TableCell>
        <TableCell className="text-center">
          {formatActiveTime(user.inactivityTime)}
        </TableCell>
        <TableCell className="text-center">
          {formatActiveTime(user.activeTime)}
        </TableCell>
        <TableCell className="text-center">
          <Switch
            checked={isSwitchChecked}
            onCheckedChange={handleSwitchChange} // Usamos el manejador de cambios
            className="data-[state=checked]:bg-[#3C98CB]"
            disabled={user.connectionStatus === "No disponible"} // Deshabilitar cuando el usuario está inactivo
          />
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
