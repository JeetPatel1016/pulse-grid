import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Sample, Track } from "../types";
import * as Tone from "tone";
import { TransportClass } from "tone/build/esm/core/clock/Transport";

type ToneContextType = {
  isPlaying: boolean;
  samples: Sample[];
  numOfSteps: number;
  bpm: number;
  transport: TransportClass;
  lampsRef: React.MutableRefObject<HTMLDivElement[]>;
  stepsRef: React.MutableRefObject<HTMLInputElement[][]>;
  tracksRef: React.MutableRefObject<Track[]>;
  play: () => void;
  stop: () => void;
  setBPM: (newBPM: number) => void;
};

const ToneContext = createContext<ToneContextType | undefined>(undefined);

export default function ToneProvider({
  children,
  samples,
  numOfSteps,
  note,
}: {
  children: React.ReactNode;
  samples: Sample[];
  numOfSteps: number;
  note: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpmState] = useState<number>(Tone.getTransport().bpm.value);

  const lampsRef = useRef<HTMLDivElement[]>([]);
  const stepsRef = useRef<HTMLInputElement[][]>([[]]);
  const seqRef = useRef<Tone.Sequence | null>(null);
  const tracksRef = useRef<Track[]>([]);

  const play = async () => {
    if (Tone.getTransport().state === "started") return;
    await Tone.start();
    Tone.getTransport().start();
    setIsPlaying(true);
  };

  const stop = () => {
    if (Tone.getTransport().state !== "started") return;
    Tone.getTransport().stop();
    lampsRef.current.forEach((lamp) => lamp.classList.remove("active"));
    setIsPlaying(false);
  };

  const setBPM = (newBpm: number) => {
    const clampedBpm = Math.min(300, Math.max(20, newBpm)); // Clamp the BPM between 20 and 300
    Tone.getTransport().bpm.value = clampedBpm;
    setBpmState(clampedBpm);
  };

  useEffect(() => {
    // Initialize Tone.js Samplers and Sequence
    tracksRef.current = samples.map((sample, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: { [note]: sample.url },
      }).toDestination(),
    }));

    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.forEach((track) => {
          if (stepsRef.current[track.id]?.[step]?.checked) {
            track.sampler.triggerAttack(note, time);
          }
        });

        // Update the step lamps
        lampsRef.current.forEach((lamp, index) => {
          if (index === step) lamp.classList.add("active");
          else lamp.classList.remove("active");
        });
      },
      Array.from({ length: numOfSteps }, (_, i) => i),
      "16n"
    ).start(0);

    // Cleanup Tone.js resources on unmount
    return () => {
      seqRef.current?.dispose();
      tracksRef.current.forEach((track) => track.sampler.dispose());
    };
  }, [samples, numOfSteps, note]);

  return (
    <ToneContext.Provider
      value={{
        samples,
        numOfSteps,
        isPlaying,
        bpm,
        transport: Tone.getTransport(),
        setBPM,
        play,
        stop,
        lampsRef,
        stepsRef,
        tracksRef,
      }}
    >
      {children}
    </ToneContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTone() {
  const context = useContext(ToneContext);
  if (!context) {
    throw new Error("useTone must be used within a ToneContextProvider");
  }
  return context;
}
