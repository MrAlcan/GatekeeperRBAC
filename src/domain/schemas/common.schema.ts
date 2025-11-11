import { z } from 'zod'

export const UUIDSchema = z.string().uuid( 'Invalid UUID format' )

export const EmailSchema = z.string()
  .email( 'Invalid email format' )
  .toLowerCase()
  .trim()
  .max( 255, 'Email too long' )

export const PasswordSchema = z.string()
  .min( 8, 'Password must be at least 8 characters' )
  .max( 128, 'Password must not exceed 128 characters' )
  .regex( /[a-z]/, 'Password must contain at least one lowercase letter' )
  .regex( /[A-Z]/, 'Password must contain at least one uppercase letter' )
  .regex( /\d/, 'Password must contain at least one number' )

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default( 1 ),
  pageSize: z.coerce.number().int().positive().max( 100 ).default( 10 ),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum( [ 'asc', 'desc' ] ).optional()
})

export const NameSchema = z.string()
  .min( 2, 'Name must be at least 2 characters' )
  .max( 100, 'Name must not exceed 100 characters' )
  .regex( /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Name must contain only letters and spaces' )
  .trim()

export const DescriptionSchema = z.string()
  .max( 500, 'Description must not exceed 500 characters' )
  .trim()
  .optional()