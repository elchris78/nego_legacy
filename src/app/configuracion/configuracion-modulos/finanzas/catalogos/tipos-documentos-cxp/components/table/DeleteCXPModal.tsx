"use client";

import { useEffect, useState } from "react";

import Cookies from "js-cookie";
import Swal from "sweetalert2";

import { Dialog, styled } from "@mui/material";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { deleteCuentaPorPagar, getCuentaPorPagarById } from "../../services/CXPSlice";
import showAlert from "@/lib/utils/alerts";
import { isDayPickerSingle } from "react-day-picker";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "15px",
    maxWidth: "590px",
    border: "3px solid #FF0008",
  },
}));

interface Props {
  isOpenModal: boolean;
  onCloseModal: () => void;
  id: string;
}

const DeleteModal = ({
  isOpenModal,
  onCloseModal,
  id,
}: Props) => {
  // Cookies
  const token = Cookies.get("auth-token") || "";

  // Redux actions
  const dispatch = useDispatch<AppDispatch>();

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [modalText, setModalText] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  // actualizar texto cuando lleguen las cuentas por pagar
  useEffect(() => {
    if (!isOpenModal) return;
    setModalText(`
      ¿Estás seguro que deseas eliminar este Tipo de documento de cuentas por pagar?
    `);

  }, [isOpenModal]);

  // Handlers
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await dispatch(
        deleteCuentaPorPagar({
          token,
          request: {
            id: id
          }
        })
      ).unwrap()
      showAlert({ success: true, message: "El Tipo de documento de cuentas por pagar ha sido eliminado exitosamente." })
      onCloseModal();
    } catch (error) {
      showAlert({ success: false, message: `${error}` })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledDialog
      open={isOpenModal}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onCloseModal();
        }
      }}
      fullWidth
    >
      <div className="flex flex-col gap-4 py-5 px-5 sm:px-16 lg:px-24">
        {/* Icon */}
        <div className="flex justify-center items-center">
          <WarningIcon />
        </div>

        {/* Title */}
        <div className="text-center text-[#5D6D7E]">
          <h3 className="uppercase font-semibold text-xl">¡Atención!</h3>
          {isFetching ? (
              <span className="text-xl font-light">Cargando...</span>
            ) : (
            <span className="text-xl font-light">
              {modalText ? modalText : "JIJIJA"}
            </span>
            )}

        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-8 mt-4">
          <Button
            variant="outline"
            className="px-8"
            onClick={onCloseModal}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            className="px-8"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </StyledDialog>
  );
};

const WarningIcon = () => {
  return (
    <svg
      width="110"
      height="120"
      viewBox="0 0 170 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M81.1203 18.5921C84.2199 13.3694 91.7801 13.3693 94.8797 18.5921L160.503 129.167C163.668 134.5 159.825 141.25 153.624 141.25H22.3763C16.1751 141.25 12.3317 134.5 15.4966 129.167L81.1203 18.5921Z"
        fill="white"
      />
      <path
        d="M69.641 14.5103L69.641 14.5103L7.88117 120.367L7.88013 120.369C-0.335574 134.467 9.95389 152 26.2475 152H149.753C166.039 152 176.337 134.468 168.121 120.369L168.12 120.367L106.36 14.5103L102.923 16.5153L106.36 14.5103C98.1837 0.496565 77.8172 0.496561 69.641 14.5103ZM151.198 133.368L153.19 136.836L151.198 133.368C150.758 133.62 150.257 133.756 149.745 133.758H26.2548C25.7416 133.756 25.2398 133.621 24.7998 133.368C24.3588 133.115 23.9969 132.753 23.7469 132.324C23.4971 131.895 23.3668 131.411 23.3663 130.92C23.3658 130.431 23.4943 129.948 23.7417 129.519C23.7425 129.518 23.7433 129.517 23.7441 129.515L85.4853 23.6789C85.4861 23.6776 85.4868 23.6764 85.4875 23.6751C85.7389 23.2486 86.1009 22.8903 86.5412 22.6394C86.9829 22.3875 87.4862 22.2537 88.0005 22.2537C88.5147 22.2537 89.018 22.3875 89.4597 22.6394C89.8999 22.8903 90.2619 23.2484 90.5132 23.6749C90.514 23.6762 90.5148 23.6776 90.5156 23.6789L152.255 129.518C152.256 129.52 152.257 129.522 152.258 129.524C152.504 129.952 152.632 130.434 152.631 130.922C152.63 131.412 152.499 131.896 152.25 132.325C152 132.754 151.638 133.115 151.198 133.368Z"
        fill="#FF0008"
        stroke="white"
        strokeWidth="8"
      />
      <path
        d="M94.52 113.862C94.52 115.673 93.8307 117.409 92.6036 118.69C91.3765 119.97 89.7123 120.689 87.9769 120.689C86.2416 120.689 84.5773 119.97 83.3503 118.69C82.1232 117.409 81.4338 115.673 81.4338 113.862C81.4338 112.051 82.1232 110.314 83.3503 109.034C84.5773 107.753 86.2416 107.034 87.9769 107.034C89.7123 107.034 91.3765 107.753 92.6036 109.034C93.8307 110.314 94.52 112.051 94.52 113.862ZM92.8842 57.5334C92.8842 56.1753 92.3672 54.8728 91.4469 53.9124C90.5266 52.9521 89.2784 52.4126 87.9769 52.4126C86.6754 52.4126 85.4272 52.9521 84.5069 53.9124C83.5866 54.8728 83.0696 56.1753 83.0696 57.5334V88.2579C83.0696 89.6161 83.5866 90.9185 84.5069 91.8789C85.4272 92.8392 86.6754 93.3787 87.9769 93.3787C89.2784 93.3787 90.5266 92.8392 91.4469 91.8789C92.3672 90.9185 92.8842 89.6161 92.8842 88.2579V57.5334Z"
        fill="#FF0008"
      />
    </svg>
  );
};

export default DeleteModal;
