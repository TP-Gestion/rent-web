import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useTenantSummary } from "../hooks/useTenantSummary";
import { useUpdateTenant } from "../hooks/useUpdateTenant";
import { useDeleteTenant } from "../hooks/useDeleteTenant";
import { ESTADO_LABEL, ESTADO_CSS } from "../utils/billingStatus";
import { formatCurrency, formatDate } from "../utils/propertyDetail";
import type { TenantSummary, TenantSummaryProperty } from "../service/tenants";
import Toast, { type ToastItem } from "../components/ui/Toast";
import "../components/tenants/dataTable/DataTable.css";
import "./TenantsPage.css";
import "./propertyDetail/PropertyDetailPage.css";

function getNextDueDate(properties: TenantSummaryProperty[]): string | null {
  if (properties.length === 0) return null;
  const sorted = [...properties]
    .map((p) => p.dueDate)
    .filter(Boolean)
    .sort();
  return sorted[0] ?? null;
}

export default function TenantSummaryPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useTenantSummary(
    tenantId ? Number(tenantId) : null,
  );
  const summary = data?.data;
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, variant: ToastItem["variant"]) => {
    setToasts((prev) => [...prev, { id: Date.now(), message, variant }]);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="expensas-page">
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#c7ad6a",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "1px",
            textTransform: "uppercase",
            padding: 0,
            fontFamily: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ← Volver
        </button>
        <div className="expensas-page__section-label" style={{ marginTop: 6 }}>
          Perfil de inquilino
        </div>
      </div>

      {isLoading && (
        <div className="data-table">
          <div
            style={{
              padding: 40,
              textAlign: "center",
              fontSize: 13,
              color: "#c7ad6a",
            }}
          >
            Cargando perfil...
          </div>
        </div>
      )}

      {isError && !summary && (
        <div className="data-table">
          <div
            style={{
              padding: 40,
              textAlign: "center",
              fontSize: 13,
              color: "#a33030",
            }}
          >
            No se pudo cargar el perfil del inquilino.
          </div>
        </div>
      )}

      {summary && (
        <>
          <TenantTopGrid
            summary={summary}
            tenantId={Number(tenantId)}
            onDeleted={() => navigate(-1)}
            onToast={showToast}
          />
          <PropertiesTable
            properties={summary.properties}
            onVerDetalle={(id) => navigate(`/propiedades/${id}`)}
          />
        </>
      )}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function TenantTopGrid({
  summary,
  tenantId,
  onDeleted,
  onToast,
}: {
  summary: TenantSummary;
  tenantId: number;
  onDeleted: () => void;
  onToast: (message: string, variant: ToastItem["variant"]) => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState({
    firstName: summary.firstName,
    lastName: summary.lastName,
    email: summary.email,
    phone: summary.phone,
  });
  const [saveError, setSaveError] = useState<string | null>(null);

  const updateMutation = useUpdateTenant(tenantId);
  const deleteMutation = useDeleteTenant(tenantId);

  const nextDue = getNextDueDate(summary.properties);
  const hasDebt = summary.pendingAmount > 0;

  const handleSave = () => {
    setSaveError(null);
    updateMutation.mutate(form, {
      onSuccess: () => {
        setSaveError(null);
        onToast("Datos actualizados correctamente", "success");
      },
      onError: () => {
        setSaveError("No se pudo guardar los cambios. Intentá nuevamente.");
        onToast("No se pudo guardar los cambios. Intentá nuevamente.", "error");
      },
    });
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        onToast("Inquilino eliminado correctamente", "success");
        setTimeout(onDeleted, 1500);
      },
      onError: () => {
        setShowDeleteConfirm(false);
        onToast(
          "No se pudo eliminar el inquilino. Intentá nuevamente.",
          "error",
        );
      },
    });
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
          alignItems: "stretch",
        }}
      >
        <div className="data-table" style={{ padding: "20px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
              borderBottom: "1px solid #f0ece0",
              paddingBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#b8a882",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
              }}
            >
              Datos del inquilino
            </span>
            <IconBtn
              title="Eliminar inquilino"
              danger
              onClick={() => setShowDeleteConfirm(true)}
            >
              <TrashIcon />
            </IconBtn>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div className="pm-field" style={{ margin: 0 }}>
                <label className="pm-field__label">Nombre</label>
                <input
                  className="pm-field__input"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, firstName: e.target.value }))
                  }
                  placeholder="Nombre"
                />
              </div>
              <div className="pm-field" style={{ margin: 0 }}>
                <label className="pm-field__label">Apellido</label>
                <input
                  className="pm-field__input"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lastName: e.target.value }))
                  }
                  placeholder="Apellido"
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div className="pm-field" style={{ margin: 0 }}>
                <label className="pm-field__label">Email</label>
                <input
                  className="pm-field__input"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div className="pm-field" style={{ margin: 0 }}>
                <label className="pm-field__label">Teléfono</label>
                <input
                  className="pm-field__input"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="Teléfono"
                />
              </div>
            </div>

            {saveError && (
              <p style={{ margin: 0, fontSize: 12, color: "#c0392b" }}>
                {saveError}
              </p>
            )}

            <button
              className="pd-btn pd-btn--primary"
              type="button"
              onClick={handleSave}
              disabled={updateMutation.isPending}
              style={{ alignSelf: "flex-start", marginTop: 2 }}
            >
              {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>

        <div className="data-table" style={{ padding: "28px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #f0ece0",
              paddingBottom: 12,
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#b8a882",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
              }}
            >
              Resumen Financiero
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FinancialRow
              label="Deuda Total"
              value={formatCurrency(summary.pendingAmount)}
              valueColor={hasDebt ? "#a33030" : "#2c2820"}
              valueSize={22}
            />
            <div style={{ borderTop: "1px solid #f0ece0" }} />
            <FinancialRow
              label="Próximo Vencimiento"
              value={nextDue ? formatDate(nextDue) : "—"}
            />
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="pm-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div
            className="pm-modal"
            style={{ maxWidth: 420 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pm-modal__header">
              <h2 className="pm-modal__title">Eliminar inquilino</h2>
              <button
                className="pm-modal__close"
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteMutation.isPending}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="pm-modal__body" style={{ gap: 0 }}>
              <p style={{ color: "#555550", fontSize: 14, margin: 0 }}>
                ¿Estás seguro de que querés eliminar a{" "}
                <strong style={{ color: "#2c2820" }}>
                  {summary.firstName} {summary.lastName}
                </strong>
                ? Esta acción no puede deshacerse.
              </p>
            </div>
            <div className="pm-modal__footer">
              <button
                className="pd-btn pd-btn--secondary"
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteMutation.isPending}
              >
                Cancelar
              </button>
              <button
                className="pd-btn pd-btn--primary"
                style={{ background: "#c0392b", color: "#fff" }}
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending
                  ? "Eliminando..."
                  : "Confirmar eliminación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function IconBtn({
  children,
  title,
  danger,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        background: "none",
        border: "1px solid",
        borderColor: danger ? "#f5c0c0" : "#e8e4d8",
        borderRadius: 7,
        padding: "6px 8px",
        cursor: "pointer",
        color: danger ? "#c0392b" : "#888880",
        display: "flex",
        alignItems: "center",
        transition: "background-color 0.15s ease, color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = danger
          ? "#fdf0f0"
          : "#fafaf7";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "transparent";
      }}
    >
      {children}
    </button>
  );
}

