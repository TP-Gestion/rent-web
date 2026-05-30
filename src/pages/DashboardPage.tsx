import { useNavigate } from "react-router";
import {
    formatDueDate,
    getDueStatusLabel,
    useDashboard,
} from "../hooks/useDashboard.ts";
import { PERIOD, formatArs } from "../utils/billingHelpers";
import StatCard from "../components/dashboard/StatCard";
import "./DashboardPage.css";

type DashboardActionProps = {
    label: string;
    description: string;
    onClick: () => void;
    primary?: boolean;
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

export default function DashboardPage() {
    const navigate = useNavigate();
    const {
        isLoading,
        hasError,
        overview,
        buildingBreakdown,
        followUpBillings,
        overdueBillings,
        buildings,
        tenants,
        payments,
    } = useDashboard();

    const openFollowUps = overview.pendingProperties + overview.overdueProperties;
    const dueSoonBillings = followUpBillings.filter((item) => (item.daysLeft ?? 0) <= 7);

    const actionCards = [
        {
            label: "Generar liquidación",
            description: "Armá el lote mensual de expensas",
            onClick: () => navigate("/generar-liquidacion"),
        },
        {
            label: "Cargar expensa",
            description: "Registrá gastos operativos",
            onClick: () => navigate("/finances"),
        },
        {
            label: "Nueva propiedad",
            description: "Sumá una unidad a la cartera",
            onClick: () => navigate("/nueva-propiedad"),
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
                        subtitle={`${payments.paidCount} pagos registrados`}
                        variant="success"
                    />
                    <StatCard
                        label="Pendientes"
                        value={formatArs(payments.totalPendingAmount ?? 0)}
                        subtitle={`${payments.pendingCount} unidades`}
                        variant="warning"
                    />
                    <StatCard
                        label="Atrasadas"
                        value={formatArs(payments.totalOverdueAmount ?? 0)}
                        subtitle={`${payments.overdueCount} unidades`}
                        variant="danger"
                    />
                </aside>
            </section>

            <section className="dashboard-metrics" aria-label="Resumen operativo">
                <StatCard
                    label="Propiedades"
                    value={String(overview.totalProperties)}
                    subtitle={`${overview.occupiedProperties} ocupadas / ${overview.availableProperties} disponibles`}
                    variant="success"
                />
                <StatCard
                    label="Ocupación"
                    value={`${overview.occupancyRate}%`}
                    subtitle={`${overview.occupiedProperties} unidades activas`}
                    variant="default"
                />
                <StatCard
                    label="Seguimiento abierto"
                    value={String(openFollowUps)}
                    subtitle={`${overview.pendingProperties} pendientes / ${overview.overdueProperties} vencidas`}
                    variant="warning"
                />
                <StatCard
                    label="Deuda abierta"
                    value={formatArs(overview.totalDebt)}
                    subtitle={`${overview.overdueProperties} unidades en mora`}
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
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <article className="dashboard-card dashboard-card--followup dashboard-card--wide">
                    <div className="dashboard-card__header">
                        <div>
                            <div className="dashboard-card__eyebrow">Cobros que requieren seguimiento</div>
                            <h2 className="dashboard-card__title">Próximos vencimientos y mora</h2>
                        </div>
                        <span className="dashboard-card__badge">{dueSoonBillings.length + overdueBillings.length} en vista</span>
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
                                                    {item.inquilino || "Unidad sin asignar"} · {formatDueDate(item.fechaVencimiento)}
                                                </span>
                                            </div>
                                            <div className="dashboard-due-item__side">
                                                <span className={`dashboard-status dashboard-status--${item.tone}`}>
                                                    {getDueStatusLabel(item.daysLeft)}
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
                                                    {item.inquilino || "Unidad sin asignar"} · {formatDueDate(item.fechaVencimiento)}
                                                </span>
                                            </div>
                                            <div className="dashboard-due-item__side">
                                                <span className={`dashboard-status dashboard-status--${item.tone}`}>
                                                    {getDueStatusLabel(item.daysLeft)}
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

                <article className="dashboard-card dashboard-card--buildings">
                    <div className="dashboard-card__header">
                        <div>
                           <div className="dashboard-card__eyebrow">Propiedades</div>
                            <h2 className="dashboard-card__title">Concentración de unidades</h2>
                        </div>
                    </div>

                    <div className="dashboard-building-list">
                        {buildingBreakdown.map((building) => (
                        <div className="dashboard-building" key={building.id}>
                            <div className="dashboard-building__main">
                                <strong>{building.name}</strong>
                                <span>{building.address}</span>
                            </div>
                                <div className="dashboard-building__count">
                                    <strong>{building.units}</strong>
                                    <span>unidades</span>
                                </div>
                            </div>
                        ))}
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

                    <div className="dashboard-card__divider" />

                    <div className="dashboard-card__header dashboard-card__header--compact">
                        <div>
                            <div className="dashboard-card__eyebrow">Universo de trabajo</div>
                            <h2 className="dashboard-card__title">Edificios y tenencia</h2>
                        </div>
                    </div>

                    <div className="dashboard-universe">
                        <div className="dashboard-universe__item">
                            <span className="dashboard-universe__value">{buildings.length}</span>
                            <span className="dashboard-universe__label">edificios activos</span>
                        </div>
                        <div className="dashboard-universe__item">
                            <span className="dashboard-universe__value">{tenants.length}</span>
                            <span className="dashboard-universe__label">inquilinos cargados</span>
                        </div>
                    </div>
                </aside>


            </section>
        </div>
    );
}
