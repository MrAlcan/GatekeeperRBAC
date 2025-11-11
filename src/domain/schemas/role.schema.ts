import { z } from 'zod'
import { NameSchema, DescriptionSchema, UUIDSchema } from './common.schema'

export const CreateRoleSchema = z.object({
  name: NameSchema,
  description: DescriptionSchema
})

export type CreateRoleInput = z.infer<typeof CreateRoleSchema>

export const UpdateRoleSchema = z.object({
  id: UUIDSchema,
  name: NameSchema.optional(),
  description: DescriptionSchema
})

export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>

export const DeleteRoleSchema = z.object({
  id: UUIDSchema
})

export type DeleteRoleInput = z.infer<typeof DeleteRoleSchema>

export const GetRoleByIdSchema = z.object({
  id: UUIDSchema
})

export type GetRoleByIdInput = z.infer<typeof GetRoleByIdSchema>

export const AssignPermissionToRoleSchema = z.object({
  roleId: UUIDSchema,
  permissionId: UUIDSchema
})

export type AssignPermissionToRoleInput = z.infer<typeof AssignPermissionToRoleSchema>

export const RemovePermissionFromRoleSchema = z.object({
  roleId: UUIDSchema,
  permissionId: UUIDSchema
})

export type RemovePermissionFromRoleInput = z.infer<typeof RemovePermissionFromRoleSchema>