import {observer} from "mobx-react-lite"
import authStore from "./pages/auth/authStore.ts"
import {rootStore, RootStoreProvider} from "./stores/rootStore"
import ErrorBoundary from "./components/common/ErrorBoundary"
import {Tooltip} from "react-tooltip"
import AppRoutes from "@/routes";
import {ToastContainer} from "react-toastify";
import {useEffect} from "react";

const App = observer(() => {
  
  useEffect(() => {
    if (localStorage.getItem("wii_token")) {
      authStore.getProfile().then()
    } else {
      authStore.logout()
    }
  }, []);
  
  return (
    <RootStoreProvider value={rootStore}>
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AppRoutes/>
          <Tooltip id="app-tooltip"/>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </ErrorBoundary>
    </RootStoreProvider>
  )
})

export default App
