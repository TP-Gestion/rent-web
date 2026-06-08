import { useState } from "react";
import type { PropiedadDetalle } from "../../service/propiedades";
import { getInitials } from "../../utils/propertyDetail";
import { useRemoveTenant } from "../../hooks/useRemoveTenant";
import { useAssignTenant } from "../../hooks/useAssignTenant";
import { useTenants } from "../../hooks/useTenants";
import type { ToastItem } from "../../components/ui/Toast";
import { SelectOrCreate } from "../../components/ui/SelectOrCreate";
import { TenantModal } from "../../components/ui/TenantModal";

interface Props {
  detalle: PropiedadDetalle;
  propertyId: string;
  onShowToast: (message: string, variant: ToastItem["variant"]) => void;
}

export default function TenantCard({
  detalle,
  propertyId,
  onShowToast,
}: Props) {
  const hasTenant = detalle.estadoOcupacion === "OCCUPIED";

  return (
    <div className="pd-card">
      <h2 className="pd-card__title">Inquilino</h2>
      {hasTenant ? (
        <TenantInfo
          detalle={detalle}
          propertyId={propertyId}
          onShowToast={onShowToast}
        />
      ) : (
        <FreeState propertyId={propertyId} onShowToast={onShowToast} />
      )}
    </div>
  );
}

function TenantInfo({
  detalle,
  propertyId,
  onShowToast,
}: {
  detalle: PropiedadDetalle;
  propertyId: string;
  onShowToast: (message: string, variant: ToastItem["variant"]) => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const removeMutation = useRemoveTenant(propertyId);

  const fullName = detalle.nombreInquilino;
  const nameParts = fullName.split(" ");
  const initials = getInitials(nameParts[0] ?? "", nameParts[1] ?? "");

  const handleConfirmRemove = () => {
    removeMutation.mutate(undefined, {
      onSuccess: () => {
        setShowConfirm(false);
        onShowToast("Inquilino desvinculado correctamente", "success");
      },
      onError: () => {
        setShowConfirm(false);
        onShowToast(
          "No se pudo desvincular el inquilino. Intentá nuevamente.",
          "error",
        );
      },
    });
  };

  return (
    <>
      <div className="pd-tenant__head">
        <div className="pd-tenant__avatar">{initials}</div>
        <div>
          <p className="pd-tenant__name">{fullName}</p>
          <span className="pd-tenant__role">Inquilino activo</span>
        </div>
      </div>
      <button
        className="pd-btn pd-btn--primary pd-tenant__action"
        style={{ marginBottom: 8 }}
        type="button"
      >
        Ver Perfil Completo
      </button>
      <button
        className="pd-btn pd-btn--secondary pd-tenant__action"
        type="button"
        onClick={() => setShowConfirm(true)}
        disabled={removeMutation.isPending}
      >
        {removeMutation.isPending
          ? "Desvinculando..."
          : "Desvincular inquilino"}
      </button>

      {showConfirm && (
        <ConfirmRemoveModal
          tenantName={fullName}
          isPending={removeMutation.isPending}
          onConfirm={handleConfirmRemove}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

function FreeState({
  propertyId,
  onShowToast,
}: {
  propertyId: string;
  onShowToast: (message: string, variant: ToastItem["variant"]) => void;
}) {
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const { data: tenants = [], isLoading: isLoadingTenants } = useTenants();
  const assignMutation = useAssignTenant(propertyId);

  const tenantItems = tenants.map((t) => ({
    id: t.id,
    primaryLabel: `${t.firstName} ${t.lastName}`,
    secondaryLabel: t.email,
  }));

  const handleAssign = () => {
    if (!selectedTenantId) return;
    assignMutation.mutate(selectedTenantId, {
      onSuccess: () => {
        onShowToast("Inquilino asignado correctamente", "success");
      },
      onError: () => {
        onShowToast(
          "No se pudo asignar el inquilino. Intentá nuevamente.",
          "error",
        );
      },
    });
  };

  return (
    <>
      <SelectOrCreate
        items={tenantItems}
        isLoading={isLoadingTenants}
        selectedId={selectedTenantId}
        onSelect={setSelectedTenantId}
        onClear={() => setSelectedTenantId(null)}
        onCreateNew={() => setShowTenantModal(true)}
        searchPlaceholder="Buscar inquilino..."
        createLabel="Crear nuevo inquilino"
        emptyLabel="No se encontraron inquilinos"
      />
      <button
        className="pd-btn pd-btn--primary pd-tenant__action"
        style={{ marginTop: 10 }}
        type="button"
        onClick={handleAssign}
        disabled={!selectedTenantId || assignMutation.isPending}
      >
        {assignMutation.isPending ? "Asignando..." : "Asignar inquilino"}
      </button>

      {showTenantModal && (
        <TenantModal
          onClose={() => setShowTenantModal(false)}
          onSuccess={(newTenant) => {
            setSelectedTenantId(newTenant.id);
            setShowTenantModal(false);
          }}
        />
      )}
    </>
  );
}

function ConfirmRemoveModal({
  tenantName,
  isPending,
  onConfirm,
  onCancel,
}: {
  tenantName: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="pm-overlay" onClick={onCancel}>
      <div
        className="pm-modal"
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pm-modal__header">
          <h2 className="pm-modal__title">Desvincular inquilino</h2>
          <button
            className="pm-modal__close"
            onClick={onCancel}
            type="button"
            aria-label="Cerrar"
            disabled={isPending}
          >
            ✕
          </button>
        </div>
        <div className="pm-modal__body" style={{ gap: 0 }}>
          <p style={{ color: "#555550", fontSize: 14, margin: 0 }}>
            ¿Estás seguro de que querés desvincular a{" "}
            <strong style={{ color: "#2c2820" }}>{tenantName}</strong> de esta
            propiedad?
          </p>
          <p style={{ color: "#888880", fontSize: 13, marginTop: 10 }}>
            El historial de pagos se mantendrá intacto. Esta acción no puede
            deshacerse.
          </p>
        </div>
        <div className="pm-modal__footer">
          <button
            className="pd-btn pd-btn--secondary"
            type="button"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            className="pd-btn pd-btn--primary"
            style={{ background: "#c0392b", color: "#fff" }}
            type="button"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Desvinculando..." : "Confirmar desvinculación"}
          </button>
        </div>
      </div>
    </div>
  );
}
