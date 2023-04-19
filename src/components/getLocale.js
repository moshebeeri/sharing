import { enUS } from "date-fns/locale";
import * as locales from "date-fns/locale";

export const getLocale = () => {
  const browserLocale = navigator.language || "en-US";
  const localeCode = browserLocale.split("-")[0];
  const dateFnsLocale = Object.values(locales).find(
    (locale) => locale.code === localeCode
  );

  return dateFnsLocale || enUS;
};
