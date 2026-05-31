export type ExpenseType = 'ORDINARIA' | 'EXTRAORDINARIA'

export type ExpenseFrequency = 'UNICA' | 'MENSUAL'

// POST
export interface CreateExpenseRequest {
  type: ExpenseType
  category?: string
  concept?: string
  amount: number
}

export interface UpdateExpenseRequest {
  type?: ExpenseType
  category?: string
  concept?: string
  amount?: number
}

export interface ExpenseItem {
  id: number
  buildingName: string
  type: ExpenseType
  category?: string
  concept?: string
  frequency: ExpenseFrequency
  amount: number
  createdAt: string
}

// GET
export interface ExpenseResponse {
  expenses: ExpenseItem[]
}