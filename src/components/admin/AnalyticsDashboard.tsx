import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Eye, Users, MousePointerClick, Activity, Loader2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { toast } from "sonner";

type PageView = {
  id: string;
  session_id: string;
  user_id: string | null;
  path: string;
  referrer: string | null;
  device_type: string | null;
  browser: string | null;
  created_at: string;
};

type ActivityEvent = {
  id: string;
  session_id: string | null;
  user_id: string | null;
  event_type: string;
  event_category: string | null;
  event_label: string | null;
  metadata: any;
  created_at: string;
};

const RANGES: Record<string, number> = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export const AnalyticsDashboard = () => {
  const [range, setRange] = useState<keyof typeof RANGES>("7d");
  const [loading, setLoading] = useState(true);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [profiles, setProfiles] = useState<Record<string, { email: string; full_name: string | null }>>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const since = new Date(Date.now() - RANGES[range] * 86400000).toISOString();

        const [{ data: pv, error: pvErr }, { data: ev, error: evErr }] = await Promise.all([
          supabase
            .from("page_views")
            .select("*")
            .gte("created_at", since)
            .order("created_at", { ascending: false })
            .limit(2000),
          supabase
            .from("activity_events")
            .select("*")
            .gte("created_at", since)
            .order("created_at", { ascending: false })
            .limit(2000),
        ]);

        if (pvErr) throw pvErr;
        if (evErr) throw evErr;

        setPageViews((pv || []) as PageView[]);
        setEvents((ev || []) as ActivityEvent[]);

        const userIds = new Set<string>();
        (pv || []).forEach((r: any) => r.user_id && userIds.add(r.user_id));
        (ev || []).forEach((r: any) => r.user_id && userIds.add(r.user_id));
        if (userIds.size > 0) {
          const { data: profs } = await supabase
            .from("profiles")
            .select("id, email, full_name")
            .in("id", Array.from(userIds));
          const map: Record<string, { email: string; full_name: string | null }> = {};
          (profs || []).forEach((p) => (map[p.id] = { email: p.email, full_name: p.full_name }));
          setProfiles(map);
        } else {
          setProfiles({});
        }
      } catch (err: any) {
        toast.error("Failed to load analytics: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [range]);

  const stats = useMemo(() => {
    const sessions = new Set(pageViews.map((p) => p.session_id));
    const uniqueUsers = new Set(pageViews.filter((p) => p.user_id).map((p) => p.user_id));
    return {
      pageViews: pageViews.length,
      sessions: sessions.size,
      signedIn: uniqueUsers.size,
      events: events.length,
    };
  }, [pageViews, events]);

  const timeSeries = useMemo(() => {
    const map = new Map<string, number>();
    const bucketByHour = range === "24h";
    pageViews.forEach((p) => {
      const d = new Date(p.created_at);
      const key = bucketByHour
        ? `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}h`
        : `${d.getMonth() + 1}/${d.getDate()}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([label, count]) => ({ label, count }))
      .reverse();
  }, [pageViews, range]);

  const topPaths = useMemo(() => {
    const map = new Map<string, number>();
    pageViews.forEach((p) => map.set(p.path, (map.get(p.path) || 0) + 1));
    return Array.from(map.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [pageViews]);

  const deviceBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    pageViews.forEach((p) => {
      const k = p.device_type || "unknown";
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map.entries()).map(([k, v]) => ({ label: k, count: v }));
  }, [pageViews]);

  const topReferrers = useMemo(() => {
    const map = new Map<string, number>();
    pageViews.forEach((p) => {
      if (!p.referrer) return;
      try {
        const host = new URL(p.referrer).host;
        map.set(host, (map.get(host) || 0) + 1);
      } catch {}
    });
    return Array.from(map.entries())
      .map(([host, count]) => ({ host, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [pageViews]);

  const eventBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach((e) => map.set(e.event_type, (map.get(e.event_type) || 0) + 1));
    return Array.from(map.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [events]);

  const topUsers = useMemo(() => {
    const map = new Map<string, { pv: number; ev: number }>();
    pageViews.forEach((p) => {
      if (!p.user_id) return;
      const cur = map.get(p.user_id) || { pv: 0, ev: 0 };
      cur.pv++;
      map.set(p.user_id, cur);
    });
    events.forEach((e) => {
      if (!e.user_id) return;
      const cur = map.get(e.user_id) || { pv: 0, ev: 0 };
      cur.ev++;
      map.set(e.user_id, cur);
    });
    return Array.from(map.entries())
      .map(([uid, v]) => ({
        uid,
        email: profiles[uid]?.email || "Unknown",
        name: profiles[uid]?.full_name || null,
        ...v,
      }))
      .sort((a, b) => (b.pv + b.ev) - (a.pv + a.ev))
      .slice(0, 10);
  }, [pageViews, events, profiles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6 [&_.grid>*]:min-w-0">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Traffic & Activity</h2>
          <p className="text-sm text-muted-foreground">Who visits the site and what they do</p>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as any)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Page Views" value={stats.pageViews} icon={<Eye className="h-4 w-4 text-primary" />} />
        <StatCard label="Sessions" value={stats.sessions} icon={<MousePointerClick className="h-4 w-4 text-primary" />} />
        <StatCard label="Signed-in Users" value={stats.signedIn} icon={<Users className="h-4 w-4 text-primary" />} />
        <StatCard label="Activity Events" value={stats.events} icon={<Activity className="h-4 w-4 text-primary" />} />
      </div>

      <Card>
        <CardHeader><CardTitle>Traffic over time</CardTitle></CardHeader>
        <CardContent>
          {timeSeries.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No traffic yet in this window.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="label" fontSize={12} />
                  <YAxis fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top Pages</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Path</TableHead><TableHead className="text-right">Views</TableHead></TableRow></TableHeader>
              <TableBody>
                {topPaths.length === 0 ? (
                  <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">No data</TableCell></TableRow>
                ) : topPaths.map((p) => (
                  <TableRow key={p.path}><TableCell className="font-mono text-sm [overflow-wrap:anywhere]">{p.path}</TableCell><TableCell className="text-right">{p.count}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Devices</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Device</TableHead><TableHead className="text-right">Views</TableHead></TableRow></TableHeader>
              <TableBody>
                {deviceBreakdown.length === 0 ? (
                  <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">No data</TableCell></TableRow>
                ) : deviceBreakdown.map((d) => (
                  <TableRow key={d.label}><TableCell className="capitalize">{d.label}</TableCell><TableCell className="text-right">{d.count}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Referrers</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Source</TableHead><TableHead className="text-right">Visits</TableHead></TableRow></TableHeader>
              <TableBody>
                {topReferrers.length === 0 ? (
                  <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">Direct / no referrers</TableCell></TableRow>
                ) : topReferrers.map((r) => (
                  <TableRow key={r.host}><TableCell>{r.host}</TableCell><TableCell className="text-right">{r.count}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Event Breakdown</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Event</TableHead><TableHead className="text-right">Count</TableHead></TableRow></TableHeader>
              <TableBody>
                {eventBreakdown.length === 0 ? (
                  <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">No events</TableCell></TableRow>
                ) : eventBreakdown.map((e) => (
                  <TableRow key={e.type}><TableCell><Badge variant="outline">{e.type}</Badge></TableCell><TableCell className="text-right">{e.count}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Most Active Users</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Page Views</TableHead>
                <TableHead className="text-right">Events</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topUsers.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No signed-in activity yet</TableCell></TableRow>
              ) : topUsers.map((u) => (
                <TableRow key={u.uid}>
                  <TableCell>
                    <div className="font-medium">{u.name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </TableCell>
                  <TableCell className="text-right">{u.pv}</TableCell>
                  <TableCell className="text-right">{u.ev}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.slice(0, 25).length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No recent activity</TableCell></TableRow>
              ) : events.slice(0, 25).map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(e.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {e.user_id ? (profiles[e.user_id]?.email || "user") : <span className="text-muted-foreground">anonymous</span>}
                  </TableCell>
                  <TableCell><Badge variant="outline">{e.event_type}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate max-w-xs">
                    {e.event_label || (e.metadata && Object.keys(e.metadata).length ? JSON.stringify(e.metadata) : "—")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
    </CardContent>
  </Card>
);

export default AnalyticsDashboard;
