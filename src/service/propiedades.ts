import {
  ApiResponse,
  BackendResponse,
  apiClient,
  wrapResponse,
} from "./client";
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

export type EstadoOcupacion = "AVAILABLE" | "OCCUPIED";
export type EstadoPago = "PAID" | "PENDING" | "OVERDUE";

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

interface PropertyDetailsApiData {
  id: number;
  building: { id: number; name: string; address: string };
  floor: string;
  area: number;
  rooms: number;
  unitType: string;
  occupancyStatus: string;
  tenant: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
  activeContract: {
    id: number;
    propertyId: number;
    amount: number;
    dueDate: string;
    status: string;
  } | null;
}

interface PaymentDetailsApiData {
  rentalContract: { amount: number; dueDate: string; status: string } | null;
  expenses: Array<{ amount: number }>;
  totalDue: number;
  paymentStatus: string;
  earliestDueDate: string | null;
}

export async function getDetallePropiedad(
  idPropiedad: string,
): Promise<ApiResponse<PropiedadDetalle>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    const item = MOCK_PROPIEDADES.find((p) => String(p.id) === idPropiedad);
    if (item) return { data: item, errors: [] };
    return Promise.reject(new Error("Propiedad no encontrada"));
  }

  const [detailsRes, paymentRes] = await Promise.all([
    apiClient.get<BackendResponse<PropertyDetailsApiData>>(
      `/properties/${idPropiedad}/details`,
    ),
    apiClient.get<BackendResponse<PaymentDetailsApiData>>(
      `/properties/${idPropiedad}/payment-details`,
    ),
  ]);

  const d = detailsRes.data.data;
  const p = paymentRes.data.data;

  return {
    data: {
      id: d.id,
      edificio: d.building.name,
      direccion: d.building.address,
      piso: d.floor,
      superficie: d.area,
      ambientes: d.rooms,
      tipoUnidad: d.unitType,
      estadoOcupacion: d.occupancyStatus as EstadoOcupacion,
      estadoPago: p.paymentStatus as EstadoPago,
      fechaVencimiento: p.earliestDueDate,
      montoTotal: p.totalDue,
      montoAlquiler: p.rentalContract?.amount ?? 0,
      expensas: p.totalDue - (p.rentalContract?.amount ?? 0),
      nombreInquilino: d.tenant
        ? `${d.tenant.firstName} ${d.tenant.lastName}`
        : "",
    },
    errors: [],
  };
}

export type PropiedadListItem = PropiedadDetalle;

export async function getPropiedades(): Promise<PropiedadListItem[]> {
  if (true) {
    await mockDelay();
    return MOCK_PROPIEDADES;
  }
  const { data } = await apiClient.get<PropiedadListItem[]>("/properties");
  return data;
}

export interface PropertySummaryInquilino {
  id: number;
  nombre: string;
  apellido: string;
}

export interface PropertySummaryItem {
  id: number;
  edificio: string;
  piso: string;
  tipoUnidad: string;
  estadoOcupacion: string;
  estadoPago: string;
  inquilino: PropertySummaryInquilino | null;
  fechaVencimiento: string | null;
  montoTotal: number;
}

interface PropertySummaryApiResponse {
  status: number;
  message: string;
  data: PropertySummaryItem[];
  errors: Record<string, unknown>;
  timestamp: string;
}

export async function getPropertiesSummary(): Promise<PropiedadListItem[]> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return MOCK_PROPIEDADES;
  }
  const { data } = await apiClient.get<PropertySummaryApiResponse>(
    "/properties/summary",
  );
  return data.data.map((item) => ({
    id: item.id,
    edificio: item.edificio,
    piso: item.piso,
    tipoUnidad: item.tipoUnidad,
    estadoOcupacion: item.estadoOcupacion as EstadoOcupacion,
    estadoPago: item.estadoPago as EstadoPago,
    nombreInquilino: item.inquilino
      ? `${item.inquilino.nombre} ${item.inquilino.apellido}`
      : "",
    fechaVencimiento: item.fechaVencimiento,
    montoTotal: item.montoTotal,
    // Fields not returned by the summary endpoint
    direccion: "",
    superficie: 0,
    ambientes: 0,
    montoAlquiler: 0,
    expensas: 0,
  }));
}

