import * as XLSX from "xlsx";
import type { BillingItem } from "../components/billing/BillingTable";

export function exportBillingToExcel(
  items: BillingItem[],
  selectedIds: Set<string>,
  batchId: string,
  dueDate: string,
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
    Vencimiento: dueDate,
    Estado: "PENDIENTE",
    Notificado: selectedIds.has(item.id) ? "Sí" : "No",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Facturación");
  XLSX.writeFile(wb, `facturacion-${batchId}.xlsx`);
}
