import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, XCircle, Search, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react" // Importar el ícono de palomita
import Empresas from "@/assets/Empresas.png"
import Image from "next/image"
import InfoIcon from "@/assets/HelpCircle.png"
import { Tooltip as TooltipMUI } from "@mui/material"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { createCompany } from "../services/companyActions"
import { editCompany } from "../services/companyActions"
import { deleteCompany } from "../services/companyActions"
import { CreateModal } from "@/Modals/Modal_Create"
import { ShowModal } from "@/Modals/Modal_Show"
import { EditModal } from "@/Modals/Modal_Edit"
import { DeleteConfirmationModal } from "@/Modals/Modal_DeleteConfirmation"
import Cookies from "js-cookie"
import ConfirmacionEdit from "@/components/ui/Modals/ConfirmacionEdit"
import ConfirmacionEliminar from "@/components/ui/Modals/ConfirmacionEliminar"
import Swal from "sweetalert2"
import alerta from '@/Asset/alerta 1.png';
import carruselIzq from "@/assets/carruselIzq.png";
import carruselDer from "@/assets/carrsuelDer.png";
import {
  useMediaQuery
} from "@mui/material";

interface WelcomeProps {
  title: string
  subtitle?: string
  subtitle2?: string
  textButton: string
  showTooltip?: boolean
  companiesArray?: any[]
  handleUpdate: () => void
  token?: string
}

interface CompanyProps {
  companyId: number
  name: string
}

