import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { SafeParseReturnType } from "zod";
import { InputField, SelectField } from "../components/formFields/FormFields";
import {
  SelectOrCreate,
  type SelectOrCreateItem,
} from "../components/ui/SelectOrCreate";
import { useBuildings } from "../hooks/useBuildings";
import { useTenants } from "../hooks/useTenants";
import { useAltaPropiedad } from "../hooks/useAltaPropiedad";
import {
  createBuilding,
  createBuildingExpense,
  createTenant,
  type Building,
  type Tenant,
  type ExpenseType,
} from "../service/propiedades";
import {
  buildingSchema,
  tenantSchema,
  unitSchema as step3Schema,
  contractSchema as step4Schema,
} from "../schemas/crearPropiedadSchema";
import "./NuevaPropiedadPage.css";
import { MAX_UPLOAD_BYTES, ALLOWED_CONTRACT_MIME } from "../config/fileLimits";

const UNIT_TYPE_OPTIONS = [
  { value: "DEPARTAMENTO", label: "Departamento" },
  { value: "OFICINA", label: "Oficina" },
  { value: "LOCAL", label: "Local" },
];

const EXPENSE_TYPE_OPTIONS: { value: ExpenseType; label: string }[] = [
  { value: "MAINTENANCE", label: "Mantenimiento" },
  { value: "REPAIR", label: "Reparación" },
  { value: "UTILITIES", label: "Servicios" },
  { value: "TAXES", label: "Impuestos" },
  { value: "ADMINISTRATION", label: "Administración" },
];

type Step = 1 | 2 | 3;

interface ExpenseFormItem {
  id: string;
  type: ExpenseType;
  amount: string;
  description: string;
  dueDate: string;
}

interface WizardData {
  buildingId: number | null;
  tenantId: number | null;
  floor: string;
  area: string;
  rooms: string;
  unitType: string;
  contractAmount: string;
  contractDueDate: string;
}

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

interface BuildingModalProps {
  onClose: () => void;
  onSuccess: (building: Building) => void;
}

