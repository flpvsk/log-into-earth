import "./style.css"
import { useState } from "preact/hooks"
import { useLogIn, LogInParamsSchema } from "../../hooks/useLogIn"
import { getIssuesAtPathFromResult } from "../../utils/validation"
import { z } from "zod"
import { isDefined } from "../../utils/undefined"
import { cx } from "../../utils/styling"

export function Login() {
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
    console.log("va", validationResult)
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
      class="login-form"
      novalidate
      onSubmit={(e) => {
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
      }}
    >
      <div class="form-header">Welcome to Earth</div>

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

      {formIssues.length > 0 && (
        <div class="form-error">
          {formIssues.map((i) => i.message).join(";")}
        </div>
      )}

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
            required
            aria-invalid={emailValidationIssues.length > 0}
            aria-aria-errormessage={emailValidationIssues
              .map((i) => i.message)
              .join(";")}
            onChange={updateEmail}
            onInput={onEmailInput}
            autofocus
            class="form-field-text__input"
          />
        </label>
        {emailValidationIssues.map((issue, i) => (
          <div key={i} class="form-field-text__error">
            {issue.message}
          </div>
        ))}
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
            aria-invalid={passwordValidationIssues.length > 0}
            aria-aria-errormessage={passwordValidationIssues
              .map((i) => i.message)
              .join(";")}
            onChange={updatePassword}
            onInput={onPasswordInput}
            class="form-field-text__input"
          />
        </label>
        {passwordValidationIssues.map((issue, i) => (
          <div key={i} class="form-field-text__error">
            {issue.message}
          </div>
        ))}
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
        >
          Log in
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
