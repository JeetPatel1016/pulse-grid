import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Sample } from "./types";
import ToneProvider from "./context/ToneContext.tsx";

const samples: Sample[] = [
  {
    url: "/kick.wav",
    name: "KD",
  },
  {
    url: "/snare.wav",
    name: "SD",
  },
  {
    url: "/hat-closed.wav",
    name: "CH",
  },
  {
    url: "/hat-open.wav",
    name: "OH",
  },
];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToneProvider samples={samples} numOfSteps={16} note="C2">
      <App />
    </ToneProvider>
  </StrictMode>
);
