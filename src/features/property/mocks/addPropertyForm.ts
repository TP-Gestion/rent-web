import type { FormValues } from "../types/createPropertySchema";

export const TIPO_OPTIONS = [
  { value: "departamento", label: "Departamento" },
  { value: "casa", label: "Casa" },
  { value: "oficina", label: "Oficina" },
  { value: "local", label: "Local comercial" },
];

export const INITIAL_VALUES: FormValues = {
  direccion: "",
  edificio: "",
  piso: "",
  superficie: "",
  ambientes: "",
  montoAlquiler: "",
  expensas: "",
  tipoUnidad: "",
  enAlquiler: false,
  nombreInquilino: "",
  apellidoInquilino: "",
  correoInquilino: "",
  telefonoInquilino: "",
};
