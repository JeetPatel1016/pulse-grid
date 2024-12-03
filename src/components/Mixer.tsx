import { ChangeEventHandler } from "react";
import { useTone } from "../context/ToneContext";

export default function Mixer() {
  const { tracksRef, levels, volumes, updateVolume, muteTrack, soloTrack } =
    useTone();
  const handleMute: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;
    const { value: trackId, checked } = target;
    muteTrack(Number(trackId), checked);
  };
  const handleSolo: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;
    const { value: trackId, checked } = target;
    soloTrack(Number(trackId), checked);
  };
  return (
    <div className="flex flex-col gap-y-4 overflow-hidden">
      {tracksRef.current.map((track, index) => (
        <div key={`track-${index}`} className="h-8 overflow-hidden">
          <div className="relative w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className=" bg-green-500 shadow-glow-2 h-full"
              style={{
                width: `${Math.round(levels[track.id].level * 100).toFixed(
                  2
                )}%`,
              }}
            ></div>
            <input
              value={volumes[track.id].volume}
              onChange={(e) => {
                updateVolume(track.id, Number(e.currentTarget.value));
              }}
              type="range"
              min={0}
              max={1}
              step={0.01}
              className="top-0 absolute slider"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <label className="mixer_btn">
              <input
                value={track.id}
                className="mixer_btn_input"
                type="checkbox"
                checked={track.isMuted}
                onChange={handleMute}
              />
              <span className="mixer_btn_content mute">M</span>
            </label>
            <label className="mixer_btn">
              <input
                value={track.id}
                className="mixer_btn_input"
                onChange={handleSolo}
                checked={track.isSolo}
                type="checkbox"
              />
              <span className="mixer_btn_content solo">S</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
