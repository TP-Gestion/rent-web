import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearPropiedad } from "../service/propiedades";
import type { CreatePropiedadRequest } from "../service/propiedades";

export function useCrearPropiedad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePropiedadRequest) => crearPropiedad(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propiedades"] });
    },
  });
}
