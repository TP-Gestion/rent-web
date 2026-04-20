import { z } from "zod";

const expenseCategoryValues = [
  "SERVICIOS",
  "REPARACIONES",
  "ADMINISTRACION",
  "IMPUESTOS",
  "LIMPIEZA",
  "OTROS",
] as const;

const expenseFrequencyValues = ["UNICA", "MENSUAL"] as const;
const durationTypeValues = ["INDEFINIDA", "MESES"] as const;

export type ExpenseCategory = (typeof expenseCategoryValues)[number];
export type ExpenseFrequency = (typeof expenseFrequencyValues)[number];
export type ExpenseDurationType = (typeof durationTypeValues)[number];

export const EXPENSE_CATEGORY_OPTIONS: { value: ExpenseCategory; label: string }[] = [
  { value: "SERVICIOS", label: "Servicios" },
  { value: "REPARACIONES", label: "Reparaciones" },
  { value: "ADMINISTRACION", label: "Administración" },
  { value: "IMPUESTOS", label: "Impuestos" },
  { value: "LIMPIEZA", label: "Limpieza" },
  { value: "OTROS", label: "Otros" },
];

export const EXPENSE_FREQUENCY_OPTIONS: { value: ExpenseFrequency; label: string }[] = [
  { value: "UNICA", label: "Una sola vez" },
  { value: "MENSUAL", label: "Mensual" },
];

export const EXPENSE_DURATION_OPTIONS: { value: ExpenseDurationType; label: string }[] = [
  { value: "INDEFINIDA", label: "Indefinida" },
  { value: "MESES", label: "Por cantidad de meses" },
];

export const crearGastoSchema = z
  .object({
    propertyId: z.string().min(1, "Seleccioná una propiedad"),
    category: z.enum(expenseCategoryValues, {
      errorMap: () => ({ message: "Seleccioná una categoría" }),
    }),
    frequency: z.enum(expenseFrequencyValues, {
      errorMap: () => ({ message: "Seleccioná una frecuencia" }),
    }),
    durationType: z.enum(durationTypeValues, {
      errorMap: () => ({ message: "Seleccioná una duración" }),
    }),
    durationMonths: z.string(),
    amount: z
      .string()
      .min(1, "El monto es obligatorio")
      .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, "Debe ser un número mayor a 0"),
    supplier: z.string(),
    reference: z.string(),
    notes: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.frequency === "MENSUAL") {
      if (data.durationType === "MESES") {
        if (!data.durationMonths) {
          ctx.addIssue({
            path: ["durationMonths"],
            message: "Indicá la cantidad de meses",
            code: z.ZodIssueCode.custom,
          });
        } else if (!Number.isInteger(Number(data.durationMonths)) || Number(data.durationMonths) <= 0) {
          ctx.addIssue({
            path: ["durationMonths"],
            message: "Debe ser un entero mayor a 0",
            code: z.ZodIssueCode.custom,
          });
        }
      }
    }
  });

export type ExpenseFormValues = z.infer<typeof crearGastoSchema>;
