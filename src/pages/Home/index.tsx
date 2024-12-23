import {useUserInfo} from "../../hooks/useUserInfo"

export function Home() {
  const userInfoResult = useUserInfo({ shouldRedirectToLogInIfNeeded: true })

  if (!userInfoResult.isSuccess) {
    return <div class="home">{userInfoResult.error.message}</div>
  }

  const { userInfo, logOut } = userInfoResult.data

  return (
    <div class="dialog">
      <h1 class="dialog-header">Earth</h1>
      <p>
        Welcome {userInfo.username},<br/>
        Glad you’ve made it!
      </p>
      <p>
        <a href="javascript:void(0)" onClick={logOut}>Log out</a>
      </p>
    </div>
  )

}
