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
    tenant: {
      firstName: "Pedro",
      lastName: "Pérez",
      email: "pedro.perez@email.com",
      phone: "+54 11 4523-8891",
    },
    previousStatus: "PENDING",
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
    tenant: {
      firstName: "Laura",
      lastName: "Gómez",
      email: "lgomez@correo.com",
      phone: "+54 11 5678-1234",
    },
    previousStatus: "OVERDUE",
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
    tenant: {
      firstName: "Martín",
      lastName: "Rodríguez",
      email: "m.rodriguez@gmail.com",
      phone: "+54 11 2345-6789",
    },
    previousStatus: "PENDING",
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
    tenant: {
      firstName: "Sofía",
      lastName: "Martínez",
      email: "sofia.m@outlook.com",
      phone: "+54 11 9876-5432",
    },
    previousStatus: "OVERDUE",
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
    tenant: {
      firstName: "Carlos",
      lastName: "Sánchez",
      email: "c.sanchez@empresa.com",
      phone: "+54 11 3344-5566",
    },
    previousStatus: "PAID",
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
    tenant: {
      firstName: "Ana",
      lastName: "Torres",
      email: "a.torres@hotmail.com",
      phone: "+54 11 7788-9900",
    },
    previousStatus: "PENDING",
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
    tenant: {
      firstName: "Diego",
      lastName: "López",
      email: "dlopez@comercio.com.ar",
      phone: "+54 11 4100-2233",
    },
    previousStatus: "OVERDUE",
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
    tenant: {
      firstName: "Valeria",
      lastName: "Ruiz",
      email: "vruiz@estudio.com.ar",
      phone: "+54 11 4100-3344",
    },
    previousStatus: "PAID",
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
  tenant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  previousStatus: "PAID" | "OVERDUE" | "PENDING";
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

export type BillingStatus = "PAID" | "PENDING" | "OVERDUE";
export type PaymentMethod =
  | "BANK_TRANSFER"
  | "CASH"
  | "CHECK"
  | "DEBIT"
  | "CREDIT";

export interface Billing {
  id: string;
  period: string;
  status: BillingStatus;
  amount: number;
  dueDate: string;
  paymentDate?: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  notes?: string;
  periods: string[];
}

export interface RegisterPaymentRequest {
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  reference?: string;
  notes?: string;
  selectedPeriods: string[];
}

export interface RegisterPaymentResponse {
  id: string;
}

