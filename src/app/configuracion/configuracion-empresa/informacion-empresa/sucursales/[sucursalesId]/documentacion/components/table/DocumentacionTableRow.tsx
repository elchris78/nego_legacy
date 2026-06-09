import { useEffect, useState } from "react";

import { EllipsisIcon, PencilLine, Trash2, Download  } from "lucide-react";
import Cookies from "js-cookie";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import Swal from "sweetalert2";
import { useParams } from "next/navigation";
import { AddDocumentSucursal } from "../../../../services/sucursalesTypes";
import { sucursalActions } from "../../../../services/sucursalesSlice";
import ModalDocumentoSucursal from "./ModalDocumentoSucursal";
import DeleteDocModal from "./DeleteDocModal";

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
  startIndex: number;
  documentacionValue: AddDocumentSucursal;
}

const DocumentacionTableRow = ({
  index,
  startIndex,
  documentacionValue,
}: Props) => {
  // token
  const token = Cookies.get("auth-token") || "";

  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const claims = useSelector((state: RootState) => state.claims.data);
  const params = useParams();
  const idParams = params?.sucursalesId as string | undefined;
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); // true = editable
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<AddDocumentSucursal | null>(null);

  // Claims const
  const updateClaim = "Configuración.Configuración empresa.Información de la empresa.Sucursales.Actualizar";
  const deleteClaim = "Configuración.Configuración empresa.Información de la empresa.Sucursales.Eliminar";

  const hasClaim = (claimValue: string) =>
    claims?.some((c: { claimValue: string }) => c.claimValue === claimValue);


  const handleDeleteArea = () => {
    setIsOpenModalDelete(true);
  };
  const handleOpenModal = async () => {
    setModoEdicion(false); // Empieza en modo solo lectura
    setIsOpenModal(true);
    try {
      const result = await dispatch(
        sucursalActions.getDocumentSucursalById({
          token,
          id: documentacionValue?.id,
        })
      ).unwrap();

      setDocumentoSeleccionado(result);
    } catch (error) {
      console.error("Error al obtener documento:", error);
    }
  };

  const handleEditClick = async () => {
    setModoEdicion(true); // ← Activar edición desde el inicio
    setIsOpenModal(true);
    try {
      const result = await dispatch(
        sucursalActions.getDocumentSucursalById({
          token,
          id: documentacionValue?.id,
        })
      ).unwrap();
      setDocumentoSeleccionado(result);
    } catch (error) {
      console.error("Error al obtener documento:", error);
    }
  };
  return (
    <>
      <TableRow className="text-[#5B6670]">
        <TableCell className="border-r border-[#EDEDED] text-center">
          {startIndex + index + 1}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-center">
          {documentacionValue?.formato}
        </TableCell>
        <TableCell className="border-r border-[#EDEDED] text-[#3C98CB] text-center">
          <span
            className="cursor-pointer hover:underline text-[#3C98CB]"
            onClick={handleOpenModal}
          >
            {documentacionValue?.nombreDocumento.length > 20
              ? documentacionValue?.nombreDocumento.slice(0, 20) + "..."
              : documentacionValue?.nombreDocumento}
          </span>

        </TableCell>

        <TableCell>
          {documentacionValue.fechaRegistro
            ? new Date(documentacionValue.fechaRegistro).toISOString().split("T")[0]
            : "Sin fecha"}
        </TableCell>


        <TableCell className="border-r border-[#EDEDED]">
          <Popover>
            <PopoverTrigger
              className="flex items-center justify-center w-full cursor-pointer"
              asChild
            >
              <EllipsisIcon className="mr-1 mt-1" color="#BDC3C7" />
            </PopoverTrigger>
            <PopoverContent align="center" className="p-2 w-fit">
              <div className="flex flex-row gap-2">
                {documentacionValue.rutaArchivo && (
                  <Download
                    size={18}
                    className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                    onClick={() => {
                      window.open(documentacionValue.rutaArchivo, "_blank", "noopener");
                    }}
                  />
                )}
                {hasClaim(updateClaim) && (
                  <PencilLine 
                    size={18} 
                    onClick={handleEditClick}
                    className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                  />
                )}
                {hasClaim(deleteClaim) && (
                  <Trash2
                    size={18}
                    className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                    onClick={handleDeleteArea}
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
      <DeleteDocModal
        isOpenModal={isOpenModalDelete}
        onCloseModal={() => setIsOpenModalDelete(false)}
        id={documentacionValue?.id}
        sucursalId={documentacionValue?.sucursalId}
      /> 

      <ModalDocumentoSucursal
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        documento={documentoSeleccionado}
        modoEdicion={modoEdicion}
        onEditar={() => setModoEdicion(true)}
        onSubmit={async (data) => {
          if (!documentoSeleccionado) return;

          try {
            const resultAction = await dispatch(
              sucursalActions.updateDocumentSucursal({
                token,
                id: Number(documentoSeleccionado.id),
                sucursalId: documentoSeleccionado.sucursalId,
                nombreDocumento: data.fileName,
                isDeleted: false,
                archivo: data.file?.length > 0 ? data.file[0] : null,
              })
            );

            if (sucursalActions.updateDocumentSucursal.rejected.match(resultAction)) {
              throw resultAction.payload;
            }
              await dispatch(
                sucursalActions.getDocumentsBySucursalId({
                  token,
                  id: idParams ?? null,
                })
              );
            // Mensaje de éxito
            Swal.fire({
              title: "¡ÉXITO!",
              text: resultAction.payload.message,
              icon: "success",
              confirmButtonText: "Cerrar",
              customClass: customClassesSuccess,
            });

            setIsOpenModal(false);
          } catch (error: any) {
            console.error("Error al actualizar documento:", error);

            Swal.fire({
              title: "¡ERROR!",
              text: error?.message || "Error al actualizar el documento.",
              icon: "error",
              confirmButtonText: "Cerrar",
              customClass: customClassesError,
            });
          }
        }}
      />
    </>
  );
};

export default DocumentacionTableRow;
