import type { Request, Response, NextFunction } from 'express'
import { z, ZodType } from 'zod'
import { ValidationError } from '@/domain/errors'

type ValidationType = 'body' | 'query' | 'params'

export const validate = (
  schema: ZodType,
  type: ValidationType = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[type]
      console.log({ reqQuery: req['query'] })
      console.log({ data })
      console.log({ reqType: req[type] })
      console.log({ type })

      const validated = await schema.parseAsync(data)

      // Clear existing properties and assign validated ones
      // This avoids the readonly property error with req.query
      Object.keys(req[type] as object).forEach(key => {
        delete (req[type] as Record<string, unknown>)[key]
      })
      Object.assign(req[type] as object, validated)

      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.issues.map((err) => ({
          field: err.path.join('.'),
          code: err.code,
          message: err.message
        }))

        next(ValidationError.fromFields(details))
      } else {
        next(error)
      }
    }
  }
}

export const validateBody = (schema: ZodType) => validate(schema, 'body')
export const validateQuery = (schema: ZodType) => validate(schema, 'query')
export const validateParams = (schema: ZodType) => validate(schema, 'params')