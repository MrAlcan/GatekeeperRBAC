import { hash, compare, genSalt } from 'bcryptjs'
import { PasswordHasherPort } from '@/application/ports'

export class BcryptHasherAdapter implements PasswordHasherPort {
  private readonly defaultRounds: number = 10

  async hash(plainPassword: string, rounds?: number): Promise<string> {
    const saltRounds = rounds || this.defaultRounds
    return hash(plainPassword, saltRounds)
  }

  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return compare(plainPassword, hashedPassword)
  }

  isHash(value: string): boolean {
    return /^\$2[ayb]\$\d{2}\$.{53}$/.test(value)
  }
}