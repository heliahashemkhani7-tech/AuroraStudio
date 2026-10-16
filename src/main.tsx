import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n.ts";
import App from "./pages/App.tsx";
import "./assets/css/font-face.css";
import "./assets/css/main.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <BrowserRouter>
      <App />
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  </StrictMode>
);
