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
  telefonoInquilino?: string;
}

export interface PropiedadCreada extends CreatePropiedadRequest {
  id: string;
}

export interface PagoHistorial {
  periodo: string;
  fechaPago: string;
  monto: number;
  estado: "PAGADO" | "PARCIAL" | "ADEUDADO";
}

export type EstadoPropiedad = "AL_DIA" | "ADEUDADO" | "LIBRE";

export interface PropiedadDetalle {
  edificio: string;
  piso: string;
  estado: EstadoPropiedad;
  fechaVencimiento: string;
  nombreInquilino: string;
  apellidoInquilino: string;
  telefonoInquilino?: string;
  superficie: string;
  ambientes: number;
  historialDePagos: PagoHistorial[];
  montoAdeudado: number;
  montoMensualExpensa: number;
  montoMensualGasto: number;
  gananciaMensualAlquiler: number;
  gastos: unknown[];
  direccion: string;
  correoInquilino?: string;
}
