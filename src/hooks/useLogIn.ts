import { useState } from 'preact/hooks'
import {isDefined} from '../utils/undefined'
import {Result, makeErrorResult, makeOkResult} from '../utils/result'
import {useLocation} from 'preact-iso'

async function wait(s: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), s * 1000)
  })
}


export interface LogInData {
  username: string
}

export interface UseLogInState {
  isLoading: boolean
  result?: Result<LogInData>
}

export type UseLogInResult = [
  doLogIn: (args: LogInParams) => void,
  logInState: UseLogInState
]

export interface LogInParams {
  username: string
  password: string
}

async function callServer(args: LogInParams): Promise<LogInData> {
  console.log(`Calling login for ${args.username}...`)
  console.log("This would normally be a fetch call")
  await wait(4)
  return {
    username: args.username,
  }
}

export function useLogIn(): UseLogInResult {
  const [promise, setPromise] = useState<Promise<void> | undefined>()
  const [result, setResult] = useState<Result<LogInData> | undefined>()
  const { route } = useLocation()

  function logIn(args: LogInParams) {
    if (promise) return

    const newPromise = callServer(args)
      .then(result => {
        setResult(makeOkResult(result))
        setPromise(undefined)
        route("/", true)
      })
      .catch((e) => {
        setResult(makeErrorResult(e))
      })

    setPromise(newPromise)
  }

  return [
    logIn,
    {
      isLoading: isDefined(promise),
      result,
    }
  ]
}
