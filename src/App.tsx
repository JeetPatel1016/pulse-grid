import { useEffect, useState } from "react";
import "./App.css";
import * as Tone from "tone";
import TrackGrid from "./components/TrackGrid";
import useToneSequencer from "./hooks/useToneSequencer";
import { Sample } from "./types";
import Controls from "./components/Controls";
import Mixer from "./components/Mixer";

type Props = {
  samples: Sample[];
  numOfSteps: number;
};

const NOTE = "C2";

export default function App({ samples, numOfSteps }: Props) {
  const stepIds = [...Array(numOfSteps).keys()] as const;

  const { isPlaying, handleStartClick, lampsRef, stepsRef, tracksRef, seqRef } =
    useToneSequencer(samples, numOfSteps);
  const [tempo, setTempo] = useState<number>(Tone.getTransport().bpm.value);

  const [isMixerOpen, setIsMixerOpen] = useState(false);

  const handleTempoChange = (newValue: number) => {
    // bounds for Tempo
    if (newValue < 20) newValue = 20;
    if (newValue > 300) newValue = 300;

    setTempo(newValue);
    Tone.getTransport().bpm.value = newValue;
  };

  useEffect(() => {
    tracksRef.current = samples.map((sample, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: sample.url,
        },
      }).toDestination(),
    }));
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.forEach((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack(NOTE, time);
          }
        });
        lampsRef.current.forEach((lampElement, index) => {
          if (index === step) lampElement.classList.add("active");
          else lampElement.classList.remove("active");
        });
      },
      [...stepIds],
      "16n"
    ).start(0);

    return () => {
      seqRef.current?.dispose();
      tracksRef.current.forEach((track) => track.sampler.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samples, numOfSteps]);

  return (
    <>
      <div className="app">
        <TrackGrid samples={samples} numOfSteps={numOfSteps} />

        {isMixerOpen && <Mixer numTracks={samples.length} />}
      </div>
      <Controls
        isPlaying={isPlaying}
        onPlayPauseClick={handleStartClick}
        tempo={tempo}
        onTempoChange={handleTempoChange}
        isMixerOpen={isMixerOpen}
        toggleMixer={() => setIsMixerOpen((state) => !state)}
      />
    </>
  );
}
