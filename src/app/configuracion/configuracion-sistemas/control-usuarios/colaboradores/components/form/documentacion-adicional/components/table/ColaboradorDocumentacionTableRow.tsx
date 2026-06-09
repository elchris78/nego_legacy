import { useEffect, useState } from "react";

import { EllipsisIcon, FileDown, PencilLine, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AppDispatch, RootState } from "@/lib/store/store";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteItemModal from "@/components/ui/Tables/DeleteItemModal";

import type { ColaboradorDocumentacion } from "../../services/colaboradorDocumentacionTypes";
import { colaboradorDocumentacionActions } from "../../services/colaboradorDocumentacionSlice";
import { useSearchParams } from "next/navigation";
import UploadDataModal from "@/components/ui/Modals/carga-archivo/UploadDataModal";
import showAlert from "@/lib/utils/alerts";
import { transformDate } from "@/lib/utils/dates";

interface Props {
  index: number;
  startIndex: number;
  documento: ColaboradorDocumentacion;
  getData?: () => void; // Optional function to refresh data
}

const ColaboradorDocumentacionTableRow = ({
  index,
  startIndex,
  documento,
  getData = () => {},
}: Props) => {
  const params = useSearchParams();
  const id = params.get("id");
  const mode = params.get("mode");
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDocumentModal, setIsOpenDocumentModal] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Reset readOnly state when the document modal is closed
  useEffect(() => {
    if (!isOpenDocumentModal) {
      setIsReadOnly(false);
    }
  }, [isOpenDocumentModal]);

  const isPending = useSelector(
    (state: RootState) => state.colaboradoresDocumentacion.isPending
  );
  const currentDocument = useSelector(
    (state: RootState) => state.colaboradoresDocumentacion.currentDocumentacion
  );
  const isLoadingDocument = useSelector(
    (state: RootState) => state.colaboradoresDocumentacion.isLoadingDocument
  );

  // Handle delete action
  const handleDeleteItem = async () => {
    try {
      const resultAction = await dispatch(
        colaboradorDocumentacionActions.deleteColaboradorDocumentacion({
          token,
          id: documento?.id,
          colaboradorId: id || "",
        })
      );
      if (
        colaboradorDocumentacionActions.deleteColaboradorDocumentacion.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }

      // Show success message
      showAlert({
        success: true,
        message:
          resultAction.payload.message || "Documento eliminado correctamente.",
      });

      getData(); // Refresh data after deletion
      setIsOpenModal(false); // Close the modal after successful deletion
    } catch (error: any) {
      console.log("🚀 ~ handleDeleteItem ~ error:", error);
      showAlert({
        success: false,
        message: error.message || "Error al eliminar el documento.",
      });
    }
  };

  // Handle get document
  const handleGetDocument = async () => {
    try {
      const resultAction = await dispatch(
        colaboradorDocumentacionActions.getColaboradorDocumentacionById({
          token,
          id: documento?.id,
          colaboradorId: id || "",
        })
      );
      if (
        colaboradorDocumentacionActions.getColaboradorDocumentacionById.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }
    } catch (error: any) {
      console.log("🚀 ~ handleGetDocument ~ error:", error);
      setIsOpenDocumentModal(false); // Close the modal if there's an error
      showAlert({
        success: false,
        message: error.message || "Error al obtener el documento.",
      });
    }
  };

  const handleSubmitFile = async (file: File | undefined, name: string) => {
    try {
      const resultAction = await dispatch(
        colaboradorDocumentacionActions.updateColaboradorDocumentacion({
          token,
          id: documento?.id,
          body: {
            archivo: file,
            nombre: name,
          },
          colaboradorId: id || "",
        })
      );
      if (
        colaboradorDocumentacionActions.updateColaboradorDocumentacion.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }

      getData(); // Refresh data after successful upload
      setIsOpenDocumentModal(false); // Close the modal after successful upload

      showAlert({
        success: true,
        message:
          resultAction.payload.message ||
          "Documento actualizado correctamente.",
      });
    } catch (error: any) {
      console.log("🚀 ~ handleSubmitFile ~ error:", error);
      showAlert({
        success: false,
        message: error.message || "Error al actualizar el documento.",
      });
    }
  };

  const downloadFile = (url: string = "") => {
    if (!url) return;
    try {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.setAttribute(
        "download",
        `${documento?.nombre}.${documento?.formato}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      showAlert({
        success: false,
        message: "Error al descargar el archivo.",
      });
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
        <TableCell className="text-center uppercase">
          {documento?.formato}
        </TableCell>
        <TableCell className="text-center text-[#3C98CB]">
          <span
            className="hover:underline cursor-pointer"
            onClick={() => {
              setIsReadOnly(true);
              setIsOpenDocumentModal(true);
              handleGetDocument();
            }}
          >
            {documento?.nombre}.{documento?.formato}
          </span>
        </TableCell>
        <TableCell className="text-center">
          {transformDate(documento?.fechaCarga)}
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
                {mode === "edit" && (
                  <>
                    <FileDown
                      size={18}
                      className="cursor-pointer text-[#5B6670] hover:text-green-500"
                      onClick={() => downloadFile(documento?.url)}
                    />
                    <PencilLine
                      size={18}
                      className="cursor-pointer text-[#5B6670] hover:text-[#3C98CB]"
                      onClick={() => {
                        setIsOpenDocumentModal(true);
                        handleGetDocument();
                      }}
                    />
                    <Trash2
                      size={18}
                      className="cursor-pointer text-[#5B6670] hover:text-[#CF5459]"
                      onClick={() => setIsOpenModal(true)}
                    />
                  </>
                )}
                {mode === "view" && (
                  <span className="text-gray-500 text-sm">
                    Deshabilitado al consultar
                  </span>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>

      {/* Delete modal */}
      <DeleteItemModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        onHandleDelete={handleDeleteItem}
        isLoading={isPending}
        label="¿Estás seguro que deseas eliminar este documento?"
      />

      {/* Document details modal */}
      {isOpenDocumentModal && (
        <UploadDataModal
          isModalOpen={isOpenDocumentModal}
          onCloseModal={() => setIsOpenDocumentModal(false)}
          handleFile={handleSubmitFile}
          getData={async () => getData()}
          isLoading={isPending}
          currentDocument={currentDocument}
          isLoadingDocument={isLoadingDocument}
          readOnly={isReadOnly}
        />
      )}
    </>
  );
};

export default ColaboradorDocumentacionTableRow;
