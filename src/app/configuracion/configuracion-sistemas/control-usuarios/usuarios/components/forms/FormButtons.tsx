"use client";

import { Button } from "@/components/ui/button";
import { createUser, editUser } from "../../services/usersActions";
import { DeleteUserModal } from "./DeleteUserModal";
import { toast } from "react-toastify";
import { ToastErrorMsg } from "@/components/ui/Toast/ToastErrorMsg";
import { ToastSuccessMsg } from "@/components/ui/Toast/ToastSuccessMsg";
import { Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useUserForm } from "./UsersFormContext";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Link from "next/link";
import { assignClaims, createUserNoClaims } from "../../services/usersCompanySlice";
import { AppDispatch } from "@/lib/store/store";
import { useDispatch } from "react-redux";
import alerta from '@/Asset/alerta 1.png';


export const FormButtons = () => {
  const { handleSubmitForms, currentUser, handleAssignClaims, isFormIncomplete, isPermissionsFormIncomplete } = useUserForm();
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
  }

  // Create user function
  const onAddUser = async () => {
    if (isFormIncomplete) return;
    try {
      setIsLoading(true);
  
      const body = await handleSubmitForms();
      if (body === undefined) return;
      console.log("🚀 ~ onAddUser ~ bodyyyy:", body);
      const resp = await dispatch(
        createUserNoClaims({ token, body }) 
      ).unwrap();
  
      if (resp !== undefined) {
        Swal.fire({
          title: "¡ÉXITO!",
          text: "Se ha creado el usuario de forma exitosa",
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          }
        });
        router.push(
          "/configuracion/configuracion-sistemas/control-usuarios/usuarios"
        );
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
        text: errorMsg ,
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
    try {
      setIsLoading(true);
  
      const body = await handleSubmitForms();
      if (body === undefined) return;
  
      const { password, confirmPassword, ...bodyRest } = body;
      const resp = await editUser({
        token,
        body: { ...bodyRest, id, password, confirmPassword, roleTemplateId: Array.isArray(bodyRest.roleTemplateId) 
      ? bodyRest.roleTemplateId 
      : [bodyRest.roleTemplateId] },
        id,
      });
      console.log("🚀 ~ onEditUser:", body);
  
      if (resp !== undefined && resp.success) {
        Swal.fire({
          title: "¡ÉXITO!",
          text: "Se han actualizado los datos generales del usuario de forma exitosa.",
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes',
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
          }
        });
        router.push(
          "/configuracion/configuracion-sistemas/control-usuarios/usuarios"
        );
      }
    } catch (error: any) {
      let errorMsg = "No se pudo actualizar los datos generales del usuario de forma exitosa.";
  
      // Manejo de errores de conexión
      if (error.message === "Failed to fetch" || error.message === "NetworkError when attempting to fetch resource.") {
        errorMsg = "No se pudo actualizar los datos generales del usuario de forma exitosa.";
      } else {
        errorMsg = error?.message || errorMsg;
      }
  
      Swal.fire({
        title: "¡ERROR!",
        text: errorMsg || "No se pudo actualizar los datos generales del usuario de forma exitosa.",
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
            router.push("/configuracion/configuracion-sistemas/control-usuarios/usuarios");
        }
    });
};
  

  return (
    <>
      <div className="flex items-center justify-center mb-8 w-full lg:mt-40 md:mt-16">
        <div className="flex flex-col gap-5 sm:flex-row w-full justify-center">
          { (mode !== 'editw') && (
            <Button
            type="button"
            variant={"outline"}
            className="w-full sm:w-36" 
            onClick={() => router.push("/configuracion/configuracion-sistemas/control-usuarios/usuarios")}
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
          {mode === "view" && currentUser.userType === 'Interno' && (
            <Button
              type="button"
              variant={"default"}
              className="min-w-36"
              disabled={isLoading || isFormIncomplete}
            >
              <Link
                href={
                  `/configuracion/configuracion-sistemas/control-usuarios/usuarios/formUser?mode=edit&id=${id}`
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
        id={currentUser?.userId}
      />
    </>
  );
};
