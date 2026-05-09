import jsPDF from "jspdf";
import JSZip from "jszip";
import type { BillingItem } from "../components/billing/BillingTable";

const PAGE_W = 210;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;

function fmtArs(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

function fmtDate(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
}

function todayStr(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function labelValue(
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
): void {
  doc.setFont("helvetica", "bold");
  doc.text(`${label}:`, x, y);
  doc.setFont("helvetica", "normal");
  doc.text(value, x + doc.getTextWidth(`${label}:`) + 2, y);
}

function sanitizeSegment(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function generateInvoicePdf(item: BillingItem): ArrayBuffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  let y = 22;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("FACTURA", PAGE_W / 2, y, { align: "center" });
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  labelValue(doc, "Fecha de emisión", " " + (todayStr() || "N/A"), MARGIN, y);
  y += 10;

  labelValue(doc, "Emisor", item.edificio, MARGIN, y);
  y += 10;

  labelValue(doc, "Cliente", item.inquilino, MARGIN, y);
  y += 5;
  labelValue(doc, "Email", item.correo, MARGIN, y);
  y += 5;
  labelValue(doc, "Tel", item.telefono, MARGIN, y);
  y += 10;

  labelValue(doc, "Unidad", `${item.edificio} - ${item.unidad}`, MARGIN, y);
  y += 5;
  labelValue(doc, "Dirección", item.direccion, MARGIN, y);
  y += 10;

  const ROW_H = 7;
  const colDesc = MARGIN;
  const colPeriod = MARGIN + 95;
  const colAmount = MARGIN + 140;

  doc.setFillColor(220, 220, 220);
  doc.rect(colDesc, y, CONTENT_W, ROW_H, "F");
  doc.setDrawColor(180, 180, 180);
  doc.rect(colDesc, y, CONTENT_W, ROW_H, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Descripción", colDesc + 3, y + 4.8);
  doc.text("Período", colPeriod + 3, y + 4.8);
  doc.text("Importe", colAmount + 3, y + 4.8);
  y += ROW_H;

  type Row = [string, string, string];
  const rows: Row[] = [
    ["Alquiler", item.periodo, fmtArs(item.montoAlquiler)],
    ["Expensas", item.periodo, fmtArs(item.expensas)],
    ["Otros", item.periodo, fmtArs(item.gastos)],
  ];

  if (item.estadoAnterior === "OVERDUE" && item.deudaAmount) {
    rows.push(["Deuda anterior", item.periodo, fmtArs(item.deudaAmount)]);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  for (const [desc, period, amount] of rows) {
    doc.setDrawColor(180, 180, 180);
    doc.rect(colDesc, y, CONTENT_W, ROW_H, "S");
    doc.text(desc, colDesc + 3, y + 4.8);
    doc.text(period, colPeriod + 3, y + 4.8);
    doc.text(amount, colAmount + 3, y + 4.8);
    y += ROW_H;
  }

  y += 1;
  doc.setFillColor(200, 200, 200);
  doc.rect(colDesc, y, CONTENT_W, ROW_H + 1, "F");
  doc.setDrawColor(150, 150, 150);
  doc.rect(colDesc, y, CONTENT_W, ROW_H + 1, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTAL A PAGAR", colDesc + 3, y + 5.5);
  doc.text(fmtArs(item.montoACobrar), colAmount + 3, y + 5.5);
  y += ROW_H + 1 + 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  labelValue(
    doc,
    "Vencimiento",
    " " + (fmtDate(item.fechaVencimiento) || "N/A"),
    MARGIN,
    y,
  );
  y += 6;

  const estadoCuenta = item.estadoAnterior === "PAID" ? "Al día" : "Adeudado";
  labelValue(doc, "Estado de cuenta", estadoCuenta, MARGIN, y);
  y += 12;

  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  doc.text("Documento no válido como factura fiscal.", MARGIN, y);

  return doc.output("arraybuffer");
}

export async function exportBillingToPdfZip(
  items: BillingItem[],
  selectedIds: Set<string>,
): Promise<void> {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const folderName = `FACTURAS_${dd}${mm}${yyyy}_${hh}${min}`;

  const zip = new JSZip();
  const folder = zip.folder(folderName);
  if (!folder) return;

  const selected = items.filter((i) => selectedIds.has(i.id));

  for (const item of selected) {
    const pdfBytes = generateInvoicePdf(item);
    const edificio = sanitizeSegment(item.edificio);
    const unidad = sanitizeSegment(item.unidad);
    const periodo = sanitizeSegment(item.periodo);
    const filename = `${edificio}_${unidad}_${periodo}.pdf`;
    folder.file(filename, pdfBytes);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
