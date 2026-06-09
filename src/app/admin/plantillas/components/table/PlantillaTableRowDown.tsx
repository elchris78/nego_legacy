"use client";

import { DeletePlantillaModal } from "./DeletePlantillaModal";
import {
  CopyPlus,
  Edit,
  Ellipsis,
  Eye,
  PencilLine,
  Trash2,
} from "lucide-react";
import { es } from "date-fns/locale";
import {
  fetchCreatePlantilla,
  fetchDeletePlantilla,
  fetchTogglePlantillaStatus,
} from "../../services/plantillasActions";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import { ToastErrorMsg } from "@/components/ui/Toast/ToastErrorMsg";
import { ToastSuccessMsg } from "@/components/ui/Toast/ToastSuccessMsg";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Tooltip } from "@mui/material";
import Link from "next/link";

import Swal from "sweetalert2";
import { AppDispatch } from "@/lib/store/store";
import { useDispatch } from "react-redux";
import alerta from "@/Asset/alerta 1.png";
interface Props {
  index: number;
  startIndex: number;
  plantilla: any;
  getPlantillas: () => Promise<void>;
}

const transformDate = (date?: string) => {
  if (date) {
    const newDate = new Date(date);
    return format(newDate, "dd/MM/yyyy", {
      locale: es,
    });
  }
};

export const PlantillaTableRowDown = ({
  index,
  startIndex,
  plantilla,
  getPlantillas,
}: Props) => {
  const token = Cookies.get("auth-token");
  const router = useRouter();
  const [isActive, setisActive] = useState<boolean>(plantilla?.active ?? false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  const menuRef = useRef<HTMLDivElement>(null);
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  const companiesNames = plantilla?.companies
    .map((company: any) => company.item2)
    .join(", ");

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


  return (
    <>
      <TableRow>
        <TableCell className="border-r border-[#EDEDED] text-center">
          {startIndex + index + 1}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-center">
          {plantilla?.roleTemplateId}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-[#3C98CB]">
          {plantilla?.roleTemplateName.length > 20 ? (
            <Tooltip title={plantilla?.roleTemplateName} arrow>
              <Link
                className="cursor-pointer hover:underline"
                href={`/admin/plantillas/form?mode=edit&id=${plantilla?.roleTemplateId}`}
              >
                {plantilla?.roleTemplateName.slice(0, 20) + "..."}
              </Link>
            </Tooltip>
          ) : (
            <Link
              className="cursor-pointer hover:underline"
              href={`/admin/plantillas/form?mode=view&id=${plantilla?.roleTemplateId}`}
            >
              {plantilla?.roleTemplateName}
            </Link>
          )}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED]">
          {plantilla?.description}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED]">
          {companiesNames}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-center">
          {transformDate(plantilla?.createdAt)}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] flex justify-center">
          <Switch
            checked={isActive}
            className="data-[state=checked]:bg-[#3C98CB]"
          />
        </TableCell>
      </TableRow>
    </>
  );
};
