import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import en from "./locales/en.json";
import es from "./locales/es.json";
import "./styles/global.scss";
import "./styles/reset-dark.scss";

const availableLocales = ["en", "es"];

const detectLocale = (): string => {
  const navLang = navigator.language || (navigator as any).userLanguage || "en";
  const baseLang = navLang.toLowerCase().split("-")[0];
  if (availableLocales.includes(baseLang)) return baseLang;
  return "en";
};

const i18n = createI18n({
  locale: detectLocale(),
  fallbackLocale: "en",
  messages: { en, es } as any,
});

createApp(App).use(i18n).mount("#movielytics");
