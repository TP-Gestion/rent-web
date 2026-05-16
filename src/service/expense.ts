import { apiClient, wrapResponse, ApiResponse } from './client'

export type ExpenseType = 'ORDINARIA' | 'EXTRAORDINARIA'

export interface CreateExpenseRequest {
  building: string
  type: ExpenseType
  category?: string
  amount: number
  concept: string
}

export interface ExpenseItem {
  id: number
  building: string
  type: ExpenseType
  category?: string
  amount: number
  concept: string
  frequency: 'UNICA' | 'MENSUAL'
  createdAt: string
}

// Create an expense (expensa)
export async function createExpense(
  body: CreateExpenseRequest,
): Promise<ApiResponse<ExpenseItem>> {
  return wrapResponse(apiClient.post<ExpenseItem>('/api/v1/expenses', body))
}

// List expenses for a building
export async function getExpensesForBuilding(
  building: string,
): Promise<ApiResponse<ExpenseItem[]>> {
  return wrapResponse(apiClient.get<ExpenseItem[]>(`/api/v1/expenses?building=${encodeURIComponent(building)}`))
}

export default {} as const
