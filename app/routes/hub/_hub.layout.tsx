
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
    }
  })

  if (!user) {
    throw redirect("/login")
  }


  return data({ session })
}


export default function HubLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}
