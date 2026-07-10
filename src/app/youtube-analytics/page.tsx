"use client";

import type { ReactNode } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { youtubeData, youtubeSummary } from "@/lib/youtube-data";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const summary = youtubeSummary();
const top10 = youtubeData.videos.slice(0, 10);

export default function YoutubeAnalyticsPage() {
  return (
    <DashboardShell title="Wait What Daily Analytics Dashboard" description="Channel ID: UCk2ks62RB6Ozr4-iZa3RrTw · Generated 2026-07-10 01:48:41">
      {youtubeData.is_sample ? (
        <div className="mb-5 rounded-lg border border-amber-700 bg-amber-950/30 px-4 py-2 text-center text-sm font-semibold text-amber-300">Sample Data Mode</div>
      ) : null}

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Total Views (30d)" value={summary.totalViews.toLocaleString()} />
        <Metric label="Total Subscribers" value={summary.totalSubscribers.toLocaleString()} />
        <Metric label="Avg CTR" value={`${summary.avgCtr}%`} />
        <Metric label="Total Watch Time" value={`${summary.totalWatch.toLocaleString()} min`} />
      </section>

      <section className="mb-6 grid gap-4 xl:grid-cols-2">
        <ChartCard title="Views Over Time (30 Days)">
          <Line
            data={{
              labels: youtubeData.daily.dates,
              datasets: [
                {
                  label: "Daily Views",
                  data: youtubeData.daily.views,
                  borderColor: "#58a6ff",
                  backgroundColor: "rgba(88,166,255,0.1)",
                  fill: true,
                  tension: 0.3
                }
              ]
            }}
            options={lineOptions}
          />
        </ChartCard>
        <ChartCard title="Top 10 Videos by Views">
          <Bar
            data={{
              labels: top10.map((video) => (video.title.length > 30 ? `${video.title.substring(0, 30)}...` : video.title)),
              datasets: [{ label: "Views", data: top10.map((video) => video.views), backgroundColor: "#ff0000", borderRadius: 4 }]
            }}
            options={horizontalBarOptions}
          />
        </ChartCard>
        <ChartCard title="Subscriber Growth">
          <Line
            data={{
              labels: youtubeData.daily.dates,
              datasets: [
                {
                  label: "Net Subscribers",
                  data: youtubeData.daily.subs_cumulative,
                  borderColor: "#2ea043",
                  backgroundColor: "rgba(46,160,67,0.1)",
                  fill: true,
                  tension: 0.3
                }
              ]
            }}
            options={lineOptions}
          />
        </ChartCard>
        <ChartCard title="CTR Trend (30 Days)">
          <Bar
            data={{
              labels: youtubeData.daily.dates,
              datasets: [{ label: "CTR (%)", data: youtubeData.daily.ctr, backgroundColor: "#d29922", borderRadius: 3 }]
            }}
            options={barOptions}
          />
        </ChartCard>
      </section>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead></TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Likes</TableHead>
                <TableHead className="text-right">Comments</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Subs Gained</TableHead>
                <TableHead className="text-right">Avg View %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {youtubeData.videos.map((video, index) => (
                <TableRow key={video.video_id} className={index === 0 ? "bg-emerald-950/10" : index === youtubeData.videos.length - 1 ? "bg-amber-950/10" : undefined}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {video.thumbnail ? <img src={video.thumbnail} alt="" className="h-9 w-12 rounded object-cover" /> : null}
                  </TableCell>
                  <TableCell className="min-w-64 font-medium text-zinc-100">{video.title}</TableCell>
                  <TableCell className="text-right tabular-nums">{video.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{video.likes.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{video.comments.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{video.ctr ? `${video.ctr}%` : "--"}</TableCell>
                  <TableCell className="text-right tabular-nums">{video.subs_gained ?? "--"}</TableCell>
                  <TableCell className="text-right tabular-nums">{video.avg_view_percentage ? `${video.avg_view_percentage}%` : "--"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-xs text-zinc-500">Wait What Daily Analytics · Data fetched via YouTube Data API v3 / YouTube Analytics API v2</p>
    </DashboardShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
        <p className="mt-2 text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-zinc-300">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">{children}</CardContent>
    </Card>
  );
}

const commonScales = {
  x: { ticks: { color: "#8b949e", maxTicksLimit: 8 }, grid: { color: "#30363d" } },
  y: { ticks: { color: "#8b949e" }, grid: { color: "#30363d" } }
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: "#8b949e" } } },
  scales: commonScales
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: "#8b949e" } } },
  scales: commonScales
};

const horizontalBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: { legend: { labels: { color: "#8b949e" } } },
  scales: commonScales
};
