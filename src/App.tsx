import "./App.css";
import { AppRoutes } from "@/routes/app-routes";
import { ServerStatusIndicator } from "./components/ServerStatusIndicator";

function App() {
  return (
    <>
      <ServerStatusIndicator />
      <AppRoutes />
    </>
  );
}

export default App;
