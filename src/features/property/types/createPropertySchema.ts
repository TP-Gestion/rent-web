import { z } from "zod";

const createPropertySchema = z
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

export type FormValues = z.infer<typeof createPropertySchema>;

export { createPropertySchema };
