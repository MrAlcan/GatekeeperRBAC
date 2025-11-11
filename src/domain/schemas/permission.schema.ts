import { z } from 'zod'
import { NameSchema, DescriptionSchema, UUIDSchema } from './common.schema'

const PermissionSlugSchema = z.string()
  .regex(
    /^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/,
    'Permission slug must be in format "module:action" (lowercase, letters and hyphens only)'
  )
  .toLowerCase()
  .trim()

export const CreatePermissionSchema = z.object({
  slug: PermissionSlugSchema,
  name: NameSchema,
  description: DescriptionSchema
})

export type CreatePermissionInput = z.infer<typeof CreatePermissionSchema>

export const UpdatePermissionSchema = z.object({
  id: UUIDSchema,
  name: NameSchema.optional(),
  description: DescriptionSchema
})

export type UpdatePermissionInput = z.infer<typeof UpdatePermissionSchema>

export const DeletePermissionSchema = z.object({
  id: UUIDSchema
})

export type DeletePermissionInput = z.infer<typeof DeletePermissionSchema>

export const GetPermissionByIdSchema = z.object({
  id: UUIDSchema
})

export type GetPermissionByIdInput = z.infer<typeof GetPermissionByIdSchema>