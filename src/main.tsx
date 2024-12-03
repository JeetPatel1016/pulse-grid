import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ToneProvider from "./context/ToneContext.tsx";
import { samples } from "./utils/samples.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToneProvider samples={samples} numOfSteps={16} note="C2">
      <App />
    </ToneProvider>
  </StrictMode>
);
