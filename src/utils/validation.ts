import { z } from "zod"
import { Result } from "./result"

export function getIssuesAtPath(
  path: string[],
  error: z.ZodError | Error,
): z.ZodIssue[] {
  if (!("issues" in error) && path.length === 0)
    return [
      {
        message: error.message,
        fatal: true,
        path: [],
        code: "custom",
      },
    ]

  if (!("issues" in error)) return []
  if (path.length === 0) {
    return error.issues.filter((issue) => issue.path.length === 0)
  }

  const filteredIssues: z.ZodIssue[] = []
  for (const issue of error.issues) {
    let isMatch = true
    for (let i = 0; i < path.length; i++) {
      if (path[i] !== issue.path[i]) {
        isMatch = false
        break
      }
    }

    if (isMatch) filteredIssues.push(issue)
  }

  return filteredIssues
}

export function getIssuesAtPathFromResult(
  path: string[],
  result: Result<unknown>,
): z.ZodIssue[] {
  if (result.isSuccess) return []
  return getIssuesAtPath(path, result.error)
}

export function issuesToStr(issues: z.ZodIssue[]): string {
  return issues.map((i) => i.message).join(";")
}
