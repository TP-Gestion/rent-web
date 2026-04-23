import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, "El email es obligatorio")
  .email("Ingresa un email valido");

const passwordSchema = z
  .string()
  .min(1, "La contraseña es obligatoria")
  .min(6, "La contraseña debe tener al menos 6 caracteres");

const nameSchema = z
  .string()
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres");

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const registerSchema = loginSchema.extend({
  name: nameSchema,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

export { loginSchema, registerSchema };