import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z.object({
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  noKtp: z.string().min(8, 'No. KTP tidak valid'),
  phone: z.string().min(8, 'No. HP tidak valid'),
  cabangId: z.string().uuid('Pilih cabang').optional().or(z.literal('')),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password baru minimal 6 karakter'),
  confirm: z.string().min(6, 'Konfirmasi password minimal 6 karakter'),
}).refine((d) => d.password === d.confirm, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirm'],
})

export const contactSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
})

export const newsSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  slug: z.string().min(3, 'Slug minimal 3 karakter'),
  excerpt: z.string().optional(),
  content: z.string().min(20, 'Konten minimal 20 karakter'),
  categoryId: z.string().uuid().optional().or(z.literal('')),
  coverUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean().default(false),
})

export const profileUpdateSchema = z.object({
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  phone: z.string().optional(),
  address: z.string().optional(),
  birthDate: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type NewsInput = z.infer<typeof newsSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
