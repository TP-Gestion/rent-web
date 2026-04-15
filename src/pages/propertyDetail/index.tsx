import { useParams, useNavigate } from "react-router";
import { usePropertyDetail } from "../../hooks/usePropertyDetail";
import DetailHeader from "./DetailHeader";
import DueDateBanner from "./DueDateBanner";
import SummaryCard from "./SummaryCard";
import TenantCard from "./TenantCard";
import PaymentHistory from "./PaymentHistory";
import SpecsCard from "./SpecsCard";
import DocumentsCard from "./DocumentsCard";
import "./PropertyDetailPage.css";

function SkeletonView() {
  return (
    <div className="pd-page">
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="pd-skeleton" style={{ height: "12px", width: "90px" }} />
        <div className="pd-skeleton" style={{ height: "32px", width: "55%", borderRadius: "8px" }} />
        <div className="pd-skeleton" style={{ height: "14px", width: "28%" }} />
      </div>
      <div className="pd-skeleton" style={{ height: "52px", borderRadius: "10px" }} />
      <div className="pd-grid">
        <div className="pd-left-col">
          <div className="pd-skeleton" style={{ height: "200px", borderRadius: "12px" }} />
          <div className="pd-skeleton" style={{ height: "260px", borderRadius: "12px" }} />
        </div>
        <div className="pd-right-col">
          <div className="pd-skeleton" style={{ height: "170px", borderRadius: "12px" }} />
          <div className="pd-skeleton" style={{ height: "190px", borderRadius: "12px" }} />
          <div className="pd-skeleton" style={{ height: "120px", borderRadius: "12px" }} />
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
        <button className="pd-btn pd-btn--secondary" type="button" onClick={onBack}>
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
  const detalle = data?.data;

  if (isLoading) return <SkeletonView />;
  if (isError || !detalle) return <ErrorView onBack={() => navigate(-1)} />;

  return (
    <div className="pd-page">
      <DetailHeader detalle={detalle} onBack={() => navigate(-1)} />
      <DueDateBanner fechaVencimiento={detalle.fechaVencimiento} />
      <div className="pd-grid">
        <div className="pd-left-col">
          <SummaryCard detalle={detalle} />
          <PaymentHistory pagos={detalle.historialDePagos} />
        </div>
        <div className="pd-right-col">
          <TenantCard detalle={detalle} />
          <SpecsCard detalle={detalle} />
          <DocumentsCard />
        </div>
      </div>
    </div>
  );
}
