import { createContext, useContext, type ReactNode } from "react";

export type Locale = "en" | "zh-CN";

const EntranceLocaleContext = createContext<Locale>("en");

export function EntranceLocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <EntranceLocaleContext.Provider value={locale}>
      {children}
    </EntranceLocaleContext.Provider>
  );
}

export function useEntranceLocale() {
  return useContext(EntranceLocaleContext);
}
