import { useEffect, useState } from "react";

import { EllipsisIcon, FileDown, PencilLine, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteItemModal from "@/ui/Tables/DeleteItemModal";
import { fabricanteDocumentosActions } from "../../services/fabricanteDocumentosSlice";

import { useParams } from "next/navigation";
import showAlert from "@/lib/utils/alerts";
import UploadDataModal from "@/components/ui/Modals/carga-archivo/UploadDataModal";

import { AppDispatch, RootState } from "@/lib/store/store";
import type { FabricanteDocumento } from "../../services/fabricantesDocumentosTypes";
import { transformDate } from "@/lib/utils/dates";

interface Props {
  index: number;
  startIndex: number;
  documento: FabricanteDocumento;
  getData?: () => void; // Optional function to refresh data
}

const FabricanteDocumentosTableRow = ({
  index,
  startIndex,
  documento,
  getData = () => {},
}: Props) => {
  const { fabricanteId } = useParams() as { fabricanteId: string };

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

  // Redux selectors
  const isPending = useSelector(
    (state: RootState) => state.fabricanteDocumentos.isPending
  );
  const isLoadingDocument = useSelector(
    (state: RootState) => state.fabricanteDocumentos.isLoadingDocument
  );
  const currentDocument = useSelector(
    (state: RootState) => state.fabricanteDocumentos.currentDocumento
  );

  // Handle delete item
  const handleDeleteItem = async () => {
    try {
      const resultAction = await dispatch(
        fabricanteDocumentosActions.deleteFabricanteDocumento({
          token,
          id: documento?.id,
          fabricanteId,
        })
      );
      if (
        fabricanteDocumentosActions.deleteFabricanteDocumento.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }
      setIsOpenModal(false);
      getData(); // Refresh data after deletion

      // Show success message
      showAlert({
        success: true,
        message:
          resultAction.payload.message || "Documento eliminado correctamente.",
      });
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
        fabricanteDocumentosActions.getFabricanteDocumentoById({
          token,
          id: documento?.id,
          fabricanteId,
        })
      );
      if (
        fabricanteDocumentosActions.getFabricanteDocumentoById.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }
    } catch (error: any) {
      console.log("🚀 ~ handleGetDocument ~ error:", error);
      showAlert({
        success: false,
        message: error.message || "Error al obtener el documento.",
      });
    }
  };

  // Handle submit file
  const handleSubmitFile = async (file: File | undefined, name: string) => {
    try {
      const resultAction = await dispatch(
        fabricanteDocumentosActions.updateFabricanteDocumento({
          token,
          id: documento?.id,
          body: {
            archivo: file,
            nombre: name,
          },
          fabricanteId,
        })
      );
      if (
        fabricanteDocumentosActions.updateFabricanteDocumento.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }

      getData(); // Refresh data after successful upload
      setIsOpenDocumentModal(false);

      // Show success message
      showAlert({
        success: true,
        message:
          resultAction.payload.message || "Archivo subido correctamente.",
      });
    } catch (error: any) {
      console.log("🚀 ~ handleSubmitFile ~ error:", error);
      showAlert({
        success: false,
        message: error.message || "Error al subir el archivo.",
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
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>

      {/* Delete modal */}
      <DeleteItemModal
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        isLoading={isPending}
        onHandleDelete={handleDeleteItem}
        label="¿Estás seguro que deseas eliminar el documento de forma definitiva?"
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

export default FabricanteDocumentosTableRow;
