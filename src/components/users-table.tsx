
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import { useLanguage } from "@/context/language-context";
import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";

type UsersTableProps = {
  users: User[];
};

type SortKey = keyof User;
type SortDirection = "asc" | "desc";

export function UsersTable({ users }: UsersTableProps) {
  const { t } = useLanguage();
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedUsers = useMemo(() => {
    const sorted = [...users].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [users, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4" /> // Could use different icons for up/down
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t("users")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">
                 <Button variant="ghost" onClick={() => handleSort("rank")} className="px-0">
                    Rank
                    {getSortIcon("rank")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("name")} className="px-0">
                    Name
                    {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort("points")} className="px-0 w-full justify-end">
                    Points
                    {getSortIcon("points")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-center">{user.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.imageHint} />
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
  );
}
