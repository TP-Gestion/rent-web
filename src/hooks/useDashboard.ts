import { useMemo } from "react";
import { getDaysUntil, getStatusTone } from "../utils/dashboardUtils";
import type {
	DashboardBuilding,
	DashboardOverview,
	DashboardPaymentsSummary,
	UpcomingBillingItem,
} from "../types/dashboard.ts";
import { useBillableProperties } from "./useBillableProperties";
import { useBuildings } from "./useBuildings";
import { usePropertiesSummary } from "./usePropertiesSummary";
import { useTenants } from "./useTenants";

function isOverdueBilling(
	item: { estadoAnterior: string; fechaVencimiento: string | null | undefined },
) {
	const daysLeft = getDaysUntil(item.fechaVencimiento);
	return item.estadoAnterior !== "PAID" && daysLeft !== null && daysLeft < 0;
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
		const pendingProperties = properties.filter(
			(property) => property.estadoPago === "PENDING",
		).length;
		const overdueProperties = properties.filter(
			(property) => property.estadoPago === "OVERDUE",
		).length;
		const totalDebt = billableItems.reduce((sum, item) => {
			if (!isOverdueBilling(item)) {
				return sum;
			}

			return sum + (item.montoACobrar ?? 0);
		}, 0);

		return {
			totalProperties,
			occupiedProperties,
			availableProperties,
			pendingProperties,
			overdueProperties,
			totalDebt,
			occupancyRate:
				totalProperties > 0
					? Math.round((occupiedProperties / totalProperties) * 100)
					: 0,
		};
	}, [billableItems, properties]);

	const buildingBreakdown = useMemo<DashboardBuilding[]>(() => {
		const unitsByBuilding = new Map<string, number>();
		const occupiedUnitsByBuilding = new Map<string, number>();

		properties.forEach((property) => {
			unitsByBuilding.set(
				property.edificio,
				(unitsByBuilding.get(property.edificio) ?? 0) + 1,
			);

			if (property.estadoOcupacion !== "AVAILABLE") {
				occupiedUnitsByBuilding.set(
					property.edificio,
					(occupiedUnitsByBuilding.get(property.edificio) ?? 0) + 1,
				);
			}
		});

		return buildings
			.map((building) => {
				const units = unitsByBuilding.get(building.name) ?? 0;
				const occupiedUnits = occupiedUnitsByBuilding.get(building.name) ?? 0;

				return {
					...building,
					units,
					occupiedUnits,
					occupancyRate: units > 0 ? Math.round((occupiedUnits / units) * 100) : 0,
				};
			})
			.sort((left, right) => right.units - left.units)
			.slice(0, 4);
	}, [buildings, properties]);

	const dueSoonBillings = useMemo<UpcomingBillingItem[]>(() => {
		return [...billableItems]
			.map((item) => {
				const daysLeft = getDaysUntil(item.fechaVencimiento);
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
			.filter((item) => item.daysLeft !== null && item.daysLeft >= 0 && item.daysLeft <= 7)
			.slice(0, 5);
	}, [billableItems]);

	const overdueBillings = useMemo<UpcomingBillingItem[]>(() => {
		return [...billableItems]
			.map((item) => {
				const daysLeft = getDaysUntil(item.fechaVencimiento);
				return {
					...item,
					daysLeft,
					tone: getStatusTone(daysLeft),
				};
			})
			.filter((item) => isOverdueBilling(item))
			.sort((left, right) => (left.daysLeft ?? 0) - (right.daysLeft ?? 0))
			.slice(0, 5);
	}, [billableItems]);

	const payments = useMemo<DashboardPaymentsSummary>(() => {
		const paid = billableItems.filter((item) => item.estadoAnterior === "PAID");
		const pending = billableItems.filter((item) => item.estadoAnterior === "PENDING");
		const overdue = overdueBillings;
		const morosityRate =
			overview.occupiedProperties > 0
				? Math.round((overdue.length / overview.occupiedProperties) * 100)
				: 0;

		return {
			totalPaidAmount: paid.reduce((sum, item) => sum + (item.montoACobrar ?? 0), 0),
			totalPendingAmount: pending.reduce((sum, item) => sum + (item.montoACobrar ?? 0), 0),
			totalOverdueAmount: overdue.reduce((sum, item) => sum + (item.montoACobrar ?? 0), 0),
			paidCount: paid.length,
			pendingCount: pending.length,
			overdueCount: overdue.length,
			morosityRate,
		};
	}, [billableItems, overdueBillings, overview.occupiedProperties]);

	const openFollowUps = overview.pendingProperties + overview.overdueProperties;

	return {
		isLoading,
		hasError,
		overview,
		openFollowUps,
		buildingBreakdown,
		dueSoonBillings,
		overdueBillings,
		buildings,
		tenants,
		payments,
	};
}