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
  return [];
  const { data } = await apiClient.get<PropiedadListItem[]>("/properties");
  return data;
}

export const USE_MOCK_BILLABLE_DATA = true;

const _period = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
})();

const MOCK_BILLABLE_ITEMS_RAW: Omit<ApiBillableItem, never>[] = [
  {
    id: "1",
    unit: "2A",
    building: "Torre Solaris I",
    address: "Av. Corrientes 1234, CABA",
    tenantName: "Pedro Pérez",
    tenantEmail: "pedro.perez@email.com",
    tenantPhone: "+54 11 4523-8891",
    previousStatus: "PENDIENTE",
    rentAmount: 180000,
    expenses: 25000,
    additionalCharges: 0,
    totalAmount: 205000,
    dueDate: `${_period}-10`,
    period: _period,
  },
  {
    id: "2",
    unit: "PH",
    building: "Torre Solaris I",
    address: "Av. Corrientes 1234, CABA",
    tenantName: "Laura Gómez",
    tenantEmail: "lgomez@correo.com",
    tenantPhone: "+54 11 5678-1234",
    previousStatus: "DEUDA",
    debtAmount: 95000,
    rentAmount: 210000,
    expenses: 30000,
    additionalCharges: 0,
    totalAmount: 335000,
    dueDate: `${_period}-10`,
    period: _period,
  },
  {
    id: "3",
    unit: "3B",
    building: "Edificio Palermo Sky",
    address: "Honduras 4567, Palermo, CABA",
    tenantName: "Martín Rodríguez",
    tenantEmail: "m.rodriguez@gmail.com",
    tenantPhone: "+54 11 2345-6789",
    previousStatus: "PENDIENTE",
    rentAmount: 155000,
    expenses: 18000,
    additionalCharges: 12000,
    totalAmount: 185000,
    dueDate: `${_period}-15`,
    period: _period,
  },
  {
    id: "4",
    unit: "1C",
    building: "Edificio Palermo Sky",
    address: "Honduras 4567, Palermo, CABA",
    tenantName: "Sofía Martínez",
    tenantEmail: "sofia.m@outlook.com",
    tenantPhone: "+54 11 9876-5432",
    previousStatus: "DEUDA",
    debtAmount: 60000,
    rentAmount: 140000,
    expenses: 20000,
    additionalCharges: 0,
    totalAmount: 220000,
    dueDate: `${_period}-15`,
    period: _period,
  },
  {
    id: "5",
    unit: "5D",
    building: "Residencial Belgrano Norte",
    address: "Cabildo 2890, Belgrano, CABA",
    tenantName: "Carlos Sánchez",
    tenantEmail: "c.sanchez@empresa.com",
    tenantPhone: "+54 11 3344-5566",
    previousStatus: "AL_DIA",
    rentAmount: 200000,
    expenses: 28000,
    additionalCharges: 5000,
    totalAmount: 233000,
    dueDate: `${_period}-05`,
    period: _period,
  },
  {
    id: "6",
    unit: "2F",
    building: "Residencial Belgrano Norte",
    address: "Cabildo 2890, Belgrano, CABA",
    tenantName: "Ana Torres",
    tenantEmail: "a.torres@hotmail.com",
    tenantPhone: "+54 11 7788-9900",
    previousStatus: "PENDIENTE",
    rentAmount: 175000,
    expenses: 22000,
    additionalCharges: 0,
    totalAmount: 197000,
    dueDate: `${_period}-05`,
    period: _period,
  },
  {
    id: "7",
    unit: "Local 3",
    building: "Centro Comercial San Martín",
    address: "San Martín 720, Microcentro, CABA",
    tenantName: "Diego López",
    tenantEmail: "dlopez@comercio.com.ar",
    tenantPhone: "+54 11 4100-2233",
    previousStatus: "DEUDA",
    debtAmount: 150000,
    rentAmount: 320000,
    expenses: 45000,
    additionalCharges: 20000,
    totalAmount: 535000,
    dueDate: `${_period}-01`,
    period: _period,
  },
  {
    id: "8",
    unit: "Oficina 12",
    building: "Centro Comercial San Martín",
    address: "San Martín 720, Microcentro, CABA",
    tenantName: "Valeria Ruiz",
    tenantEmail: "vruiz@estudio.com.ar",
    tenantPhone: "+54 11 4100-3344",
    previousStatus: "AL_DIA",
    rentAmount: 260000,
    expenses: 35000,
    additionalCharges: 8000,
    totalAmount: 303000,
    dueDate: `${_period}-01`,
    period: _period,
  },
];

export interface ApiBillableItem {
  id: string;
  unit: string;
  building: string;
  address: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  previousStatus: "AL_DIA" | "DEUDA" | "PENDIENTE";
  debtAmount?: number;
  rentAmount: number;
  expenses: number;
  additionalCharges: number;
  totalAmount: number;
  dueDate: string;
  period: string;
}

export async function getBillableProperties(): Promise<
  ApiResponse<ApiBillableItem[]>
> {
  if (USE_MOCK_BILLABLE_DATA) {
    return { data: MOCK_BILLABLE_ITEMS_RAW as ApiBillableItem[], errors: [] };
  }
  const { data } = await apiClient.get<ApiResponse<ApiBillableItem[]>>(
    "/properties/billable",
  );
  return data;
}

export interface GenerateBillingsRequest {
  propertyIds: string[];
  dueDate: string;
}

export interface GenerateBillingsResponse {
  batchId: string;
  count: number;
}

export async function generateBillings(
  body: GenerateBillingsRequest,
): Promise<ApiResponse<GenerateBillingsResponse>> {
  if (USE_MOCK_BILLABLE_DATA) {
    return {
      data: { batchId: "mock-batch-001", count: body.propertyIds.length },
      errors: [],
    };
  }
  const { data } = await apiClient.post<ApiResponse<GenerateBillingsResponse>>(
    "/billings",
    body,
  );
  return data;
}
