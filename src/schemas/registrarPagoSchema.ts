import { z } from "zod";

export const registrarPagoSchema = z.object({
  periodos: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos un período a pagar"),
  fechaPago: z.string().min(1, "Debe ingresar una fecha de pago"),
  medioPago: z.string().min(1, "Debe seleccionar un medio de pago válido"),
  referencia: z.string().optional(),
  observaciones: z.string().optional(),
});

export type RegistrarPagoFormValues = z.infer<typeof registrarPagoSchema>;
export type RegistrarPagoFormErrors = Partial<
  Record<keyof RegistrarPagoFormValues, string>
>;
