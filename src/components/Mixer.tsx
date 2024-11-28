type MixerProps = {
  numTracks: number;
};

export default function Mixer({ numTracks }: MixerProps) {
  return (
    <div className="grid overflow-hidden">
      {[...Array(numTracks).keys()].map((id) => (
        <input key={id} type="range" className="slider" />
      ))}
    </div>
  );
}
