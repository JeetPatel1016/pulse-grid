import { FaPause, FaPlay } from "react-icons/fa6";
import { RxMixerHorizontal } from "react-icons/rx";
import Tempo from "./Tempo";

type ControlsProps = {
  isPlaying: boolean;
  onPlayPauseClick: () => void;
  tempo: number;
  onTempoChange: (tempo: number) => void;
  isMixerOpen: boolean;
  toggleMixer: () => void;
};

export default function Controls({
  isPlaying,
  onPlayPauseClick,
  tempo,
  onTempoChange,
  isMixerOpen,
  toggleMixer,
}: ControlsProps) {
  return (
    <div className="controls">
      <button className="mr-4 play" onClick={onPlayPauseClick}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <Tempo tempo={tempo} setTempo={onTempoChange} />
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
