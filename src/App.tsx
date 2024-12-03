import { useEffect, useState } from "react";
import "./App.css";
import TrackGrid from "./components/TrackGrid";
import Controls from "./components/Controls";
import Mixer from "./components/Mixer";
import Joyride, { Step } from "react-joyride";

const steps: Step[] = [
  {
    target: ".app",
    content: "Welcome to PulseGrid",
    disableBeacon: true,
    placement: "center",
    spotlightClicks: true,
  },
  {
    target: "#tracks",
    title: "Tracks",
    content: "Tap the grid cells to create your beats for each track.",
  },
  {
    target: ".play",
    title: "Controls",
    content: "Hit play to hear your music. Pause or resume anytime. ",
  },
  {
    target: ".tempo",
    title: "Tempo",
    content: "Adjust the Tempo to speed up or slow down your drum pattern.",
  },
  {
    target: "#mixer-btn",
    title: "Mixer",
    placement: "top",
    content: "Use the mixer to tweak volume and monitor levels.",
  },
  {
    target: ".app",
    content:
      "That's it! You've completed the tour. Start creating your beats and have fun!",
    placement: "center",
    spotlightClicks: true,
    disableBeacon: true,
    title: "You're Ready to Go!",
  },
];

export default function App() {
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
  const [isMixerOpen, setIsMixerOpen] = useState(false);

  useEffect(() => {
    const onboardingFlag = localStorage.getItem("onboardingComplete");
    if (!onboardingFlag) {
      setIsOnboardingVisible(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("onboardingComplete", "true");
    setIsOnboardingVisible(false);
  };

  return (
    <>
      <div className="app">
        {isOnboardingVisible && (
          <Joyride
            run={true}
            steps={steps}
            continuous={true}
            showSkipButton={true}
            locale={{
              skip: "Skip Tour",
              last: "Let's Go",
            }}
            styles={{
              beaconInner: {
                backgroundColor: "#5eead4",
              },
              beaconOuter: {
                backgroundColor: "#14b8a67f",
                borderColor: "#14b8a6",
              },
              tooltipTitle: {
                fontWeight: "normal",
                color: "white",
              },
              tooltip: {
                fontWeight: "lighter",
                backgroundColor: "#1e293b",
                color: "#f1f5f9",
              },
              buttonClose: {
                color: "white",
              },
              buttonSkip: {
                color: "#e2e8f0",
              },
              buttonNext: {
                backgroundColor: "#10b981",
                border: "1px solid #2dd4bf",
              },
              buttonBack: {
                color: "#5eead4",
              },
              options: {
                arrowColor: "#1e293b",
              },
            }}
            callback={({ status }) => {
              if (status === "finished" || status === "skipped")
                handleOnboardingComplete();
            }}
          />
        )}

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
