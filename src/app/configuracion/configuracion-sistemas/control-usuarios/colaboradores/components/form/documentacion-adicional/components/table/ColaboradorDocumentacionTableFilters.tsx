"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import AccordionFilters from "./AccordionFilters";
import BadgeFiltersList from "./BadgeFiltersList";
import FilterIcon from "@/components/ui/icons/Filter";
import searchIcon from "@/Asset/searchIcon.png";
import showAlert from "@/lib/utils/alerts";
import UploadDataModal from "@/components/ui/Modals/carga-archivo/UploadDataModal";

import { AppDispatch, RootState } from "@/lib/store/store";
import type { ColaboradorDocumentacionParams } from "../../services/colaboradorDocumentacionTypes";
import { colaboradorDocumentacionActions } from "../../services/colaboradorDocumentacionSlice";

interface Props {
  searchParams: ColaboradorDocumentacionParams;
  setSearchParams: Dispatch<SetStateAction<ColaboradorDocumentacionParams>>;
  getData?: () => void; // Optional function to refresh data
}

const formatoOptions = [
  { value: "png", label: "PNG" },
  { value: "jpg", label: "JPG" },
  { value: "jpeg", label: "JPEG" },
  { value: "xls", label: "XLS" },
  { value: "xlsx", label: "XLSX" },
  { value: "doc", label: "DOC" },
  { value: "docx", label: "DOCX" },
  { value: "pdf", label: "PDF" },
];

const ColaboradorDocumentacionTableFilters = ({
  searchParams,
  setSearchParams,
  getData = () => {},
}: Props) => {
  const params = useSearchParams();
  const id = params.get("id");
  const mode = params.get("mode");
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();

  const [inputValue, setInputValue] = useState(""); // Valor del input sin debounce
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isPending = useSelector(
    (state: RootState) => state.colaboradoresDocumentacion.isPending
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((prev) => ({ ...prev, searchQuery: inputValue }));
    }, 500); // Retraso de 500ms

    return () => {
      clearTimeout(handler); // Limpia el timeout anterior si el valor cambia antes de que termine
    };
  }, [inputValue]); // Solo se ejecuta cuando inputValue cambia

  const handleSubmitFile = async (file: File | undefined, name: string) => {
    try {
      const resultAction = await dispatch(
        colaboradorDocumentacionActions.createColaboradorDocumentacion({
          token,
          body: {
            archivo: file,
            nombre: name,
          },
          colaboradorId: id || "",
        })
      );
      if (
        colaboradorDocumentacionActions.createColaboradorDocumentacion.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }

      getData(); // Refresh data after successful upload
      setIsModalOpen(false); // Close the modal after successful upload

      showAlert({
        success: true,
        message:
          resultAction.payload.message || "Documento cargado correctamente.",
      });
    } catch (error: any) {
      console.log("🚀 ~ handleSubmitFile ~ error:", error);
      showAlert({
        success: false,
        message: error.message || "Error al cargar el documento.",
      });
    }
  };

  return (
    <>
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

            {/* Multi select Filter options */}
            <div className="w-auto">
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-30 flex gap-2 py-5 px-3 border-gray-300"
                  >
                    <div className="flex flex-row items-center justify-start gap-1">
                      <FilterIcon color="#5B6670" />
                      <span className="font-normal text-gray-700">Filtrar</span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-[93vw] p-0 ml-4 mr-6 sm:w-[35vw] sm:ml-0 sm:mr-0 max-h-[500px] overflow-y-auto"
                >
                  <AccordionFilters
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    onClosePopover={() => setIsPopoverOpen(false)}
                    formatoOptions={formatoOptions}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Options */}
          {(mode === "create" || mode === "edit") && (
            <div className="w-auto flex gap-2">
              <Button
                aria-label="Crear Colaborador"
                className="flex items-center gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={22} strokeWidth={3} />
                <span>Agregar</span>
              </Button>
            </div>
          )}
        </form>

        {/* Badge List */}
        <BadgeFiltersList
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          setInputValue={setInputValue}
          formatoOptions={formatoOptions}
        />
      </div>

      {/* Modal añadir archivo */}
      {isModalOpen && (
        <UploadDataModal
          isModalOpen={isModalOpen}
          onCloseModal={() => setIsModalOpen(false)}
          handleFile={handleSubmitFile}
          getData={async () => getData()}
          isLoading={isPending}
        />
      )}
    </>
  );
};

export default ColaboradorDocumentacionTableFilters;
