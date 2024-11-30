import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Level, Sample, Track, VolumeLevel } from "../types";
import * as Tone from "tone";
import { TransportClass } from "tone/build/esm/core/clock/Transport";
import { DbToLinear, linearToDb } from "../utils/volume";

type ToneContextType = {
  isPlaying: boolean;
  samples: Sample[];
  numOfSteps: number;
  bpm: number;
  levels: Level[];
  volumes: VolumeLevel[];
  updateVolume: (trackId: number, linearValue: number) => void;
  transport: TransportClass;
  lampsRef: React.MutableRefObject<HTMLDivElement[]>;
  stepsRef: React.MutableRefObject<HTMLInputElement[][]>;
  tracksRef: React.MutableRefObject<Track[]>;
  play: () => void;
  stop: () => void;
  muteTrack: (trackId: number, toggle: boolean) => void;
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
  const [levels, setLevels] = useState<Level[]>([]);
  const [volumes, setVolumes] = useState<VolumeLevel[]>([]);
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

  const getLevels = () => {
    return tracksRef.current.map((trk) => ({
      level: trk.meter.getValue() as number,
      id: trk.id,
    }));
  };

  const updateVolume = (trackId: number, linearValue: number) => {
    const track = tracksRef.current.find((t) => t.id === trackId);
    if (track) {
      const dbValue = linearToDb(linearValue);
      track.sampler.volume.value = dbValue;
    }
    setVolumes(
      tracksRef.current.map((trk, id) => ({
        id,
        volume: DbToLinear(trk.sampler.volume.value),
      }))
    );
  };

  const muteTrack = (trackId: number, toggle: boolean) => {
    tracksRef.current[trackId].isMuted = toggle;
  };
  useEffect(() => {
    // Initialize Tone.js Samplers and Sequence
    tracksRef.current = samples.map((sample, i) => {
      const id = i;
      const meter = new Tone.Meter({
        channelCount: 1,
        normalRange: true,
        smoothing: 0.95,
      });
      const sampler = new Tone.Sampler({
        urls: { [note]: sample.url },
      })
        .connect(meter)
        .toDestination();
      return { id, meter, sampler, isMuted: false, isSolo: false };
    });

    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.forEach((track) => {
          if (stepsRef.current[track.id]?.[step]?.checked && !track.isMuted) {
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

    setVolumes(
      tracksRef.current.map((trk, id) => ({
        id,
        volume: DbToLinear(trk.sampler.volume.value),
      }))
    );

    // Cleanup Tone.js resources on unmount
    return () => {
      seqRef.current?.dispose();
      tracksRef.current.forEach((track) => {
        track.sampler.dispose();
        track.meter.dispose();
      });
    };
  }, [samples, numOfSteps, note]);

  useEffect(() => {
    let animationId: number;

    const updateLevels = () => {
      setLevels(getLevels());
      animationId = requestAnimationFrame(updateLevels);
    };
    updateLevels();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <ToneContext.Provider
      value={{
        samples,
        numOfSteps,
        isPlaying,
        bpm,
        levels,
        volumes,
        updateVolume,
        transport: Tone.getTransport(),
        setBPM,
        play,
        stop,
        muteTrack,
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