export const USE_MOCK_BILLABLE_DATA = false;

const mockDelay = () => new Promise((r) => setTimeout(r, 3000));

const _period = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
})();

const MOCK_PROPIEDADES: PropiedadDetalle[] = [
  {
    id: 1,
    nombreInquilino: "Pedro Pérez",
    edificio: "Torre Solaris I",
    piso: "2A",
    estadoOcupacion: "OCCUPIED",
    estadoPago: "PENDING",
    fechaVencimiento: `${_period}-10`,
    montoTotal: 205000,
    direccion: "Av. Corrientes 1234, CABA",
    superficie: 55,
    ambientes: 2,
    tipoUnidad: "Departamento",
    montoAlquiler: 180000,
    expensas: 25000,
  },
  {
    id: 2,
    nombreInquilino: "Laura Gómez",
    edificio: "Torre Solaris I",
    piso: "PH",
    estadoOcupacion: "OCCUPIED",
    estadoPago: "OVERDUE",
    fechaVencimiento: `${_period}-10`,
    montoTotal: 335000,
    direccion: "Av. Corrientes 1234, CABA",
    superficie: 120,
    ambientes: 4,
    tipoUnidad: "PH",
    montoAlquiler: 210000,
    expensas: 30000,
  },
  {
    id: 3,
    nombreInquilino: "Martín Rodríguez",
    edificio: "Edificio Palermo Sky",
    piso: "3B",
    estadoOcupacion: "OCCUPIED",
    estadoPago: "PENDING",
    fechaVencimiento: `${_period}-15`,
    montoTotal: 185000,
    direccion: "Honduras 4567, Palermo, CABA",
    superficie: 48,
    ambientes: 2,
    tipoUnidad: "Departamento",
    montoAlquiler: 155000,
    expensas: 18000,
  },
  {
    id: 4,
    nombreInquilino: "Sofía Martínez",
    edificio: "Edificio Palermo Sky",
    piso: "1C",
    estadoOcupacion: "OCCUPIED",
    estadoPago: "OVERDUE",
    fechaVencimiento: `${_period}-15`,
    montoTotal: 220000,
    direccion: "Honduras 4567, Palermo, CABA",
    superficie: 42,
    ambientes: 1,
    tipoUnidad: "Departamento",
    montoAlquiler: 140000,
    expensas: 20000,
  },
  {
    id: 5,
    nombreInquilino: "Carlos Sánchez",
    edificio: "Residencial Belgrano Norte",
    piso: "5D",
    estadoOcupacion: "OCCUPIED",
    estadoPago: "PAID",
    fechaVencimiento: `${_period}-05`,
    montoTotal: 233000,
    direccion: "Cabildo 2890, Belgrano, CABA",
    superficie: 68,
    ambientes: 3,
    tipoUnidad: "Departamento",
    montoAlquiler: 200000,
    expensas: 28000,
  },
  {
    id: 6,
    nombreInquilino: "Ana Torres",
    edificio: "Residencial Belgrano Norte",
    piso: "2F",
    estadoOcupacion: "OCCUPIED",
    estadoPago: "PENDING",
    fechaVencimiento: `${_period}-05`,
    montoTotal: 197000,
    direccion: "Cabildo 2890, Belgrano, CABA",
    superficie: 52,
    ambientes: 2,
    tipoUnidad: "Departamento",
    montoAlquiler: 175000,
    expensas: 22000,
  },
  {
    id: 7,
    nombreInquilino: "Diego López",
    edificio: "Centro Comercial San Martín",
    piso: "Local 3",
    estadoOcupacion: "OCCUPIED",
    estadoPago: "OVERDUE",
    fechaVencimiento: `${_period}-01`,
    montoTotal: 535000,
    direccion: "San Martín 720, Microcentro, CABA",
    superficie: 90,
    ambientes: 1,
    tipoUnidad: "Local Comercial",
    montoAlquiler: 320000,
    expensas: 45000,
  },
  {
    id: 8,
    nombreInquilino: "Valeria Ruiz",
    edificio: "Centro Comercial San Martín",
    piso: "Oficina 12",
    estadoOcupacion: "OCCUPIED",
    estadoPago: "PAID",
    fechaVencimiento: `${_period}-01`,
    montoTotal: 303000,
    direccion: "San Martín 720, Microcentro, CABA",
    superficie: 75,
    ambientes: 2,
    tipoUnidad: "Oficina",
    montoAlquiler: 260000,
    expensas: 35000,
  },
  {
    id: 9,
    nombreInquilino: "",
    edificio: "Torre Solaris I",
    piso: "4C",
    estadoOcupacion: "AVAILABLE",
    estadoPago: "PAID",
    fechaVencimiento: null,
    montoTotal: 0,
    direccion: "Av. Corrientes 1234, CABA",
    superficie: 60,
    ambientes: 3,
    tipoUnidad: "Departamento",
    montoAlquiler: 0,
    expensas: 0,
  },
  {
    id: 10,
    nombreInquilino: "",
    edificio: "Edificio Palermo Sky",
    piso: "6A",
    estadoOcupacion: "AVAILABLE",
    estadoPago: "PAID",
    fechaVencimiento: null,
    montoTotal: 0,
    direccion: "Honduras 4567, Palermo, CABA",
    superficie: 80,
    ambientes: 3,
    tipoUnidad: "Departamento",
    montoAlquiler: 0,
    expensas: 0,
  },
  {
    id: 11,
    nombreInquilino: "Roberto Ibáñez",
    edificio: "Residencial Belgrano Norte",
    piso: "7B",
    estadoOcupacion: "OCCUPIED",
    estadoPago: "PAID",
    fechaVencimiento: `${_period}-05`,
    montoTotal: 245000,
    direccion: "Cabildo 2890, Belgrano, CABA",
    superficie: 70,
    ambientes: 3,
    tipoUnidad: "Departamento",
    montoAlquiler: 210000,
    expensas: 32000,
  },
  {
    id: 12,
    nombreInquilino: "Claudia Ferreyra",
    edificio: "Centro Comercial San Martín",
    piso: "Oficina 7",
    estadoOcupacion: "OCCUPIED",
    estadoPago: "PENDING",
    fechaVencimiento: `${_period}-01`,
    montoTotal: 280000,
    direccion: "San Martín 720, Microcentro, CABA",
    superficie: 65,
    ambientes: 2,
    tipoUnidad: "Oficina",
    montoAlquiler: 240000,
    expensas: 38000,
  },
];

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
    await mockDelay();
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
    await mockDelay();
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

