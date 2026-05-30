import { useMemo } from "react";
import { usePropertiesSummary } from "./usePropertiesSummary";

export function usePaymentsSummary() {
  const propertiesQuery = usePropertiesSummary();
  const properties = propertiesQuery.data ?? [];

  const summary = useMemo(() => {
    const paid = properties.filter((p) => p.estadoPago === "PAID");
    const pending = properties.filter((p) => p.estadoPago === "PENDING");
    const overdue = properties.filter((p) => p.estadoPago === "OVERDUE");

    const totalPaidAmount = paid.reduce((s, p) => s + (p.montoTotal ?? 0), 0);
    const totalPendingAmount = pending.reduce((s, p) => s + (p.montoTotal ?? 0), 0);
    const totalOverdueAmount = overdue.reduce((s, p) => s + (p.montoTotal ?? 0), 0);

    return {
      totalPaidAmount,
      totalPendingAmount,
      totalOverdueAmount,
      paidCount: paid.length,
      pendingCount: pending.length,
      overdueCount: overdue.length,
    };
  }, [properties]);

  return {
    ...summary,
    isLoading: propertiesQuery.isLoading,
    isError: propertiesQuery.isError,
  };
}

export default usePaymentsSummary;
