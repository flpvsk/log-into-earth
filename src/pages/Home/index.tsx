import { useUserInfo } from "../../hooks/useUserInfo"
import earthImg from "../../assets/earth.png"

export function Home() {
  const userInfoResult = useUserInfo({ shouldRedirectToLogInIfNeeded: true })

  if (!userInfoResult.isSuccess) {
    return <div class="home">{userInfoResult.error.message}</div>
  }

  const { userInfo, logOut } = userInfoResult.data

  return (
    <div class="dialog">
      <h1 class="dialog-header">Earth</h1>
      <div class="dialog-pic-text">
        <p>
          Welcome {userInfo.username},<br />
          Glad you’ve made it!
        </p>
        <img src={earthImg} width="32" height="32" alt="Image of Earth" />
      </div>
      <div class="dialog-link">
        <a class="dialog-link__a" href="javascript:void(0)" onClick={logOut}>
          Log out
        </a>
      </div>
    </div>
  )
}
