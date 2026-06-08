import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { SafeParseReturnType } from "zod";
import { InputField } from "../formFields/FormFields";
import { createTenant, type Tenant } from "../../service/propiedades";
import { tenantSchema } from "../../schemas/crearPropiedadSchema";
import "../../pages/NuevaPropiedadPage.css";

function extractErrors<T extends object>(
  result: SafeParseReturnType<T, T>,
): Partial<Record<keyof T, string>> {
  const errs: Partial<Record<keyof T, string>> = {};
  if (result.success) return errs;
  result.error.issues.forEach((issue) => {
    const key = issue.path[0] as keyof T;
    if (key && !errs[key]) errs[key] = issue.message;
  });
  return errs;
}

export interface TenantModalProps {
  onClose: () => void;
  onSuccess: (tenant: Tenant) => void;
}

export function TenantModal({ onClose, onSuccess }: TenantModalProps) {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<"firstName" | "lastName" | "email" | "phone", string>>
  >({});
  const [isCreating, setIsCreating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const result = tenantSchema.safeParse({
      firstName,
      lastName,
      email,
      phone,
    });
    if (!result.success) {
      setErrors(extractErrors(result));
      return;
    }
    setApiError(null);
    setIsCreating(true);
    try {
      const { data: newTenant } = await createTenant({
        firstName,
        lastName,
        email,
        phone,
      });
      queryClient.setQueryData<Tenant[]>(["tenants"], (prev) =>
        prev ? [...prev, newTenant] : [newTenant],
      );
      onSuccess(newTenant);
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : "Error al crear el inquilino",
      );
      setIsCreating(false);
    }
  };

  return (
    <div className="np-modal" role="dialog" aria-modal="true">
      <div className="np-modal__overlay" onClick={onClose} />
      <div className="np-modal__content">
        <div className="np-modal__header">
          <h3 className="np-modal__title">Nuevo inquilino</h3>
          <button
            className="np-modal__close"
            onClick={onClose}
            type="button"
            disabled={isCreating}
          >
            ×
          </button>
        </div>
        <div className="np-modal__body">
          {apiError && (
            <div className="np-feedback np-feedback--error" role="alert">
              <span className="np-feedback__icon">✕</span>
              <div>
                <p className="np-feedback__title">Error</p>
                <p className="np-feedback__body">{apiError}</p>
              </div>
            </div>
          )}
          <div className="np-grid-2">
            <InputField
              label="Nombre *"
              placeholder="Pedro"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
            />
            <InputField
              label="Apellido *"
              placeholder="Pérez"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
            />
          </div>
          <InputField
            label="Email *"
            type="email"
            placeholder="inquilino@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <InputField
            label="Teléfono *"
            type="tel"
            placeholder="1145238891"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />
        </div>
        <div className="np-modal__footer">
          <button
            type="button"
            className="np-btn np-btn--secondary"
            onClick={onClose}
            disabled={isCreating}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="np-btn np-btn--primary"
            onClick={handleSubmit}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <span className="np-spinner" />
                Creando...
              </>
            ) : (
              "Guardar inquilino"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
