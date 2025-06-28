import { Card, CardContent } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Copy, ExternalLink, BarChart3, TrendingUp, } from "lucide-react"

interface StatsCardProps {
  linkUsername: string;
  totalLinks?: number;
  totalActiveLinks?: number;
  totalClicks?: number;
}

export function StatsCard({ linkUsername, totalLinks, totalActiveLinks, totalClicks }: StatsCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-medium text-sm">Profile URL</p>
              <p className="text-blue-900 font-bold text-sm">{`lynqr.me/${linkUsername}`}</p>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Links</p>
              <p className="text-gray-900 font-bold text-2xl">{totalLinks}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Clicks</p>
              <p className="text-gray-900 font-bold text-2xl">{totalClicks}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Links</p>
              <p className="text-gray-900 font-bold text-2xl">{totalActiveLinks}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
