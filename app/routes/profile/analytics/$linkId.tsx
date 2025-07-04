import { useLoaderData } from "react-router";
import { prisma } from "~/lib/prisma";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export async function loader({ params }: LoaderFunctionArgs) {
  const linkId = params.linkId;

  if (!linkId) {
    return data({ link: null, clicks: [] });
  }

  const link = await prisma.link.findUnique({
    where: {
      id: linkId,
    },
    select: {
      title: true,
      clicks: {
        select: {
          createdAt: true,
        },
      },
    },
  });

  if (!link) {
    return data({ link: null, clicks: [] });
  }

  const clicksByDay: { [key: string]: number } = {};
  link.clicks.forEach((click) => {
    const date = new Date(click.createdAt).toLocaleDateString();
    clicksByDay[date] = (clicksByDay[date] || 0) + 1;
  });

  const chartData = Object.keys(clicksByDay).map((date) => ({
    date,
    clicks: clicksByDay[date],
  }));

  return data({ link, clicks: chartData });
}

export default function LinkAnalytics() {
  const { link, clicks } = useLoaderData<typeof loader>();

  if (!link) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Link not found</h1>
        <p>The link you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Analytics for "{link.title}"</h1>

      <Card>
        <CardHeader>
          <CardTitle>Clicks Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clicks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
