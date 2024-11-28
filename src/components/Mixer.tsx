import { useTone } from "../context/ToneContext";

export default function Mixer() {
  const { tracksRef } = useTone();

  return (
    <div className="grid overflow-hidden">
      {[...Array(tracksRef.current.length).keys()].map((id) => (
        <input key={id} type="range" className="slider" />
      ))}
    </div>
  );
}
