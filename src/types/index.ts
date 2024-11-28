import { Meter, Sampler } from "tone";

export type Sample = {
  name: string;
  url: string;
};

export type Track = {
  id: number;
  sampler: Sampler;
  meter: Meter;
};

export type Level = {
  id: number;
  level: number;
};
export type VolumeLevel = {
  id: number;
  volume: number;
};
