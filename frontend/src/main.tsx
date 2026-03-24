import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@styles/index.css";
import App from "./App.tsx";
import { TanStackQueryProvider } from "./integrations/tanstack-query.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanStackQueryProvider>
      <App />
    </TanStackQueryProvider>
  </StrictMode>,
);
