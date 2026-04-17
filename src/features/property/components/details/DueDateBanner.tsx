import { getDueDateStatus, formatDate } from "../../utils/propertyDetail";

interface Props {
  fechaVencimiento: string;
}

const BANNER_CONFIG = {
  past: {
    icon: "⚠️",
    label: "Vencimiento pasado",
    cls: "pd-due-banner pd-due-banner--past",
  },
  soon: {
    icon: "🔔",
    label: "Próximo vencimiento",
    cls: "pd-due-banner pd-due-banner--soon",
  },
  ok: {
    icon: "📅",
    label: "Próximo vencimiento",
    cls: "pd-due-banner pd-due-banner--ok",
  },
};

export default function DueDateBanner({ fechaVencimiento }: Props) {
  const status = getDueDateStatus(fechaVencimiento);
  const cfg = BANNER_CONFIG[status];

  return (
    <div className={cfg.cls}>
      <span className="pd-due-banner__icon">{cfg.icon}</span>
      <div className="pd-due-banner__content">
        <span className="pd-due-banner__label">{cfg.label}</span>
        <span className="pd-due-banner__date">{formatDate(fechaVencimiento)}</span>
      </div>
    </div>
  );
}
