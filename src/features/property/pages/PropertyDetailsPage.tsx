import { useParams, useNavigate } from "react-router";
import { usePropertyDetail } from "../hooks/usePropertyDetail";
import DetailHeader from "../components/details/DetailHeader";
import DueDateBanner from "../components/details/DueDateBanner";
import SummaryCard from "../components/details/SummaryCard";
import TenantCard from "../components/details/TenantCard";
import PaymentHistory from "../components/details/PaymentHistory";
import SpecsCard from "../components/details/SpecsCard";
import DocumentsCard from "../components/details/DocumentsCard";
import "../components/details/PropertyDetails.module.css";

function SkeletonView() {
  return (
    <div className="pd-page">
      <div className="pd-skeleton-stack">
        <div className="pd-skeleton pd-skeleton--meta" />
        <div className="pd-skeleton pd-skeleton--title" />
        <div className="pd-skeleton pd-skeleton--subline" />
      </div>
      <div className="pd-skeleton pd-skeleton--banner" />
      <div className="pd-grid">
        <div className="pd-left-col">
          <div className="pd-skeleton pd-skeleton--card-md" />
          <div className="pd-skeleton pd-skeleton--card-lg" />
        </div>
        <div className="pd-right-col">
          <div className="pd-skeleton pd-skeleton--card-sm-a" />
          <div className="pd-skeleton pd-skeleton--card-sm-b" />
          <div className="pd-skeleton pd-skeleton--card-sm-c" />
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

export default function PropertyDetailsPage() {
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
