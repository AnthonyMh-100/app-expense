import Swal, { type SweetAlertIcon } from "sweetalert2";

export interface ActionResult {
  ok: boolean;
  message: string;
}

interface AlertConfig {
  title: string;
  icon: SweetAlertIcon;
  message: string;
}

const configFor = (result: ActionResult): AlertConfig => ({
  icon: result.ok ? "success" : "error",
  title: result.ok ? "¡Hecho!" : "No se pudo completar",
  message: result.message,
});

const buildOptions = ({ icon, title, message }: AlertConfig) => ({
  icon,
  title,
  text: message,
  buttonsStyling: false,
  allowOutsideClick: false,
  showConfirmButton: icon !== "success",
  timer: icon === "success" ? 2000 : undefined,
  confirmButtonText: "Entendido",
  customClass: {
    confirmButton:
      "inline-flex cursor-pointer items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500",
  },
});

export const alertResult = async (result: ActionResult): Promise<void> => {
  await Swal.fire(buildOptions(configFor(result)));
};

export const alertWarning = async (
  title: string,
  message: string,
): Promise<void> => {
  await Swal.fire(buildOptions({ icon: "warning", title, message }));
};

export const alertInfo = async (title: string, message: string): Promise<void> => {
  await Swal.fire(buildOptions({ icon: "info", title, message }));
};