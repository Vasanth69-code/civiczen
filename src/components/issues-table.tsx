"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Issue } from "@/lib/types";
import { ArrowUp, MoreHorizontal, Share } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";
import { TranslationKey } from "@/lib/translations";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type IssuesTableProps = {
  issues: Issue[];
  title: string;
};

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
  Resolved: "default",
  "In Progress": "secondary",
  Pending: "secondary",
  Rejected: "destructive",
};

export function IssuesTable({ issues, title }: IssuesTableProps) {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleShare = (issueId: string) => {
    const url = `${window.location.origin}/issues/${issueId}`;
    if (navigator.share) {
      navigator.share({
        title: t('share_issue_title'),
        text: t('share_issue_text'),
        url: url,
      }).catch(err => console.error("Share failed", err));
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: t('link_copied'),
        description: t('link_copied_description'),
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t(title as TranslationKey)}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('title')}</TableHead>
              <TableHead className="hidden md:table-cell">{t('department')}</TableHead>
              <TableHead className="hidden sm:table-cell">{t('priority')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <Link href={`/issues/${issue.id}`} className="hover:underline">
                      {issue.title}
                    </Link>
                    <span className="text-sm text-muted-foreground md:hidden">{issue.department}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{issue.department}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={issue.priority === "High" ? "destructive" : "outline"}>
                    {t(issue.priority.toLowerCase() as TranslationKey)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[issue.status] || "secondary"}>
                    {t(issue.status.replace(" ", "_").toLowerCase() as TranslationKey)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ArrowUp className="h-4 w-4" />
                    <span>{Math.floor(Math.random() * 200)}</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/issues/${issue.id}`}>{t('view_details')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(issue.id)}>
                        <Share className="mr-2 h-4 w-4" />
                        {t('share')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
