import "./style.css"
import { useState } from "preact/hooks"
import { useLogIn, LogInParamsSchema } from "../../hooks/useLogIn"
import { issuesToStr, getIssuesAtPathFromResult } from "../../utils/validation"
import { z } from "zod"
import { isDefined } from "../../utils/undefined"
import { cx, hide as hideWhen, show as showWhen } from "../../utils/styling"
import {FormEvent} from "preact/compat"
import { useUserInfo } from "../../hooks/useUserInfo"

export function Login() {
  useUserInfo({ shouldRedirectHomeIfPossible: true })

  const [shouldShowPassword, setShouldShowPassword] = useState(false)
  const [logIn, logInState] = useLogIn()

  const [email, setEmail] = useState("")
  const [showEmailValidation, setShowEmailValidation] = useState(false)

  const [password, setPassword] = useState("")
  const [showPassValidation, setShowPassValidation] = useState(false)

  const [showFormValidation, setShowFormValidation] = useState(false)

  const passwordInputType = shouldShowPassword ? "text" : "password"

  function updateEmail(e: Event) {
    if (!e.target) return
    const input = e.target as HTMLInputElement
    setEmail(input.value)
    setShowEmailValidation(true)
  }

  function updatePassword(e: Event) {
    if (!e.target) return
    const input = e.target as HTMLInputElement
    setPassword(input.value)
    setShowPassValidation(true)
  }

  function onEmailInput() {
    setShowEmailValidation(false)
    setShowFormValidation(false)
  }

  function onPasswordInput() {
    setShowPassValidation(false)
    setShowFormValidation(false)
  }

  function callLogIn(e: FormEvent) {
    e.preventDefault()

    if (logInState.isLoading) return
    if (logInState.result?.isSuccess) return

    if (!e.target) return
    const form = e.target as HTMLFormElement
    const data = {
      email: form.email.value,
      password: form.password.value,
    }

    const validationResult = LogInParamsSchema.safeParse(data)
    if (!validationResult.success) {
      setShowEmailValidation(true)
      setShowPassValidation(true)
      return
    }

    setShowEmailValidation(false)
    setShowPassValidation(false)

    logIn(data)

    setShowFormValidation(true)
  }

  let emailValidationIssues: z.ZodIssue[] = []
  if (showEmailValidation) {
    const validationResult = LogInParamsSchema.shape.email.safeParse(email)
    if (!validationResult.success) {
      emailValidationIssues = validationResult.error.issues
    }
  }

  if (!showEmailValidation && isDefined(logInState.result)) {
    emailValidationIssues = getIssuesAtPathFromResult(
      ["email"],
      logInState.result,
    )
  }

  let passwordValidationIssues: z.ZodIssue[] = []
  if (showPassValidation) {
    const validationResult =
      LogInParamsSchema.shape.password.safeParse(password)
    if (!validationResult.success) {
      passwordValidationIssues = validationResult.error.issues
    }
  }

  if (!showPassValidation && isDefined(logInState.result)) {
    passwordValidationIssues = getIssuesAtPathFromResult(
      ["password"],
      logInState.result,
    )
  }

  let formIssues: z.ZodIssue[] = []
  if (logInState.result && showFormValidation) {
    formIssues = getIssuesAtPathFromResult([], logInState.result)
  }

  return (
    <form
      class="dialog"
      novalidate
      onSubmit={callLogIn}>
      <h1 class="dialog-header">Welcome to Earth</h1>

      <div class="form-hero">
        <img
          src="key_world-0.png"
          width="32px"
          height="32px"
          class="form-hero__image"
          alt="Graphic of a key"
        />
        <div class="form-hero__text">
          Type a user name and password to log into Earth.
        </div>
      </div>

      <div
        class={cx({ "form-error": true, _isVisible: formIssues.length > 0 })}
        aria-live="polite"
        role="alert"
      >
        {issuesToStr(formIssues)}
      </div>

      <div
        class={cx({
          "form-field-text": true,
          "form-field-text_hasError": emailValidationIssues.length > 0,
        })}
      >
        <label class="form-field-text__label">
          Email:
          <input
            name="email"
            type="email"
            autocomplete="username"
            required
            aria-invalid={emailValidationIssues.length > 0}
            aria-errormessage={issuesToStr(emailValidationIssues)}
            onChange={updateEmail}
            onInput={onEmailInput}
            class="form-field-text__input"
          />
        </label>
        <div
          class={cx({
            "form-field-text__error": true,
            _isVisible: emailValidationIssues.length > 0,
          })}
          aria-live="polite"
        >
          {issuesToStr(emailValidationIssues)}
        </div>
      </div>

      <div
        class={cx({
          "form-field-text": true,
          "form-field-text_hasError": passwordValidationIssues.length > 0,
        })}
      >
        <label class="form-field-text__label">
          Password:
          <input
            name="password"
            type={passwordInputType}
            autocomplete="current-password"
            required
            aria-invalid={passwordValidationIssues.length > 0}
            aria-errormessage={issuesToStr(passwordValidationIssues)}
            onChange={updatePassword}
            onInput={onPasswordInput}
            class="form-field-text__input"
          />
        </label>
        <div
          class={cx({
            "form-field-text__error": true,
            _isVisible: passwordValidationIssues.length > 0,
          })}
          aria-live="polite"
        >
          {issuesToStr(passwordValidationIssues)}
        </div>
      </div>

      <div class="form-field-checkbox">
        <label class="form-field-checkbox__label">
          Show password:
          <input
            onChange={(e) => {
              setShouldShowPassword(Boolean(e.currentTarget.checked))
            }}
            class="form-field-checkbox__input"
            type="checkbox"
          />
        </label>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          disabled={logInState.isLoading}
          class="form-button form-button_default"
          aria-live="polite"
        >
          {logInState.isLoading ? "Loading..." : "Log in"}
        </button>

        <div class="form-field-link">
          <a class="form-field-link__a" href="/forgot-password">
            Forgot password?
          </a>
        </div>
      </div>
    </form>
  )
}
