import { redirect, Outlet, Link, useLocation, useLoaderData, useNavigate } from "react-router";
import { prisma } from "~/lib/prisma";
import type { LoaderFunctionArgs } from "react-router";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { ChevronDown, Settings, MessageSquare, HelpCircle, LogOut, BarChart3, Home, LinkIcon, Palette, QrCode, Users } from "lucide-react";
import { Sidebar, SidebarProvider, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroupLabel, SidebarFooter, SidebarInset } from "~/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"
import { data } from "react-router";
import { authClient } from "~/lib/auth.client";
import { auth } from "~/lib/auth.server";

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
      id: true,
      name: true,
      email: true,
      hasUsername: true,
      linkUsername: true,
      image: true,
    }
  });

  if (!user) {
    throw redirect("/login");
  }

  if (!user.linkUsername || !user.hasUsername) {
    return redirect("/hub");
  }

  return data({ user });
}

const navigationItems = [
  {
    title: "Profile",
    to: "/profile",
    icon: Home,
  },
  {
    title: "Appearance",
    to: "/profile/appearance",
    icon: Palette,
  },
]

const toolsItems = [
  {
    title: "Link Shortener",
    to: "/link-shortener",
    icon: LinkIcon,
  },
  {
    title: "QR Code Generator",
    to: "/qr-generator",
    icon: QrCode,
  },
]

export default function ProfileLayout() {
  const location = useLocation();
  const navigate = useNavigate()
  const { user } = useLoaderData<typeof loader>();

  const initials = user.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    < SidebarProvider >
      <div className="flex h-screen bg-gray-50 w-full">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="p-4">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                lynqr.me
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="w-full justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              {user.image && <AvatarImage src={`${user.image}`} alt={user.name} />}
                              <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                          <ChevronDown className="w-4 h-4" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuItem>
                          <Settings className="w-4 h-4 mr-2" />
                          Account Settings
                        </DropdownMenuItem>
                        <Link to="/p/share-feedback">
                        <DropdownMenuItem>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Share Feedback
                        </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Help
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={async () => {
                          await authClient.signOut({
                            fetchOptions: {
                              onSuccess: () => {
                                navigate("/login")
                              }
                            }
                          })

                        }} className="text-red-600">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator />

            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.to
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.to}>
                            <item.icon className="w-4 h-4" />
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Tools</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {toolsItems.map((item) => {
                    const isActive = location.pathname === item.to
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.to}>
                            <item.icon className="w-4 h-4" />
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="text-xs text-gray-500 text-center">
              lynqr.me/{user.linkUsername}
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider >
  );
}