export type EstadoFactura = "PAGADO" | "PENDIENTE" | "VENCIDO";
export type MedioPago =
  | "TRANSFERENCIA"
  | "EFECTIVO"
  | "CHEQUE"
  | "DEBITO"
  | "CREDITO";

export interface Factura {
  id: string;
  periodo: string;
  estado: EstadoFactura;
  monto: number;
  fechaVencimiento: string;
  fechaPago?: string;
}

export interface PagoHistorial {
  id: string;
  fecha: string;
  monto: number;
  medioPago: MedioPago;
  referencia?: string;
  observaciones?: string;
  periodos: string[];
}

export interface RegistrarPagoRequest {
  monto: number;
  medioPago: MedioPago;
  fechaPago: string;
  referencia?: string;
  observaciones?: string;
  periodosSeleccionados: string[];
}

export interface RegistrarPagoResponse {
  id: string;
}

const MOCK_FACTURAS: Record<string, Factura[]> = {
  "1": [
    {
      id: "f1-5",
      periodo: "2026-05",
      estado: "PENDIENTE",
      monto: 205000,
      fechaVencimiento: "2026-05-10",
    },
    {
      id: "f1-4",
      periodo: "2026-04",
      estado: "PAGADO",
      monto: 205000,
      fechaVencimiento: "2026-04-10",
      fechaPago: "2026-04-03",
    },
    {
      id: "f1-3",
      periodo: "2026-03",
      estado: "PAGADO",
      monto: 195000,
      fechaVencimiento: "2026-03-10",
      fechaPago: "2026-03-05",
    },
  ],
  "2": [
    {
      id: "f2-5",
      periodo: "2026-05",
      estado: "PENDIENTE",
      monto: 335000,
      fechaVencimiento: "2026-05-10",
    },
    {
      id: "f2-4",
      periodo: "2026-04",
      estado: "VENCIDO",
      monto: 335000,
      fechaVencimiento: "2026-04-10",
    },
    {
      id: "f2-3",
      periodo: "2026-03",
      estado: "VENCIDO",
      monto: 335000,
      fechaVencimiento: "2026-03-10",
    },
    {
      id: "f2-2",
      periodo: "2026-02",
      estado: "PAGADO",
      monto: 320000,
      fechaVencimiento: "2026-02-10",
      fechaPago: "2026-02-05",
    },
  ],
  "3": [
    {
      id: "f3-5",
      periodo: "2026-05",
      estado: "PENDIENTE",
      monto: 185000,
      fechaVencimiento: "2026-05-10",
    },
    {
      id: "f3-4",
      periodo: "2026-04",
      estado: "PAGADO",
      monto: 185000,
      fechaVencimiento: "2026-04-10",
      fechaPago: "2026-04-10",
    },
  ],
  "4": [
    {
      id: "f4-5",
      periodo: "2026-05",
      estado: "PENDIENTE",
      monto: 220000,
      fechaVencimiento: "2026-05-10",
    },
    {
      id: "f4-4",
      periodo: "2026-04",
      estado: "VENCIDO",
      monto: 220000,
      fechaVencimiento: "2026-04-10",
    },
    {
      id: "f4-3",
      periodo: "2026-03",
      estado: "PAGADO",
      monto: 210000,
      fechaVencimiento: "2026-03-10",
      fechaPago: "2026-03-08",
    },
  ],
  "5": [
    {
      id: "f5-5",
      periodo: "2026-05",
      estado: "PAGADO",
      monto: 233000,
      fechaVencimiento: "2026-05-10",
      fechaPago: "2026-05-01",
    },
    {
      id: "f5-4",
      periodo: "2026-04",
      estado: "PAGADO",
      monto: 233000,
      fechaVencimiento: "2026-04-10",
      fechaPago: "2026-04-02",
    },
  ],
  "6": [
    {
      id: "f6-5",
      periodo: "2026-05",
      estado: "PENDIENTE",
      monto: 197000,
      fechaVencimiento: "2026-05-10",
    },
    {
      id: "f6-4",
      periodo: "2026-04",
      estado: "PAGADO",
      monto: 197000,
      fechaVencimiento: "2026-04-10",
      fechaPago: "2026-04-05",
    },
  ],
  "7": [
    {
      id: "f7-05",
      periodo: "2026-05",
      estado: "PENDIENTE",
      monto: 535000,
      fechaVencimiento: "2026-05-10",
    },
    {
      id: "f7-04",
      periodo: "2026-04",
      estado: "VENCIDO",
      monto: 535000,
      fechaVencimiento: "2026-04-10",
    },
    {
      id: "f7-03",
      periodo: "2026-03",
      estado: "VENCIDO",
      monto: 535000,
      fechaVencimiento: "2026-03-10",
    },
    {
      id: "f7-02",
      periodo: "2026-02",
      estado: "VENCIDO",
      monto: 500000,
      fechaVencimiento: "2026-02-10",
    },
    {
      id: "f7-01",
      periodo: "2026-01",
      estado: "VENCIDO",
      monto: 500000,
      fechaVencimiento: "2026-01-10",
    },
    {
      id: "f7-2512",
      periodo: "2025-12",
      estado: "VENCIDO",
      monto: 480000,
      fechaVencimiento: "2025-12-10",
    },
    {
      id: "f7-2511",
      periodo: "2025-11",
      estado: "VENCIDO",
      monto: 480000,
      fechaVencimiento: "2025-11-10",
    },
    {
      id: "f7-2510",
      periodo: "2025-10",
      estado: "VENCIDO",
      monto: 460000,
      fechaVencimiento: "2025-10-10",
    },
    {
      id: "f7-2509",
      periodo: "2025-09",
      estado: "VENCIDO",
      monto: 460000,
      fechaVencimiento: "2025-09-10",
    },
    {
      id: "f7-2508",
      periodo: "2025-08",
      estado: "VENCIDO",
      monto: 440000,
      fechaVencimiento: "2025-08-10",
    },
    {
      id: "f7-2507",
      periodo: "2025-07",
      estado: "VENCIDO",
      monto: 440000,
      fechaVencimiento: "2025-07-10",
    },
    {
      id: "f7-2506",
      periodo: "2025-06",
      estado: "VENCIDO",
      monto: 420000,
      fechaVencimiento: "2025-06-10",
    },
    {
      id: "f7-2505",
      periodo: "2025-05",
      estado: "VENCIDO",
      monto: 420000,
      fechaVencimiento: "2025-05-10",
    },
    {
      id: "f7-2504",
      periodo: "2025-04",
      estado: "VENCIDO",
      monto: 400000,
      fechaVencimiento: "2025-04-10",
    },
    {
      id: "f7-2503",
      periodo: "2025-03",
      estado: "VENCIDO",
      monto: 400000,
      fechaVencimiento: "2025-03-10",
    },
    {
      id: "f7-2502",
      periodo: "2025-02",
      estado: "VENCIDO",
      monto: 380000,
      fechaVencimiento: "2025-02-10",
    },
    {
      id: "f7-2501",
      periodo: "2025-01",
      estado: "VENCIDO",
      monto: 380000,
      fechaVencimiento: "2025-01-10",
    },
    {
      id: "f7-2412",
      periodo: "2024-12",
      estado: "VENCIDO",
      monto: 360000,
      fechaVencimiento: "2024-12-10",
    },
    {
      id: "f7-2411",
      periodo: "2024-11",
      estado: "VENCIDO",
      monto: 360000,
      fechaVencimiento: "2024-11-10",
    },
    {
      id: "f7-2410",
      periodo: "2024-10",
      estado: "PAGADO",
      monto: 340000,
      fechaVencimiento: "2024-10-10",
      fechaPago: "2024-10-08",
    },
  ],
  "8": [
    {
      id: "f8-5",
      periodo: "2026-05",
      estado: "PAGADO",
      monto: 303000,
      fechaVencimiento: "2026-05-10",
      fechaPago: "2026-05-01",
    },
    {
      id: "f8-4",
      periodo: "2026-04",
      estado: "PAGADO",
      monto: 303000,
      fechaVencimiento: "2026-04-10",
      fechaPago: "2026-04-02",
    },
  ],
  "11": [
    {
      id: "f11-5",
      periodo: "2026-05",
      estado: "PAGADO",
      monto: 245000,
      fechaVencimiento: "2026-05-10",
      fechaPago: "2026-05-01",
    },
    {
      id: "f11-4",
      periodo: "2026-04",
      estado: "PAGADO",
      monto: 245000,
      fechaVencimiento: "2026-04-10",
      fechaPago: "2026-04-03",
    },
  ],
  "12": [
    {
      id: "f12-5",
      periodo: "2026-05",
      estado: "PENDIENTE",
      monto: 280000,
      fechaVencimiento: "2026-05-10",
    },
    {
      id: "f12-4",
      periodo: "2026-04",
      estado: "PAGADO",
      monto: 280000,
      fechaVencimiento: "2026-04-10",
      fechaPago: "2026-04-05",
    },
  ],
};

