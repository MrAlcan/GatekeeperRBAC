import { z } from 'zod'
import { EmailSchema, PasswordSchema, NameSchema, UUIDSchema } from './common.schema'

export const CreateUserSchema = z.object({
  name: NameSchema,
  lastName: NameSchema,
  email: EmailSchema,
  password: PasswordSchema,
  roleIds: z.array( UUIDSchema ).optional()
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>

export const UpdateUserSchema = z.object({
  id: UUIDSchema,
  name: NameSchema.optional(),
  lastName: NameSchema.optional(),
  isActive: z.boolean().optional()
})

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>

export const DeleteUserSchema = z.object({
  id: UUIDSchema
})

export type DeleteUserInput = z.infer<typeof DeleteUserSchema>

export const GetUserByIdSchema = z.object({
  id: UUIDSchema
})

export type GetUserByIdInput = z.infer<typeof GetUserByIdSchema>

export const AssignRoleToUserSchema = z.object({
  userId: UUIDSchema,
  roleId: UUIDSchema
})

export type AssignRoleToUserInput = z.infer<typeof AssignRoleToUserSchema>

export const RemoveRoleFromUserSchema = z.object({
  userId: UUIDSchema,
  roleId: UUIDSchema
})

export type RemoveRoleFromUserInput = z.infer<typeof RemoveRoleFromUserSchema>