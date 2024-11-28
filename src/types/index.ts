import { Sampler } from "tone";

export type Sample = {
  name: string;
  url: string;
};

export type Track = {
  id: number;
  sampler: Sampler;
};
