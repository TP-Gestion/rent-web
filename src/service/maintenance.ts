import {
  ApiResponse,
  BackendResponse,
  apiClient,
} from "./client";
import {
  USE_MOCK_BILLABLE_DATA,
  mockDelay,
} from "./service_mock";

export type ExpenseType =
  | "MAINTENANCE"
  | "REPAIR"
  | "UTILITIES"
  | "TAXES"
  | "ADMINISTRATION";

export interface CommonExpense {
  expenseId: number;
  type: ExpenseType;
  totalAmount: number;
  description: string;
  dueDate: string;
  createdAt: string;
  affectedProperties: number;
}

interface CommonExpensesApiResponse {
  status: number;
  message: string;
  data: CommonExpense[];
  errors: Record<string, unknown> | null;
  timestamp: string;
}

/**
 * Fetch common expenses for a building
 * Endpoint: GET /api/v1/buildings/{buildingId}/common-expenses
 */
export async function getBuildingCommonExpenses(
  buildingId: number,
): Promise<ApiResponse<CommonExpense[]>> {
    if (USE_MOCK_BILLABLE_DATA) {
        await mockDelay();
        return {
        data: [],
        errors: [],
        };
    }

  try {
    const { data } = await apiClient.get<CommonExpensesApiResponse>(
      `/buildings/${buildingId}/common-expenses`,
    );
    return {
      data: data.data || [],
      errors: [],
    };
  } catch (error) {
    return {
      data: [],
      errors: [
        {
          message: "Failed to fetch common expenses",
          code: "FETCH_ERROR",
          statusCode: 500,
        },
      ],
    };
  }
}

/**
 * Update a common expense
 * Endpoint: PUT /api/v1/buildings/{buildingId}/common-expenses/{expenseId}
 */
export interface UpdateCommonExpenseRequest {
  type?: ExpenseType;
  totalAmount?: number;
  description?: string;
  dueDate?: string;
}

export async function updateCommonExpense(
  buildingId: number,
  expenseId: number,
  body: UpdateCommonExpenseRequest,
): Promise<ApiResponse<CommonExpense>> {
  if (USE_MOCK_BILLABLE_DATA) {
    return {
      data: {} as CommonExpense,
      errors: [
        {
          message: "Expense not found",
          code: "NOT_FOUND",
          statusCode: 404,
        },
      ],
    };
  }

  try {
    const { data } = await apiClient.put<BackendResponse<CommonExpense>>(
      `/buildings/${buildingId}/common-expenses/${expenseId}`,
      body,
    );
    return {
      data: data.data,
      errors: [],
    };
  } catch (error) {
    return {
      data: {} as CommonExpense,
      errors: [
        {
          message: "Failed to update expense",
          code: "UPDATE_ERROR",
          statusCode: 500,
        },
      ],
    };
  }
}
