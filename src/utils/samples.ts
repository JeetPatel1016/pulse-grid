import { Sample } from "../types";

export function buildAssetPublicURL(url: string) {
  const baseURL = import.meta.env.BASE_URL;
  if (url.startsWith("./")) return baseURL + "/" + url.slice(2);
  if (url.startsWith("/")) return baseURL + "/" + url.slice(1);
  return baseURL + "/" + url;
}

export const samples: Sample[] = [
  {
    url: buildAssetPublicURL("kick.wav"),
    name: "Kick",
  },
  {
    url: buildAssetPublicURL("snare.wav"),
    name: "Snare",
  },
  {
    url: buildAssetPublicURL("hat-closed.wav"),
    name: "Closed Hat",
  },
  {
    url: buildAssetPublicURL("hat-open.wav"),
    name: "Open Hat",
  },
];
