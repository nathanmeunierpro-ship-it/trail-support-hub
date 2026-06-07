import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageShell({ children, padTop = true }: { children: ReactNode; padTop?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [canGoBack, setCanGoBack] = useState(
    typeof window !== "undefined" ? window.history.length > 1 : false
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.length > 1);
    }
  }, [pathname]);

  const showBack = pathname !== "/" && canGoBack;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className={`flex-1 ${padTop ? "pt-20" : ""}`}>
        {showBack && (
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.history.back();
              }
            }}
            className="inline-flex items-center gap-2 bg-transparent text-[#1A1A1A] text-sm font-semibold cursor-pointer px-6 py-4"
          >
            <span>←</span>
            Retour
          </button>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
