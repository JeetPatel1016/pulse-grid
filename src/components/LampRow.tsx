import { useTone } from "../context/ToneContext";

export default function LampRow() {
  const { numOfSteps, lampsRef } = useTone();
  const stepIds = [...Array(numOfSteps).keys()] as const;

  return (
    <div className="row">
      {stepIds.map((stepId) => (
        <div
          ref={(elm) => {
            if (!elm) return;
            lampsRef.current[stepId] = elm;
          }}
          key={stepId}
          className="lamp"
        ></div>
      ))}
    </div>
  );
}
