
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, CheckCircle2, AlertTriangle, Clock, Building } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useIssues } from "@/context/issue-context";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useMemo, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

const IssueHeatmap = dynamic(() => import("./issue-heatmap").then(mod => mod.IssueHeatmap), {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
});

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function AnalyticsDashboard() {
  const { issues } = useIssues();
  const router = useRouter();

  const totalReports = issues.length;
  const resolvedReports = issues.filter(i => i.status === 'Resolved').length;
  const pendingReports = issues.filter(i => i.status === 'Pending').length;
  const inProgressReports = issues.filter(i => i.status === 'In Progress').length;

  const issuesByDept = useMemo(() => {
    const counts = issues.reduce((acc, issue) => {
        acc[issue.department] = (acc[issue.department] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [issues]);

  const issuesByCategory = useMemo(() => {
    const counts = issues.reduce((acc, issue) => {
        acc[issue.category] = (acc[issue.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [issues]);

  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const departmentName = data.activePayload[0].payload.name;
      router.push(`/admin/departments/${encodeURIComponent(departmentName)}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">+2 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedReports}</div>
            <p className="text-xs text-muted-foreground">
                {totalReports > 0 ? Math.round((resolvedReports/totalReports) * 100) : 0}% resolution rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressReports}</div>
            <p className="text-xs text-muted-foreground">Currently being actioned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Issue Hotspots</CardTitle>
            <CardDescription>A heatmap of where issues are being reported across the city.</CardDescription>
        </CardHeader>
        <CardContent>
            <IssueHeatmap issues={issues} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    <span>Issues by Department</span>
                </CardTitle>
                <CardDescription>Breakdown of all reported issues by department.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={issuesByDept} layout="vertical" margin={{ left: 25, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                        <Tooltip
                            cursor={{fill: 'hsl(var(--accent))'}}
                            contentStyle={{
                                background: "hsl(var(--background))",
                                borderColor: "hsl(var(--border))",
                            }}
                        />
                        <Bar dataKey="value" name="Issues" fill="hsl(var(--primary))" barSize={20} onClick={handleBarClick} className="cursor-pointer" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <span>Issues by Category</span>
                </CardTitle>
                <CardDescription>Breakdown of all reported issues by category.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={issuesByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                return ( (percent * 100) > 5 ?
                                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                        {`${(percent * 100).toFixed(0)}%`}
                                    </text> : null
                                );
                            }}
                        >
                            {issuesByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                             contentStyle={{
                                background: "hsl(var(--background))",
                                borderColor: "hsl(var(--border))",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    