const MOCK_FACTURAS: Record<string, Billing[]> = {
  "1": [
    {
      id: "f1-5",
      period: "2026-05",
      status: "PENDING",
      amount: 205000,
      dueDate: "2026-05-10",
    },
    {
      id: "f1-4",
      period: "2026-04",
      status: "PAID",
      amount: 205000,
      dueDate: "2026-04-10",
      paymentDate: "2026-04-03",
    },
    {
      id: "f1-3",
      period: "2026-03",
      status: "PAID",
      amount: 195000,
      dueDate: "2026-03-10",
      paymentDate: "2026-03-05",
    },
  ],
  "2": [
    {
      id: "f2-5",
      period: "2026-05",
      status: "PENDING",
      amount: 335000,
      dueDate: "2026-05-10",
    },
    {
      id: "f2-4",
      period: "2026-04",
      status: "OVERDUE",
      amount: 335000,
      dueDate: "2026-04-10",
    },
    {
      id: "f2-3",
      period: "2026-03",
      status: "OVERDUE",
      amount: 335000,
      dueDate: "2026-03-10",
    },
    {
      id: "f2-2",
      period: "2026-02",
      status: "PAID",
      amount: 320000,
      dueDate: "2026-02-10",
      paymentDate: "2026-02-05",
    },
  ],
  "3": [
    {
      id: "f3-5",
      period: "2026-05",
      status: "PENDING",
      amount: 185000,
      dueDate: "2026-05-10",
    },
    {
      id: "f3-4",
      period: "2026-04",
      status: "PAID",
      amount: 185000,
      dueDate: "2026-04-10",
      paymentDate: "2026-04-10",
    },
  ],
  "4": [
    {
      id: "f4-5",
      period: "2026-05",
      status: "PENDING",
      amount: 220000,
      dueDate: "2026-05-10",
    },
    {
      id: "f4-4",
      period: "2026-04",
      status: "OVERDUE",
      amount: 220000,
      dueDate: "2026-04-10",
    },
    {
      id: "f4-3",
      period: "2026-03",
      status: "PAID",
      amount: 210000,
      dueDate: "2026-03-10",
      paymentDate: "2026-03-08",
    },
  ],
  "5": [
    {
      id: "f5-5",
      period: "2026-05",
      status: "PAID",
      amount: 233000,
      dueDate: "2026-05-10",
      paymentDate: "2026-05-01",
    },
    {
      id: "f5-4",
      period: "2026-04",
      status: "PAID",
      amount: 233000,
      dueDate: "2026-04-10",
      paymentDate: "2026-04-02",
    },
  ],
  "6": [
    {
      id: "f6-5",
      period: "2026-05",
      status: "PENDING",
      amount: 197000,
      dueDate: "2026-05-10",
    },
    {
      id: "f6-4",
      period: "2026-04",
      status: "PAID",
      amount: 197000,
      dueDate: "2026-04-10",
      paymentDate: "2026-04-05",
    },
  ],
  "7": [
    {
      id: "f7-05",
      period: "2026-05",
      status: "PENDING",
      amount: 535000,
      dueDate: "2026-05-10",
    },
    {
      id: "f7-04",
      period: "2026-04",
      status: "OVERDUE",
      amount: 535000,
      dueDate: "2026-04-10",
    },
    {
      id: "f7-03",
      period: "2026-03",
      status: "OVERDUE",
      amount: 535000,
      dueDate: "2026-03-10",
    },
    {
      id: "f7-02",
      period: "2026-02",
      status: "OVERDUE",
      amount: 500000,
      dueDate: "2026-02-10",
    },
    {
      id: "f7-01",
      period: "2026-01",
      status: "OVERDUE",
      amount: 500000,
      dueDate: "2026-01-10",
    },
    {
      id: "f7-2512",
      period: "2025-12",
      status: "OVERDUE",
      amount: 480000,
      dueDate: "2025-12-10",
    },
    {
      id: "f7-2511",
      period: "2025-11",
      status: "OVERDUE",
      amount: 480000,
      dueDate: "2025-11-10",
    },
    {
      id: "f7-2510",
      period: "2025-10",
      status: "OVERDUE",
      amount: 460000,
      dueDate: "2025-10-10",
    },
    {
      id: "f7-2509",
      period: "2025-09",
      status: "OVERDUE",
      amount: 460000,
      dueDate: "2025-09-10",
    },
    {
      id: "f7-2508",
      period: "2025-08",
      status: "OVERDUE",
      amount: 440000,
      dueDate: "2025-08-10",
    },
    {
      id: "f7-2507",
      period: "2025-07",
      status: "OVERDUE",
      amount: 440000,
      dueDate: "2025-07-10",
    },
    {
      id: "f7-2506",
      period: "2025-06",
      status: "OVERDUE",
      amount: 420000,
      dueDate: "2025-06-10",
    },
    {
      id: "f7-2505",
      period: "2025-05",
      status: "OVERDUE",
      amount: 420000,
      dueDate: "2025-05-10",
    },
    {
      id: "f7-2504",
      period: "2025-04",
      status: "OVERDUE",
      amount: 400000,
      dueDate: "2025-04-10",
    },
    {
      id: "f7-2503",
      period: "2025-03",
      status: "OVERDUE",
      amount: 400000,
      dueDate: "2025-03-10",
    },
    {
      id: "f7-2502",
      period: "2025-02",
      status: "OVERDUE",
      amount: 380000,
      dueDate: "2025-02-10",
    },
    {
      id: "f7-2501",
      period: "2025-01",
      status: "OVERDUE",
      amount: 380000,
      dueDate: "2025-01-10",
    },
    {
      id: "f7-2412",
      period: "2024-12",
      status: "OVERDUE",
      amount: 360000,
      dueDate: "2024-12-10",
    },
    {
      id: "f7-2411",
      period: "2024-11",
      status: "OVERDUE",
      amount: 360000,
      dueDate: "2024-11-10",
    },
    {
      id: "f7-2410",
      period: "2024-10",
      status: "PAID",
      amount: 340000,
      dueDate: "2024-10-10",
      paymentDate: "2024-10-08",
    },
  ],
  "8": [
    {
      id: "f8-5",
      period: "2026-05",
      status: "PAID",
      amount: 303000,
      dueDate: "2026-05-10",
      paymentDate: "2026-05-01",
    },
    {
      id: "f8-4",
      period: "2026-04",
      status: "PAID",
      amount: 303000,
      dueDate: "2026-04-10",
      paymentDate: "2026-04-02",
    },
  ],
  "11": [
    {
      id: "f11-5",
      period: "2026-05",
      status: "PAID",
      amount: 245000,
      dueDate: "2026-05-10",
      paymentDate: "2026-05-01",
    },
    {
      id: "f11-4",
      period: "2026-04",
      status: "PAID",
      amount: 245000,
      dueDate: "2026-04-10",
      paymentDate: "2026-04-03",
    },
  ],
  "12": [
    {
      id: "f12-5",
      period: "2026-05",
      status: "PENDING",
      amount: 280000,
      dueDate: "2026-05-10",
    },
    {
      id: "f12-4",
      period: "2026-04",
      status: "PAID",
      amount: 280000,
      dueDate: "2026-04-10",
      paymentDate: "2026-04-05",
    },
  ],
};

