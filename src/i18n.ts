import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import fa from "./locales/fa/translation.json";

const resources = {
  en: {
    translation: en,
    dir: "ltr",
  },
  fa: {
    translation: fa,
    dir: "rtl",
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const updateDirection = (lng: keyof typeof resources) => {
  document.documentElement.dir = resources[lng].dir;
  document.documentElement.lang = lng;

  document.documentElement.classList.toggle("font-fa", lng === "fa");
  document.documentElement.classList.toggle("font-en", lng === "en");
};

updateDirection(i18n.language as keyof typeof resources);
i18n.on("languageChanged", (lng) => {
  updateDirection(lng as keyof typeof resources);
});

export default i18n;
