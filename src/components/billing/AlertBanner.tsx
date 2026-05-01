import './AlertBanner.css';

interface AlertBannerProps {
  title: string;
  messages: string[];
  variant?: 'warning' | 'danger' | 'info';
}

export default function AlertBanner({ title, messages, variant = 'warning' }: AlertBannerProps) {
  return (
    <div className={`alert-banner alert-banner--${variant}`} role="alert">
      <div className="alert-banner__icon">⚠</div>
      <div className="alert-banner__body">
        <div className="alert-banner__title">{title}</div>
        <ul className="alert-banner__list">
          {messages.map((msg) => (
            <li key={msg} className="alert-banner__item">{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
