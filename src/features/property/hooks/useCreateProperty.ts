import { useMutation } from "@tanstack/react-query";
import { crearPropiedad } from "../services/propertyService";
import type { CreatePropiedadRequest } from "../types/property";

export function useCreateProperty() {
  return useMutation({
    mutationFn: (body: CreatePropiedadRequest) => crearPropiedad(body),
  });
}
