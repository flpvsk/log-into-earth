import { useUserInfo } from "../../hooks/useUserInfo"

export function ForgotPassword() {
  useUserInfo({ shouldRedirectHomeIfPossible: true })

  return (
    <div class="dialog">
      <h1 class="dialog-header">Forgot password</h1>
      <p>Password "admin" leads to a server error.</p>
      <p>Password with less than 5 characters is invalid.</p>
      <p>
        Any valid email and a password with more than 5 characters will log you
        in.
      </p>
      <p>
        <a href="/login">Log In</a>
      </p>
    </div>
  )
}
