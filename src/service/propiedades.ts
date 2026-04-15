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
  telefonoInquilino?: string;
}

export interface PropiedadCreada extends CreatePropiedadRequest {
  id: string;
}

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
const MOCK_DETALLE: Record<string, PropiedadDetalle> = {
  "8829-K": {
    edificio: "TORRE SOLARIS I",
    piso: "12B",
    estado: "AL_DIA",
    fechaVencimiento: "2026-04-20",
    nombreInquilino: "Agustín",
    apellidoInquilino: "Moreno",
    telefonoInquilino: "+54 11 4523-8891",
    correoInquilino: "agustin.moreno@example.com",
    superficie: "72",
    ambientes: 3,
    direccion: "Av. Libertador 4500",
    montoAdeudado: 0,
    montoMensualExpensa: 320000,
    montoMensualGasto: 85000,
    gananciaMensualAlquiler: 145000,
    gastos: [],
    historialDePagos: [
      {
        periodo: "MAR 2026",
        fechaPago: "2026-03-08",
        monto: 550000,
        estado: "PAGADO",
      },
      {
        periodo: "FEB 2026",
        fechaPago: "2026-02-07",
        monto: 550000,
        estado: "PAGADO",
      },
      {
        periodo: "ENE 2026",
        fechaPago: "2026-01-10",
        monto: 520000,
        estado: "PAGADO",
      },
      {
        periodo: "DIC 2025",
        fechaPago: "2025-12-09",
        monto: 520000,
        estado: "PAGADO",
      },
    ],
  },
  "4102-G": {
    edificio: "TORRE CENTRAL",
    piso: "3B",
    estado: "ADEUDADO",
    fechaVencimiento: "2026-04-11",
    nombreInquilino: "Pedro",
    apellidoInquilino: "Perez",
    telefonoInquilino: "+54 9 351 667-4420",
    superficie: "85",
    ambientes: 4,
    direccion: "Calle Falsa 122",
    montoAdeudado: 750000,
    montoMensualExpensa: 500000,
    montoMensualGasto: 250000,
    gananciaMensualAlquiler: 1222,
    gastos: [],
    historialDePagos: [
      { periodo: "ABR 2026", fechaPago: "", monto: 751222, estado: "ADEUDADO" },
      {
        periodo: "MAR 2026",
        fechaPago: "2026-03-20",
        monto: 400000,
        estado: "PARCIAL",
      },
      {
        periodo: "FEB 2026",
        fechaPago: "2026-02-12",
        monto: 751222,
        estado: "PAGADO",
      },
      {
        periodo: "ENE 2026",
        fechaPago: "2026-01-11",
        monto: 720000,
        estado: "PAGADO",
      },
    ],
  },
  "9910-K": {
    edificio: "TORRE SOLARIS II",
    piso: "7A",
    estado: "LIBRE",
    fechaVencimiento: "",
    nombreInquilino: "",
    apellidoInquilino: "",
    superficie: "60",
    ambientes: 2,
    direccion: "Av. Corrientes 1800",
    montoAdeudado: 0,
    montoMensualExpensa: 210000,
    montoMensualGasto: 60000,
    gananciaMensualAlquiler: 0,
    gastos: [],
    historialDePagos: [],
  },
  "3345-L": {
    edificio: "EDIFICIO NORTE",
    piso: "2C",
    estado: "AL_DIA",
    fechaVencimiento: "2026-04-18",
    nombreInquilino: "Lucía",
    apellidoInquilino: "Ramírez",
    telefonoInquilino: "+54 11 5812-0034",
    superficie: "95",
    ambientes: 5,
    direccion: "Tucumán 850",
    montoAdeudado: 0,
    montoMensualExpensa: 410000,
    montoMensualGasto: 120000,
    gananciaMensualAlquiler: 112400,
    gastos: [],
    historialDePagos: [
      {
        periodo: "MAR 2026",
        fechaPago: "2026-03-14",
        monto: 642400,
        estado: "PAGADO",
      },
      {
        periodo: "FEB 2026",
        fechaPago: "2026-02-14",
        monto: 642400,
        estado: "PAGADO",
      },
      {
        periodo: "ENE 2026",
        fechaPago: "2026-01-16",
        monto: 600000,
        estado: "PARCIAL",
      },
      {
        periodo: "DIC 2025",
        fechaPago: "2025-12-14",
        monto: 600000,
        estado: "PAGADO",
      },
      {
        periodo: "NOV 2025",
        fechaPago: "2025-11-13",
        monto: 580000,
        estado: "PAGADO",
      },
    ],
  },
};

export async function getDetallePropiedad(
  idPropiedad: string,
): Promise<ApiResponse<PropiedadDetalle>> {
  console.log("Obteniendo detalle de propiedad para ID:", idPropiedad);
  const mock = MOCK_DETALLE[idPropiedad];
  if (mock) {
    return { data: mock, errors: [] };
  }

  const { data } = await apiClient.get<ApiResponse<PropiedadDetalle>>(
    `/propiedades/${idPropiedad}/detalle`,
  );
  return data;
}
