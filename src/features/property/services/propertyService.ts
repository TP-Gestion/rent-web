import { ApiResponse, apiClient } from "../../../service/client";
import { getMockPropertyDetailById } from "../mocks/propertyDetails";
import type {
  CreatePropiedadRequest,
  PropiedadCreada,
  PropiedadDetalle,
} from "../types/property";

export async function crearPropiedad(
  body: CreatePropiedadRequest,
): Promise<ApiResponse<PropiedadCreada>> {
  console.log("Creando propiedad con datos:", body);
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

export async function getDetallePropiedad(
  idPropiedad: string,
): Promise<ApiResponse<PropiedadDetalle>> {
  console.log("Obteniendo detalle de propiedad para ID:", idPropiedad);
  const mock = getMockPropertyDetailById(idPropiedad);
  if (mock) {
    return { data: mock, errors: [] };
  }

  const { data } = await apiClient.get<ApiResponse<PropiedadDetalle>>(
    `/propiedades/${idPropiedad}/detalle`,
  );
  return data;
}
