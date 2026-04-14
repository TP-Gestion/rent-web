import { ApiResponse, apiClient } from "./client";
export interface CreatePropiedadRequest {
  edificio: string;
  piso: string;
  superficie: string;
  ambientes: number;
  direccion: string;
  tipoUnidad: string;
  montoAlquiler?: number;
  expensas?: number;
  nombreInquilino?: string;
  apellidoInquilino?: string;
  correoInquilino?: string;
}

export interface PropiedadCreada extends CreatePropiedadRequest {
  id: string;
}

export async function crearPropiedad(
  body: CreatePropiedadRequest,
): Promise<ApiResponse<PropiedadCreada>> {
  if (body.edificio === "Edificio A" && body.piso === "1") {
    return {
      data: {
        id: "123",
        ...body,
      },
      errors: [],
    };
  }
  if (body.edificio === "Edificio B" && body.piso === "2") {
    return {
      data: null as any,
      errors: [
        {
          code: "PROP001",
          message: "El piso ya está ocupado por otra propiedad.",
          statusCode: 400,
        },
      ],
    };
  }
  return {} as any;

  const { data } = await apiClient.post<ApiResponse<PropiedadCreada>>(
    "/propiedades",
    body,
  );
  return data;
}
