import { apiClient, ApiResponse, BackendResponse } from './client'
import { CreateExpenseRequest, ExpenseItem, UpdateExpenseRequest } from '../types/expense'

export async function createBuildingExpense(
  body: CreateExpenseRequest,
  buildingId: number,
): Promise<ApiResponse<ExpenseItem>> {
  const response = await apiClient.post<BackendResponse<ExpenseItem>>(`/buildings/${buildingId}/expenses`, body)
  return {
    data: response.data.data,
    errors: [],
  }
}

export async function updateBuildingExpense(
  buildingId: number,
  expenseId: number,
  body: UpdateExpenseRequest,
): Promise<ApiResponse<ExpenseItem>> {
  const response = await apiClient.patch<BackendResponse<ExpenseItem>>(
    `/buildings/${buildingId}/expenses/${expenseId}`,
    body,
  )
  return {
    data: response.data.data,
    errors: [],
  }
}

export async function getExpensesForBuilding(
  buildingId: number,
): Promise<ApiResponse<ExpenseItem[]>> {
  const response = await apiClient.get<BackendResponse<ExpenseItem[]>>(`/buildings/${buildingId}/expenses`)
  return {
    data: response.data.data,
    errors: [],
  }
}

export default {} as const
