export class Validators {
  static get email () {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})+$/
  }
  static get password () {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/
  }
  static get username () {
    return /^[a-zA-Z][a-zA-Z0-9_]{3,14}$/
  }
}
