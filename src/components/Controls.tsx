import { FaPause, FaPlay } from "react-icons/fa6";
import { RxMixerHorizontal } from "react-icons/rx";
import Tempo from "./Tempo";
import { useTone } from "../context/ToneContext";

type ControlsProps = {
  isMixerOpen: boolean;
  toggleMixer: () => void;
};

export default function Controls({ isMixerOpen, toggleMixer }: ControlsProps) {
  const { isPlaying, play, stop, transport } = useTone();

  const handlePlayPauseClick = () => {
    if (transport.state === "started") {
      stop();
    } else {
      play();
    }
  };
  return (
    <div className="controls">
      <button className="mr-4 play" onClick={handlePlayPauseClick}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <Tempo />
      <div className="seperater-vertical"></div>
      <button
        onClick={toggleMixer}
        className={`mixer ${isMixerOpen ? "!bg-teal-500/90" : ""}`}
      >
        <RxMixerHorizontal />
      </button>
    </div>
  );
}
