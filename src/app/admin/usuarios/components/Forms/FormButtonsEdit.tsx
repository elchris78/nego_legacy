import { Button } from "@/ui/button";
import { createUser, editUser } from "../../services/usersActions";

import { toast } from "react-toastify";
import { ToastErrorMsg } from "@/Toast/ToastErrorMsg";
import { ToastSuccessMsg } from "@/Toast/ToastSuccessMsg";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useUserForm } from "./UserFormContext";
import Cookies from "js-cookie";
import { TransformSharp } from "@mui/icons-material";
import { Trash2 } from "lucide-react";
import { DeleteUserModal } from "./DeleteUserModal";

export const FormButtonsEdit = () => {
  const { handleSubmitForms, currentUser } = useUserForm();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Create user function
  const onAddUser = async () => {
    try {
      setIsLoading(true);
  
      const body = await handleSubmitForms();
      if (body === undefined) return;
  
      const resp = await createUser({
        token,
        body,
      });
  
      if (resp !== undefined && resp.success) {
        // toast(
        //   <ToastSuccessMsg description="Se ha creado el usuario de forma exitosa" />
        // );
        router.push("/admin/usuarios");  
      }
    } catch (error: any) {
      const errorMsg = error?.message;
      // toast(
      //   <ToastErrorMsg
      //     description={
      //       errorMsg ?? "No se pudo crear el usuario de forma exitosa"
      //     }
      //   />
      // );
      console.log("🚀 ~ onAddUser ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };  

  // Edit user function
  const onEditUser = async () => {
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
        // toast(
        //   <ToastSuccessMsg description="Se ha editado el usuario de forma exitosa" />
        // );
        window.location.reload(); 
      }
    } catch (error: any) {
      const errorMsg = error?.message;
      // toast(
      //   <ToastErrorMsg
      //     description={
      //       errorMsg ?? "No se pudo editar el usuario de forma exitosa"
      //     }
      //   />
      // );
      console.log("🚀 ~ onEditUser ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
          {( mode === "edit") && (
            <Button
              type="button"
              variant={"default"}
              className="min-w-36 ml-4"
              onClick={onHandleSubmit}
              disabled={isLoading}
            >
              Actualizar permisos
            </Button>
          )}
    </>
  );
};
