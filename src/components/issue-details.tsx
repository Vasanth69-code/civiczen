"use client";

import { Issue, IssueStatus } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowUp, ArrowDown, Calendar, MapPin, Share2, Copy, MessageSquare, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { TranslationKey } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useIssues } from "@/context/issue-context";
import { usePathname } from "next/navigation";


type IssueDetailsProps = {
    issue: Issue;
};

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
  Resolved: "default",
  "In Progress": "secondary",
  Pending: "secondary",
  Rejected: "destructive",
};

const availableStatuses: IssueStatus[] = ["Pending", "In Progress", "Resolved", "Rejected"];

export function IssueDetails({ issue: initialIssue }: IssueDetailsProps) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [votes, setVotes] = useState(0);
    const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
    const { issues, updateIssueStatus } = useIssues();
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    // This ensures we have the latest issue state from the context
    const issue = issues.find(i => i.id === initialIssue.id) || initialIssue;
    
    const issueUrl = typeof window !== 'undefined' ? `${window.location.origin}/issues/${issue.id}` : '';
    const shareText = `${t('share_issue_title')}: ${issue.title}\n${issueUrl}`;

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(issueUrl);
        toast({
            title: t('link_copied'),
            description: t('link_copied_description'),
        });
    }

    const handleUpvote = () => {
        if (userVote === "up") {
          // If already upvoted, retract vote
          setVotes(votes - 1);
          setUserVote(null);
        } else if (userVote === "down") {
          // If was downvoted, switch to upvote
          setVotes(votes + 2);
          setUserVote("up");
        } else {
          // If no vote, upvote
          setVotes(votes + 1);
          setUserVote("up");
        }
      };
    
      const handleDownvote = () => {
        if (userVote === "down") {
          // If already downvoted, retract vote
          setVotes(votes + 1);
          setUserVote(null);
        } else if (userVote === "up") {
          // If was upvoted, switch to downvote
          setVotes(votes - 2);
          setUserVote("down");
        } else {
          // If no vote, downvote
          setVotes(votes - 1);
          setUserVote("down");
        }
      };

    const handleStatusChange = (newStatus: IssueStatus) => {
        updateIssueStatus(issue.id, newStatus);
        toast({
            title: "Status Updated",
            description: `Issue "${issue.title}" is now ${newStatus}.`,
        });
    };
    
    const createdAtDate = issue.createdAt;


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">{issue.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={issue.reporter.avatarUrl} />
                                <AvatarFallback>{issue.reporter.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{issue.reporter.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{createdAtDate.toLocaleDateString()}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {issue.imageUrl && (
                        <div className="relative aspect-video w-full">
                            <Image src={issue.imageUrl} alt={issue.title} fill objectFit="cover" className="rounded-md" data-ai-hint={issue.imageHint} />
                        </div>
                    )}
                    <p className="text-base leading-relaxed">{issue.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="font-medium text-muted-foreground">{t('status')}</p>
                            {isAdmin ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex items-center gap-2">
                                             <Badge variant={statusVariant[issue.status] || "secondary"}>
                                                {t(issue.status.replace(" ", "_").toLowerCase() as TranslationKey)}
                                            </Badge>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {availableStatuses.map(status => (
                                            <DropdownMenuItem key={status} onSelect={() => handleStatusChange(status)}>
                                                {t(status.replace(" ", "_").toLowerCase() as TranslationKey)}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Badge variant={statusVariant[issue.status] || "secondary"}>
                                    {t(issue.status.replace(" ", "_").toLowerCase() as TranslationKey)}
                                </Badge>
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-muted-foreground">{t('priority')}</p>
                             <Badge variant={issue.priority === "High" ? "destructive" : "outline"}>
                                {t(issue.priority.toLowerCase() as TranslationKey)}
                            </Badge>
                        </div>
                        <div>
                            <p className="font-medium text-muted-foreground">{t('category')}</p>
                            <p>{issue.category}</p>
                        </div>
                        <div>
                            <p className="font-medium text-muted-foreground">{t('department')}</p>
                            <p>{issue.department}</p>
                        </div>
                    </div>

                     <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            {t('location')}
                        </h3>
                        <p className="text-muted-foreground mb-4">{issue.address}</p>
                        <div className="p-4 rounded-md border text-sm text-muted-foreground">
                            Map removed. Location: {issue.location.lat}, {issue.location.lng}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <div className="flex items-center gap-1 rounded-md border bg-background">
                        <Button variant="ghost" size="icon" onClick={handleUpvote} aria-pressed={userVote === 'up'}>
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                        <span className="font-medium text-sm tabular-nums">{votes}</span>
                        <Button variant="ghost" size="icon" onClick={handleDownvote} aria-pressed={userVote === 'down'}>
                            <ArrowDown className="h-4 w-4" />
                        </Button>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                <Share2 className="mr-2 h-4 w-4" />
                                {t('share')}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={handleCopyToClipboard}>
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Copy Link</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
                                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16.75 13.96c.25.13.43.2.5.28.07.08.14.18.18.28.05.1.06.2.06.28 0 .1-.03.2-.08.28-.05.1-.1.18-.18.25-.08.08-.18.13-.28.16-.4.16-1 .06-1.78-.3-1.15-.55-2.13-1.3-2.9-2.2-.6-.7-1.1-1.5-1.5-2.35-.1-.2-.18-.4-.2-.6 0-.2.04-.4.1-.6.1-.15.2-.28.3-.4.1-.1.2-.18.3-.22.1-.04.2-.05.3-.05h.4c.1 0 .2 0 .3.02.1.03.2.06.2.1l.1.25c.1.2.2.4.3.6.1.2.1.4.1.5s-.02.3-.06.4c-.04.1-.1.2-.15.25l-.25.3c-.04.04-.05.1-.05.1s.02.1.06.2c.05.1.1.2.15.25.25.3.5.6.8.8.3.2.6.4.8.5.1.05.2.1.25.1.1 0 .2-.02.25-.05l.3-.25c.05-.05.1-.1.2-.1.1 0 .2.02.3.05.1.03.2.1.3.15l.6.9c.02.05.04.1.06.15.02.05.03.1.03.15s0 .1-.02.2c-.02.05-.04.1-.06.15l-.25.25zm5.1-1.6V7.6c-.02-1.3-.5-2.5-1.4-3.4s-2.1-1.4-3.4-1.4c-1.3 0-2.5.5-3.4 1.4-1 .9-1.5 2.1-1.5 3.4v.4c-1.8 1-3.3 2.5-4.3 4.3v.4c0 1.3.5 2.5 1.4 3.4s2.1 1.4 3.4 1.4h.4c1.8-1 3.3-2.5 4.3-4.3h.4c1.3 0 2.5-.5 3.4-1.4.9-.9 1.4-2.1 1.4-3.4zM12 21.9C6.5 21.9 2.1 17.5 2.1 12S6.5 2.1 12 2.1c5.5 0 9.9 4.4 9.9 9.9 0 5.5-4.4 9.9-9.9 9.9z"></path></svg>
                                    <span>WhatsApp</span>
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                 <a href={`sms:?body=${encodeURIComponent(shareText)}`}>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    <span>SMS</span>
                                </a>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardFooter>
            </Card>
        </div>
    );
}
