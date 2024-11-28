import { MouseEventHandler, useEffect, useRef, useState } from "react";
import "./App.css";
import * as Tone from "tone";
import Tempo from "./components/Tempo";
import { FaPause, FaPlay } from "react-icons/fa6";
import { RxMixerHorizontal } from "react-icons/rx";

type Track = {
  id: number;
  sampler: Tone.Sampler;
};

type Props = {
  samples: { url: string; name: string }[];
  numOfSteps: number;
};

const NOTE = "C2";

export default function App({ samples, numOfSteps }: Props) {
  const trackIds = [...Array(samples.length).keys()] as const;
  const stepIds = [...Array(numOfSteps).keys()] as const;

  const tracksRef = useRef<Track[]>([]);
  const stepsRef = useRef<HTMLInputElement[][]>([[]]);
  const lampsRef = useRef<HTMLDivElement[]>([]);
  const seqRef = useRef<Tone.Sequence | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState<number>(Tone.getTransport().bpm.value);

  const [isMixerOpen, setIsMixerOpen] = useState(false);

  const handleTempoChange = (newValue: number) => {
    // bounds for Tempo
    if (newValue < 20) newValue = 20;
    if (newValue > 300) newValue = 300;

    setTempo(newValue);
    Tone.getTransport().bpm.value = newValue;
  };

  const handleStartClick: MouseEventHandler = async () => {
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
        <div className="grid">
          {samples.map((sample, index) => (
            <p key={index}>{sample.name}</p>
          ))}
        </div>
        <div className="grid">
          <div className="cellList">
            {trackIds.map((trackId) => (
              <div key={trackId} className="row">
                {stepIds.map((stepId) => {
                  const ids = trackId + "-" + stepId;
                  return (
                    <label key={ids} className="cell">
                      <input
                        id={ids}
                        ref={(elm) => {
                          if (!elm) return;
                          if (!stepsRef.current[trackId]) {
                            stepsRef.current[trackId] = [];
                          }
                          stepsRef.current[trackId][stepId] = elm;
                        }}
                        type="checkbox"
                        className="cell_input"
                      />
                      <div className="cell_content"></div>
                    </label>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="row">
            {stepIds.map((stepId) => (
              <div
                ref={(elm) => {
                  if (!elm) return;
                  lampsRef.current[stepId] = elm;
                }}
                key={stepId}
                className={`lamp`}
              ></div>
            ))}
          </div>
        </div>

        {isMixerOpen && (
          <div className={`grid overflow-hidden`}>
            {trackIds.map((id, index) => (
              <input key={index} type="range" className="slider" />
              // <p key={index}>This is a very long text id number {id}</p>
            ))}
          </div>
        )}
      </div>
      <div className="controls">
        <button className="mr-4 play" onClick={handleStartClick}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <Tempo tempo={tempo} setTempo={handleTempoChange} />
        <div className="seperater-vertical"></div>
        <button
          onClick={() => {
            setIsMixerOpen((state) => !state);
          }}
          className={`mixer ${isMixerOpen ? "!bg-teal-500/90" : ""}`}
        >
          <RxMixerHorizontal />
        </button>
      </div>
    </>
  );
}
