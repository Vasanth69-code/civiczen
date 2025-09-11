
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { IssuesTable } from "./issues-table";
import { mockIssues } from "@/lib/placeholder-data";
import { useLanguage } from "@/context/language-context";

export function AdminDashboard() {
  const { t } = useLanguage();
  const totalReports = mockIssues.length;
  const resolvedReports = mockIssues.filter(i => i.status === 'Resolved').length;
  const pendingReports = mockIssues.filter(i => i.status === 'Pending').length;
  const inProgressReports = mockIssues.filter(i => i.status === 'In Progress').length;

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
                {Math.round((resolvedReports/totalReports) * 100)}% {t('resolution_rate')}
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
      <div>
        <IssuesTable issues={mockIssues} title="Issue Reports"/>
      </div>
    </div>
  );
}
