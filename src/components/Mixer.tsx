import { useTone } from "../context/ToneContext";

export default function Mixer() {
  const { tracksRef, levels, volumes, updateVolume } = useTone();
  return (
    <div className="flex flex-col gap-y-4 overflow-hidden">
      {[...Array(tracksRef.current.length).keys()].map((id) => (
        <div className="h-8 py-3">
          <div className="relative w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className=" bg-green-500 shadow-glow-2 h-full"
              style={{
                width: `${Math.round(levels[id].level * 100).toFixed(2)}%`,
              }}
            ></div>
            <input
              key={id}
              value={volumes[id].volume}
              onChange={(e) => {
                updateVolume(id, Number(e.currentTarget.value));
              }}
              type="range"
              min={0}
              max={1}
              step={0.01}
              className="top-0 absolute slider"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