const MOCK_PAGOS: Record<string, PagoHistorial[]> = {
  "1": [
    {
      id: "p1-1",
      fecha: "2026-04-03",
      monto: 205000,
      medioPago: "TRANSFERENCIA",
      referencia: "TX100001",
      periodos: ["2026-04"],
    },
    {
      id: "p1-2",
      fecha: "2026-03-05",
      monto: 195000,
      medioPago: "TRANSFERENCIA",
      referencia: "TX100002",
      periodos: ["2026-03"],
    },
  ],
  "2": [
    {
      id: "p2-1",
      fecha: "2026-02-05",
      monto: 320000,
      medioPago: "EFECTIVO",
      periodos: ["2026-02"],
    },
  ],
  "3": [
    {
      id: "p3-1",
      fecha: "2026-04-10",
      monto: 185000,
      medioPago: "TRANSFERENCIA",
      referencia: "TX300001",
      periodos: ["2026-04"],
    },
  ],
  "4": [
    {
      id: "p4-1",
      fecha: "2026-03-08",
      monto: 210000,
      medioPago: "CHEQUE",
      referencia: "CH-4402",
      periodos: ["2026-03"],
    },
  ],
  "5": [
    {
      id: "p5-1",
      fecha: "2026-05-01",
      monto: 233000,
      medioPago: "TRANSFERENCIA",
      referencia: "TX500001",
      periodos: ["2026-05"],
    },
    {
      id: "p5-2",
      fecha: "2026-04-02",
      monto: 233000,
      medioPago: "TRANSFERENCIA",
      referencia: "TX500002",
      periodos: ["2026-04"],
    },
  ],
  "6": [
    {
      id: "p6-1",
      fecha: "2026-04-05",
      monto: 197000,
      medioPago: "DEBITO",
      periodos: ["2026-04"],
    },
  ],
  "7": [
    {
      id: "p7-1",
      fecha: "2026-01-10",
      monto: 480000,
      medioPago: "TRANSFERENCIA",
      referencia: "TX700001",
      periodos: ["2026-01"],
    },
  ],
  "8": [
    {
      id: "p8-1",
      fecha: "2026-05-01",
      monto: 303000,
      medioPago: "TRANSFERENCIA",
      referencia: "TX800001",
      periodos: ["2026-05"],
    },
    {
      id: "p8-2",
      fecha: "2026-04-02",
      monto: 303000,
      medioPago: "TRANSFERENCIA",
      referencia: "TX800002",
      periodos: ["2026-04"],
    },
  ],
  "11": [
    {
      id: "p11-1",
      fecha: "2026-05-01",
      monto: 245000,
      medioPago: "TRANSFERENCIA",
      referencia: "TX1100001",
      periodos: ["2026-05"],
    },
    {
      id: "p11-2",
      fecha: "2026-04-03",
      monto: 245000,
      medioPago: "TRANSFERENCIA",
      referencia: "TX1100002",
      periodos: ["2026-04"],
    },
  ],
  "12": [
    {
      id: "p12-1",
      fecha: "2026-04-05",
      monto: 280000,
      medioPago: "EFECTIVO",
      periodos: ["2026-04"],
    },
  ],
};

