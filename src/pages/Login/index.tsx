import './style.css';
import { useState } from 'preact/hooks'
import { useLogIn } from '../../hooks/useLogIn'

export function Login() {
  const [
    shouldShowPassword,
    setShouldShowPassword,
  ]= useState(false)
  const [ logIn, logInState ] = useLogIn()
  const passwordInputType = shouldShowPassword ? "text" : "password"

	return (
		<form class="login-form" onSubmit={(e) => {
      e.preventDefault()

      if (logInState.isLoading) return;
      if (logInState.result?.isSuccess) return;

      logIn({
        username: e.currentTarget.username.value,
        password: e.currentTarget.username.value,
      })
    }}>

      <div class="form-header">
        Welcome to Earth
      </div>

      <div class="form-hero">
        <img
          src="key_world-0.png"
          width="32px"
          height="32px"
          class="form-hero__image"
        />
        <div class="form-hero__text">
          Type a user name and password to log into Earth.
        </div>
      </div>

      <div class="form-field-text">
        <label class="form-field-text__label">
          User name:
          <input
            name="username"
            type="text"
            autofocus
            class="form-field-text__input"
          />
        </label>
      </div>

      <div class="form-field-text">
        <label class="form-field-text__label">
          Password:
          <input
            name="password"
            type={passwordInputType}
            class="form-field-text__input"
          />
        </label>
      </div>

      <div class="form-field-checkbox">
        <label class="form-field-checkbox__label">
          Show password
          <input
            onChange={(e) => {
              console.log(e.currentTarget.checked)
              setShouldShowPassword(Boolean(e.currentTarget.checked))
            }}
            class="form-field-checkbox__input"
            type="checkbox"
          />
        </label>
      </div>

      <div class="form-actions">
        <button
          type="button"
          disabled={logInState.isLoading}
          class="form-button"
        >
          Forgot password
        </button>
        <button
          type="submit"
          disabled={logInState.isLoading}
          class="form-button form-button_default"
        >
          Log in
        </button>
      </div>

		</form>
	);
}
