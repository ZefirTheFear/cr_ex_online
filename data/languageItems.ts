import { Language } from "../models/language";

import uaFlag from "../assets/flags/ua-flag.png";
import ukFlag from "../assets/flags/uk-flag.png";
import ruFlag from "../assets/flags/rus-flag.png";

export const languages: Language[] = [
  {
    name: "ua",
    img: uaFlag
  },
  {
    name: "en",
    img: ukFlag
  },
  {
    name: "ru",
    img: ruFlag
  }
];
