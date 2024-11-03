import { ReactNode } from "react";
import { LngProvider } from "./LngContext";
import ReactQueryProvider from "./ReactQueryProvider";
import ThemeProvider from "../ThemeProvider";

export default function Providers({
  lng,
  children,
}: Readonly<{ lng: string; children: ReactNode }>) {
  return (
    <ReactQueryProvider>
      <LngProvider lng={lng}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </LngProvider>
    </ReactQueryProvider>
  );
}
