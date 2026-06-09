import { useState } from "react";

import { EllipsisIcon, PencilLine, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DeleteDepartamentoModal } from "./DeleteDepartamentoModal";
import { getUser } from "@/app/admin/usuarios/services/usersActions";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  deleteDepartment,
  toggleDepartmentStatus,
} from "@/lib/services/departments/departmentsSlice";
import { Tooltip } from "@mui/material";
import { transformDate } from "@/lib/utils/dates";
import { useDispatch, useSelector } from "react-redux";
import ModalView from "@/app/configuracion/configuracion-modulos/ventas/catalogos/vendedores/components/table/ModalView";

import { AppDispatch, RootState } from "@/lib/store/store";
import { DepartmentDto } from "@/lib/services/departments/departmentsTypes";
import { getColaboradorById } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresActions";
import showAlert from "@/lib/utils/alerts";
import DeleteItemModal from "@/components/ui/Tables/DeleteItemModal";

const deleteClaim =
  "Configuración.Configuración empresa.Información de la empresa.Departamentos.Eliminar";
const updateClaim =
  "Configuración.Configuración empresa.Información de la empresa.Departamentos.Actualizar";
const toggleStatusClaims =
  "Configuración.Configuración empresa.Información de la empresa.Departamentos.ToggleStatus";
const readClaim =
  "Configuración.Configuración empresa.Información de la empresa.Departamentos.Leer";

interface Props {
  index: number;
  departamento: DepartmentDto;
  getDepartamentos: () => void;
  startIndex: number;
}

