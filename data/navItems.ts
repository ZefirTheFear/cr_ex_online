const navItems = (language: "ua" | "ru" | "en") => [
  {
    id: "1",
    title: language === "ua" ? "обмін" : language === "ru" ? "обмен" : "exchange"
  },
  {
    id: "2",
    title: language === "ua" ? "про нас" : language === "ru" ? "о нас" : "about us"
  },
  {
    id: "3",
    title: language === "ua" ? "новини" : language === "ru" ? "новости" : "news"
  },
  {
    id: "4",
    title: language === "ua" ? "контакти" : language === "ru" ? "контакты" : "contacts"
  }
];

export default navItems;
