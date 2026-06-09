"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Plus } from "lucide-react";
import Image from "next/image";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";

import BadgeFiltersList from "./BadgeFiltersList";
import searchIcon from "@/Asset/searchIcon.png";

import type {
  DocumentacionParams
} from "../../services/documentacionTypes";

import { useParams } from "next/navigation";
import AddFileModal from "@/components/ui/Modals/file-upload/AddFileModal";
import { sucursalActions } from "../../../../services/sucursalesSlice";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

interface Props {
  searchParams: DocumentacionParams;
  setSearchParams: Dispatch<SetStateAction<DocumentacionParams>>;
  currentSucursalName?: string; // Nombre del atributo actual, opcional
}

const statusOptions = [
  { value: "true", label: "Activo" },
  { value: "false", label: "Inactivo" },
];

const DocumentacionTableFilter = ({
  searchParams,
  setSearchParams,
  currentSucursalName,
}: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const [inputValue, setInputValue] = useState(""); // Valor del input sin debounce

  const params = useParams();
  const { sucursalesId } = useParams() as { sucursalesId: string };

  const [isAddFileOpen, setIsAddFileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("auth-token") || "";

  const handleAddFile = async (data: { fileName: string; file: FileList }) => {
  setIsLoading(true);

  const rawFile = data.file[0];

  const normalizedFilename = rawFile.name
  .trim()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "") // quita tildes
  .replace(/\s+/g, "_") // reemplaza espacios por guiones bajos
  .replace(/[^a-zA-Z0-9_.-]/g, ""); // elimina símbolos raros

  const sanitizedFile = new File([rawFile], normalizedFilename, { type: rawFile.type });

  try {
    if (!data.file || data.file.length === 0) {
      throw new Error("No se seleccionó ningún archivo");
    }

    const formData = new FormData();
    formData.append("sucursalId", sucursalesId);
    formData.append("nombreDocumento", data.fileName);
    formData.append("archivo", sanitizedFile);

    const resultAction = await dispatch(
      sucursalActions.addDocumentSucursal({ token, formData })
    );

    if (sucursalActions.addDocumentSucursal.rejected.match(resultAction)) {
      throw resultAction.payload;
    }
    await dispatch(
      sucursalActions.getDocumentsBySucursalId({
        token,
        id: sucursalesId ?? null,
      })
    );
    // Mostrar éxito (opcionalmente con Swal)
    Swal.fire({
      title: "¡ÉXITO!",
      text: `Se ha subido el archivo correctamente.`,
      icon: "success",
      confirmButtonText: "Cerrar",
      customClass: {
        container: 'swal2-container',
        popup: 'swal-popup-succes',
        confirmButton: 'swal-confirm-button',
        title: 'swal-title',
      },
      didOpen: () => {
        const popup = document.querySelector(".swal2-popup") as HTMLElement;
        if (popup) {
          popup.style.border = "3px solid #348F41"; // Verde éxito
          popup.style.borderRadius = "16px"; // Bordes redondeados
        }
      },
    });

    setIsAddFileOpen(false); // Cierra el modal si todo sale bien
  } catch (error: any) {
    // console.error("Error al subir archivo:", error.message);
    Swal.fire({
    title: "¡ERROR!",
    text: error?.message || "No se pudo subir el archivo.",
    icon: "error",
    confirmButtonText: "Cerrar",
    customClass: {
      container: 'swal2-container',
      popup: 'swal-popup-error',
      confirmButton: 'swal-confirm-button',
      title: 'swal-title',
    },
    didOpen: () => {
      const popup = document.querySelector(".swal2-popup") as HTMLElement;
      if (popup) {
        popup.style.border = "3px solid #CF5459"; // Rojo error
        popup.style.borderRadius = "16px";
      }
    },
  });
    // Swal.fire({ icon: "error", title: "Error", text: error.message || "No se pudo subir el archivo" });
  } finally {
    setIsLoading(false);
  }
};

  // Claim consts
  const createClaim =
    "Configuración.Configuración empresa.Información de la empresa.Sucursales.Crear"; 

  const claims = useSelector((state: RootState) => state.claims.data);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((prev) => ({ ...prev, searchQuery: inputValue }));
    }, 500); // Retraso de 500ms

    return () => {
      clearTimeout(handler); // Limpia el timeout anterior si el valor cambia antes de que termine
    };
  }, [inputValue]); // Solo se ejecuta cuando inputValue cambia

  // Filtrar navegación según los claims
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  return (
    <div className="px-4">
      <form
        className="flex flex-col items-center md:flex-row md:justify-between gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Primera sección de filtros */}
        <div className="flex w-full flex-wrap justify-center md:justify-start md:w-3/4 lg:w-4/6 gap-3">
          {/* Search */}
          <div className="flex-1 min-w-56 max-w-80">
            <div className="flex items-center gap-3 rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 h-[2.625rem]">
              <Image src={searchIcon} alt="Search" width={20} height={20} />
              <input
                id="search"
                type="search"
                placeholder="Buscar..."
                className="w-full p-2 placeholder:text-muted-foreground bg-white disabled:bg-gray-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="w-auto flex gap-2">
        {hasClaim(createClaim) && (
          <label
            className="bg-[#3c98cb] text-white px-2 py-1 rounded-lg flex items-center justify-center w-[100px] space-x-2 hover:bg-[#3188b8] transition duration-300 cursor-pointer"
            aria-label="Subir archivo"
            onClick={() => setIsAddFileOpen(true)}
          >
            <Plus size={22} strokeWidth={3} />
            <div className="flex flex-row md:flex-col gap-1 md:gap-0 text-sm text-center">
              <span>Agregar</span>
            </div>
          </label>
        )}
      </div>
      </form>

      {/* Badge List */}
      <BadgeFiltersList
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setInputValue={setInputValue}
        statusOptions={statusOptions}
      />
      <AddFileModal
        open={isAddFileOpen}
        onClose={() => setIsAddFileOpen(false)}
        onSubmit={handleAddFile}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DocumentacionTableFilter;