export async function getFacturasPropiedad(
  idPropiedad: string,
): Promise<ApiResponse<Factura[]>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return { data: MOCK_FACTURAS[idPropiedad] ?? [], errors: [] };
  }
  const { data } = await apiClient.get<ApiResponse<Factura[]>>(
    `/properties/${idPropiedad}/facturas`,
  );
  return data;
}

export async function getPagosPropiedad(
  idPropiedad: string,
): Promise<ApiResponse<PagoHistorial[]>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return { data: MOCK_PAGOS[idPropiedad] ?? [], errors: [] };
  }
  const { data } = await apiClient.get<ApiResponse<PagoHistorial[]>>(
    `/properties/${idPropiedad}/pagos`,
  );
  return data;
}

export async function registrarPago(
  idPropiedad: string,
  body: RegistrarPagoRequest,
): Promise<ApiResponse<RegistrarPagoResponse>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return { data: { id: `pago-${Date.now()}` }, errors: [] };
  }
  const { data } = await apiClient.post<ApiResponse<RegistrarPagoResponse>>(
    `/properties/${idPropiedad}/pagos`,
    body,
  );
  return data;
}

export interface Building {
  id: number;
  name: string;
  address: string;
}

export interface CreateBuildingRequest {
  name: string;
  address: string;
}

