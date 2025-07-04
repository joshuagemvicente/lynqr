import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { NotFound } from "./components/errors/404";

import type { Route } from "./+types/root";
import { useEffect } from "react";
import { getToast } from "remix-toast"
import { Toaster, toast as notify } from "sonner"
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);
  return data({ toast }, { headers });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { toast } = useLoaderData<typeof loader>();
  useEffect(() => {
    if (toast?.type === "error") {
      notify.error(toast.message);
    }
    if (toast?.type === "success") {
      notify.success(toast.message);
    }
  }, [toast]);


  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <meta property="og:title" content="Lynqr - Your Digital Connection Hub" />
        <meta property="og:description" content="Create your personalized link-in-bio and QR codes for seamless sharing." />
        <meta property="og:image" content="https://lynqr.me/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lynqr - Your Digital Connection Hub" />
        <meta name="twitter:description" content="Create your personalized link-in-bio and QR codes for seamless sharing." />
        <meta name="twitter:image" content="https://lynqr.me/og-image.jpg" />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <NotFound />
      default:
        message = `Error ${error.status}`;
        details = error.statusText || details;
    }
    // message = error.status === 404 ? "404" : "Error";
    // details =
    //   error.status === 404
    //     ? "The requested page could not be found."
    //     : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
