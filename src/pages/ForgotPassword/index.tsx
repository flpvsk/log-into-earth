import { useUserInfo } from "../../hooks/useUserInfo"

export function ForgotPassword() {
  useUserInfo({ shouldRedirectHomeIfPossible: true })

  return (
    <div class="dialog">
      <h1 class="dialog-header">Forgot password</h1>
      <p>Password "admin" gives to a server error.</p>
      <p>
        Password with less than 5 characters gives an invalid login-password
        combination error.
      </p>
      <p>
        Any valid email and a password with more than 5 characters will log you
        in.
      </p>
      <div class="dialog-link">
        <a class="dialog-link__a" href="/login">
          Log in
        </a>
      </div>
    </div>
  )
}
