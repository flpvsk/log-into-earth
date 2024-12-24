import { useState } from "preact/hooks"
import { useLocation } from "preact-iso"

import { isDefined } from "../utils/undefined"
import { Result, makeErrorResult, makeOkResult } from "../utils/result"

import { z } from "zod"
import { saveUserInfo, UserInfo } from "./useUserInfo"

async function wait(s: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), s * 1000)
  })
}

export interface UseLogInState {
  isLoading: boolean
  result?: Result<UserInfo>
}

export type UseLogInResult = [
  doLogIn: (_args: LogInParams) => void,
  logInState: UseLogInState,
]

export const LogInParamsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password can not be empty"),
})

export type LogInParams = z.infer<typeof LogInParamsSchema>

async function callServer(args: LogInParams): Promise<UserInfo> {
  console.log(`Calling login for ${args.email}...`)
  console.log("This would normally be a fetch call")

  if (args.password.trim().toLowerCase() === "admin") {
    await wait(4)
    throw new Error("Server error: timeout")
  }

  await wait(2)
  if (args.password.length < 5) throw new Error("Wrong email or password")

  return {
    email: args.email,
    username: args.email.split("@")[0],
  }
}

export function useLogIn(): UseLogInResult {
  const [promise, setPromise] = useState<Promise<void> | undefined>()
  const [result, setResult] = useState<Result<UserInfo> | undefined>()
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
        saveUserInfo(result)
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
