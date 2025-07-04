import { useLoaderData, useSubmit } from "react-router";
import { AvatarFallback, Avatar, AvatarImage } from "~/components/ui/avatar";
import { prisma } from "~/lib/prisma";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { getIconComponent } from "~/utils/icons";
import { ExternalLink } from "lucide-react";
import type { Route } from "./+types/user-profile";
import { incrementLinkClicks } from "~/utils/link.server";

interface User {
  id: string;
  name: string;
  linkUsername: string | null;
  image: string | null;
  bio: string | null;
}

interface Link {
  id: string;
  title: string;
  link: string;
  description: string | null;
  icon: string | null;
}

interface LoaderData {
  user: User | null;
  links: Link[];
}

export async function loader({ params }: LoaderFunctionArgs) {
  const username = params.linkUsername;

  if (!username) {
    return data<LoaderData>({ user: null, links: [] });
  }

  const user = await prisma.user.findUnique({
    where: {
      linkUsername: username
    },
    select: {
      id: true,
      name: true,
      linkUsername: true,
      image: true,
      bio: true
    }
  });

  if (!user) {
    return data<LoaderData>({ user: null, links: [] });
  }

  const links = await prisma.link.findMany({
    where: {
      userId: user.id,
      isActive: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return data<LoaderData>({ user, links });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const linkId = formData.get("linkId") as string;
  const url = formData.get("url") as string;

  if (!linkId) {
    return data({ success: false, message: "Link ID is required" });
  }

  await incrementLinkClicks(linkId);
  return data({ success: true, url });
}

export default function UserProfile() {
  const { user, links } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen w-full bg-white p-8">
        <h1 className="text-4xl font-light text-gray-900 mb-3">Profile not found</h1>
        <p className="text-gray-500 text-lg max-w-md text-center">
          The user you&apos;re looking for doesn&apos;t exist or may have changed their username.
        </p>
      </div>
    );
  }


  if (!user.linkUsername) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen w-full bg-white p-8">
        <h1 className="text-4xl font-light text-gray-900 mb-3">Profile unavailable</h1>
        <p className="text-gray-500 text-lg max-w-md text-center">
          This user hasn&apos;t completed their profile setup yet.
        </p>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((name: string) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLinkClick = (linkId: string, url: string) => {
    const formData = new FormData();
    formData.append("linkId", linkId);
    formData.append("url", url);

    submit(formData, { method: "post" });

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-white p-4 md:p-8">
      <div className="max-w-md w-full py-12">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <Avatar className="h-28 w-28 ring-2 ring-gray-100">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-2xl">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="space-y-2">
            <h1 className="text-2xl font-light text-gray-900">{user.name}</h1>
            <p className="text-gray-500 text-sm">@{user.linkUsername}</p>
          </div>

          {user.bio && (
            <p className="text-gray-600 max-w-xs text-base leading-relaxed">{user.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link: Link) => {
            const { icon: IconComponent, color } = getIconComponent(link.icon || "website");

            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.link)}
                className="flex items-center p-5 bg-white hover:bg-gray-50 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md w-full group text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mr-5 group-hover:scale-105 transition-transform">
                  <IconComponent className={`w-7 h-7 ${color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-light text-gray-900 text-lg">{link.title}</h3>
                  {link.description && (
                    <p className="text-gray-500 text-sm line-clamp-1 mt-1">{link.description}</p>
                  )}
                </div>

                <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors ml-2 opacity-0 group-hover:opacity-100" />
              </button>
            );
          })}

          {links.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg font-light">No links available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-300 pt-12">
          <p>Made with lynqr.me</p>
        </div>
      </div>
    </div>
  );
}
