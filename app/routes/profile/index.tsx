import { prisma } from "~/lib/prisma"
import type { Route } from "./+types/index";
import { Link as NavLink, Outlet, useLoaderData, useNavigate } from "react-router"
import { Eye, Share, Search, Filter, Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useState } from "react"
import { StatsCard } from "~/components/profile/StatsCard"
import { LinkCard } from "~/components/profile/LinkCard"
import { auth } from "~/lib/auth.server";
import { deleteLinkById, getLinksByUserId, updateLinkStatus } from "~/utils/link.server";
import { getIconComponent } from "~/utils/icons";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })
  const userId = session?.user.id

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      linkUsername: true,
      Link: {
        select: {
          clicks: true,
          isActive: true,
        },
      },
    }
  })

  const totalLinks = user?.Link?.length ?? 0;
  const totalActiveLinks = user?.Link?.filter((x) => x.isActive).length ?? 0;
  const totalClicks = user?.Link?.reduce((sum, link) => sum + link.clicks.length, 0) ?? 0;

  return {
    linkList: await getLinksByUserId(userId || ""),
    data: {
      linkUsername: user?.linkUsername ?? "",
      totalLinks,
      totalActiveLinks,
      totalClicks
    }
  }
}

export default function Profile() {
  const { data, linkList } = useLoaderData<typeof loader>()

  const [searchQuery, setSearchQuery] = useState("")

  const filteredLinks = searchQuery
    ? linkList.filter(link =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.link.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : linkList;
  return (
    <div className="p-8 w-full space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage your links and customize your digital presence</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="lg" className="h-12">
            <Eye className="w-5 h-5 mr-2" />
            Preview Profile
          </Button>
          <Button variant="outline" size="lg" className="h-12">
            <Share className="w-5 h-5 mr-2" />
            Share Profile
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCard {...data} />

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" className="h-12">
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </Button>

          <NavLink to="add">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-12"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Link
            </Button>
          </NavLink>
        </div>
      </div>

      <div className="space-y-6">

        {filteredLinks.length > 0 ? (<LinkCard links={filteredLinks} getIconComponent={getIconComponent} />) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No links found" : "No links yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? "Try adjusting your search terms" : "Get started by adding your first link"}
            </p>
            {!searchQuery && (
              <NavLink to="add">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Link
                </Button>
              </NavLink>
            )}
          </div>
        )}
      </div>
      <section>
        <Outlet />
      </section>
    </div>
  )
}


export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const linkId = formData.get("linkId") as string;
  const intent = formData.get("intent") as string;

  if (!linkId) {
    return { error: "Link ID is required" };
  }

  try {
    switch (intent) {
      case "deleteLink":
        await deleteLinkById(linkId);
        return { success: true };

      case "toggleStatus":
        const status = formData.get("status") === "true";
        await updateLinkStatus(linkId, status);
        return { success: true };

      default:
        return { error: "Invalid action" };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
}
