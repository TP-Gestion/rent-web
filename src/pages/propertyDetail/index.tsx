import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { usePropertyDetail } from "../../hooks/usePropertyDetail";
import { useFacturas } from "../../hooks/useFacturas";
import { useRegistrarPago } from "../../hooks/useRegistrarPago";
import DetailHeader from "./DetailHeader";
import DueDateBanner from "./DueDateBanner";
import SummaryCard from "./SummaryCard";
import TenantCard from "./TenantCard";
import SpecsCard from "./SpecsCard";
import DocumentsCard from "./DocumentsCard";
import PaymentHistory from "./PaymentHistory";
import RegisterPaymentModal from "./RegisterPaymentModal";
import Toast, { type ToastItem } from "../../components/ui/Toast";
import "./PropertyDetailPage.css";

function SkeletonView() {
  return (
    <div className="pd-page">
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div
          className="pd-skeleton"
          style={{ height: "12px", width: "90px" }}
        />
        <div
          className="pd-skeleton"
          style={{ height: "32px", width: "55%", borderRadius: "8px" }}
        />
        <div className="pd-skeleton" style={{ height: "14px", width: "28%" }} />
      </div>
      <div
        className="pd-skeleton"
        style={{ height: "52px", borderRadius: "10px" }}
      />
      <div className="pd-grid">
        <div className="pd-left-col">
          <div
            className="pd-skeleton"
            style={{ height: "200px", borderRadius: "12px" }}
          />
          <div
            className="pd-skeleton"
            style={{ height: "260px", borderRadius: "12px" }}
          />
        </div>
        <div className="pd-right-col">
          <div
            className="pd-skeleton"
            style={{ height: "170px", borderRadius: "12px" }}
          />
          <div
            className="pd-skeleton"
            style={{ height: "190px", borderRadius: "12px" }}
          />
          <div
            className="pd-skeleton"
            style={{ height: "120px", borderRadius: "12px" }}
          />
        </div>
      </div>
    </div>
  );
}

function ErrorView({ onBack }: { onBack: () => void }) {
  return (
    <div className="pd-page">
      <div className="pd-error">
        <span className="pd-error__icon">⚠️</span>
        <h2 className="pd-error__title">No se pudo cargar la propiedad</h2>
        <p className="pd-error__sub">
          Verificá que el identificador sea correcto o intentá nuevamente.
        </p>
        <button
          className="pd-btn pd-btn--secondary"
          type="button"
          onClick={onBack}
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default function PropertyDetailPage() {
  const { idPropiedad = "" } = useParams<{ idPropiedad: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = usePropertyDetail(idPropiedad);
  const { data: facturasData, isLoading: isLoadingFacturas } =
    useFacturas(idPropiedad);
  const registrarPagoMutation = useRegistrarPago(idPropiedad);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, variant: ToastItem["variant"]) => {
    setToasts((prev) => [...prev, { id: Date.now(), message, variant }]);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const detalle = data?.data;
  const facturas = facturasData?.data ?? [];

  if (isLoading) return <SkeletonView />;
  if (isError || !detalle) return <ErrorView onBack={() => navigate(-1)} />;

  return (
    <div className="pd-page">
      <DetailHeader
        detalle={detalle}
        onBack={() => navigate(-1)}
        onRegistrarPago={() => setIsPaymentModalOpen(true)}
      />
      <DueDateBanner fechaVencimiento={detalle.fechaVencimiento} />
      <div className="pd-grid">
        <div className="pd-left-col">
          <SummaryCard detalle={detalle} />
          <PaymentHistory facturas={facturas} isLoading={isLoadingFacturas} />
        </div>
        <div className="pd-right-col">
          <TenantCard detalle={detalle} />
          <SpecsCard detalle={detalle} />
          <DocumentsCard />
        </div>
      </div>
      <RegisterPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        facturas={facturas}
        isLoadingFacturas={isLoadingFacturas}
        onSubmit={(data) =>
          registrarPagoMutation.mutate(data, {
            onSuccess: () => {
              showToast("Pago registrado con éxito", "success");
              setIsPaymentModalOpen(false);
              registrarPagoMutation.reset();
            },
            onError: () => {
              showToast(
                "No se pudo registrar el pago. Intentá nuevamente.",
                "error",
              );
            },
          })
        }
        isPending={registrarPagoMutation.isPending}
      />
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
