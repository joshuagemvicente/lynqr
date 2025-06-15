import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "~/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select"
import { Eye, Share, Search, Filter, Copy, Plus, ExternalLink, Edit, Trash2, BookOpen, Camera, Gamepad2, Globe, Heart, Instagram, Mail, DotIcon as DragHandleDots2, Music, Phone, ShoppingBag, Star, Twitter, Youtube, Zap, BarChart3, MoreVertical, TrendingUp, Upload } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Card, CardContent } from "~/components/ui/card"
import { DialogHeader } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import { useState } from "react"
import { Switch } from "@radix-ui/react-switch"
import { Textarea } from "~/components/ui/textarea"
import { StatsCard } from "~/components/profile/StatsCard"

const iconOptions = [
  { value: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-600" },
  { value: "twitter", label: "Twitter", icon: Twitter, color: "text-blue-500" },
  { value: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600" },
  { value: "website", label: "Website", icon: Globe, color: "text-gray-600" },
  { value: "email", label: "Email", icon: Mail, color: "text-blue-600" },
  { value: "phone", label: "Phone", icon: Phone, color: "text-green-600" },
  { value: "camera", label: "Photography", icon: Camera, color: "text-purple-600" },
  { value: "music", label: "Music", icon: Music, color: "text-green-500" },
  { value: "shop", label: "Shop", icon: ShoppingBag, color: "text-orange-600" },
  { value: "blog", label: "Blog", icon: BookOpen, color: "text-indigo-600" },
  { value: "gaming", label: "Gaming", icon: Gamepad2, color: "text-purple-500" },
  { value: "heart", label: "Favorite", icon: Heart, color: "text-red-500" },
  { value: "star", label: "Featured", icon: Star, color: "text-yellow-500" },
  { value: "zap", label: "Quick Link", icon: Zap, color: "text-yellow-600" },
]

interface Link {
  id: string
  title: string
  url: string
  description?: string
  icon: string
  clicks: number
  isActive: boolean
  createdAt: string
}

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([
    {
      id: "1",
      title: "My Photography Portfolio",
      url: "https://portfolio.example.com",
      description: "Check out my latest photography work and projects",
      icon: "camera",
      clicks: 245,
      isActive: true,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Instagram Profile",
      url: "https://instagram.com/johndoe",
      description: "Follow me for daily updates and behind-the-scenes content",
      icon: "instagram",
      clicks: 189,
      isActive: true,
      createdAt: "2024-01-14",
    },
    {
      id: "3",
      title: "Latest Blog Post",
      url: "https://blog.example.com/latest",
      description: "My thoughts on modern web development trends",
      icon: "blog",
      clicks: 67,
      isActive: true,
      createdAt: "2024-01-13",
    },
    {
      id: "4",
      title: "YouTube Channel",
      url: "https://youtube.com/johndoe",
      description: "Subscribe for weekly tech tutorials and reviews",
      icon: "youtube",
      clicks: 156,
      isActive: false,
      createdAt: "2024-01-12",
    },
  ])

  const [isAddingLink, setIsAddingLink] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    description: "",
    icon: "website",
  })

  const toggleLinkStatus = (id: string) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, isActive: !link.isActive } : link)))
  }

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((option) => option.value === iconName)
    return iconOption ? { icon: iconOption.icon, color: iconOption.color } : { icon: Globe, color: "text-gray-600" }
  }

  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const activeLinks = links.filter((link) => link.isActive).length

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
      <StatsCard />


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

          <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-12"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Link
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">Add New Link</DialogTitle>
                <DialogDescription className="text-base">Create a new link to add to your profile</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-base font-medium">
                      Link Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter link title"
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      className="mt-2 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="url" className="text-base font-medium">
                      Destination URL *
                    </Label>
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      className="mt-2 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-base font-medium">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of this link"
                      value={newLink.description}
                      onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                      className="mt-2 min-h-[80px]"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="icon" className="text-base font-medium">
                      Choose Icon
                    </Label>
                    <Select value={newLink.icon} onValueChange={(value) => setNewLink({ ...newLink, icon: value })}>
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {iconOptions.map((option) => {
                          const IconComponent = option.icon
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-3">
                                <IconComponent className={`w-5 h-5 ${option.color}`} />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Or upload custom icon</p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center space-x-3">
                        {(() => {
                          const { icon: IconComponent, color } = getIconComponent(newLink.icon)
                          return <IconComponent className={`w-6 h-6 ${color}`} />
                        })()}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{newLink.title || "Link Title"}</p>
                          {newLink.description && (
                            <p className="text-sm text-gray-500 truncate">{newLink.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsAddingLink(false)} size="lg">
                  Cancel
                </Button>
                <Button size="lg">
                  Add Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Links Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Your Links ({filteredLinks.length})</h2>
        </div>

        <div className="grid gap-4">
          {filteredLinks.map((link) => {
            const { icon: IconComponent, color } = getIconComponent(link.icon)
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
                          <Switch checked={link.isActive} onCheckedChange={() => toggleLinkStatus(link.id)} />
                        </div>

                        <p className="text-gray-500 flex items-center mb-2">
                          <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{link.url}</span>
                        </p>

                        {link.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{link.description}</p>
                        )}

                        <div className="flex items-center space-x-6">
                          <Badge variant="secondary" className="text-sm px-3 py-1">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            {link.clicks} clicks
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Created {new Date(link.createdAt).toLocaleDateString()}
                          </span>
                          {!link.isActive && (
                            <Badge variant="outline" className="text-xs text-gray-500">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-10 w-10">
                        <Copy className="w-4 h-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-10 w-10">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Link
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredLinks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No links found" : "No links yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? "Try adjusting your search terms" : "Get started by adding your first link"}
            </p>
            {!searchQuery && (
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Link
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
