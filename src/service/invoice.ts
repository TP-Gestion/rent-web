import { apiClient, wrapResponse, type ApiResponse } from "./client"
import type { IssueInvoiceRequest } from "../types/invoice"

// Este servicio es un placeholder, 
// Se asume que habrá un endpoint para emitir facturas,
// y este servicio se encargará de llamar a ese endpoint con los datos necesarios.
export async function issueInvoice(
  body: IssueInvoiceRequest,
): Promise<ApiResponse<void>> {
  return wrapResponse(apiClient.post<void>("/Todo/backend", body))
}

export default {} as const