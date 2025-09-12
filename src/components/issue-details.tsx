
"use client";

import { Issue } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowUp, ArrowDown, Calendar, MapPin, Share } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { TranslationKey } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type IssueDetailsProps = {
    issue: Issue;
};

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
  Resolved: "default",
  "In Progress": "secondary",
  Pending: "secondary",
  Rejected: "destructive",
};

export function IssueDetails({ issue }: IssueDetailsProps) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [votes, setVotes] = useState(0);
    const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
        navigator.share({
            title: `${t('share_issue_title')}: ${issue.title}`,
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
                            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {issue.imageUrl && (
                        <div className="relative aspect-video w-full">
                            <Image src={issue.imageUrl} alt={issue.title} layout="fill" objectFit="cover" className="rounded-md" data-ai-hint={issue.imageHint} />
                        </div>
                    )}
                    <p className="text-base leading-relaxed">{issue.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="font-medium text-muted-foreground">{t('status')}</p>
                            <Badge variant={statusVariant[issue.status] || "secondary"}>
                                {t(issue.status.replace(" ", "_").toLowerCase() as TranslationKey)}
                            </Badge>
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
                        <div className="aspect-video w-full rounded-md overflow-hidden">
                             <iframe
                                className="w-full h-full"
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${issue.location.lng-0.005},${issue.location.lat-0.005},${issue.location.lng+0.005},${issue.location.lat+0.005}&layer=mapnik&marker=${issue.location.lat},${issue.location.lng}`}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
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
                    <Button onClick={handleShare}>
                        <Share className="mr-2 h-4 w-4" />
                        {t('share')}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
