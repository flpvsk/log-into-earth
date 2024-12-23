import { ZodError } from "zod"

export type ErrorResult = {
  isError: true
  isSuccess: false
  error: Error | ZodError
}

export type OkResult<T> = {
  isError: false
  isSuccess: true
  data: T
}

export type Result<T> = OkResult<T> | ErrorResult

export function makeErrorResult(error: Error): ErrorResult {
  return {
    isError: true,
    isSuccess: false,
    error,
  }
}

export function makeOkResult<T>(data: T): OkResult<T> {
  return {
    isError: false,
    isSuccess: true,
    data,
  }
}

export function isOkResult<T>(result: Result<T>): result is OkResult<T> {
  return result.isSuccess
}

export function isErrorResult(result: Result<unknown>): result is ErrorResult {
  return result.isError
}
