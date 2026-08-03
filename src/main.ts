import App from "@/App.vue";
import i18n from "@/i18n";
import "@/styles/global.scss";
import "@/styles/reset-dark.scss";
import { createApp } from "vue";

createApp(App).use(i18n).mount("#movielytics");
