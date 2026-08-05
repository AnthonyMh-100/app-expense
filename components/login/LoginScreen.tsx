"use client";

import { useState } from "react";
import moment from "moment";
import {
  FiArrowRight,
  FiBriefcase,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";
import { login, register } from "@/actions/actionsAuth/action-auth";
import { alertResult, alertWarning } from "@/components/alerts";

type Mode = "login" | "register";

const LoginScreen = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "login") {
      if (!email.trim() || !password) {
        await alertWarning(
          "Datos incompletos",
          "Ingresa tu correo y contraseña.",
        );
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await login(email, password, remember);
        if (!result.ok) {
          await alertResult(result);
        }
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!companyName.trim() || !email.trim() || !password) {
      await alertWarning("Datos incompletos", "Completa todos los campos.");
      return;
    }
    if (password.length < 6) {
      await alertWarning(
        "Contraseña débil",
        "La contraseña debe tener al menos 6 caracteres.",
      );
      return;
    }
    if (password !== confirmPassword) {
      await alertWarning(
        "Las contraseñas no coinciden",
        "Verifica y vuelve a intentarlo.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register(companyName, email, password);
      if (!result.ok) {
        await alertResult(result);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";

  const renderPasswordInput = (
    id: string,
    autoComplete: string,
    value: string,
    onChange: (value: string) => void,
    shown: boolean,
    onToggleShow: () => void,
    showLabel: string,
    hideLabel: string,
  ) => (
    <div className="relative">
      <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        id={id}
        type={shown ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder="••••••••"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClassName} pl-10 pr-11`}
      />
      <button
        type="button"
        onClick={onToggleShow}
        aria-label={shown ? hideLabel : showLabel}
        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
      >
        {shown ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
      </button>
    </div>
  );

  const renderField = (
    id: string,
    label: string,
    type: string,
    autoComplete: string,
    placeholder: string,
    value: string,
    onChange: (value: string) => void,
    icon: React.ReactNode,
  ) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClassName} pl-10`}
        />
      </div>
    </div>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-xl font-bold text-white shadow-lg shadow-indigo-500/30">
            S/
          </span>
          <div>
            <p className="text-base font-semibold text-slate-900">Caja diaria</p>
            <p className="text-sm text-slate-500">Gestión de imprenta</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-xl shadow-slate-200/60 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-brand-gradient"
          />
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition ${
                mode === "login"
                  ? "bg-brand-gradient text-white shadow-md shadow-indigo-500/30"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition ${
                mode === "register"
                  ? "bg-brand-gradient text-white shadow-md shadow-indigo-500/30"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Crear negocio
            </button>
          </div>

          {mode === "login" ? (
            <>
              <h1 className="mt-6 text-xl font-bold tracking-tight text-slate-900">
                Bienvenido de nuevo
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Ingresa tus credenciales para acceder al panel.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-6 text-xl font-bold tracking-tight text-slate-900">
                Crea tu negocio
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Registra tu empresa y comienza a gestionar tu caja diaria.
              </p>
            </>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {mode === "register" && (
              <>
                {renderField(
                  "register-company",
                  "Nombre del negocio",
                  "text",
                  "organization",
                  "Ej. Imprenta Huancayo",
                  companyName,
                  setCompanyName,
                  <FiBriefcase className="h-4 w-4" />,
                )}
              </>
            )}

            {renderField(
              "login-email",
              "Correo electrónico",
              "email",
              "email",
              "usuario@imprenta.pe",
              email,
              setEmail,
              <FiMail className="h-4 w-4" />,
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-slate-700"
              >
                Contraseña
              </label>
              {renderPasswordInput(
                "login-password",
                mode === "login" ? "current-password" : "new-password",
                password,
                setPassword,
                showPassword,
                () => setShowPassword((value) => !value),
                "Mostrar contraseña",
                "Ocultar contraseña",
              )}
            </div>

            {mode === "register" && (
              <div className="space-y-1.5">
                <label
                  htmlFor="register-confirm-password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Confirmar contraseña
                </label>
                {renderPasswordInput(
                  "register-confirm-password",
                  "new-password",
                  confirmPassword,
                  setConfirmPassword,
                  showConfirmPassword,
                  () => setShowConfirmPassword((value) => !value),
                  "Mostrar contraseña",
                  "Ocultar contraseña",
                )}
              </div>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between gap-3">
                <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                  />
                  Recordarme
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-gradient px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  {mode === "login" ? "Verificando..." : "Creando cuenta..."}
                </>
              ) : (
                <>
                  {mode === "login" ? "Ingresar al panel" : "Crear mi cuenta"}
                  <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-center text-sm text-slate-500">
          {mode === "login" ? (
            <>
              <span>¿Aún no tienes cuenta?</span>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="cursor-pointer font-medium text-indigo-600 transition hover:text-indigo-800"
              >
                Crear mi negocio
              </button>
            </>
          ) : (
            <>
              <span>¿Ya tienes cuenta?</span>
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="cursor-pointer font-medium text-indigo-600 transition hover:text-indigo-800"
              >
                Iniciar sesión
              </button>
            </>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          © {moment().year()} Caja diaria de imprenta. Todos los
          derechos reservados.
        </p>
      </div>
    </main>
  );
};

export default LoginScreen;