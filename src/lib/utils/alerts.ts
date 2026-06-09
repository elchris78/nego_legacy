import Swal, { SweetAlertIcon } from "sweetalert2";

/**
 * @typedef {Object} AlertOptions
 * @property {boolean} success      - Indica si la alerta es de éxito o de error.
 * @property {string}  message      - Mensaje que se mostrará en el cuerpo.
 * @property {string}  [confirmText] - Texto personalizado del botón.
 * @property {() => void} [onClose]  - Callback que se ejecuta al cerrar la alerta.
 * @property {number}  [timer]       - Duración opcional en milisegundos para cerrar automáticamente.
 * 
 */

/**
 * Muestra una alerta de éxito o error.
 * @param {AlertOptions} options
 */
const showAlert = ({
  success,
  message,
  confirmText,
  onClose,
  timer,
}: {
  success: boolean;
  message: string;
  confirmText?: string;
  onClose?: () => void;
  timer?: number;
}): void => {
  const icon: SweetAlertIcon = success ? "success" : "error";

  Swal.fire({
    title: success ? "¡ÉXITO!" : "¡ERROR!",
    text: message,
    icon,
    timer, // si timer es undefined, simplemente no lo usará
    confirmButtonText:
      confirmText ?? (success ? "Cerrar" : "Volver a intentar"),
    customClass: {
      container: "swal2-container",
      popup: success ? "swal-popup-succes" : "swal-popup-error",
      confirmButton: "swal-confirm-button",
      title: "swal-title",
      actions: "swal-actions",
    },
  }).then(() => {
    // al cerrarse la alerta, invocamos el callback si existe
    if (onClose) onClose();
  });
};

export default showAlert;
