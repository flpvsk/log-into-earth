import { z } from "zod"
import { makeErrorResult, makeOkResult, Result } from "../utils/result"
import { useLocation } from "preact-iso"

export const UserInfoSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1, "Username has to be at least 1 character long"),
})

export type UserInfo = z.infer<typeof UserInfoSchema>

export type UseUserInfoResult = Result<{
  userInfo: UserInfo
  logOut: () => void
}>

export interface UseUserInfoArgs {
  shouldRedirectHomeIfPossible?: boolean
  shouldRedirectToLogInIfNeeded?: boolean
}

export function useUserInfo(args: UseUserInfoArgs = {}): UseUserInfoResult {
  const userInfoResult = getUserInfo()
  const { route } = useLocation()

  if (userInfoResult.isError) {
    if (args.shouldRedirectToLogInIfNeeded) {
      if (typeof history !== "undefined") {
        route("/login")
      }
    }
    return makeErrorResult(userInfoResult.error)
  }

  if (args.shouldRedirectHomeIfPossible) {
    if (typeof history !== "undefined") {
      route("/", true)
    }
  }

  return makeOkResult({
    userInfo: userInfoResult.data,
    logOut: () => {
      removeUserInfo()
      if (typeof history !== "undefined") {
        route("/login")
      }
    },
  })
}

function getWindow(): Window | undefined {
  if (typeof window !== "undefined") {
    return window
  }

  return undefined
}

export function saveUserInfo(userInfo: UserInfo): void {
  const parsed = UserInfoSchema.parse(userInfo)
  getWindow()?.localStorage.setItem("user", JSON.stringify(parsed))
}

export function getUserInfo(): Result<UserInfo> {
  try {
    const raw = getWindow()?.localStorage.getItem("user")
    if (!raw) throw new Error("User not logged in")
    const json = JSON.parse(raw)
    return makeOkResult(UserInfoSchema.parse(json))
  } catch (e: unknown) {
    getWindow()?.localStorage.removeItem("user")
    return makeErrorResult(e as Error)
  }
}

export function removeUserInfo(): void {
  getWindow()?.localStorage.removeItem("user")
}
