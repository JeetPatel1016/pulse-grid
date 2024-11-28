import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App
      samples={[
        { url: "/hat-closed.wav", name: "CH" },
        { url: "/hat-open.wav", name: "OH" },
        { url: "/snare.wav", name: "SD" },
        { url: "/kick.wav", name: "KD" },
      ]}
      numOfSteps={16}
    />
  </StrictMode>
);
