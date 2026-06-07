import { useQuery } from "@tanstack/react-query";
import { getExpensesForBuilding, createBuildingExpense } from "../service/expense";
import { CreateExpenseRequest} from "../types/expense";

function getExpensas(buildingId: number) {
    return useQuery({
        queryKey: ['expenses', buildingId],
        queryFn: () => getExpensesForBuilding(buildingId),
        enabled: !!buildingId,
    });
}

function addExpensa(expenseData: CreateExpenseRequest, buildingId: number) {
    return createBuildingExpense(expenseData, buildingId);
}

export { getExpensas, addExpensa };