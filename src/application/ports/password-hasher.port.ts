export abstract class PasswordHasherPort {
  abstract hash( plainPassword: string, rounds?: number ): Promise<string>
  abstract compare( plainPassword: string, hashedPassword: string ): Promise<boolean>
  abstract isHash( value: string ): boolean
}