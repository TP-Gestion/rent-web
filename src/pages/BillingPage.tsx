import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import AlertBanner from "../components/billing/AlertBanner";
import StatCard from "../components/dashboard/StatCard";
import BillingTable from "../components/billing/BillingTable";
import { useBillableProperties } from "../hooks/useBillableProperties";
import { useGenerateBillings } from "../hooks/useGenerateBillings";
import { exportBillingToExcel } from "../utils/billingExport";
import { formatArs, BATCH_ID } from "../utils/billingHelpers";
import type { BillingItem } from "../components/billing/BillingTable";
import "./BillingPage.css";

function BillingSuccessScreen({
  count,
  items,
  selectedIds,
  onGoHome,
}: {
  count: number;
  items: BillingItem[];
  selectedIds: Set<string>;
  onGoHome: () => void;
}) {
  return (
    <div className="billing-success">
      <div className="billing-success__icon">✓</div>
      <h2 className="billing-success__title">
        Facturas generadas correctamente
      </h2>
      <p className="billing-success__subtitle">
        Se han generado{" "}
        <strong>
          {count} factura{count !== 1 ? "s" : ""}
        </strong>{" "}
        Para más detalles revisá el reporte descargable.
      </p>
      <div className="billing-success__actions">
        <button
          className="billing-btn billing-btn--primary"
          onClick={() => exportBillingToExcel(items, selectedIds)}
        >
          ↓&nbsp; Descargar reporte
        </button>
        <button className="billing-btn" onClick={onGoHome}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const navigate = useNavigate();
  const {
    data: billableItems = [],
    isLoading,
    isError,
  } = useBillableProperties();
  const generateMutation = useGenerateBillings();

  const buildingOptions = useMemo(() => {
    const unique = [...new Set(billableItems.map((i) => i.edificio))];
    return [
      { value: "todos", label: "Todos los edificios" },
      ...unique.map((b) => ({ value: b, label: b })),
    ];
  }, [billableItems]);

  const [buildingFilter, setBuildingFilter] = useState("todos");

  const filteredItems = useMemo(
    () =>
      buildingFilter === "todos"
        ? billableItems
        : billableItems.filter((i) => i.edificio === buildingFilter),
    [billableItems, buildingFilter],
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const hasSeededRef = useRef(false);

  useEffect(() => {
    if (!hasSeededRef.current && billableItems.length > 0) {
      hasSeededRef.current = true;
      setSelectedIds(new Set(billableItems.map((i) => i.id)));
    }
  }, [billableItems]);

  const totalFacturable = billableItems.reduce(
    (sum, i) => sum + i.montoACobrar,
    0,
  );

  const filteredSelected = filteredItems.filter((i) => selectedIds.has(i.id));
  const montoSeleccionado = filteredSelected.reduce(
    (sum, i) => sum + i.montoACobrar,
    0,
  );

  const handleCancel = () => navigate("/tenants");

  const handleGenerateFacturas = () => {
    const idsToSubmit = filteredItems
      .filter((i) => selectedIds.has(i.id))
      .map((i) => i.id);

    if (idsToSubmit.length === 0) return;

    generateMutation.mutate({
      propertyIds: idsToSubmit,
    });
  };

  if (generateMutation.isSuccess) {
    const result = generateMutation.data.data;
    return (
      <div className="billing-page">
        <BillingSuccessScreen
          count={result.count}
          items={billableItems}
          selectedIds={selectedIds}
          onGoHome={() => navigate("/tenants")}
        />
      </div>
    );
  }

  return (
    <div className="billing-page">
      <div className="billing-page__header">
        <div className="billing-page__header-left">
          <div className="billing-page__section-label">
            Administración de Cartera
          </div>
          <h1 className="billing-page__title">
            COBRO DE EXPENSAS — MES ACTUAL
          </h1>
          <div className="billing-page__subtitle">
            Proceso de facturación masiva&nbsp;&nbsp;|&nbsp;&nbsp;Lote ID:{" "}
            <span className="billing-page__lote-id">{BATCH_ID}</span>
          </div>
        </div>

        <div className="billing-page__header-right" />
      </div>

      {isLoading && (
        <div className="billing-page__feedback">Cargando propiedades...</div>
      )}
      {isError && (
        <div className="billing-page__feedback billing-page__feedback--error">
          No se pudieron cargar las propiedades.
        </div>
      )}

      <div className="billing-page__metrics">
        <StatCard
          label="Propiedades facturables"
          value={String(billableItems.length)}
          subtitle="en el período actual"
          variant="default"
        />
        <StatCard
          label="Total facturable"
          value={formatArs(totalFacturable)}
          subtitle="suma de todos los ítems"
          variant="default"
        />
        <StatCard
          label="Seleccionadas"
          value={String(filteredSelected.length)}
          subtitle={`de ${filteredItems.length} en la vista actual`}
          variant="success"
        />
        <StatCard
          label="Monto del lote"
          value={formatArs(montoSeleccionado)}
          subtitle="total de las propiedades seleccionadas"
          variant="success"
        />
      </div>

      <AlertBanner
        title="ATENCIÓN: Acción Masiva"
        messages={[
          "Esta acción genera facturas en bloque y no se puede deshacer una vez confirmada.",
          "Verifique los montos y las propiedades seleccionadas antes de proceder.",
        ]}
        variant="warning"
      />

      <BillingTable
        items={filteredItems}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        buildingOptions={buildingOptions}
        currentBuilding={buildingFilter}
        onBuildingChange={setBuildingFilter}
      />

      <div className="billing-page__footer">
        <div className="billing-page__footer-info">
          <span>
            {selectedIds.size} propiedad{selectedIds.size !== 1 ? "es" : ""}{" "}
            incluida{selectedIds.size !== 1 ? "s" : ""} en el lote.
          </span>
        </div>
        <div className="billing-page__footer-actions">
          {generateMutation.isError && (
            <span className="billing-page__footer-error">
              Error al generar — intentá de nuevo
            </span>
          )}
          <button
            className="billing-btn"
            onClick={handleCancel}
            disabled={generateMutation.isPending}
          >
            Cancelar
          </button>
          <button
            className="billing-btn billing-btn--primary"
            onClick={handleGenerateFacturas}
            disabled={selectedIds.size === 0 || generateMutation.isPending}
          >
            {generateMutation.isPending ? "Generando..." : "GENERAR FACTURAS"}
          </button>
        </div>
      </div>
    </div>
  );
}
