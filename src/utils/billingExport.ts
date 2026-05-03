import * as XLSX from "xlsx";
import type { BillingItem } from "../components/billing/BillingTable";

const PREVIOUS_TO_NEW_STATUS: Record<string, string> = {
  PAID: "Pendiente",
  PENDING: "Adeudado",
  OVERDUE: "Adeudado",
};

function getBillingFileName(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `FACTURACION_${dd}${mm}${yyyy}_${hh}${min}.xlsx`;
}

export function exportBillingToExcel(
  items: BillingItem[],
  selectedIds: Set<string>,
): void {
  const rows = items.map((item) => ({
    Edificio: item.edificio,
    Unidad: item.unidad,
    Dirección: item.direccion,
    Inquilino: item.inquilino,
    Correo: item.correo,
    Teléfono: item.telefono,
    Período: item.periodo,
    Alquiler: item.montoAlquiler,
    Expensas: item.expensas,
    Gastos: item.gastos,
    Total: item.montoACobrar,
    Vencimiento: item.fechaVencimiento,
    Estado: PREVIOUS_TO_NEW_STATUS[item.estadoAnterior] ?? "PENDING",
    Notificado: selectedIds.has(item.id) ? "Sí" : "No",
  }));

  const fileName = getBillingFileName();

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Facturación");
  XLSX.writeFile(wb, fileName);
}
