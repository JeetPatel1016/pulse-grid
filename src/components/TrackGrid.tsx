import LampRow from "./LampRow";
import { useTone } from "../context/ToneContext";

export default function TrackGrid() {
  const { samples, stepsRef, numOfSteps } = useTone();
  const stepIds = [...Array(numOfSteps).keys()] as const;

  return (
    <>
      <div className="grid">
        {samples.map((sample, trackId) => (
          <p key={trackId} className="text-right">
            {sample.name}
          </p>
        ))}
      </div>
      <div id="tracks" className="grid">
        <div className="cellList">
          {samples.map((_, trackId) => (
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
        <LampRow />
      </div>
    </>
  );
}
