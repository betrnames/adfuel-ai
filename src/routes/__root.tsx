import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { DeskChat } from "@/components/desk-chat";
import { CookieBanner } from "@/components/cookie-banner";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "AdFuel.ai";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "AdFuel.ai — paste a product URL. Get 3 on-brand statics, copy, and a 7-day Launch plan. You go live. We don’t run ads.",
      },
      { name: "theme-color", content: "#050B14" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" className="dark antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-bg text-fg">
        <PreviewHostBridge />
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <SiteNav />
            <div className="flex-1">
              <Outlet />
            </div>
            <SiteFooter />
          </div>
          <Toaster theme="dark" position="bottom-center" richColors={false} />
          <DeskChat />
          <CookieBanner />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
