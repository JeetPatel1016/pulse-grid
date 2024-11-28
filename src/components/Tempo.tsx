import { MouseEventHandler, useCallback, useEffect, useState } from "react";

type Props = {
  tempo: number;
  setTempo: (value: number) => void;
};

export default function Tempo({ tempo, setTempo }: Props) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [snapshot, setSnapshot] = useState<number>(0);

  const onStart = useCallback<MouseEventHandler>((event) => {
    setIsDragging(true);
    setSnapshot(event.clientY);
  }, []);

  useEffect(() => {
    const onUpdate = (event: MouseEvent) => {
      if (isDragging) {
        const offset = snapshot - event.clientY;
        setTempo(tempo + offset * 0.05);
      }
    };
    const onEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", onUpdate);
      document.addEventListener("mouseup", onEnd);
    }
    return () => {
      document.removeEventListener("mousemove", onUpdate);
      document.removeEventListener("mouseup", onEnd);
    };
  }, [isDragging, tempo, setTempo, snapshot]);

  return (
    <div className="flex items-center">
    <span onMouseDown={onStart} className="tempo">
      {Math.round(tempo)}
    </span>
    <p className="ml-3 text-lg">BPM</p>
    </div>
  );
}
