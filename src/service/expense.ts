import { apiClient, wrapResponse, ApiResponse } from './client'
import { CreateExpenseRequest, ExpenseItem, UpdateExpenseRequest } from '../types/expense'

export async function createBuildingExpense(
  body: CreateExpenseRequest,
  buildingId: number,
): Promise<ApiResponse<ExpenseItem>> {
  return wrapResponse(apiClient.post<ExpenseItem>(`/buildings/${buildingId}/expenses`, body))
}

export async function updateBuildingExpense(
  buildingId: number,
  expenseId: number,
  body: UpdateExpenseRequest,
): Promise<ApiResponse<ExpenseItem>> {
  return wrapResponse(
    apiClient.patch<ExpenseItem>(`/buildings/${buildingId}/expenses/${expenseId}`, body),
  )
}


export async function getExpensesForBuilding(
  buildingId: number,
): Promise<ApiResponse<ExpenseItem[]>> {
  return wrapResponse(apiClient.get<ExpenseItem[]>(`/buildings/${buildingId}/expenses`))
}

export default {} as const
