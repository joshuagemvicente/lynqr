import { useNavigate } from "react-router"
import { Dialog } from "~/components/ui/dialog"
import { EditLinkForm } from "~/components/profile/EditLinkForm"
import type { Route } from "./+types"
import { prisma } from "~/lib/prisma"
import { auth } from "~/lib/auth.server"
import { parseWithZod } from "@conform-to/zod"
import { redirectWithSuccess, dataWithError } from "remix-toast"
import { UpdateLinkSchema } from "~/dtos/link/updateLink.dto"

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
      <EditLinkForm />
    </Dialog>
  )
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })
  const userId = session?.user.id

  if (!userId) {
    return { error: "You must be logged in to edit a link" }
  }

  const linkId = params.linkId

  if (!linkId) {
    return { error: "Link ID is required" }
  }

  const link = await prisma.link.findUnique({
    where: {
      id: linkId,
      userId
    },
    select: {
      id: true,
      title: true,
      link: true,
      description: true,
      icon: true,
      isActive: true
    }
  })

  if (!link) {
    return { error: "Link not found" }
  }

  return { link }
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData()
  
  
  const submission = parseWithZod(formData, { schema: UpdateLinkSchema })

  if (submission.status !== "success") {
    console.error("Validation error:", submission.error)
    return submission.reply()
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  })
  const userId = session?.user.id

  if (!userId) {
    return dataWithError(null, "You must be logged in to edit a link")
  }

  const linkId = params.linkId

  if (!linkId) {
    return dataWithError(null, "Link ID is required")
  }

  const existingLink = await prisma.link.findUnique({
    where: {
      id: linkId,
      userId
    }
  })

  if (!existingLink) {
    return dataWithError(null, "Link not found or you don't have permission to edit it")
  }

  const { title, link, description, icon } = submission.value

  const duplicateLink = await prisma.link.findFirst({
    where: {
      userId,
      link,
      id: { not: linkId }
    }
  })

  if (duplicateLink) {
    return dataWithError(null, "You already have another link with this URL")
  }

  await prisma.link.update({
    where: {
      id: linkId
    },
    data: {
      title,
      link,
      description,
      icon: icon || existingLink.icon
    }
  })

  return redirectWithSuccess("/profile", { message: "Link updated successfully" })
}
