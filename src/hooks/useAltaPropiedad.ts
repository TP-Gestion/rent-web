import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  createPropertyV2,
  assignTenantToProperty,
  createRentalContract,
} from "../service/propiedades";

export interface AltaPropiedadInput {
  buildingId: number;
  tenantId: number | null;
  floor: string;
  area: number;
  rooms: number;
  unitType: string;
  contractAmount: number;
  contractDueDate: string;
  contractFile?: File | null;
}

function extractApiError(err: unknown): Error {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const message = err.response?.data?.message as string | undefined;
    if (status === 409) {
      return new Error(
        "Ya existe una unidad registrada en ese edificio y piso. Verificá los datos e intentá con otro piso.",
      );
    }
    if (message) return new Error(message);
  }
  return err instanceof Error
    ? err
    : new Error("Error inesperado del servidor.");
}

export function useAltaPropiedad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AltaPropiedadInput) => {
      try {
        const propResult = await createPropertyV2({
          buildingId: input.buildingId,
          floor: input.floor,
          area: input.area,
          rooms: input.rooms,
          unitType: input.unitType,
        });
        const propertyId = propResult.data.id;

        if (input.tenantId !== null) {
          await assignTenantToProperty(propertyId, input.tenantId);
        }

        await createRentalContract(propertyId, {
          amount: input.contractAmount,
          dueDate: input.contractDueDate,
          contract: input.contractFile ?? undefined,
        });

        return propertyId;
      } catch (err) {
        throw extractApiError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propiedades"] });
    },
  });
}
