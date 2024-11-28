import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

type Track = {
  id: number;
  sampler: Tone.Sampler;
};

type Sample = {
  name: string;
  url: string;
};

export default function useToneSequencer(
  samples: Sample[],
  numOfSteps: number
) {
  const stepIds = [...Array(numOfSteps).keys()] as const;

  const tracksRef = useRef<Track[]>([]);
  const stepsRef = useRef<HTMLInputElement[][]>([[]]);
  const lampsRef = useRef<HTMLDivElement[]>([]);
  const seqRef = useRef<Tone.Sequence | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartClick = async () => {
    const transport = Tone.getTransport();
    if (transport.state === "started") {
      transport.stop();
      lampsRef.current.forEach((elm) => elm.classList.remove("active"));
      setIsPlaying(false);
    } else {
      await Tone.start();
      transport.start();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    tracksRef.current = samples.map((sample, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: { C2: sample.url },
      }).toDestination(),
    }));
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.forEach((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack("C2", time);
          }
        });
        lampsRef.current.forEach((lamp, index) => {
          if (index === step) lamp.classList.add("active");
          else lamp.classList.remove("active");
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

  return { isPlaying, handleStartClick, lampsRef, stepsRef, tracksRef, seqRef };
}
