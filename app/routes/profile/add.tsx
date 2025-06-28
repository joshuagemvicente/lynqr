import { parseWithZod } from "@conform-to/zod"
import type { Route } from "./+types/add"
import { AddNewLinkForm } from "~/components/profile/AddNewLinkForm"
import { Dialog } from "~/components/ui/dialog"
import { CreateLinkSchema } from "~/dtos/link/createLink.dto"
import { useNavigate } from "react-router"
import { prisma } from "~/lib/prisma"
import { auth } from "~/lib/auth.server"
import { dataWithError, redirectWithSuccess } from "remix-toast"

export default () => {
  const navigate = useNavigate()

  return (
    <Dialog
      modal
      defaultOpen={true}
      onOpenChange={(open) =>
        !open && navigate("/profile")
      }
    >
      <AddNewLinkForm />
    </Dialog>
  )

}


export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: CreateLinkSchema })

  if (submission.status !== "success") {
    return submission.reply()
  }

  const { title, icon, link, description } = submission.value

  const session = await auth.api.getSession({
    headers: request.headers,
  })
  const userId = session?.user.id

  if (!userId) {
    return dataWithError(null, "You must be logged in to create a link")
  }

  const existingLink = await prisma.link.findFirst({
    where: {
      userId,
      link
    }
  })

  if (existingLink) {
    return dataWithError(null, "You already have a link with this URL")
  }

  await prisma.link.create({
    data: {
      title,
      link,
      description,
      icon,
      userId
    }
  })

  return redirectWithSuccess("/profile", { message: "Link added successfully" })
}
