import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageShell({ children, padTop = true }: { children: ReactNode; padTop?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className={`flex-1 ${padTop ? "pt-20" : ""}`}>{children}</main>
      <Footer />
    </div>
  );
}
