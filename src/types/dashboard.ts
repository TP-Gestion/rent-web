import type { BillingItem } from "../components/billing/BillingTable";
import type { StatusTone } from "../utils/dashboardUtils";

export type DashboardBuilding = {
	id: number | string;
	name: string;
	address?: string;
	units: number;
	occupiedUnits: number;
	occupancyRate: number;
};

export type DashboardOverview = {
	totalProperties: number;
	occupiedProperties: number;
	availableProperties: number;
	pendingProperties: number;
	overdueProperties: number;
	totalDebt: number;
	occupancyRate: number;
};

export type DashboardPaymentsSummary = {
	totalPaidAmount: number;
	totalPendingAmount: number;
	totalOverdueAmount: number;
	paidCount: number;
	pendingCount: number;
	overdueCount: number;
};

export type UpcomingBillingItem = BillingItem & {
	daysLeft: number | null;
	tone: StatusTone;
};