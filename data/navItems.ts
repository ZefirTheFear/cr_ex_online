import { Languages } from "../models/language";

const navItems = (language: Languages) => [
  {
    id: "1",
    title: language === Languages.ua ? "обмін" : language === Languages.ru ? "обмен" : "exchange"
  },
  {
    id: "2",
    title: language === Languages.ua ? "про нас" : language === Languages.ru ? "о нас" : "about us"
  },
  {
    id: "3",
    title: language === Languages.ua ? "новини" : language === Languages.ru ? "новости" : "news"
  },
  {
    id: "4",
    title:
      language === Languages.ua ? "контакти" : language === Languages.ru ? "контакты" : "contacts"
  }
];

export default navItems;
