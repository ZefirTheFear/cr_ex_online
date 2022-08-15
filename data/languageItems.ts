import { Language, Languages } from "../models/language";

import uaFlag from "../assets/flags/ua-flag.png";
import ukFlag from "../assets/flags/uk-flag.png";
import ruFlag from "../assets/flags/rus-flag.png";

export const languages: Language[] = [
  {
    name: Languages.ua,
    img: uaFlag
  },
  {
    name: Languages.en,
    img: ukFlag
  },
  {
    name: Languages.ru,
    img: ruFlag
  }
];
