import { useQuery } from "@tanstack/react-query";
import {
  getBillableProperties,
  type ApiBillableItem,
} from "../service/propiedades";
import type { BillingItem } from "../components/billing/BillingTable";

function normalizeItem(api: ApiBillableItem): BillingItem {
  return {
    id: api.id,
    propiedad: `${api.building} ${api.unit}`,
    edificio: api.building,
    unidad: api.unit,
    inquilino: `${api.tenant.firstName} ${api.tenant.lastName}`,
    correo: api.tenant.email,
    telefono: api.tenant.phone,
    direccion: api.address,
    estadoAnterior: api.previousStatus,
    deudaAmount: api.debtAmount,
    montoACobrar: api.totalAmount,
    montoAlquiler: api.rentAmount,
    expensas: api.expenses,
    gastos: api.additionalCharges,
    fechaVencimiento: api.dueDate,
    periodo: api.period,
  };
}

export function useBillableProperties() {
  return useQuery<BillingItem[]>({
    queryKey: ["billable-properties"],
    queryFn: async () => {
      const response = await getBillableProperties();
      return response.data.map(normalizeItem);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
