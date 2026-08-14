import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n.ts";
import App from "./pages/App.tsx";
import "./assets/css/font-face.css";
import "./assets/css/main.css";
import SplashCursor from "./components/animiations/SplashCursor.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SplashCursor
      DENSITY_DISSIPATION={3.5}
      VELOCITY_DISSIPATION={2}
      PRESSURE={0.1}
      CURL={3}
      SPLAT_RADIUS={0.2}
      SPLAT_FORCE={6000}
      COLOR_UPDATE_SPEED={10}
      SHADING
      RAINBOW_MODE={false}
      COLOR="var(--span)"
    />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
