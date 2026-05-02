const now = new Date();

export const PERIOD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
export const BATCH_ID = `EXP-${PERIOD}`;

export function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function formatArs(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}
