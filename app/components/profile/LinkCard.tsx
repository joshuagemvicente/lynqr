import { Card, CardContent } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { ExternalLink, Edit, Trash2, DotIcon as DragHandleDots2, BarChart3, MoreVertical, Copy, Eye } from "lucide-react"
import { Form, Link } from "react-router";
import { dataWithSuccess } from "remix-toast";
import { Skeleton } from "../ui/skeleton";

interface Link {
  id: string;
  title: string;
  link: string;
  url?: string;
  description?: string | null;
  icon?: string | null;
  clicks: { id: string }[];
  isActive: boolean;
  createdAt: string | Date;
}

interface LinkCardProps {
  links: Link[];
  getIconComponent: (iconName: string) => { icon: React.ElementType; color: string };
  loading?: boolean;
}

export function LinkCard({ links, getIconComponent, loading }: LinkCardProps) {
  const handleCopyLink = async (linkUrl: string) => {
      await navigator.clipboard.writeText(linkUrl);
      dataWithSuccess(null, "Link copied to clipboard!");
  }

  if (loading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-gray-300 opacity-75">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-14 h-14 rounded-2xl" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No links yet
        </h3>
        <p className="text-gray-500 mb-6">
          Get started by adding your first link
        </p>
        <NavLink to="add">
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Link
          </Button>
        </NavLink>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {links.map((link) => {
        const { icon: IconComponent, color } = getIconComponent(link.icon || "");
        const url = link.url || link.link;

        return (
          <Card
            key={link.id}
            className={`hover:shadow-lg transition-all duration-200 ${link.isActive ? "border-l-4 border-l-blue-500" : "border-l-4 border-l-gray-300 opacity-75"
              }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="cursor-grab">
                    <DragHandleDots2 className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="w-14 h-14 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
                    <IconComponent className={`w-7 h-7 ${color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-gray-900 text-lg truncate">{link.title}</h3>

                      <Form method="post">
                        <input type="hidden" name="linkId" value={link.id} />
                        <input type="hidden" name="intent" value="toggleStatus" />
                        <input type="hidden" name="status" value={(!link.isActive).toString()} />
                        <Switch
                          type="submit"
                          checked={link.isActive}
                          onClick={(e) => {
                            e.currentTarget.form?.requestSubmit();
                          }}
                        />
                      </Form>
                    </div>

                    <p className="text-gray-500 flex items-center mb-2">
                      <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{url}</span>
                    </p>

                    {link.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{link.description}</p>
                    )}

                    <div className="flex items-center space-x-6">
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        {typeof link.clicks === 'number' ? link.clicks : link.clicks?.length || 0} clicks
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Created {new Date(link.createdAt).toLocaleDateString()}
                      </span>
                      {!link.isActive ? (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          Inactive
                        </Badge>
                      ) :
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-10 w-10"
                    onClick={() => handleCopyLink(url)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-10 w-10">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/profile/${link.id}`} className="flex items-center cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Link
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/profile/analytics/${link.id}`} className="flex items-center cursor-pointer">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Analytics
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyLink(url)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />

                      <Form method="post">
                        <input type="hidden" name="linkId" value={link.id} />
                        <input type="hidden" name="intent" value="deleteLink" />
                        <button
                          type="submit"
                          className="text-red-600 flex w-full items-center px-2 py-1.5 text-sm hover:bg-red-50 rounded-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Link
                        </button>
                      </Form>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 
