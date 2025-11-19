import { prisma } from '@/infrastructure/data'

export class AuthDatasourceImpl {
  async getUserPermissions(userId: string): Promise<string[]> {
    const permissions = await prisma.$queryRaw<Array<{ permission_slug: string }>>`
      SELECT DISTINCT p.slug as permission_slug
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE u.id = '${userId}'
      AND u.is_active = true
    `

    return permissions.map((p: any) => p.permission_slug)
  }
}