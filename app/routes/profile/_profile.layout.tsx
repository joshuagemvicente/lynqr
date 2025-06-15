import { redirect, Outlet } from "react-router";
import { auth } from "~/lib/auth.server";
import { prisma } from "~/lib/prisma";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    throw redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      hasUsername: true,
      linkUsername: true
    }
  });

  if (!user) {
    throw redirect("/login");
  }

  // If user doesn't have a username or hasUsername is false, redirect to hub
  if (!user.linkUsername || !user.hasUsername) {
    return redirect("/hub");
  }

  return null;
}

export default function ProfileLayout() {
  return (
    <main>
      <Outlet />
    </main>
  );
} 