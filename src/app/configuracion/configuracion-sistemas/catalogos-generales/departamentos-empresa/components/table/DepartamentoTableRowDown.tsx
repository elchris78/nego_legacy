import { Ellipsis } from "lucide-react";

import { AppDispatch, RootState } from "@/lib/store/store";
import { DeleteDepartamentoModal } from "./DeleteDepartamentoModal";
import { Edit, Eye, Trash2 } from "lucide-react";
import { es } from "date-fns/locale";
import { fetchClaims } from "@/lib/services/claims/claimsSlices";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { deleteDepartment, toggleDepartmentStatus } from "@/lib/services/departments/departmentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";
import success from '@/Asset/successN.png';
import errorn from '@/Asset/error.png';
import alerta from '@/Asset/alerta 1.png';

interface Props {
  index: number;
  departamento: any;
  getDepartamentos: () => void;
  startIndex: number;
}

const transformDate = (date?: string) => {
  if (date) {
    const newDate = new Date(date);
    return format(newDate, "d MMMM yyyy", {
      locale: es,
    });
  }
};

export const DepartamentoTableRowDown = ({
  index,
  departamento,
  getDepartamentos,
  startIndex,
}: Props) => {
  const token = Cookies.get("auth-token") || "";
  const router = useRouter();
  const [isActive, setisActive] = useState<boolean>(
    departamento?.status ?? false
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isActionsVisible, setIsActionsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claims.data);

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

  // Obtener claims del usuario al cargar el componente
  useEffect(() => {
    const token = Cookies.get("auth-token") || "";
    dispatch(fetchClaims(token));
  }, [dispatch]);

  // Filtrar navegación según los claims
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const handleToggleStatus = async (newState: boolean) => {
    if (!hasClaim("Configuración.Configuración empresa.Información de la empresa.Departamentos.ToggleStatus")) {
      Swal.fire({
        title: '¡Error!',
        text: 'No tienes permiso para cambiar el estado del departamento.', 
        icon: 'error',
        confirmButtonText: 'Volver a intentar',
        customClass: {
          container:'swal2-container',
          popup: 'swal-popup-error', 
          confirmButton: 'swal-confirm-button', 
          title: 'swal-title', 
        },
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
        Swal.fire({
          title: '¡Éxito!',
          text: response.message || "bien", 
          icon: 'success',
          confirmButtonText: 'Cerrar',
          customClass: {
            container:'swal2-container',
            popup: 'swal-popup-succes', 
            confirmButton: 'swal-confirm-button', 
            title: 'swal-title', 
          }
        });
        await getDepartamentos();
      } else {
        Swal.fire({
          title: '¡Error!',
          text: response.message || "mal", 
          icon: 'error',
          confirmButtonText: 'Volver a intentar',
          customClass: {
            container:'swal2-container',
            popup: 'swal-popup-error', 
            confirmButton: 'swal-confirm-button', 
            title: 'swal-title', 
          },
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: '¡Error!',
        text: error.message || "Error al cambiar el estado del departamento.", 
        icon: 'error',
        confirmButtonText: 'Volver a intentar',
        customClass: {
          container:'swal2-container',
          popup: 'swal-popup-error', 
          confirmButton: 'swal-confirm-button', 
          title: 'swal-title', 
        },
      });
      
    }
  };

  const handleDeleteDepartamento = async () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn-success",
        cancelButton: "btn-danger",
        container: 'swal2-container',
        popup: 'swal-popup-error',
        title: 'swal-title',
      },
      buttonsStyling: false
    });
  
    swalWithBootstrapButtons.fire({
      title: "¡Atención!",
      text: "¿Estás seguro que deseas eliminar el departamento de forma definitiva?",
      imageUrl: alerta.src,  // Usar imageUrl en lugar de icon
      imageWidth: 120,
      imageHeight: 100,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(
            deleteDepartment({ token, request: { departmentId: departamento?.id } })
          ).unwrap();
  
          if (response.success) {
            Swal.fire({
              title: "¡Exito!",
              text: response.message || "Se ha eliminado departamento de forma exitosa.",
              icon: "success",
              confirmButtonText: "Cerrar",
              customClass: {
                container:'swal2-container',
                popup: 'swal-popup-succes', 
                confirmButton: 'swal-confirm-button', 
                title: 'swal-title', 
              }
              
            });
  
            await getDepartamentos();
          }
        } catch (error) {
          Swal.fire({
            title: "¡Error!",
            text: "No se pudo eliminar departamento de forma exitosa.",
            icon: "error",
            confirmButtonText: "Volver a intentar",
            customClass: {
              container:'swal2-container',
              popup: 'swal-popup-error', 
              confirmButton: 'swal-confirm-button', 
              title: 'swal-title', 
            },
          });
          console.error("Error al eliminar:", error);
        }
      }
    });
  };


  return (
    <>
      <TableRow>
        <TableCell className="border-r border-[#EDEDED] text-center">
          {startIndex + index + 1}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-center">
          {departamento?.id}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] font-semibold text-[#3C98CB] text-start underline">
          <Link
            className="cursor-pointer hover:underline"
            href={`/configuracion/configuracion-sistemas/catalogos-generales/departamentos-empresa/form?mode=view&id=${departamento?.id}`}
          >
            {departamento?.name}
          </Link>
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-start ">
          {departamento?.area}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] font-semibold text-[#3C98CB] text-start underline">
          <Link className="cursor-pointer hover:underline" href={"#"}>
            {/* {departamento?.responsibleName} */}
            sin datos actualmente
          </Link>
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-center">
          {transformDate(departamento?.creationDate)}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] flex items-center justify-center">
          <Switch
            checked={isActive}
            onCheckedChange={(newState) => handleToggleStatus(newState)}
            className="data-[state=checked]:bg-[#3C98CB]"
          />
        </TableCell>
      </TableRow>

      
    </>
  );
};
