import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBuildingExpense } from "../service/expense"
import type { UpdateExpenseRequest } from "../types/expense"

export function useUpdateExpense(buildingId: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ expenseId, body }: { expenseId: number; body: UpdateExpenseRequest }) => {
      if (!buildingId) throw new Error("No building selected")
      return updateBuildingExpense(buildingId, expenseId, body)
    },
    onSuccess: async () => {
      if (buildingId) {
        await queryClient.invalidateQueries({ queryKey: ["expenses", buildingId] })
      }
    },
  })
}

export default useUpdateExpense
