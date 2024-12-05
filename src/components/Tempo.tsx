import { ChangeEventHandler, useState } from "react";
import { useTone } from "../context/ToneContext";

export default function Tempo() {
  const { bpm, setBPM } = useTone();
  const [stateBPM, setStateBPM] = useState(bpm.toString());
  const handleBPMChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;
    let value = Number(target.value);
    if (value < 20) value = 20;
    if (value > 300) value = 300;
    setBPM(value);
    setStateBPM(value.toString());
  };
  return (
    <div className="flex items-center">
      <input
        type="number"
        className="tempo"
        value={stateBPM}
        onChange={(e) => {
          setStateBPM(e.currentTarget.value);
        }}
        onBlur={handleBPMChange}
      />
      <p className="ml-3 text-lg">BPM</p>
    </div>
  );
}
