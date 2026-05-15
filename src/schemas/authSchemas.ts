import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .refine(
      (val) => /[A-Z]/.test(val),
      'La contraseña debe contener al menos una mayúscula'
    ),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

export type AuthResponse = {
  id: number
  name: string
  email: string
  dummyToken: string
}

export default {} as const