const MOCK_PAGOS: Record<string, PaymentRecord[]> = {
  "1": [
    {
      id: "p1-1",
      date: "2026-04-03",
      amount: 205000,
      paymentMethod: "BANK_TRANSFER",
      reference: "TX100001",
      periods: ["2026-04"],
    },
    {
      id: "p1-2",
      date: "2026-03-05",
      amount: 195000,
      paymentMethod: "BANK_TRANSFER",
      reference: "TX100002",
      periods: ["2026-03"],
    },
  ],
  "2": [
    {
      id: "p2-1",
      date: "2026-02-05",
      amount: 320000,
      paymentMethod: "CASH",
      periods: ["2026-02"],
    },
  ],
  "3": [
    {
      id: "p3-1",
      date: "2026-04-10",
      amount: 185000,
      paymentMethod: "BANK_TRANSFER",
      reference: "TX300001",
      periods: ["2026-04"],
    },
  ],
  "4": [
    {
      id: "p4-1",
      date: "2026-03-08",
      amount: 210000,
      paymentMethod: "CHECK",
      reference: "CH-4402",
      periods: ["2026-03"],
    },
  ],
  "5": [
    {
      id: "p5-1",
      date: "2026-05-01",
      amount: 233000,
      paymentMethod: "BANK_TRANSFER",
      reference: "TX500001",
      periods: ["2026-05"],
    },
    {
      id: "p5-2",
      date: "2026-04-02",
      amount: 233000,
      paymentMethod: "BANK_TRANSFER",
      reference: "TX500002",
      periods: ["2026-04"],
    },
  ],
  "6": [
    {
      id: "p6-1",
      date: "2026-04-05",
      amount: 197000,
      paymentMethod: "DEBIT",
      periods: ["2026-04"],
    },
  ],
  "7": [
    {
      id: "p7-1",
      date: "2026-01-10",
      amount: 480000,
      paymentMethod: "BANK_TRANSFER",
      reference: "TX700001",
      periods: ["2026-01"],
    },
  ],
  "8": [
    {
      id: "p8-1",
      date: "2026-05-01",
      amount: 303000,
      paymentMethod: "BANK_TRANSFER",
      reference: "TX800001",
      periods: ["2026-05"],
    },
    {
      id: "p8-2",
      date: "2026-04-02",
      amount: 303000,
      paymentMethod: "BANK_TRANSFER",
      reference: "TX800002",
      periods: ["2026-04"],
    },
  ],
  "11": [
    {
      id: "p11-1",
      date: "2026-05-01",
      amount: 245000,
      paymentMethod: "BANK_TRANSFER",
      reference: "TX1100001",
      periods: ["2026-05"],
    },
    {
      id: "p11-2",
      date: "2026-04-03",
      amount: 245000,
      paymentMethod: "BANK_TRANSFER",
      reference: "TX1100002",
      periods: ["2026-04"],
    },
  ],
  "12": [
    {
      id: "p12-1",
      date: "2026-04-05",
      amount: 280000,
      paymentMethod: "CASH",
      periods: ["2026-04"],
    },
  ],
};

export async function getPropertyBillings(
  idPropiedad: string,
): Promise<ApiResponse<Billing[]>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return { data: MOCK_FACTURAS[idPropiedad] ?? [], errors: [] };
  }
  const { data } = await apiClient.get<ApiResponse<Billing[]>>(
    `/properties/${idPropiedad}/billings`,
  );
  return data;
}

export async function getPropertyPayments(
  idPropiedad: string,
): Promise<ApiResponse<PaymentRecord[]>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return { data: MOCK_PAGOS[idPropiedad] ?? [], errors: [] };
  }
  const { data } = await apiClient.get<ApiResponse<PaymentRecord[]>>(
    `/properties/${idPropiedad}/payments`,
  );
  return data;
}

export async function registerPayment(
  idPropiedad: string,
  body: RegisterPaymentRequest,
): Promise<ApiResponse<RegisterPaymentResponse>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return { data: { id: `pago-${Date.now()}` }, errors: [] };
  }
  const { data } = await apiClient.post<ApiResponse<RegisterPaymentResponse>>(
    `/properties/${idPropiedad}/payments`,
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
