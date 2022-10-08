import { Languages } from "../models/language";
import { FaSignInAlt } from "react-icons/fa";

export enum navItemRole {
  link = "link",
  list = "list"
}

const navItems = (language: Languages) => [
  {
    id: "01",
    icon: FaSignInAlt,
    role: navItemRole.list,
    title: language === Languages.ua ? "обмін" : language === Languages.ru ? "обмен" : "exchange",
    sublist: [
      {
        id: "01_01",
        title:
          language === Languages.ua
            ? "Продати біткоин"
            : language === Languages.ru
            ? "Продать биткоин"
            : "Sell bitcoin",
        url: `/${encodeURIComponent(language)}/btc-to-uah`
      },
      {
        id: "01_02",
        title:
          language === Languages.ua
            ? "Продати ефіріум"
            : language === Languages.ru
            ? "Продать эфириум"
            : "Sell ethereum",
        url: `/${encodeURIComponent(language)}/eth-to-uah`
      },
      {
        id: "01_03",
        title:
          language === Languages.ua
            ? "Продати USDT"
            : language === Languages.ru
            ? "Продать USDT"
            : "Sell USDT",
        url: `/${encodeURIComponent(language)}/usdt-to-uah`
      },
      {
        id: "01_04",
        title:
          language === Languages.ua
            ? "Обміняти біткоин на ефіріум"
            : language === Languages.ru
            ? "Обменять биткоин на эфириум"
            : "Exchange bitcoin to ethereum",
        url: `/${encodeURIComponent(language)}/btc-to-eth`
      },
      {
        id: "01_05",
        title:
          language === Languages.ua
            ? "Обміняти біткоин на USDT"
            : language === Languages.ru
            ? "Обменять биткоин на USDT"
            : "Exchange bitcoin to USDT",
        url: `/${encodeURIComponent(language)}/btc-to-usdt`
      }
    ]
  },
  {
    id: "02",
    icon: FaSignInAlt,
    role: navItemRole.link,
    title: language === Languages.ua ? "про нас" : language === Languages.ru ? "о нас" : "about us",
    url: `/${encodeURIComponent(language)}/about-us`
  },
  {
    id: "03",
    icon: FaSignInAlt,
    role: navItemRole.link,
    title: language === Languages.ua ? "новини" : language === Languages.ru ? "новости" : "news",
    url: `/${encodeURIComponent(language)}/news`
  },
  {
    id: "04",
    icon: FaSignInAlt,
    role: navItemRole.link,
    title:
      language === Languages.ua ? "контакти" : language === Languages.ru ? "контакты" : "contacts",
    url: `/${encodeURIComponent(language)}/contacts`
  }
];

export default navItems;
