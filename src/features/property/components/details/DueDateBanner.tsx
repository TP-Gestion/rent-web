import { useDueDateBanner } from "../../hooks/useDueDateBanner";

interface Props {
  fechaVencimiento: string;
}

export default function DueDateBanner({ fechaVencimiento }: Props) {
  const { icon, label, className, dateLabel } = useDueDateBanner(fechaVencimiento);

  return (
    <div className={className}>
      <span className="pd-due-banner__icon">{icon}</span>
      <div className="pd-due-banner__content">
        <span className="pd-due-banner__label">{label}</span>
        <span className="pd-due-banner__date">{dateLabel}</span>
      </div>
    </div>
  );
}