export type ExpenseType =
  | "MAINTENANCE"
  | "REPAIR"
  | "UTILITIES"
  | "TAXES"
  | "ADMINISTRATION";

export interface CreateExpenseRequest {
  type: ExpenseType;
  amount: number;
  description?: string;
  dueDate: string;
}

const MOCK_BUILDINGS: Building[] = [
  { id: 1, name: "Torre Solaris I", address: "Av. Corrientes 1234, CABA" },
  {
    id: 2,
    name: "Edificio Palermo Sky",
    address: "Honduras 4567, Palermo, CABA",
  },
  {
    id: 3,
    name: "Residencial Belgrano Norte",
    address: "Cabildo 2890, Belgrano, CABA",
  },
  {
    id: 4,
    name: "Centro Comercial San Martín",
    address: "San Martín 720, Microcentro, CABA",
  },
];
let _mockBuildingNextId = 5;

export async function getBuildings(): Promise<Building[]> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return [...MOCK_BUILDINGS];
  }
  const { data } = await apiClient.get<{ data: Building[] }>("/buildings");
  return data.data;
}

export async function createBuilding(
  body: CreateBuildingRequest,
): Promise<ApiResponse<Building>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    const newBuilding: Building = { id: _mockBuildingNextId++, ...body };
    MOCK_BUILDINGS.push(newBuilding);
    return { data: newBuilding, errors: [] };
  }
  const { data } = await apiClient.post<{ data: Building }>("/buildings", body);
  return { data: data.data, errors: [] };
}

