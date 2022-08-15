import { StaticImageData } from "next/image";

export enum Languages {
  ua = "ua",
  en = "en",
  ru = "ru"
}

export interface Language {
  name: Languages;
  img: StaticImageData;
}
