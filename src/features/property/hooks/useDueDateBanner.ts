import { formatDate, getDueDateStatus } from "../utils/propertyDetail";

const DUE_DATE_BANNER_CONFIG = {
  past: {
    icon: "⚠️",
    label: "Vencimiento pasado",
    className: "pd-due-banner pd-due-banner--past",
  },
  soon: {
    icon: "🔔",
    label: "Próximo vencimiento",
    className: "pd-due-banner pd-due-banner--soon",
  },
  ok: {
    icon: "📅",
    label: "Próximo vencimiento",
    className: "pd-due-banner pd-due-banner--ok",
  },
};

export function useDueDateBanner(fechaVencimiento: string) {
  const status = getDueDateStatus(fechaVencimiento);
  const config = DUE_DATE_BANNER_CONFIG[status];

  return {
    icon: config.icon,
    label: config.label,
    className: config.className,
    dateLabel: formatDate(fechaVencimiento),
  };
}
