
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, CheckCircle2, AlertTriangle, Clock, Building } from "lucide-react";
import { IssuesTable } from "./issues-table";
import { useLanguage } from "@/context/language-context";
import { TranslationKey } from "@/lib/translations";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Link from "next/link";
import { useIssues } from "@/context/issue-context";
import { useRouter } from "next/navigation";


export function AdminDashboard() {
  const { t } = useLanguage();
  const { issues } = useIssues();
  const router = useRouter();
  const totalReports = issues.length;
  const resolvedReports = issues.filter(i => i.status === 'Resolved').length;
  const pendingReports = issues.filter(i => i.status === 'Pending').length;
  const inProgressReports = issues.filter(i => i.status === 'In Progress').length;

  const issuesByDept = issues.reduce((acc, issue) => {
    acc[issue.department] = (acc[issue.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deptData = Object.entries(issuesByDept).map(([name, issues]) => ({ name, issues }));

  const handleBarClick = (data: any) => {
    if (data && data.name) {
      router.push(`/admin/departments/${encodeURIComponent(data.name)}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_reports')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">{t('total_reports_last_week')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('resolved')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedReports}</div>
            <p className="text-xs text-muted-foreground">
                {totalReports > 0 ? Math.round((resolvedReports/totalReports) * 100) : 0}% {t('resolution_rate')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('in_progress')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressReports}</div>
            <p className="text-xs text-muted-foreground">{t('currently_actioned')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pending_action')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports}</div>
            <p className="text-xs text-muted-foreground">{t('awaiting_assignment')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    <span>{t('issues_by_department')}</span>
                </CardTitle>
                <CardDescription>{t('issues_by_department_description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={deptData} layout="vertical" margin={{ left: 20, right: 20 }}>
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
                        <Bar dataKey="issues" fill="hsl(var(--primary))" barSize={20} onClick={handleBarClick} className="cursor-pointer" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
         <div className="md:col-span-2">
            <IssuesTable issues={issues} title={t("Issue Reports" as TranslationKey)}/>
        </div>
      </div>
    </div>
  );
}
