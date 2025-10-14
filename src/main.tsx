import {createRoot} from "react-dom/client"
import {BrowserRouter} from "react-router-dom"
import App from "./App.tsx"
import "./css/styles.css"
import "./i18n/config"
import "react-toastify/dist/ReactToastify.css";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3"
import config from "@/config";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <GoogleReCaptchaProvider
      reCaptchaKey={config.GOOGLE_RECAPTCHA_KEY}
      language="en-GB"
      useRecaptchaNet={true}
      useEnterprise={false}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <App/>
    </GoogleReCaptchaProvider>
  </BrowserRouter>
)
