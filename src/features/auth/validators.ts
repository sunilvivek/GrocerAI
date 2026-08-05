import { z } from "zod"

export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 72

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .max(254, "Email is too long")

export { emailSchema }

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters")
  .max(PASSWORD_MAX_LENGTH, "Password must be at most 72 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number")

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name is too long"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  email: emailSchema,
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type SignUpValues = z.infer<typeof signUpSchema>
export type SignInValues = z.infer<typeof signInSchema>
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
export type ProfileValues = z.infer<typeof profileSchema>
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
