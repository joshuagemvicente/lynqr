import type { Route } from "./+types/_auth.layout"
import { Outlet } from "react-router";
import { prisma } from "~/lib/prisma";
import { auth } from "~/lib/auth.server";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        linkUsername: true
      }
    });

    if (user) {
      if (user.linkUsername) {
        return redirect("/profile");
      } else {
        return redirect("/hub");
      }
    }
  }

  return null;
}

export default function AuthLayout() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Outlet />
      </div>
    </main>)
}
