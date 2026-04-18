import { useMemo } from "react";
import type { ApiResponse } from "../../../service/client";
import type { PropiedadCreada } from "../types/property";

type AddPropertyMutationData = ApiResponse<PropiedadCreada> | undefined;

interface AddPropertyMutationState {
  isError: boolean;
  error: unknown;
  isSuccess: boolean;
  data: AddPropertyMutationData;
}

const isExistingPropertyError = (data: AddPropertyMutationData) =>
  data?.errors?.some((error) => error.code === "PROP001") ?? false;

export function useAddPropertyPageState(mutation: AddPropertyMutationState) {
  return useMemo(() => {
    const hasApiErrors = (mutation.data?.errors?.length ?? 0) > 0;
    const showExistingPropertyMessage = isExistingPropertyError(mutation.data);
    const isSuccess = mutation.isSuccess && !hasApiErrors;

    const errorMessage = mutation.isError
      ? ((mutation.error as Error)?.message ?? "Error inesperado del servidor.")
      : mutation.data?.errors[0]?.message ?? null;

    return {
      hasApiErrors,
      showExistingPropertyMessage,
      isSuccess,
      errorMessage,
    };
  }, [mutation.data, mutation.error, mutation.isError, mutation.isSuccess]);
}
