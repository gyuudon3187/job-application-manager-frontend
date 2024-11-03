"use client";
import { createContext, ReactNode, useContext } from "react";

const LngContext = createContext<string | null>(null);

export function LngProvider({
  lng,
  children,
}: Readonly<{ lng: string; children: ReactNode }>) {
  return <LngContext.Provider value={lng}>{children}</LngContext.Provider>;
}

export function useLng() {
  const context = useContext(LngContext);
  if (context === null) {
    throw new Error("useLng must be used within an LngProvider");
  }
  return context;
}
