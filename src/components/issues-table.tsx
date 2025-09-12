
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
import { ArrowUp, MoreHorizontal, Share, ArrowDown } from "lucide-react";
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
import React, { useState } from "react";

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

const IssueRow = ({ issue, onShare }: { issue: Issue, onShare: (id: string) => void }) => {
    const [votes, setVotes] = useState(0);
    const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
    const { t } = useLanguage();

    const handleUpvote = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (userVote === "up") {
          setVotes(votes - 1);
          setUserVote(null);
        } else if (userVote === "down") {
          setVotes(votes + 2);
          setUserVote("up");
        } else {
          setVotes(votes + 1);
          setUserVote("up");
        }
      };
    
      const handleDownvote = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (userVote === "down") {
          setVotes(votes + 1);
          setUserVote(null);
        } else if (userVote === "up") {
          setVotes(votes - 2);
          setUserVote("down");
        } else {
          setVotes(votes - 1);
          setUserVote("down");
        }
      };

    return (
        <TableRow>
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
            <div className="flex items-center gap-1 rounded-md border bg-background p-0.5">
                <Button variant="ghost" size="icon" className="size-7" onClick={handleUpvote} aria-pressed={userVote === 'up'}>
                    <ArrowUp className="h-4 w-4" />
                </Button>
                <span className="font-medium text-sm tabular-nums min-w-[20px] text-center">{votes}</span>
                <Button variant="ghost" size="icon" className="size-7" onClick={handleDownvote} aria-pressed={userVote === 'down'}>
                    <ArrowDown className="h-4 w-4" />
                </Button>
            </div>
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
              <DropdownMenuItem onClick={() => onShare(issue.id)}>
                <Share className="mr-2 h-4 w-4" />
                {t('share')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    )
}

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
              <IssueRow key={issue.id} issue={issue} onShare={handleShare} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
