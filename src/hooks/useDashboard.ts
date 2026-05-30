import { useMemo } from "react";
import type { BillingItem } from "../components/billing/BillingTable";
import { useBillableProperties } from "./useBillableProperties";
import { useBuildings } from "./useBuildings";
import { usePropertiesSummary } from "./usePropertiesSummary";
import { useTenants } from "./useTenants";
import { usePaymentsSummary } from "./usePaymentsSummary";

export type StatusTone = "success" | "warning" | "danger" | "neutral";

export type DashboardBuilding = {
	id: number | string;
	name: string;
	address?: string;
	units: number;
};

export type DashboardTenant = {
	id: number | string;
	firstName: string;
	lastName: string;
	email: string;
};

export type DashboardOverview = {
	totalProperties: number;
	occupiedProperties: number;
	availableProperties: number;
	paidProperties: number;
	pendingProperties: number;
	overdueProperties: number;
	totalBillable: number;
	totalDebt: number;
	occupancyRate: number;
	collectionRate: number;
	paymentPressure: number;
};

export type UpcomingBillingItem = BillingItem & {
	daysLeft: number | null;
	tone: StatusTone;
};

export function getDueStatusLabel(daysLeft: number | null) {
	if (daysLeft === null) return "Sin fecha";
	if (daysLeft < 0) return `Vencido hace ${Math.abs(daysLeft)} días`;
	if (daysLeft === 0) return "Vence hoy";
	return `Vence en ${daysLeft} días`;
}

export function formatDueDate(dateValue: string | null | undefined) {
	if (!dateValue) return "Sin vencimiento";

	const parsedDate = new Date(`${dateValue}T00:00:00`);
	if (Number.isNaN(parsedDate.getTime())) return "Sin vencimiento";

	return new Intl.DateTimeFormat("es-AR", {
		day: "2-digit",
		month: "short",
	}).format(parsedDate);
}

function daysUntil(dateValue: string | null | undefined) {
	if (!dateValue) return null;

	const targetDate = new Date(`${dateValue}T00:00:00`);
	if (Number.isNaN(targetDate.getTime())) return null;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const diff = targetDate.getTime() - today.getTime();
	return Math.round(diff / (1000 * 60 * 60 * 24));
}

function getStatusTone(daysLeft: number | null): StatusTone {
	if (daysLeft === null) return "neutral";
	if (daysLeft < 0) return "danger";
	if (daysLeft <= 5) return "warning";
	return "success";
}

export function useDashboard() {
	const propertiesQuery = usePropertiesSummary();
	const billableQuery = useBillableProperties();
	const buildingsQuery = useBuildings();
	const tenantsQuery = useTenants();

	const properties = propertiesQuery.data ?? [];
	const billableItems = billableQuery.data ?? [];
	const buildings = buildingsQuery.data ?? [];
	const tenants = tenantsQuery.data ?? [];

	const isLoading =
		propertiesQuery.isLoading ||
		billableQuery.isLoading ||
		buildingsQuery.isLoading ||
		tenantsQuery.isLoading;

	const hasError =
		propertiesQuery.isError ||
		billableQuery.isError ||
		buildingsQuery.isError ||
		tenantsQuery.isError;

	const overview = useMemo<DashboardOverview>(() => {
		const totalProperties = properties.length;
		const occupiedProperties = properties.filter(
			(property) => property.estadoOcupacion !== "AVAILABLE",
		).length;
		const availableProperties = totalProperties - occupiedProperties;
		const paidProperties = properties.filter(
			(property) => property.estadoPago === "PAID",
		).length;
		const pendingProperties = properties.filter(
			(property) => property.estadoPago === "PENDING",
		).length;
		const overdueProperties = properties.filter(
			(property) => property.estadoPago === "OVERDUE",
		).length;

		const totalBillable = billableItems.reduce(
			(sum, item) => sum + (item.montoACobrar ?? 0),
			0,
		);
		const totalDebt = billableItems.reduce(
			(sum, item) => sum + (item.deudaAmount ?? 0),
			0,
		);

		return {
			totalProperties,
			occupiedProperties,
			availableProperties,
			paidProperties,
			pendingProperties,
			overdueProperties,
			totalBillable,
			totalDebt,
			occupancyRate:
				totalProperties > 0
					? Math.round((occupiedProperties / totalProperties) * 100)
					: 0,
			collectionRate:
				occupiedProperties > 0
					? Math.round((paidProperties / occupiedProperties) * 100)
					: 0,
			paymentPressure:
				totalProperties > 0
					? Math.round(
						((pendingProperties + overdueProperties) / totalProperties) * 100,
					)
					: 0,
		};
	}, [billableItems, properties]);

	const buildingBreakdown = useMemo<DashboardBuilding[]>(() => {
		const unitsByBuilding = new Map<string, number>();

		properties.forEach((property) => {
			unitsByBuilding.set(
				property.edificio,
				(unitsByBuilding.get(property.edificio) ?? 0) + 1,
			);
		});

		return buildings
			.map((building) => ({
				...building,
				units: unitsByBuilding.get(building.name) ?? 0,
			}))
			.sort((left, right) => right.units - left.units)
			.slice(0, 4);
	}, [buildings, properties]);

	const followUpBillings = useMemo<UpcomingBillingItem[]>(() => {
		return [...billableItems]
			.map((item) => {
				const daysLeft = daysUntil(item.fechaVencimiento);
				return {
					...item,
					daysLeft,
					tone: getStatusTone(daysLeft),
				};
			})
			.filter((item) => item.estadoAnterior !== "PAID" && item.daysLeft !== null)
			.sort((left, right) => {
				const leftDays = left.daysLeft ?? 0;
				const rightDays = right.daysLeft ?? 0;
				return leftDays - rightDays;
			})
			.filter((item) => item.daysLeft !== null && item.daysLeft >= 0)
			.slice(0, 5);
	}, [billableItems]);

	const overdueBillings = useMemo<UpcomingBillingItem[]>(() => {
		return [...billableItems]
			.map((item) => {
				const daysLeft = daysUntil(item.fechaVencimiento);
				return {
					...item,
					daysLeft,
					tone: getStatusTone(daysLeft),
				};
			})
			.filter((item) => item.estadoAnterior !== "PAID" && item.daysLeft !== null && item.daysLeft < 0)
			.sort((left, right) => (left.daysLeft ?? 0) - (right.daysLeft ?? 0))
			.slice(0, 5);
	}, [billableItems]);

	const tenantHighlights = useMemo<DashboardTenant[]>(() => tenants.slice(0, 6), [tenants]);

	const payments = usePaymentsSummary();

	return {
		isLoading,
		hasError,
		overview,
		buildingBreakdown,
		followUpBillings,
		overdueBillings,
		tenantHighlights,
		buildings,
		tenants,
		billableItems,
		payments,
	};
}