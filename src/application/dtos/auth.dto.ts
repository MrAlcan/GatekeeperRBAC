import { type UserDTO } from '@/application/mappers'

export interface SignInResponseDTO {
  success: boolean
  data: {
    user: UserDTO
    accessToken: string
    refreshToken: string
  }
}

export interface RefreshTokenResponseDTO {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
  }
}

export interface SignOutResponseDTO {
  success: boolean
  message: string
}

export interface ForgotPasswordResponseDTO {
  success: boolean
  message: string
}

export interface ResetPasswordResponseDTO {
  success: boolean
  message: string
}

export interface ChangePasswordResponseDTO {
  success: boolean
  message: string
}

export interface VerifyEmailResponseDTO {
  success: boolean
  message: string
}

export interface GetMyPermissionsResponseDTO {
  success: boolean
  data: {
    permissions: string[]
  }
}