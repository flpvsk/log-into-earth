import {
  LocationProvider,
  Router,
  Route,
  hydrate,
  prerender as ssr,
} from "preact-iso"

import { Home } from "./pages/Home/index.jsx"
import { Login } from "./pages/Login/index.jsx"
import { ForgotPassword } from "./pages/ForgotPassword/index.jsx"
import { NotFound } from "./pages/_404.jsx"
import "./style.css"

export function App() {
  return (
    <LocationProvider>
      <main class="page">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  )
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app")!)
}

export async function prerender(data: Record<string, unknown>) {
  return await ssr(<App {...data} />)
}
