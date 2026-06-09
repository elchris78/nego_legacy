"use client";

import { DeleteSucursalModal } from "./DeleteSucursalModal";
import { Edit, Eye, Trash2 } from "lucide-react";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import { ToastErrorMsg } from "@/components/ui/Toast/ToastErrorMsg";
import { ToastSuccessMsg } from "@/components/ui/Toast/ToastSuccessMsg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchTogglePlantillaStatus } from "../../services/plantillasActions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchClaims } from "@/lib/services/claims/claimsSlices";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import ActionMenu  from "../MenuAcciones";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  sucursal: any;
  // getDepartamentos: () => Promise<void>;
  getDepartamentos: () => void;
}


const transformDate = (date?: string) => {
  if (date) {
    const newDate = new Date(date);
    return format(newDate, "d MMMM yyyy", {
      locale: es,
    });
  }
};

export const SucursalTableRow = ({ sucursal, getDepartamentos }: Props) => {
  const token = Cookies.get("auth-token");
  const router = useRouter();
  const [isActive, setisActive] = useState<boolean>(
    sucursal?.active ?? false
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claims.data);

  useEffect(() => {
    const token = Cookies.get("auth-token") || "";
    dispatch(fetchClaims( token));
  }, [dispatch]);

  const hasClaim = (claimValue: string) => {
    return claims?.some((claim: { claimValue: string }) => claim.claimValue === claimValue);
  };
  const handleToggleStatus = async (newState: boolean) => {
    if (!hasClaim("Configuración.Sucursales.ToggleStatus")) {
      toast(
        <ToastErrorMsg description="No tienes permiso para cambiar el estado del departamento." />
      );
      return;
    }
  
    try {
      setisActive(newState);
      // const resp = await fetchToggleDepartamentoStatus({
      //   token,
      //   id: departamento?.id,
      // });
      const resp = { success: true };
  
      if (resp?.success) {
        toast(
          <ToastSuccessMsg description="Se ha editado el departamento de forma exitosa." />
        );
        await getDepartamentos();
      }
    } catch (error) {
      console.log("🚀 ~ handleToggleStatus ~ error:", error);
      toast(
        <ToastErrorMsg description="Ocurrió un error al cambiar el estatus del departamento." />
      );
      setisActive(!newState);
    }
  };

  const handleView = () => {
    console.log("Ver sucursal");

    router.push( 
      `/configuracion/configuracion-sistemas/catalogos-generales/sucursales/form?mode=view&id=${sucursal?.id}`
    )
  };

  const handleEdit = () => {
    console.log("editando");
  
    // Validar si el usuario tiene al menos uno de los permisos
    // const canEdit = hasClaim("Configuracion.Sucursales.Actualizar");
    const canRead = hasClaim("Configuración.Sucursales.Leer");
  
    if (!canRead) {
      toast(
        <ToastErrorMsg description="No tienes permiso para editar el departamento." />
      );
      return;
    }
  
    // Si tiene al menos uno de los permisos, realizar la navegación
    router.push(
      `/configuracion/configuracion-sistemas/catalogos-generales/sucursales/form?mode=edit&id=${sucursal?.id}`
    );
  };
  

  return (
    <>
      <TableRow>
              <TableCell className="text-center border-r border-[#EDEDED]">{sucursal.id}</TableCell>
              <TableCell className="text-center border-r border-[#EDEDED]" 
                onDoubleClick={ () =>
                  handleEdit
                }>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-[#3C98CB] cursor-pointer" onDoubleClick={handleView}>{sucursal.name}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>"Puedes hacer doble clic para visualizar."</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-center border-r border-[#EDEDED]">{sucursal.neighborhood}</TableCell>
              <TableCell className="text-center border-r border-[#EDEDED]">{sucursal.fechaCreacion}</TableCell>
              <TableCell className="text-center border-r border-[#EDEDED]">
                <Switch
                  checked={sucursal.status}
                  onCheckedChange={(newState) => handleToggleStatus(newState)}
                  className="data-[state=checked]:bg-[#3C98CB] data-[state=unchecked]:bg-[#E5E1E6] border-solid border-[#202945]"
                />
              </TableCell>
              
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  {/* {hasClaim("Configuracion.Sucursales.Eliminar") && (
                    <button className="p-2 text-white rounded-ful">
                      <Trash2
                        size={18}
                        className="cursor-pointer"
                        color="#5B89B4"
                        onClick={() => setIsOpenModal(true)}
                      />
                    </button>
                  )} */}
                  <ActionMenu
                    actions={[
                      { label: "Editar", icon: <Edit size={18} className="cursor-pointer" color="#318F41"/>, onClick: handleEdit },
                      { label: "Eliminar", icon: <Trash2 size={18} className="cursor-pointer" color="#CF5459"/>, onClick: () => setIsOpenModal(true) },
                    ]}
                  />
                </div>
              </TableCell>
            </TableRow>
            

        {/* Delete modal */}
        <DeleteSucursalModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        id={sucursal.id}
        // getPlantillas={getPlantillas}
        />
    </>
  );
};
