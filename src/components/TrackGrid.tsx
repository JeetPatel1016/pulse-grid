import LampRow from "./LampRow";
import useToneSequencer from "../hooks/useToneSequencer";
import { Sample } from "../types";

type TrackGridProps = {
  samples: Sample[];
  numOfSteps: number;
};

export default function TrackGrid({
  samples,
  numOfSteps,
}: TrackGridProps) {
  const trackIds = [...Array(samples.length).keys()] as const;
  const stepIds = [...Array(numOfSteps).keys()] as const;

  const {lampsRef, stepsRef} = useToneSequencer(samples, numOfSteps)

  return (
    <>
      <div className="grid">
        {samples.map((sample, index) => (
          <p key={index}>{sample.name}</p>
        ))}
      </div>
      <div className="grid">
        <div className="cellList">
          {trackIds.map((trackId) => (
            <div key={trackId} className="row">
              {stepIds.map((stepId) => {
                const ids = `${trackId}-${stepId}`;
                return (
                  <label key={ids} className="cell">
                    <input
                      id={ids}
                      ref={(elm) => {
                        if (!elm) return;
                        if (!stepsRef.current[trackId]) {
                          stepsRef.current[trackId] = [];
                        }
                        stepsRef.current[trackId][stepId] = elm;
                      }}
                      type="checkbox"
                      className="cell_input"
                    />
                    <div className="cell_content"></div>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
        <LampRow numOfSteps={numOfSteps} lampsRef={lampsRef} />
      </div>
    </>
  );
}