function FinancialRow({
  label,
  value,
  valueColor = "#2c2820",
  valueSize = 18,
}: {
  label: string;
  value: string;
  valueColor?: string;
  valueSize?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#b8a882",
          letterSpacing: "0.6px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: valueSize,
          fontWeight: 800,
          color: valueColor,
          letterSpacing: "-0.3px",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PropertiesTable({
  properties,
  onVerDetalle,
}: {
  properties: TenantSummaryProperty[];
  onVerDetalle: (id: number) => void;
}) {
  const COL_HEADERS = [
    "Edificio",
    "Piso",
    "Tipo",
    "Estado",
    "Vencimiento",
    "Expensas",
    "Alquiler",
    "Acción",
  ];

  return (
    <div className="data-table">
      <div className="data-table__table-wrap">
        <table className="data-table__table">
          <thead>
            <tr className="data-table__head-row">
              {COL_HEADERS.map((col) => (
                <th
                  key={col}
                  className={`data-table__head-cell${col === "Alquiler" || col === "Expensas" || col === "Acción" ? " data-table__head-cell--right" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td colSpan={COL_HEADERS.length} className="data-table__empty">
                  Sin propiedades asociadas
                </td>
              </tr>
            ) : (
              properties.map((prop) => (
                <PropertyRow
                  key={prop.id}
                  prop={prop}
                  onVerDetalle={onVerDetalle}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PropertyRow({
  prop,
  onVerDetalle,
}: {
  prop: TenantSummaryProperty;
  onVerDetalle: (id: number) => void;
}) {
  const isOverdue = prop.status === "OVERDUE";

  return (
    <tr className="tenant-row">
      <td className="tenant-row__cell">
        <div className="tenant-row__name">{prop.building}</div>
      </td>
      <td className="tenant-row__cell">
        <span className="tenant-row__property">{prop.floor}</span>
      </td>
      <td className="tenant-row__cell">
        <span className="tenant-row__property-type">{prop.unitType}</span>
      </td>
      <td className="tenant-row__cell">
        <span className={`pd-pay-status ${ESTADO_CSS[prop.status] ?? ""}`}>
          {ESTADO_LABEL[prop.status] ?? prop.status}
        </span>
      </td>
      <td className="tenant-row__cell">
        <span
          className={`tenant-row__due-date${isOverdue ? " tenant-row__due-date--overdue" : ""}`}
        >
          {formatDate(prop.dueDate)}
        </span>
      </td>
      <td className="tenant-row__cell tenant-row__cell--right">
        <span className="tenant-row__amount">
          {formatCurrency(prop.expenses)}
        </span>
      </td>
      <td className="tenant-row__cell tenant-row__cell--right">
        <span className="tenant-row__amount">
          {formatCurrency(prop.rentalAmount)}
        </span>
      </td>
      <td className="tenant-row__cell tenant-row__cell--right">
        <button
          className="tenant-row__detail-btn"
          type="button"
          onClick={() => onVerDetalle(prop.id)}
        >
          VER DETALLE
        </button>
      </td>
    </tr>
  );
}
