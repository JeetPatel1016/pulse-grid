import { useState } from "react";
import "./App.css";
import TrackGrid from "./components/TrackGrid";
import Controls from "./components/Controls";
import Mixer from "./components/Mixer";

export default function App() {
  const [isMixerOpen, setIsMixerOpen] = useState(false);

  return (
    <>
      <div className="app">
        <TrackGrid />
        {isMixerOpen && <Mixer />}
      </div>
      <Controls
        isMixerOpen={isMixerOpen}
        toggleMixer={() => setIsMixerOpen((state) => !state)}
      />
    </>
  );
}
