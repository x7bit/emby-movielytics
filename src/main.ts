import App from "@/App.vue";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import "@/styles/global.scss";
import "@/styles/reset-dark.scss";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

const detectLocale = (availableLocales: string[], defaultLocale: string): string => {
  const navLang = navigator.language || (navigator as any).userLanguage || defaultLocale;
  const lang = navLang.toLowerCase().split("-")[0] as string;
  return availableLocales.includes(lang) ? lang : defaultLocale;
};

const availableLocales = ["en", "es"];
const fallbackLocale = "en";
const locale = detectLocale(availableLocales, fallbackLocale);

if (locale !== fallbackLocale) {
  document.documentElement.lang = locale;
}

const messages: any = { en, es };
const legacy = false;
const i18n = createI18n({ locale, fallbackLocale, messages, legacy });

createApp(App).use(i18n).mount("#movielytics");