function BuildingModal({ onClose, onSuccess }: BuildingModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [expenses, setExpenses] = useState<ExpenseFormItem[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<"name" | "address", string>>
  >({});
  const [isCreating, setIsCreating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const addExpense = () =>
    setExpenses((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "MAINTENANCE",
        amount: "",
        description: "",
        dueDate: "",
      },
    ]);

  const removeExpense = (id: string) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id));

  const updateExpense = (
    id: string,
    field: keyof ExpenseFormItem,
    value: string,
  ) =>
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );

  const handleSubmit = async () => {
    const result = buildingSchema.safeParse({ name, address });
    if (!result.success) {
      setErrors(extractErrors(result));
      return;
    }
    setApiError(null);
    setIsCreating(true);
    try {
      const { data: newBuilding } = await createBuilding({ name, address });
      const validExpenses = expenses.filter((e) => e.amount && e.dueDate);
      for (const exp of validExpenses) {
        await createBuildingExpense(newBuilding.id, {
          type: exp.type,
          amount: Number(exp.amount),
          description: exp.description || undefined,
          dueDate: exp.dueDate,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      onSuccess(newBuilding);
    } catch (err: unknown) {
      let message = "Error al crear el edificio";
      if (axios.isAxiosError(err)) {
        const backendMsg: string = err.response?.data?.message ?? "";
        if (
          backendMsg.includes("already exists") &&
          backendMsg.includes("address")
        ) {
          message =
            "Ya existe un edificio con esa dirección. Usá una dirección diferente.";
        } else if (
          backendMsg.includes("already exists") &&
          backendMsg.includes("name")
        ) {
          message =
            "Ya existe un edificio con ese nombre. Usá un nombre diferente.";
        } else if (err instanceof Error) {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setApiError(message);
      setIsCreating(false);
    }
  };

  return (
    <div className="np-modal" role="dialog" aria-modal="true">
      <div className="np-modal__overlay" onClick={onClose} />
      <div className="np-modal__content">
        <div className="np-modal__header">
          <h3 className="np-modal__title">Nuevo edificio</h3>
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
          <InputField
            label="Nombre *"
            placeholder="Ej: Torre Solaris I"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <InputField
            label="Dirección *"
            placeholder="Ej: Av. Corrientes 1234, CABA"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={errors.address}
          />
          {expenses.length > 0 && (
            <div className="np-expense-list">
              <div className="np-section-title">Expensas</div>
              {expenses.map((exp) => (
                <div key={exp.id} className="np-expense-item">
                  <div className="np-grid-2">
                    <SelectField
                      label="Tipo"
                      options={EXPENSE_TYPE_OPTIONS}
                      value={exp.type}
                      onChange={(e) =>
                        updateExpense(exp.id, "type", e.target.value)
                      }
                    />
                    <InputField
                      label="Monto"
                      type="number"
                      min="1"
                      placeholder="0"
                      value={exp.amount}
                      onChange={(e) =>
                        updateExpense(exp.id, "amount", e.target.value)
                      }
                    />
                  </div>
                  <div className="np-grid-2">
                    <InputField
                      label="Descripción"
                      placeholder="Opcional"
                      value={exp.description}
                      onChange={(e) =>
                        updateExpense(exp.id, "description", e.target.value)
                      }
                    />
                    <InputField
                      label="Vencimiento"
                      type="date"
                      value={exp.dueDate}
                      onChange={(e) =>
                        updateExpense(exp.id, "dueDate", e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className="np-expense-remove"
                    onClick={() => removeExpense(exp.id)}
                    disabled={isCreating}
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          )}
          {false && (
            /* Temporalmente lo deshabilito porque el back requiere que el edificio tenga propiedades para cargar expensas??? */ <button
              type="button"
              className="np-btn-ghost"
              onClick={addExpense}
              disabled={isCreating}
            >
              + Agregar expensa
            </button>
          )}
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
              "Guardar edificio"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface TenantModalProps {
  onClose: () => void;
  onSuccess: (tenant: Tenant) => void;
}

function TenantModal({ onClose, onSuccess }: TenantModalProps) {
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
      queryClient.setQueryData<import("../service/propiedades").Tenant[]>(
        ["tenants"],
        (prev) => (prev ? [...prev, newTenant] : [newTenant]),
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

const STEPS: { number: Step; label: string }[] = [
  { number: 1, label: "Edificio" },
  { number: 2, label: "Inquilino" },
  { number: 3, label: "Unidad y contrato" },
];

function StepIndicator({ currentStep }: { currentStep: Step }) {
  return (
    <div className="np-steps">
      {STEPS.map((s, i) => (
        <div key={s.number} className="np-step-wrapper">
          <div
            className={`np-step${currentStep === s.number ? " np-step--active" : ""}${currentStep > s.number ? " np-step--done" : ""}`}
          >
            <div className="np-step__circle">
              {currentStep > s.number ? "✓" : s.number}
            </div>
            <span className="np-step__label">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`np-step__line${currentStep > s.number ? " np-step__line--done" : ""}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SuccessScreen({ onReset }: { onReset: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="np-page">
      <div>
        <div className="np-page__section-label">Administración de Cartera</div>
        <h1 className="np-page__title">Alta de Propiedad</h1>
      </div>
      <div className="np-card">
        <div className="np-success">
          <div className="np-success__icon">✓</div>
          <h2 className="np-success__title">Propiedad registrada</h2>
          <p className="np-success__subtitle">
            La unidad fue incorporada al portafolio correctamente.
          </p>
          <div className="np-success__actions">
            <button className="np-btn np-btn--secondary" onClick={onReset}>
              Registrar otra
            </button>
            <button
              className="np-btn np-btn--primary"
              onClick={() => navigate("/dashboard")}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const INITIAL_DATA: WizardData = {
  buildingId: null,
  tenantId: null,
  floor: "",
  area: "",
  rooms: "",
  unitType: "",
  contractAmount: "",
  contractDueDate: "",
};

export default function NuevaPropiedadPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [contractError, setContractError] = useState<string | null>(null);
  const [step1Error, setStep1Error] = useState<string | undefined>();
  const [step3Errors, setStep3Errors] = useState<
    Partial<
      Record<
        | "floor"
        | "area"
        | "rooms"
        | "unitType"
        | "contractAmount"
        | "contractDueDate",
        string
      >
    >
  >({});
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);

  const { data: buildings = [], isLoading: isLoadingBuildings } =
    useBuildings();
  const { data: tenants = [], isLoading: isLoadingTenants } = useTenants();
  const altaPropiedad = useAltaPropiedad();

  const buildingItems: SelectOrCreateItem[] = buildings
    ? buildings.map((b) => ({
        id: b.id,
        primaryLabel: b.name,
        secondaryLabel: b.address,
      }))
    : [];

  const tenantItems: SelectOrCreateItem[] = tenants
    ? tenants.map((t) => ({
        id: t.id,
        primaryLabel: `${t.firstName} ${t.lastName}`,
        secondaryLabel: t.email,
      }))
    : [];

  const setField = <K extends keyof WizardData>(
    field: K,
    value: WizardData[K],
  ) => setData((prev) => ({ ...prev, [field]: value }));

  const goNext = () => {
    if (step === 1) {
      if (!data.buildingId) {
        setStep1Error("Debe seleccionar o crear un edificio");
        return;
      }
      setStep1Error(undefined);
    }
    setStep((prev) => (prev < 3 ? ((prev + 1) as Step) : prev));
  };

  const goBack = () =>
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));

  const handleSubmit = () => {
    const unitResult = step3Schema.safeParse({
      floor: data.floor,
      area: data.area,
      rooms: data.rooms,
      unitType: data.unitType,
    });
    const contractResult = step4Schema.safeParse({
      contractAmount: data.contractAmount,
      contractDueDate: data.contractDueDate,
    });
    const errs = {
      ...(!unitResult.success ? extractErrors(unitResult) : {}),
      ...(!contractResult.success ? extractErrors(contractResult) : {}),
    };
    if (Object.keys(errs).length > 0) {
      setStep3Errors(errs);
      return;
    }
    setStep3Errors({});
    if (contractError) return;

    altaPropiedad.mutate({
      buildingId: data.buildingId!,
      tenantId: data.tenantId,
      floor: data.floor,
      area: Number(data.area),
      rooms: Number(data.rooms),
      unitType: data.unitType,
      contractAmount: Number(data.contractAmount),
      contractDueDate: data.contractDueDate,
      contractFile: contractFile,
    });
  };

  const handleReset = () => {
    setStep(1);
    setData(INITIAL_DATA);
    setStep1Error(undefined);
    setStep3Errors({});
    altaPropiedad.reset();
  };

  const handleContractFileChange = (f?: File) => {
    setContractError(null);
    if (!f) {
      setContractFile(null);
      return;
    }
    if (f.type !== ALLOWED_CONTRACT_MIME) {
      setContractError("El contrato debe ser un archivo PDF");
      setContractFile(null);
      return;
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      setContractError(
        `El archivo supera el límite de ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB`,
      );
      setContractFile(null);
      return;
    }
    setContractFile(f);
  };

  if (altaPropiedad.isSuccess) {
    return <SuccessScreen onReset={handleReset} />;
  }

  return (
    <>
      {showBuildingModal && (
        <BuildingModal
          onClose={() => setShowBuildingModal(false)}
          onSuccess={(building) => {
            setField("buildingId", building.id);
            setStep1Error(undefined);
            setShowBuildingModal(false);
          }}
        />
      )}
      {showTenantModal && (
        <TenantModal
          onClose={() => setShowTenantModal(false)}
          onSuccess={(tenant) => {
            setField("tenantId", tenant.id);
            setShowTenantModal(false);
          }}
        />
      )}
      <div className="np-page">
        <div>
          <div className="np-page__section-label">
            Administración de Cartera
          </div>
          <h1 className="np-page__title">Alta de Propiedad</h1>
          <p className="np-page__subtitle">
            Completá los datos paso a paso para registrar una nueva unidad en el
            portafolio.
          </p>
        </div>

        <StepIndicator currentStep={step} />

        <div className="np-card">
          {step === 1 && (
            <div className="np-form">
              <div className="np-section">
                <div className="np-section-title">Edificio</div>
                <p className="np-step__hint">
                  Buscá y seleccioná el edificio al que pertenece la unidad, o
                  creá uno nuevo junto con sus expensas.
                </p>
                <div className="np-field">
                  <label className="np-label">Edificio *</label>
                  <SelectOrCreate
                    items={buildingItems}
                    isLoading={isLoadingBuildings}
                    selectedId={data.buildingId}
                    onSelect={(id) => {
                      setField("buildingId", id);
                      setStep1Error(undefined);
                    }}
                    onClear={() => setField("buildingId", null)}
                    onCreateNew={() => setShowBuildingModal(true)}
                    searchPlaceholder="Buscar edificio..."
                    createLabel="Crear nuevo edificio"
                    error={step1Error}
                  />
                </div>
              </div>
              <div className="np-actions">
                <button
                  type="button"
                  className="np-btn np-btn--secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="np-btn np-btn--primary"
                  onClick={goNext}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="np-form">
              <div className="np-section">
                <div className="np-section-title">Inquilino</div>
                <p className="np-step__hint">
                  Asociá un inquilino existente o creá uno nuevo. Si la unidad
                  está libre podés omitir este paso.
                </p>
                <div className="np-field">
                  <label className="np-label">
                    Inquilino{" "}
                    <span className="np-label--optional">(opcional)</span>
                  </label>
                  <SelectOrCreate
                    items={tenantItems}
                    isLoading={isLoadingTenants}
                    selectedId={data.tenantId}
                    onSelect={(id) => setField("tenantId", id)}
                    onClear={() => setField("tenantId", null)}
                    onCreateNew={() => setShowTenantModal(true)}
                    searchPlaceholder="Buscar inquilino..."
                    createLabel="Crear nuevo inquilino"
                  />
                </div>
              </div>
              <div className="np-actions">
                <button
                  type="button"
                  className="np-btn np-btn--secondary"
                  onClick={goBack}
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  className="np-btn np-btn--primary"
                  onClick={goNext}
                >
                  {data.tenantId ? "Continuar →" : "Omitir por ahora →"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="np-form">
              <div className="np-section">
                <div className="np-section-title">Datos de la unidad</div>
                <div className="np-grid-2">
                  <InputField
                    label="Piso / Unidad *"
                    placeholder="Ej: 12B"
                    value={data.floor}
                    onChange={(e) => setField("floor", e.target.value)}
                    error={step3Errors.floor}
                  />
                  <SelectField
                    label="Tipo de unidad *"
                    placeholder="Seleccione tipo..."
                    options={UNIT_TYPE_OPTIONS}
                    value={data.unitType}
                    onChange={(e) => setField("unitType", e.target.value)}
                    error={step3Errors.unitType}
                  />
                </div>
                <div className="np-grid-2">
                  <InputField
                    label="Superficie (m²) *"
                    placeholder="85"
                    type="number"
                    min="1"
                    value={data.area}
                    onChange={(e) => setField("area", e.target.value)}
                    error={step3Errors.area}
                  />
                  <InputField
                    label="Ambientes *"
                    placeholder="3"
                    type="number"
                    min="1"
                    step="1"
                    value={data.rooms}
                    onChange={(e) => setField("rooms", e.target.value)}
                    error={step3Errors.rooms}
                  />
                </div>
              </div>
              <div className="np-section">
                <div className="np-section-title">Contrato de alquiler</div>
                <div className="np-grid-2">
                  <InputField
                    label="Monto mensual (ARS) *"
                    placeholder="Ej: 250000"
                    type="number"
                    min="1"
                    value={data.contractAmount}
                    onChange={(e) => setField("contractAmount", e.target.value)}
                    error={step3Errors.contractAmount}
                  />
                  <InputField
                    label="Fecha de vencimiento *"
                    type="date"
                    value={data.contractDueDate}
                    onChange={(e) =>
                      setField("contractDueDate", e.target.value)
                    }
                    error={step3Errors.contractDueDate}
                  />
                </div>
                <div className="np-field">
                  <label className="np-label">
                    Contrato (archivo, opcional)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      handleContractFileChange(e.target.files?.[0])
                    }
                  />
                  {contractFile && (
                    <p className="np-feedback">Archivo: {contractFile.name}</p>
                  )}
                  {contractError && (
                    <p className="np-feedback np-feedback--error">
                      {contractError}
                    </p>
                  )}
                </div>
              </div>

              {altaPropiedad.isError &&
                (() => {
                  const msg =
                    altaPropiedad.error instanceof Error
                      ? altaPropiedad.error.message
                      : "Error inesperado del servidor.";
                  const isConflict =
                    msg.toLowerCase().includes("already exists") ||
                    msg.toLowerCase().includes("ya existe");
                  return (
                    <div
                      className="np-feedback np-feedback--error"
                      role="alert"
                    >
                      <span className="np-feedback__icon">✕</span>
                      <div>
                        <p className="np-feedback__title">
                          {isConflict
                            ? "Unidad ya registrada"
                            : "No se pudo crear la propiedad"}
                        </p>
                        <p className="np-feedback__body">{msg}</p>
                      </div>
                    </div>
                  );
                })()}

              <div className="np-actions">
                <button
                  type="button"
                  className="np-btn np-btn--secondary"
                  onClick={goBack}
                  disabled={altaPropiedad.isPending}
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  className="np-btn np-btn--primary"
                  onClick={handleSubmit}
                  disabled={altaPropiedad.isPending}
                >
                  {altaPropiedad.isPending ? (
                    <>
                      <span className="np-spinner" />
                      Creando propiedad...
                    </>
                  ) : (
                    "Crear propiedad"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
