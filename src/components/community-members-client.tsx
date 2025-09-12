
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/context/language-context';
import { useUser } from '@/context/user-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';

export function CommunityMembersClient() {
  const { t } = useLanguage();
  const { users } = useUser();
  
  if (!users.length) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('community_members')}</CardTitle>
                <CardDescription>{t('community_members_description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-2">
                      <Skeleton className="size-10 rounded-full" />
                      <Skeleton className="h-6 flex-1" />
                      <Skeleton className="h-6 w-16" />
                  </div>
                ))}
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('community_members')}</CardTitle>
          <CardDescription>{t('community_members_description')}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='w-20 text-center'>{t('rank')}</TableHead>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead className='text-right'>{t('points')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-center font-bold text-muted-foreground">{user.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatarUrl} data-ai-hint={user.imageHint} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{user.points.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
