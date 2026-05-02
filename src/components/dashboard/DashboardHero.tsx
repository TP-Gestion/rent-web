interface DashboardHeroProps {
  periodLabel: string;
}

export default function DashboardHero({ periodLabel }: DashboardHeroProps) {
  return (
    <div className="dashboard-page__hero">
      <div>
        <div className="dashboard-page__section-label">Panel ejecutivo</div>
        <h1 className="dashboard-page__title">Dashboard de cartera</h1>
        <p className="dashboard-page__subtitle">
          Seguimiento diario de ocupación, cobranzas y alertas operativas de tu portfolio.
        </p>
      </div>
      <div className="dashboard-page__period">PERIODO · {periodLabel}</div>
    </div>
  );
}
