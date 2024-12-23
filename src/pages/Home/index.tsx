import {useUserInfo} from "../../hooks/useUserInfo"
import "./style.css"

export function Home() {
  const userInfoResult = useUserInfo({ shouldRedirectToLogInIfNeeded: true })

  if (!userInfoResult.isSuccess) {
    return <div class="home">{userInfoResult.error.message}</div>
  }

  const { userInfo, logOut } = userInfoResult.data

  return (
    <div class="home">
      Welcome, {userInfo.username}!
      <div>
        <a href="javascript:void(0)" onClick={logOut}>Log out</a>
      </div>
    </div>
  )

}
