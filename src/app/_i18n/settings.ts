export const fallbackLng = "en";
export const languageCodes = [fallbackLng, "sv", "jp"];
const languageNames = ["English", "Svenska", "日本語"];
export const languages = languageNames.map((lng, i) => ({
  name: lng,
  code: languageCodes[i],
}));
export const defaultNS = "translation";
export const cookieName = "i18next";

export function getOptions(
  lng = fallbackLng,
  ns: string | string[] = defaultNS,
) {
  return {
    // debug: true,
    supportedLngs: languageCodes,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