export const Welcome = ({
  title,
  subtitle,
  subtitle2,
  textButton,
  showTooltip = false,
  companiesArray = [],
  handleUpdate,
}: WelcomeProps) => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isShowModalOpen, setShowModalOpen] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>("")
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [companyToDeleteId, setCompanyToDeleteId] = useState<number | null>(null)
  const [successMessages, setSuccessMessages] = useState<{ [key: number]: string }>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyProps[]>(companiesArray)
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false)
  const [isModalOpenEliminar, setIsModalOpenEliminar] = useState(false)
  const [companyName, setCompanyName] = useState<string | null>(null)
  const [companies, setCompanies] = useState<CompanyProps[]>(companiesArray)
  const isBelow1700 = useMediaQuery("(max-width:1700px)");

  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN"
  const router = useRouter()

  const [itemsPerPage, setItemsPerPage] = useState(4)
  const [currentPage, setCurrentPage] = useState(0)

  // UseEffect para cambiar itemsPerPage según el tamaño de la pantalla}

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width <= 768) {
        setItemsPerPage(1)
      } else if (width < 1030) {
        setItemsPerPage(2)
      } else if (width < 1560) {
        // 1500 
        setItemsPerPage(4)
      } else if (width < 1712) {
        setItemsPerPage(4)
      } else {
        setItemsPerPage(4)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleOpenCreateModal = () => setCreateModalOpen(true)
  const handleCloseCreateModal = () => setCreateModalOpen(false)

  const checkIfCompanyExists = (name: string) => {
    return companies.some((c) => c.name.toLowerCase() === name.toLowerCase())
  }

  const handleCreateCompany = async (company: CompanyProps) => {
    try {
      if (!token) {
        router.push("/login")
        return
      }

      // Verifica si la empresa ya existe
      if (checkIfCompanyExists(company.name)) {
        return "Ya existe una empresa con este nombre."
      }

      // Crea la empresa en el servidor
      const response = await createCompany({ ...company, token })
      const newCompany = { companyId: response.companyId, name: company.name }

      // Actualiza el estado de las empresas en la lista sin recargar la página
      setCompanies((prevCompanies) => [newCompany, ...prevCompanies])
      setFilteredCompanies((prevCompanies) => [newCompany, ...prevCompanies])

      // Limpia mensajes anteriores y muestra el mensaje de éxito en el último creado
      setSuccessMessages({
        [newCompany.companyId]: "Se ha agregado la empresa de forma exitosa.",
      })

      // Elimina el mensaje de éxito después de 2 segundos
      setTimeout(() => {
        setSuccessMessages({})
        // Llama a handleUpdate si es necesario para refrescar otros componentes
        // if (handleUpdate) handleUpdate();
      }, 5000)

      // Reinicia la página actual al agregar una nueva empresa
      setCurrentPage(0)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return `Error: ${error.message}`
      } else {
        return "Error inesperado"
      }
    }
  }

  const handleEditCompany = async (company: { companyId: number; name: string; token: string }) => {
    try {
      if (!token) {
        router.push("/login")
        return "Redireccionando al login por falta de token."
      }

      if (checkIfCompanyExists(company.name)) {
        return "Ya existe una empresa con este nombre."
      }

      const resultado = await editCompany(company)
      console.log("Resultado es: " + resultado)

      if (resultado && resultado.includes("Error")) {
        return "Error al editar la empresa"
      } else {
        // Actualiza la lista de empresas
        setCompanies((prevCompanies) =>
          prevCompanies.map((c) => (c.companyId === company.companyId ? { ...c, name: company.name } : c)),
        )

        // Actualiza la lista de empresas filtradas
        setFilteredCompanies((prevFilteredCompanies) =>
          prevFilteredCompanies.map((c) => (c.companyId === company.companyId ? { ...c, name: company.name } : c)),
        )

        // Cerrar el modal de edición antes de abrir el de confirmación
        setEditModalOpen(false)

        Swal.fire({
          title: "¡ÉXITO!",
          text: `Se han actualizado los datos de la empresa correctamente.`,
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

        // Abrir el modal de confirmación
        setCompanyName(company.name) // Establecer el nombre de la empresa editada
        

        return "Empresa editada exitosamente"
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return `Error: ${error.message}`
      } else {
        return "Error inesperado"
      }
    }
  }

  const handleDeleteCompany = async (company: { companyId: number; name: string; token: string }) => {
    if (!company.token) {
      router.push("/login");
      return;
    }
  
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn-success",
        cancelButton: "btn-danger",
        container: 'swal2-container',
        popup: 'swal-popup-error',
        title: 'swal-title',
        actions: 'swal-actions',
      },
      buttonsStyling: false
    });
  
    swalWithBootstrapButtons.fire({
      title: "¡ATENCIÓN!",
      text: `¿Estás seguro que deseas eliminar la empresa de forma definitiva?`,
      imageUrl: alerta.src,
      imageWidth: 100,
      imageHeight: 100,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCompany({ companyId: company.companyId, token: company.token });
  
          setCompanies((prevCompanies) => prevCompanies.filter((c) => c.companyId !== company.companyId));
  
          Swal.fire({
            title: "¡ÉXITO!",
            text: `La empresa "${company.name}" ha sido eliminada correctamente.`,
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
          await handleUpdate();
        } catch (error) {
          Swal.fire({
            title: "¡ERROR!",
            text: "No se pudo eliminar la empresa.",
            icon: "error",
            confirmButtonText: "Volver a intentar",
            customClass: {
              container: 'swal2-container',
              popup: 'swal-popup-error',
              confirmButton: 'swal-confirm-button',
              title: 'swal-title',
            },
          });
  
          console.error("Error al eliminar la empresa:", error);
        }
      }
    });
  };
  

  const handleOpenDeleteConfirmation = (companyId: number) => {
    setCompanyToDeleteId(companyId)
    setDeleteConfirmationOpen(true)
  }

  const handleOpenEditModal = (company: CompanyProps) => {
    setSelectedCompanyId(company.companyId)
    setSelectedCompanyName(company.name)
    setEditModalOpen(true)
  }

  const handleShowModalOpen = (company: CompanyProps) => {
    setSelectedCompanyName(company.name)
    setShowModalOpen(true)
  }

  const goToNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < companies.length) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  useEffect(() => {
    const sortedCompanies = [...companiesArray].sort((a, b) => b.companyId - a.companyId)
    setCompanies(sortedCompanies) // Solo para inicializar al montar el componente.
    setFilteredCompanies(sortedCompanies)
  }, [companiesArray])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value
    setSearchTerm(term)

    const filtered = companies.filter((company) => company.name.toLowerCase().includes(term.toLowerCase()))

    setFilteredCompanies(filtered)
    setCurrentPage(0) // Reinicia la página al realizar una búsqueda
  }

  const getCurrentPageItems = () => {
    const start = currentPage * itemsPerPage
    return filteredCompanies.slice(start, start + itemsPerPage)
  }

  const closedModalEdit = () => {
    setIsModalOpenEditar(false)
    if (handleUpdate) handleUpdate()
  }

  const closedModalEliminar = () => {
    setIsModalOpenEliminar(false)
    if (handleUpdate) handleUpdate()
  }

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)

  return (
    <div className="flex">
      <div className="flex flex-col items-center p-4 w-full">
        <div className="flex items-center space-x-2 mb-8">
          <h1 className="text-5xl text-center text-[#5B6670] font-bold">{title}</h1>
          {showTooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipContent>
                  <p>Módulo desde el cual podrás gestionar las empresas</p>
                </TooltipContent>
                <TooltipTrigger className="flex items-center">
                  <span>
                    <Image className="mt-2" src={InfoIcon || "/placeholder.svg"} alt="Info" width={18} height={18} />
                  </span>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {companies.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-end items-center mx-10 mb-1 space-y-1 sm:space-y-0 sm:space-x-2 w-full max-w-full ">
              {companies.length > itemsPerPage && (
                <div className="relative w-full sm:w-auto flex">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full md:w-[249px] pl-8 pr-4 py-1 h-8 border-solid border-[2px] border-[#5D6D7D] rounded-lg"
                    placeholder="Buscar..."
                  />
                </div>
              )}

              <button
                onClick={handleOpenCreateModal}
                className="w-full sm:w-auto bg-[#3c98cb] text-white px-3 py-1.5 rounded-md flex items-center justify-center whitespace-nowrap space-x-2 hover:bg-[#3188b8] transition duration-300"
                aria-label="Crear nueva empresa"
              >
                <Plus size={24} />
                <span>Agregar nueva empresa</span>
              </button>
            </div>
            <div className="mt-[60px] mb-4">
              <p className="text-[#5D6D7E]  text-center font-normal text-2xl">
                Selecciona la empresa a la que deseas acceder....
              </p>
            </div>


            <div className="w-full mx-auto mt-[70px] flex justify-center">
              <div className="flex justify-center w-[85%] md:w-[100%] max-w-[1350px]">
                <div className="flex flex-wrap justify-center md:gap-[80px] w-full relative">
                  {/* Flecha izquierda */}
                  {currentPage > 0 && getCurrentPageItems().length > 0 && (
                    <div
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#5D6D7D] w-8 sm:w-10 flex items-center justify-center rounded-l-3xl cursor-pointer z-10"
                      style={{ height: "320px" }}
                      onClick={goToPreviousPage}
                    >
                      <Image
                        src={carruselIzq}
                        alt="Carrusel izquierdo"
                        width={24}
                        height={24}
                      />
                    </div>
                  )}

                  {getCurrentPageItems().map((company, index) => (
                    <div key={company.companyId} className="relative flex flex-col items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipContent>
                            <p>Doble clic para editar información</p>
                          </TooltipContent>
                          <TooltipTrigger asChild>
                            <div
                              onClick={() => setSelectedCompanyId(company.companyId)}
                              onDoubleClick={() => handleOpenEditModal(company)}
                              className={`flex flex-col items-center justify-center border-[#4197CB] border-4 p-4 transition duration-200 cursor-pointer ${
                                selectedCompanyId === company.companyId ? "shadow-inner" : " hover:shadow-lg"
                              } rounded-t-3xl relative min-w-[200px] w-[calc(100%-2rem)] sm:w-[240px]  ${company.name.length >= 20 ? "ml-4" : "ml-0 "}`}
                              style={{
                                height: "320px",
                                background:
                                  selectedCompanyId === company.companyId
                                    ? "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(228,228,228,1) 100%)"
                                    : "transparent",
                                boxShadow:
                                  selectedCompanyId === company.companyId ? "0 2px 5px rgba(0,0,0,0.2)" : "none",
                              }}
                            >
                              <div className="absolute top-0 right-0 bg-[#5D6D7D] text-white rounded-tr-2xl -translate-y-0">
                                <p className="block px-3 py-2">
                                  {String(index + 1 + currentPage * itemsPerPage).padStart(2, "0")}
                                </p>
                              </div>

                              <Image src={Empresas || "/placeholder.svg"} alt="empresa" width={120} height={120} />
                              {company.name.length > 20 ? (
                                <TooltipMUI title={company.name} placement="top">
                                  <h3 className="text-lg font-semibold mt-2 text-center">
                                    {company.name.slice(0, 20)}...
                                  </h3>
                                </TooltipMUI>
                              ) : (
                                <h3 className="text-lg font-semibold mt-2 text-center">{company.name}</h3>
                              )}

                              <div className="flex mt-4 space-x-2">
                                <button
                                  className="flex text-[#5B6670]"
                                  onClick={() =>
                                    handleDeleteCompany({
                                      companyId: company.companyId,
                                      name: company.name,
                                      token: token, // O el método correcto para obtener el token
                                    })
                                  }
                                  aria-label="Eliminar empresa"
                                >
                                  <XCircle className="text-[#5B6670] hover:text-red-500 transition duration-300 mr-1" />{" "}
                                  Eliminar
                                </button>
                              </div>

                              {successMessages[company.companyId] && (
                                <div
                                  className="absolute bottom-0 w-[calc(100%+8px)] bg-[#3C98CB] border-2 border-[#3C98CB] text-white px-3 py-2 rounded-b-3xl flex items-center justify-center transform translate-y-8 text-sm"
                                  style={{ marginTop: "8px" }}
                                >
                                  <div className="bg-green-500 rounded-full p-1 mr-2">
                                    <CheckCircle size={18} color="white" />
                                  </div>
                                  <span>{successMessages[company.companyId]}</span>
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                  {(currentPage + 1) * itemsPerPage < companies.length && getCurrentPageItems().length > 0 && (
                    <div
                      className="absolute right-0  top-1/2 transform -translate-y-1/2 bg-[#5D6D7D] w-8 sm:w-10 flex items-center justify-center rounded-r-3xl cursor-pointer z-10"
                      style={{ height: "320px" }}
                      onClick={goToNextPage}
                    >
                      <Image
                        src={carruselDer}
                        alt="Carrusel derecho"
                        width={24}
                        height={24}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full max-w-6xl mx-auto mt-[100px]">
              <div className="flex justify-center">
                <div className="inline-flex items-center bg-[#EDEDED] text-[#5B89B4] rounded-xl px-4 py-2 text-md md:text-lg font-semibold">
                  <span className="ml-16">Empresas registradas:</span>
                  <span className="text-black ml-2 mr-16">{companies.length}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <div>
              <p className="text-gray-600 text-center mb-2 text-2xl" style={{ whiteSpace: "pre-line" }}>
                De momento, no tienes ninguna empresa creada <br /> Da click en{" "}
                <span className="font-bold text-black text-2xl">Crear nueva empresa</span>.
              </p>
            </div>
            <div className="flex mt-8 justify-center">
              <button
                onClick={handleOpenCreateModal}
                className="w-full sm:w-auto bg-[#3c98cb] text-white px-3 py-2 rounded-md flex items-center justify-center whitespace-nowrap space-x-2 hover:bg-[#3188b8] transition duration-300"
                aria-label="Crear nueva empresa"
              >
                <Plus size={24} />
                <span>{textButton}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Renderiza los modales aquí */}
      {isCreateModalOpen && (
        <CreateModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onCreateCompany={handleCreateCompany}
        />
      )}
      {isShowModalOpen && (
        <ShowModal
          isOpen={isShowModalOpen}
          onClose={() => setShowModalOpen(false)}
          currentCompany={selectedCompanyName}
        />
      )}
      {isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onEditCompany={handleEditCompany}
          companyId={selectedCompanyId}
          initialName={selectedCompanyName}
          token={token ?? null}
        />
      )}
      {isDeleteConfirmationOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteConfirmationOpen}
          onClose={() => setDeleteConfirmationOpen(false)}
          onConfirm={handleDeleteCompany}
          name={selectedCompanyName}
          companyId={selectedCompanyId}
          token={token ?? null}
        />
      )}

      {isModalOpenEditar && (
        <ConfirmacionEdit isOpen={isModalOpenEditar} onClose={closedModalEdit} companyName={companyName || "Empresa"} />
      )}
      {isModalOpenEliminar && (
        <ConfirmacionEliminar
          isOpen={isModalOpenEliminar}
          onClose={closedModalEliminar}
          companyName={companyName || "Empresa"}
        />
      )}
    </div>
  )
}

