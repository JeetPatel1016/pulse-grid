import { ChangeEventHandler } from "react";
import { useTone } from "../context/ToneContext";

export default function Tempo() {
  const { bpm, setBPM } = useTone();
  const handleBPMChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;
    let value = Number(target.value);
    if (value < 20) value = 20;
    if (value > 300) value = 300;
    setBPM(value);
  };
  return (
    <div className="flex items-center">
      <input
        type="number"
        className="tempo"
        defaultValue={bpm}
        value={bpm}
        onChange={handleBPMChange}
      />
      <p className="ml-3 text-lg">BPM</p>
    </div>
  );
}
