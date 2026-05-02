import { z } from "zod";

const crearPropiedadSchema = z
  .object({
    direccion: z.string().min(1, "La dirección es obligatoria"),
    edificio: z.string().min(1, "El edificio es obligatorio"),
    piso: z.string().min(1, "El piso es obligatorio"),
    superficie: z
      .string()
      .min(1, "La superficie es obligatoria")
      .refine(
        (v) => !isNaN(Number(v)) && Number(v) > 0,
        "Debe ser un número mayor a 0",
      ),
    ambientes: z
      .string()
      .min(1, "Los ambientes son obligatorios")
      .refine(
        (v) => Number.isInteger(Number(v)) && Number(v) > 0,
        "Debe ser un entero mayor a 0",
      ),
    montoAlquiler: z
      .string()
      .refine(
        (v) => v === "" || (!isNaN(Number(v)) && Number(v) > 0),
        "Debe ser un monto válido",
      ),
    expensas: z
      .string()
      .refine(
        (v) => v === "" || (!isNaN(Number(v)) && Number(v) > 0),
        "Debe ser un monto válido",
      ),
    tipoUnidad: z.string().min(1, "Seleccione un tipo de unidad"),
    enAlquiler: z.boolean(),
    nombreInquilino: z.string(),
    apellidoInquilino: z.string(),
    correoInquilino: z.string(),
    telefonoInquilino: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.enAlquiler) return;
    if (!data.nombreInquilino.trim()) {
      ctx.addIssue({
        path: ["nombreInquilino"],
        message: "El nombre es obligatorio",
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.apellidoInquilino.trim()) {
      ctx.addIssue({
        path: ["apellidoInquilino"],
        message: "El apellido es obligatorio",
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.correoInquilino.trim()) {
      ctx.addIssue({
        path: ["correoInquilino"],
        message: "El correo es obligatorio",
        code: z.ZodIssueCode.custom,
      });
    } else if (!z.string().email().safeParse(data.correoInquilino).success) {
      ctx.addIssue({
        path: ["correoInquilino"],
        message: "Formato de email inválido",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type FormValues = z.infer<typeof crearPropiedadSchema>;

export const buildingSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
});

export const tenantSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().min(1, "El email es obligatorio").email("Email inválido"),
  phone: z
    .string()
    .length(10, "Debe tener exactamente 10 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
});

export const unitSchema = z.object({
  floor: z.string().min(1, "El piso / unidad es obligatorio"),
  area: z
    .string()
    .min(1, "La superficie es obligatoria")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Debe ser mayor a 0"),
  rooms: z
    .string()
    .min(1, "Los ambientes son obligatorios")
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) > 0,
      "Debe ser un entero mayor a 0",
    ),
  unitType: z.string().min(1, "Seleccione un tipo de unidad"),
});

export const contractSchema = z.object({
  contractAmount: z
    .string()
    .min(1, "El monto es obligatorio")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Debe ser mayor a 0"),
  contractDueDate: z.string().min(1, "La fecha de vencimiento es obligatoria"),
});
export { crearPropiedadSchema };
