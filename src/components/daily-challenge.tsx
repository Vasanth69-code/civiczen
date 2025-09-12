
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { TranslationKey } from "@/lib/translations";
import { Flame } from "lucide-react";
import { useEffect, useState } from "react";

const challenges: { key: TranslationKey; icon: string }[] = [
    { key: "challenge_pothole", icon: "🚧" },
    { key: "challenge_trash", icon: "🗑️" },
    { key: "challenge_streetlight", icon: "💡" }
];

export function DailyChallenge() {
    const { t } = useLanguage();
    const [challenge, setChallenge] = useState<{ key: TranslationKey; icon: string } | null>(null);

    useEffect(() => {
        // Simple logic to pick a challenge based on the day of the year
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
        const challengeIndex = dayOfYear % challenges.length;
        setChallenge(challenges[challengeIndex]);
    }, []);

    if (!challenge) {
        return null;
    }

    return (
        <Card className="bg-accent/50 border-accent">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Flame className="text-orange-500" />
                    <span>{t('daily_challenge')}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <div className="text-4xl mb-4">{challenge.icon}</div>
                <p className="font-medium">{t(challenge.key)}</p>
            </CardContent>
        </Card>
    );
}
