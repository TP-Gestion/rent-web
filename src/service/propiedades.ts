import { ApiResponse, apiClient, wrapResponse } from "./client";
export interface CreatePropiedadRequest {
  edificio: string;
  piso: string;
  superficie: number;
  ambientes: number;
  direccion: string;
  tipoUnidad: string;
  montoAlquiler?: number;
  expensas?: number;
  nombreInquilino?: string;
  apellidoInquilino?: string;
  correoInquilino?: string;
  telefonoInquilino?: string;
}

export interface PropiedadCreada extends CreatePropiedadRequest {
  id: string;
}

export async function crearPropiedad(
  body: CreatePropiedadRequest,
): Promise<ApiResponse<PropiedadCreada>> {
  return wrapResponse(apiClient.post<PropiedadCreada>("/properties", body));
}

export type EstadoOcupacion = "LIBRE" | "OCUPADO";
export type EstadoPago = "PAGADO" | "PENDIENTE" | "VENCIDO";

export interface PropiedadDetalle {
  id: number;
  nombreInquilino: string;
  edificio: string;
  piso: string;
  estadoOcupacion: EstadoOcupacion;
  estadoPago: EstadoPago;
  fechaVencimiento: string | null;
  montoTotal: number;
  direccion: string;
  superficie: number;
  ambientes: number;
  tipoUnidad: string;
  montoAlquiler: number;
  expensas: number;
}

export async function getDetallePropiedad(
  idPropiedad: string,
): Promise<ApiResponse<PropiedadDetalle>> {
  return wrapResponse(
    apiClient.get<PropiedadDetalle>(`/properties/${idPropiedad}`),
  );
}

export type PropiedadListItem = PropiedadDetalle;

export async function getPropiedades(): Promise<PropiedadListItem[]> {
  const { data } = await apiClient.get<PropiedadListItem[]>("/properties");
  return data;
}
