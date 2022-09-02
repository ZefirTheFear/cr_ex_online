import { Languages } from "../models/language";

export enum navItemRole {
  link = "link",
  list = "list"
}

const navItems = (language: Languages) => [
  {
    id: "1",
    role: navItemRole.list,
    title: language === Languages.ua ? "обмін" : language === Languages.ru ? "обмен" : "exchange",
    // url: "",
    sublist: [
      {
        id: "1",
        title:
          language === Languages.ua
            ? "Продати біткоин"
            : language === Languages.ru
            ? "Продать биткоин"
            : "Sell bitcoin",
        url: `/${encodeURIComponent(language)}/btc-to-uah`
      },
      {
        id: "2",
        title:
          language === Languages.ua
            ? "Продати ефіріум"
            : language === Languages.ru
            ? "Продать эфириум"
            : "Sell ethereum",
        url: `/${encodeURIComponent(language)}/eth-to-uah`
      },
      {
        id: "3",
        title:
          language === Languages.ua
            ? "Продати USDT"
            : language === Languages.ru
            ? "Продать USDT"
            : "Sell USDT",
        url: `/${encodeURIComponent(language)}/usdt-to-uah`
      },
      {
        id: "4",
        title:
          language === Languages.ua
            ? "Обміняти біткоин на ефіріум"
            : language === Languages.ru
            ? "Обменять биткоин на эфириум"
            : "Exchange bitcoin to ethereum",
        url: `/${encodeURIComponent(language)}/btc-to-eth`
      },
      {
        id: "5",
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
    id: "2",
    role: navItemRole.link,
    title: language === Languages.ua ? "про нас" : language === Languages.ru ? "о нас" : "about us",
    url: `/${encodeURIComponent(language)}/about-us`
  },
  {
    id: "3",
    role: navItemRole.link,
    title: language === Languages.ua ? "новини" : language === Languages.ru ? "новости" : "news",
    url: `/${encodeURIComponent(language)}/news`
  },
  {
    id: "4",
    role: navItemRole.link,
    title:
      language === Languages.ua ? "контакти" : language === Languages.ru ? "контакты" : "contacts",
    url: `/${encodeURIComponent(language)}/contacts`
  }
];

export default navItems;
