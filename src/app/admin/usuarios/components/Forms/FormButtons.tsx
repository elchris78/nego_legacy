import { Button } from "@/ui/button";
import { createUser, editUser } from "../../services/usersActions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useUserForm } from "./UserFormContext";
import Cookies from "js-cookie";
import { DeleteUserModal } from "./DeleteUserModal";
import { createUserNoClaims, assignClaims } from "../../services/usersSlice";
import { AppDispatch } from "@/lib/store/store";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import Link from "next/link";
import alerta from '@/Asset/alerta 1.png';
export const FormButtons = () => {
  
  const { handleSubmitForms, currentUser, handleAssignClaims, isFormIncomplete } = useUserForm();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const onHandleSubmit = async () => {
    switch (mode) {
      case "new":
        onAddUser();
        break;
      case "edit":
        onEditUser();
        break;
      default:
        break;
    }
  };

  const onHandleAssignClaims = async () => {
    switch (mode) {
      case "editw":
        onAssignClaims();
        break;
      default:
        break;
    }
  };

  // Create user function
  const onAddUser = async () => {
    if (isFormIncomplete) return;
    try {
      setIsLoading(true);
  
      const body = await handleSubmitForms();
      if (body === undefined) return;
      console.log("🚀 ~ onAddUser ~ body", body);
      const resp = await dispatch(
        createUserNoClaims({ token, body })
      ).unwrap();
  
      if (resp !== undefined && resp.success) {
        Swal.fire({
          title: "¡ÉXITO!",
          text: resp.success ? "Se ha creado el usuario de forma exitosa" : "Hubo un problema al crear el usuario.",
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes', 
            confirmButton: 'swal-confirm-button', 
            title: 'swal-title', 
          }
        });
        router.push("/admin/usuarios");  
      }
    } catch (error: any) {
      let errorMsg = error;
  
      // Manejo de errores de conexión
      if (error.message === "Failed to fetch" || error.message === "NetworkError when attempting to fetch resource.") {
        errorMsg = "No se pudo crear el usuario de forma exitosa";
      } else {
        errorMsg = error?.message || errorMsg;
      }
  
      Swal.fire({
        title: "¡ERROR!",
        text: errorMsg,
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: {
          container: 'swal2-container',
          popup: 'swal-popup-error', 
          confirmButton: 'swal-confirm-button', 
          title: 'swal-title', 
        }
      });
      console.error("🚀 ~ onAddUser ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Edit user function
  const onEditUser = async () => {
    if (isFormIncomplete) return;
    console.log("EDIIIIIIIIIT", currentUser);
    try {
      setIsLoading(true);
  
      const body = await handleSubmitForms();
      if (body === undefined) return;
  
      const { password, confirmPassword, ...bodyRest } = body;
      const resp = await editUser({
        token,
        body: { ...bodyRest, id, password, confirmPassword },
      });
  
      if (resp !== undefined && resp.success) {
        Swal.fire({
          title: "¡ÉXITO!",
          text: resp.success ? "Se han actualizado los datos generales del usuario de forma exitosa." : "Hubo un problema al editar el usuario.",
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes', 
            confirmButton: 'swal-confirm-button', 
            title: 'swal-title', 
          }
        });
        router.push("/admin/usuarios");
      }
    } catch (error: any) {
      let errorMsg = error;
  
      // Manejo de errores de conexión
      if (error.message === "Failed to fetch" || error.message === "NetworkError when attempting to fetch resource.") {
        errorMsg = "Error de conexión. Verifica tu conexión a internet.";
      } else {
        errorMsg = error?.message || errorMsg;
      }
  
      Swal.fire({
        title: "¡ERROR!",
        text: errorMsg,
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: {
          container: 'swal2-container',
          popup: 'swal-popup-error', 
          confirmButton: 'swal-confirm-button', 
          title: 'swal-title', 
        }
      });
      console.error("🚀 ~ onEditUser ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Assign claims function
  const onAssignClaims = async () => {
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
        title: "¿Seguro que desea salir?",
        text: "Se perderán los cambios no guardados en caso de tener.",
        imageUrl: alerta.src, 
        imageWidth: 120,
        imageHeight: 100,
        showCancelButton: true,
        cancelButtonText: "Cancelar", 
        confirmButtonText: "Aceptar",
    }).then((result) => {
        if (result.isConfirmed) {
            router.push("/admin/usuarios");
        }
    });
};





  return (
    <>
      <div className="flex items-center justify-center my-8 w-full px-4">
        <div className="flex flex-col gap-5 sm:flex-row w-full justify-center">
          { (mode !== 'editw') && (
            <Button
            type="button"
            variant={"outline"}
            className="w-full sm:w-36" 
            onClick={() => router.push("/admin/usuarios")}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          )}
          
          {(mode === "new" || mode === "edit") && (
            <Button
              type="button"
              variant={"default"}
              className="min-w-36"
              onClick={onHandleSubmit}
              disabled={isLoading || isFormIncomplete}
            >
              {mode === "edit" ? "Actualizar" : "Guardar"}
            </Button>
          )}
          {(mode === "editw") && (
            <Button
              type="button"
              variant={"default"}
              className="min-w-36"
              onClick={onHandleAssignClaims}
              disabled={isLoading}
            > 
              Salir
            </Button>
          )}
          {/* {mode === "edit" && (
            <Button
              type="button"
              variant={"destructive"}
              className="bg-[#cf5459] hover:bg-[#d86064] min-w-36"
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading}
            >
              <Trash2 size={16} className="mr-2" />
              Eliminar
            </Button>
          )} */}
          {mode === "view" &&  (
            <Button
              type="button"
              variant={"default"}
              className="min-w-36"
              disabled={isLoading}
            >
              <Link
                href={
                  `/admin/usuarios/form?mode=edit&id=${id}`
                }
              >
                Ir a actualizar
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Delete user modal */}
      <DeleteUserModal
        isOpenModal={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
        id={currentUser?.id}
      />
    </>
  );
};
