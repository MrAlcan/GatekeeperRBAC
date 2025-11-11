export interface AuditContext {
  userId?: string
  ipAddress?: string
  userAgent?: string
  requestId?: string
}

export interface ChangeRecord {
  field: string
  oldValue: any
  newValue: any
}