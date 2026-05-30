export type StatusTone = "success" | "warning" | "danger" | "neutral";

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

export function getDaysUntil(dateValue: string | null | undefined) {
	if (!dateValue) return null;

	const targetDate = new Date(`${dateValue}T00:00:00`);
	if (Number.isNaN(targetDate.getTime())) return null;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const diff = targetDate.getTime() - today.getTime();
	return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function getStatusTone(daysLeft: number | null): StatusTone {
	if (daysLeft === null) return "neutral";
	if (daysLeft < 0) return "danger";
	if (daysLeft <= 5) return "warning";
	return "success";
}