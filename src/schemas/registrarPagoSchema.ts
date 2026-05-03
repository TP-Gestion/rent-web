import { z } from "zod";

export const registrarPagoSchema = z.object({
  periods: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos un período a pagar"),
  paymentDate: z.string().min(1, "Debe ingresar una fecha de pago"),
  paymentMethod: z.string().min(1, "Debe seleccionar un medio de pago válido"),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type RegisterPaymentFormValues = z.infer<typeof registrarPagoSchema>;
export type RegisterPaymentFormErrors = Partial<
  Record<keyof RegisterPaymentFormValues, string>
>;
