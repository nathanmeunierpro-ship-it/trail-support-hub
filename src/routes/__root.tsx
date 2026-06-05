import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "../lib/auth-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <div className="text-7xl mb-4">🏃</div>
        <h1 className="font-display text-5xl font-black text-primary mb-3">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-2">Cette page n'existe pas</h2>
        <p className="text-muted-foreground mb-8">Tu t'es perdu sur le parcours ?</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground uppercase tracking-wider transition-opacity hover:opacity-90"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ravito — Bénévoles pour événements sportifs en France" },
      { name: "description", content: "Ravito met en relation les bénévoles passionnés et les organisateurs de trails, courses, triathlons et cyclosportives partout en France." },
      { property: "og:site_name", content: "Ravito" },
      { property: "og:title", content: "Ravito — Bénévoles pour événements sportifs en France" },
      { property: "og:description", content: "Ravito met en relation les bénévoles passionnés et les organisateurs de trails, courses, triathlons et cyclosportives partout en France." },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#73CC30" },
      { name: "twitter:title", content: "Ravito — Bénévoles pour événements sportifs en France" },
      { name: "twitter:description", content: "Ravito met en relation les bénévoles passionnés et les organisateurs de trails, courses, triathlons et cyclosportives partout en France." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/46d39bde-3e5b-4e84-b7b2-5019208d9277/id-preview-8cc159d1--d3840ef0-e7ad-4e96-99fa-709028584747.lovable.app-1780580437975.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/46d39bde-3e5b-4e84-b7b2-5019208d9277/id-preview-8cc159d1--d3840ef0-e7ad-4e96-99fa-709028584747.lovable.app-1780580437975.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&family=Pacifico&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
