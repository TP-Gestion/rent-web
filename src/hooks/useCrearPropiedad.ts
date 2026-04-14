import { useMutation } from "@tanstack/react-query";
import { crearPropiedad } from "../service/propiedades";
import type { CreatePropiedadRequest } from "../service/propiedades";

export function useCrearPropiedad() {
  return useMutation({
    mutationFn: (body: CreatePropiedadRequest) => crearPropiedad(body),
  });
}
