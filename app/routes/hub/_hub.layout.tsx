
import { redirect, data, Outlet } from "react-router"
import { auth } from "~/lib/auth.server"
import { prisma } from "~/lib/prisma"
import type { Route } from "./+types/_hub.layout.tsx"


export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    throw redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      id: true,
      hasUsername: true,
      linkUsername: true
    }
  })

  if (!user) {
    throw redirect("/login")
  }

  if (user.linkUsername && user.hasUsername) {
    const url = new URL(request.url)
    if (url.pathname === "/hub") {
      return redirect("/profile")
    }
  }

  return data({ session, user })
}


export default function HubLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}