export async function createBuildingExpense(
  buildingId: number,
  body: CreateExpenseRequest,
): Promise<ApiResponse<void>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return { data: undefined as unknown as void, errors: [] };
  }
  return wrapResponse(
    apiClient.post<void>(`/buildings/${buildingId}/expenses`, body),
  );
}

export interface Tenant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CreateTenantRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const MOCK_TENANTS: Tenant[] = [
  {
    id: 1,
    firstName: "Pedro",
    lastName: "Pérez",
    email: "pedro.perez@email.com",
    phone: "1145238891",
  },
  {
    id: 2,
    firstName: "Laura",
    lastName: "Gómez",
    email: "lgomez@correo.com",
    phone: "1156781234",
  },
  {
    id: 3,
    firstName: "Martín",
    lastName: "Rodríguez",
    email: "m.rodriguez@gmail.com",
    phone: "1123456789",
  },
  {
    id: 4,
    firstName: "Sofía",
    lastName: "Martínez",
    email: "sofia.m@outlook.com",
    phone: "1198765432",
  },
  {
    id: 5,
    firstName: "Carlos",
    lastName: "Sánchez",
    email: "c.sanchez@empresa.com",
    phone: "1133445566",
  },
  {
    id: 6,
    firstName: "Ana",
    lastName: "Torres",
    email: "a.torres@hotmail.com",
    phone: "1177889900",
  },
  {
    id: 7,
    firstName: "Diego",
    lastName: "López",
    email: "dlopez@comercio.com.ar",
    phone: "1141002233",
  },
  {
    id: 8,
    firstName: "Valeria",
    lastName: "Ruiz",
    email: "vruiz@estudio.com.ar",
    phone: "1141003344",
  },
];
let _mockTenantNextId = 9;

export async function getTenants(): Promise<Tenant[]> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return [...MOCK_TENANTS];
  }
  const { data } = await apiClient.get<{ data: Tenant[] }>("/tenants");
  return data.data;
}

export async function createTenant(
  body: CreateTenantRequest,
): Promise<ApiResponse<Tenant>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    const newTenant: Tenant = { id: _mockTenantNextId++, ...body };
    MOCK_TENANTS.push(newTenant);
    return { data: newTenant, errors: [] };
  }
  const { data } = await apiClient.post<BackendResponse<Tenant>>(
    "/tenants",
    body,
  );
  return { data: data.data, errors: [] };
}

export interface CreatePropertyV2Request {
  buildingId: number;
  floor: string;
  area: number;
  rooms: number;
  unitType: string;
}

export interface CreatedPropertyV2 {
  id: number;
}

let _mockPropertyNextId = 100;

export async function createPropertyV2(
  body: CreatePropertyV2Request,
): Promise<ApiResponse<CreatedPropertyV2>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return { data: { id: _mockPropertyNextId++ }, errors: [] };
  }
  const { data } = await apiClient.post<{ data: CreatedPropertyV2 }>(
    "/properties",
    body,
  );
  return { data: data.data, errors: [] };
}

export async function assignTenantToProperty(
  propertyId: number,
  tenantId: number,
): Promise<ApiResponse<void>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return { data: undefined as unknown as void, errors: [] };
  }
  return wrapResponse(
    apiClient.patch<void>(`/properties/${propertyId}/tenant/${tenantId}`),
  );
}

export interface CreateRentalContractRequest {
  amount: number;
  dueDate: string;
}

export async function createRentalContract(
  propertyId: number,
  body: CreateRentalContractRequest,
): Promise<ApiResponse<void>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return { data: undefined as unknown as void, errors: [] };
  }
  return wrapResponse(
    apiClient.post<void>(`/properties/${propertyId}/rental-contract`, body),
  );
}
