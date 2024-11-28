import React from "react";

type LampRowProps = {
  numOfSteps: number;
  lampsRef: React.MutableRefObject<HTMLDivElement[]>;
};

export default function LampRow({ numOfSteps, lampsRef }: LampRowProps) {
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
