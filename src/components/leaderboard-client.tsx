'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/lib/types';
import { Crown, Trophy, Medal, Star } from 'lucide-react';
import { currentUser } from '@/lib/placeholder-data';
import { useLanguage } from '@/context/language-context';

type LeaderboardClientProps = {
  users: User[];
};

const rankIcons = [
  <Crown key="1" className="h-6 w-6 text-yellow-400" />,
  <Trophy key="2" className="h-6 w-6 text-gray-400" />,
  <Medal key="3" className="h-6 w-6 text-yellow-600" />,
];

export function LeaderboardClient({ users }: LeaderboardClientProps) {
  const { t } = useLanguage();
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const topThree = sortedUsers.slice(0, 3);
  const restUsers = sortedUsers.slice(3);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-center">{t('top_citizens')}</CardTitle>
          <CardDescription className="text-center">{t('top_citizens_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around items-end">
            {topThree[1] && (
              <div className="text-center flex flex-col items-center">
                {rankIcons[1]}
                <Avatar className="w-24 h-24 border-4 border-gray-300 mt-2">
                  <AvatarImage src={topThree[1].avatarUrl} data-ai-hint={topThree[1].imageHint} />
                  <AvatarFallback>{topThree[1].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-bold mt-2">{topThree[1].name}</p>
                <p className="text-sm text-muted-foreground">{topThree[1].points} {t('pts')}</p>
              </div>
            )}
            {topThree[0] && (
              <div className="text-center flex flex-col items-center mx-4">
                {rankIcons[0]}
                <Avatar className="w-32 h-32 border-4 border-yellow-400 mt-2">
                  <AvatarImage src={topThree[0].avatarUrl} data-ai-hint={topThree[0].imageHint} />
                  <AvatarFallback>{topThree[0].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-bold text-lg mt-2">{topThree[0].name}</p>
                <p className="text-sm text-muted-foreground">{topThree[0].points} {t('pts')}</p>
              </div>
            )}
            {topThree[2] && (
              <div className="text-center flex flex-col items-center">
                {rankIcons[2]}
                <Avatar className="w-24 h-24 border-4 border-yellow-600 mt-2">
                  <AvatarImage src={topThree[2].avatarUrl} data-ai-hint={topThree[2].imageHint} />
                  <AvatarFallback>{topThree[2].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-bold mt-2">{topThree[2].name}</p>
                <p className="text-sm text-muted-foreground">{topThree[2].points} {t('pts')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {restUsers.map((user, index) => (
              <li key={user.id} className={`flex items-center p-4 ${user.id === currentUser.id ? 'bg-primary/10' : ''}`}>
                <div className="w-8 text-center font-bold text-muted-foreground">{index + 4}</div>
                <Avatar className="h-10 w-10 mx-4">
                  <AvatarImage src={user.avatarUrl} data-ai-hint={user.imageHint} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow font-medium">{user.name} {user.id === currentUser.id && <span className="text-xs font-normal text-primary">({t('you')})</span>}</div>
                <div className="flex items-center gap-1 font-bold">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {user.points.toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
