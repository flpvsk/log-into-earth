import { useState } from "preact/hooks"
import { useLocation } from "preact-iso"

import { isDefined } from "../utils/undefined"
import { Result, makeErrorResult, makeOkResult } from "../utils/result"

import { z } from "zod"

async function wait(s: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), s * 1000)
  })
}

export interface LogInData {
  email: string
  username: string
}

export interface UseLogInState {
  isLoading: boolean
  result?: Result<LogInData>
}

export type UseLogInResult = [
  doLogIn: (_args: LogInParams) => void,
  logInState: UseLogInState,
]

export const LogInParamsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password must be at least one character long"),
})

export type LogInParams = z.infer<typeof LogInParamsSchema>

async function callServer(args: LogInParams): Promise<LogInData> {
  console.log(`Calling login for ${args.email}...`)
  console.log("This would normally be a fetch call")
  await wait(3)
  if (args.password.length < 3) throw new Error("Wrong email or password")
  return {
    email: args.email,
    username: args.email.split("@")[0],
  }
}

export function useLogIn(): UseLogInResult {
  const [promise, setPromise] = useState<Promise<void> | undefined>()
  const [result, setResult] = useState<Result<LogInData> | undefined>()
  const { route } = useLocation()

  function logIn(args: LogInParams) {
    if (promise) return

    const argsValidationResult = LogInParamsSchema.safeParse(args)
    if (!argsValidationResult.success) {
      setResult(makeErrorResult(argsValidationResult.error))
      return
    }

    const newPromise = callServer(argsValidationResult.data)
      .then((result) => {
        setResult(makeOkResult(result))
        setPromise(undefined)
        route("/", true)
      })
      .catch((e) => {
        setPromise(undefined)
        setResult(makeErrorResult(e))
      })

    setPromise(newPromise)
    setResult(undefined)
  }

  return [
    logIn,
    {
      isLoading: isDefined(promise),
      result,
    },
  ]
}