export const DepartamentoTableRow = ({
  index,
  departamento,
  getDepartamentos,
  startIndex,
}: Props) => {
  const token = Cookies.get("auth-token") || "";
  const dispatch: AppDispatch = useDispatch();

  const [isActive, setisActive] = useState<boolean>(
    departamento?.status ?? false
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedColaborador, setSelectedColaborador] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  // Filtrar navegación según los claims
  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };
  const isPending = useSelector(
    (state: RootState) => state.departments.pending
  );

  const handleToggleStatus = async (newState: boolean) => {
    if (
      !navigator.onLine ||
      (!hasClaim(toggleStatusClaims) &&
        !hasClaim("Configuración.Departamentos.ToggleStatus"))
    ) {
      showAlert({
        success: false,
        message: "No tienes permiso para cambiar el estado del departamento.",
      });

      return;
    }
    try {
      setisActive(newState);
      const response = await dispatch(
        toggleDepartmentStatus({
          token,
          request: { departmentId: departamento.id, isActive: newState },
        })
      ).unwrap();
      if (response.success) {
        showAlert({
          success: true,
          message: response.message || "Estado del departamento actualizado.",
        });

        await getDepartamentos();
      } else {
        showAlert({
          success: false,
          message: response.message || "mal",
        });
      }
    } catch (error: any) {
      showAlert({
        success: false,
        message:
          error?.message || "Error al actualizar el estado del departamento.",
      });
    }
  };

  const handleGetColaborador = async () => {
    try {
      const token = Cookies.get("auth-token"); // Asegúrate de manejar bien el token
      if (!token) throw new Error("Token no disponible");

      const userData = await getColaboradorById({
        token,
        id: departamento?.responsibleId ?? "",
      });
      setSelectedColaborador(userData);
      setIsOpenModal(true);
    } catch (error: any) {
      console.error("Error al obtener colaborador:", error);
      showAlert({
        success: false,
        message: error?.message || "Error al obtener el colaborador.",
      });
    }
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const getDepartmentLink = (id: string) => {
    if (hasClaim(readClaim) || hasClaim("Configuración.Departamentos.Leer")) {
      return `/configuracion/configuracion-sistemas/catalogos-generales/departamentos-empresa/form?mode=view&id=${id}`;
    }
    return "/configuracion/configuracion-sistemas/catalogos-generales/departamentos-empresa"; // Evita devolver `undefined`
  };

  const handleNoPermission = (e: React.MouseEvent) => {
    if (!hasClaim(readClaim) && !hasClaim("Configuración.Departamentos.Leer")) {
      e.preventDefault(); // Evita la navegación si no tiene permisos
      Swal.fire({
        title: "¡Error!",
        text: "No cuentas con los permisos necesarios para acceder a este recurso.",
        icon: "error",
        confirmButtonText: "Cerrar",
        customClass: {
          container: "swal2-container",
          popup: "swal-popup-error",
          confirmButton: "swal-confirm-button",
          title: "swal-title",
        },
      });
    }
  };

  const handleDeleteDepartamento = async () => {
    try {
      const response = await dispatch(
        deleteDepartment({ token, request: { departmentId: departamento.id } })
      ).unwrap();

      if (response.success) {
        showAlert({
          success: true,
          message:
            response.message ||
            "Se ha eliminado el departamento de forma exitosa",
        });

        getDepartamentos();

        setDeleteModal(false);
      }
    } catch (error: any) {
      console.error("🚀 ~ handleDeleteDepartamento ~ error:", error);

      showAlert({
        success: false,
        message: error.message || "Error al eliminar el departamento",
      });
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
        <TableCell className="text-center">{departamento?.id}</TableCell>
        <TableCell className="font-semibold text-[#3C98CB] underline">
          {departamento?.name.length > 20 ? (
            <Tooltip title={departamento?.name} arrow>
              <Link
                className="cursor-pointer hover:underline"
                href={getDepartmentLink(departamento?.id)}
                onClick={handleNoPermission}
              >
                {departamento?.name.slice(0, 20)}...
              </Link>
            </Tooltip>
          ) : (
            <Link
              className="cursor-pointer hover:underline"
              href={getDepartmentLink(departamento?.id)}
              onClick={handleNoPermission}
            >
              {departamento?.name}
            </Link>
          )}
        </TableCell>
        <TableCell>{departamento?.area}</TableCell>
        <TableCell
          className="font-semibold text-[#3C98CB] underline cursor-pointer"
          onClick={handleGetColaborador}
        >
          {departamento?.responsible &&
            `${departamento.responsible.charAt(0).toUpperCase()}${departamento.responsible.slice(1)}`}
        </TableCell>
        <TableCell className="text-center">
          {transformDate(departamento?.creationDate)}
        </TableCell>
        <TableCell className="flex items-center justify-center">
          <Switch
            checked={isActive}
            onCheckedChange={(newState) => handleToggleStatus(newState)}
            className="data-[state=checked]:bg-[#3C98CB]"
            disabled={isPending || !hasClaim(toggleStatusClaims)}
          />
        </TableCell>
        <TableCell>
          {/* Menú de opciones */}
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
                  "Configuración.Configuración empresa.Información de la empresa.Departamentos.Actualizar"
                ) ||
                  hasClaim("Configuración.Departamentos.Actualizar")) && (
                  <Link
                    href={`/configuracion/configuracion-sistemas/catalogos-generales/departamentos-empresa/form?mode=edit&id=${departamento?.id}`}
                    className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                  >
                    <PencilLine size={18} />
                  </Link>
                )}
                {(hasClaim(
                  "Configuración.Configuración empresa.Información de la empresa.Departamentos.Eliminar"
                ) ||
                  hasClaim("Configuración.Departamentos.Eliminar")) && (
                  <Trash2
                    size={18}
                    className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                    onClick={() => setDeleteModal(true)}
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

      {/* Datos del responsable */}
      <ModalView
        title="Datos Colaborador"
        selectedUser={selectedColaborador}
        isOpenModal={isOpenModal}
        onCloseModal={handleCloseModal}
      />

      {/* Delete modal */}
      <DeleteItemModal
        isOpenModal={deleteModal}
        onCloseModal={() => setDeleteModal(false)}
        onHandleDelete={handleDeleteDepartamento}
        isLoading={isPending}
        label="¿Estás seguro que deseas eliminar este departamento de forma definitiva?"
      />
    </>
  );
};
