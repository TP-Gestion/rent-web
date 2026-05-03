import {
  ApiResponse,
  BackendResponse,
  apiClient,
  wrapResponse,
} from "./client";
import {
  getNextMockBuildingId,
  getNextMockPropertyId,
  getNextMockTenantId,
  MOCK_BILLABLE_ITEMS_RAW,
  MOCK_BUILDINGS,
  MOCK_FACTURAS,
  MOCK_PAGOS,
  MOCK_PROPIEDADES,
  MOCK_TENANTS,
  mockDelay,
  USE_MOCK_BILLABLE_DATA,
} from "./service_mock";
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
    return { data: MOCK_BILLABLE_ITEMS_RAW, errors: [] };
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
    const newBuilding: Building = { id: getNextMockBuildingId(), ...body };
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
    const newTenant: Tenant = { id: getNextMockTenantId(), ...body };
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

export async function createPropertyV2(
  body: CreatePropertyV2Request,
): Promise<ApiResponse<CreatedPropertyV2>> {
  if (USE_MOCK_BILLABLE_DATA) {
    await mockDelay();
    return { data: { id: getNextMockPropertyId() }, errors: [] };
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
