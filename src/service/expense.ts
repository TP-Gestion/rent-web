import { apiClient, wrapResponse, ApiResponse } from './client'
import { CreateExpenseRequest, ExpenseItem } from '../types/expense'

export async function createExpense(
  body: CreateExpenseRequest,
  buildingId: number,
): Promise<ApiResponse<ExpenseItem>> {
  return wrapResponse(apiClient.post<ExpenseItem>(`/buildings/${buildingId}/expenses`, body))
}


export async function getExpensesForBuilding(
  buildingId: number,
): Promise<ApiResponse<ExpenseItem[]>> {
  return wrapResponse(apiClient.get<ExpenseItem[]>(`/buildings/${buildingId}/expenses`))
}

export default {} as const
