import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useDashboard } from "../hooks/useDashboard.ts";
import { formatDueDate as formatDashboardDueDate, getDueStatusLabel as getDashboardDueStatusLabel } from "../utils/dashboardUtils";
import { PERIOD, formatArs } from "../utils/billingHelpers";
import StatCard from "../components/dashboard/StatCard";
import "./DashboardPage.css";

type DashboardActionProps = {
    label: string;
    description: string;
    onClick: () => void;
};

function DashboardAction({ label, description, onClick}: DashboardActionProps) {
    return (
        <button
            type="button"
            className="dashboard-action"
            onClick={onClick}
        >
            <span className="dashboard-action__label">{label}</span>
            <span className="dashboard-action__description">{description}</span>
        </button>
    );
}

function getOccupancyTone(occupancyRate: number) {
    if (occupancyRate === 100) {
        return "success";
    }

    if (occupancyRate >= 50) {
        return "warning";
    }

    return "danger";
}

function getOccupancyLabel(occupancyRate: number) {
    if (occupancyRate === 100) {
        return "Completo";
    }

    if (occupancyRate >= 50) {
        return "Medio";
    }

    if (occupancyRate === 0) {
        return "Sin ocupación";
    }

    return "Bajo";
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const {
        isLoading,
        hasError,
        overview,
        buildingBreakdown,
        dueSoonBillings,
        overdueBillings,
        buildings,
        tenants,
        payments,
    } = useDashboard();

    const buildingsWithAlert = useMemo(() => {
        const buildings = new Set<string>();

        [...dueSoonBillings, ...overdueBillings].forEach((item) => {
            if (item.edificio) {
                buildings.add(item.edificio);
            }
        });

        return buildings.size;
    }, [dueSoonBillings, overdueBillings]);

    const dueSoonAmount = useMemo(() => {
        return dueSoonBillings.reduce((sum, item) => sum + (item.montoACobrar ?? 0), 0);
    }, [dueSoonBillings]);

    const actionCards = [
        {
            label: "Nueva propiedad",
            description: "Sumá una unidad a la cartera",
            onClick: () => navigate("/nueva-propiedad"),
        },
        {
            label: "Cargar expensa",
            description: "Registrá gastos operativos",
            onClick: () => navigate("/finances"),
        },
        {
            label: "Generar liquidación",
            description: "Armá el lote mensual de expensas",
            onClick: () => navigate("/generar-liquidacion"),
        },
        {
            label: "Ver inquilinos",
            description: "Revisá ocupación y contactos",
            onClick: () => navigate("/tenants"),
        },
    ];

    return (
        <div className="dashboard-page">

            <section className="dashboard-hero" aria-labelledby="dashboard-title">
                <div className="dashboard-hero__content">
                    <div className="dashboard-hero__eyebrow">Panel principal</div>
                    <h1 id="dashboard-title" className="dashboard-hero__title">
                        Operación inmobiliaria en una sola vista
                    </h1>
                    <p className="dashboard-hero__copy">
                        Seguimiento de propiedades, edificios, inquilinos y cobros del período activo.
                    </p>
                    <div className="dashboard-hero__meta" aria-label="Contexto del tablero">
                        <span className="dashboard-hero__meta-pill">Período activo: {PERIOD}</span>
                    </div>
                </div>

                <aside className="dashboard-hero__panel">
                    <StatCard
                        label="Cobrado"
                        value={formatArs(payments.totalPaidAmount ?? 0)}
                        subtitle={`${payments.paidCount} pagos registrados en el período activo`}
                        variant="success"
                    />
                    <StatCard
                        label="Pendientes"
                        value={formatArs(dueSoonAmount)}
                        subtitle={`${dueSoonBillings.length} vencimientos próximos a vencer`}
                        variant="warning"
                    />
                    <StatCard
                        label="Vencidos"
                        value={formatArs(payments.totalOverdueAmount ?? 0)}
                        subtitle={`${payments.overdueCount} unidades que requieren seguimiento urgente`}
                        variant="danger"
                    />
                </aside>
            </section>

            <section className="dashboard-metrics" aria-label="Resumen operativo">
                <StatCard
                    label="Propiedades"
                    value={String(overview.totalProperties)}
                    subtitle={`${overview.occupiedProperties} ocupadas de ${overview.availableProperties} disponibles`}
                    variant="success"
                />
                <StatCard
                    label="Ocupación"
                    value={`${overview.occupancyRate}%`}
                    subtitle={`${overview.occupiedProperties} de ${overview.totalProperties} unidades ocupadas en total`}
                    variant="default"
                />                
                <StatCard
                    label="Índice de morosidad"
                    value={`${payments.morosityRate}%`}
                    badge={`${payments.overdueCount} morosos`}
                    subtitle={`${payments.overdueCount} clientes con deuda sobre ${overview.occupiedProperties} ocupadas`}
                    variant="danger"
                />
                <StatCard
                    label="Edificios con alerta"
                    value={String(buildingsWithAlert)}
                    subtitle={`${buildingsWithAlert} edificios con vencimientos próximos o atrasados`}
                    variant="danger"
                />
            </section>

            {hasError && (
                <div className="dashboard-banner dashboard-banner--error">
                    No se pudieron cargar todos los datos del panel. Reintentá desde la navegación o recargá la pantalla.
                </div>
            )}

            {isLoading && (
                <div className="dashboard-banner">Cargando métricas del dashboard...</div>
            )}

            <section className="dashboard-grid">
                <div className="dashboard-grid__main">
                <article className="dashboard-card dashboard-card--followup dashboard-card--wide">
                    <div className="dashboard-card__header">
                        <div>
                            <div className="dashboard-card__eyebrow">Cobros que requieren seguimiento</div>
                            <h2 className="dashboard-card__title">Próximos vencimientos y mora</h2>
                        </div>
                    </div>

                    <div className="dashboard-followup-grid">
                        <section className="dashboard-followup-group" aria-label="Próximos siete días">
                            <div className="dashboard-followup__header">
                                <h3 className="dashboard-followup__title">Próximos 7 días</h3>
                                <span className="dashboard-followup__count">{dueSoonBillings.length}</span>
                            </div>
                            <div className="dashboard-due-list">
                                {dueSoonBillings.length === 0 ? (
                                    <div className="dashboard-empty-state">No hay cobros por vencer en los próximos 7 días.</div>
                                ) : (
                                    dueSoonBillings.map((item) => (
                                        <div className="dashboard-due-item" key={item.id}>
                                            <div className="dashboard-due-item__main">
                                                <strong>{item.propiedad}</strong>
                                                <span>
                                                    {item.inquilino || "Unidad sin asignar"} · {formatDashboardDueDate(item.fechaVencimiento)}
                                                </span>
                                            </div>
                                            <div className="dashboard-due-item__side">
                                                <span className={`dashboard-status dashboard-status--${item.tone}`}>
                                                    {getDashboardDueStatusLabel(item.daysLeft)}
                                                </span>
                                                <strong>{formatArs(item.montoACobrar)}</strong>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <section className="dashboard-followup-group" aria-label="Vencimientos atrasados">
                            <div className="dashboard-followup__header">
                                <h3 className="dashboard-followup__title">Vencidos</h3>
                                <span className="dashboard-followup__count">{overdueBillings.length}</span>
                            </div>
                            <div className="dashboard-due-list">
                                {overdueBillings.length === 0 ? (
                                    <div className="dashboard-empty-state">No hay cobros vencidos para seguir.</div>
                                ) : (
                                    overdueBillings.map((item) => (
                                        <div className="dashboard-due-item" key={item.id}>
                                            <div className="dashboard-due-item__main">
                                                <strong>{item.propiedad}</strong>
                                                <span>
                                                    {item.inquilino || "Unidad sin asignar"} · {formatDashboardDueDate(item.fechaVencimiento)}
                                                </span>
                                            </div>
                                            <div className="dashboard-due-item__side">
                                                <span className={`dashboard-status dashboard-status--${item.tone}`}>
                                                    {getDashboardDueStatusLabel(item.daysLeft)}
                                                </span>
                                                <strong>{formatArs(item.montoACobrar)}</strong>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="dashboard-card__note">Solo se muestran cobranzas con vencimiento cargado y estado pendiente o atrasado.</div>

                </article>

                <article className="dashboard-card dashboard-card--buildings dashboard-buildings-card">
                    <div className="dashboard-card__header dashboard-card__header--stacked">
                        <div>
                            <div className="dashboard-card__eyebrow">Propiedades</div>
                            <h2 className="dashboard-card__title">Concentración de unidades</h2>
                        </div>
                    </div>

                    <p className="dashboard-buildings-card__copy">
                        Revisión de edificios con mayor cantidad de unidades y su nivel de ocupación.
                    </p>

                    <div className="dashboard-buildings-summary" aria-label="Resumen de cartera">
                        <div className="dashboard-buildings-summary__item">
                            <span className="dashboard-buildings-summary__value">{buildings.length}</span>
                            <span className="dashboard-buildings-summary__label">Edificios activos</span>
                        </div>
                        <div className="dashboard-buildings-summary__item">
                            <span className="dashboard-buildings-summary__value">{tenants.length}</span>
                            <span className="dashboard-buildings-summary__label">Inquilinos activos</span>
                        </div>
                        <div className="dashboard-buildings-summary__item">
                            <span className="dashboard-buildings-summary__value">{overview.totalProperties}</span>
                            <span className="dashboard-buildings-summary__label">Unidades totales</span>
                        </div>
                    </div>

                    <div className="dashboard-card__divider" />

                    <div className="dashboard-building-list dashboard-building-list--compact">
                        {buildingBreakdown.map((building) => {
                            const occupancyTone = getOccupancyTone(building.occupancyRate);

                            return (
                                <div className="dashboard-building dashboard-building--compact" key={building.id}>
                                    <div className="dashboard-building__main">
                                        <strong>{building.name}</strong>
                                        <span>{building.address}</span>
                                    </div>

                                    <div className="dashboard-building__occupancy">
                                        <div className="dashboard-building__occupancy-row">
                                            <strong className={`dashboard-building__occupancy-value dashboard-building__occupancy-value--${occupancyTone}`}>
                                                {building.occupancyRate}%
                                            </strong>
                                            <span className={`dashboard-building__occupancy-pill dashboard-building__occupancy-pill--${occupancyTone}`}>
                                                {getOccupancyLabel(building.occupancyRate)}
                                            </span>
                                        </div>

                                        <div
                                            className="dashboard-building__occupancy-track"
                                            role="progressbar"
                                            aria-label={`Ocupación ${building.name}`}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-valuenow={building.occupancyRate}
                                        >
                                            <span
                                                className={`dashboard-building__occupancy-fill dashboard-building__occupancy-fill--${occupancyTone}`}
                                                style={{ width: `${building.occupancyRate}%` }}
                                            />
                                        </div>

                                        <span className="dashboard-building__occupancy-meta">
                                            {building.occupiedUnits}/{building.units} ocupadas
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </article>
                </div>
                <aside className="dashboard-card">
                    <div className="dashboard-card__header">
                        <div>
                            <div className="dashboard-card__eyebrow">Acciones rápidas</div>
                            <h2 className="dashboard-card__title">Atajos operativos</h2>
                        </div>
                    </div>

                    <div className="dashboard-actions-stack">
                        {actionCards.map((action) => (
                            <DashboardAction key={action.label} {...action} />
                        ))}
                    </div>
                </aside>


            </section>
        </div>
    );
}
