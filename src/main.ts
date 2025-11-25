import App from "@/App.vue";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import "@/styles/global.scss";
import "@/styles/reset-dark.scss";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

const availableLocales = ["en", "es"];
const fallbackLocale = "en";

const detectLocale = (): string => {
  const navLang = navigator.language || (navigator as any).userLanguage || fallbackLocale;
  const lang = navLang.toLowerCase().split("-")[0] as string;
  return availableLocales.includes(lang) ? lang : fallbackLocale;
};

const i18n = createI18n({
  locale: detectLocale(),
  fallbackLocale: fallbackLocale,
  messages: { en, es } as any,
});

createApp(App).use(i18n).mount("#movielytics");
