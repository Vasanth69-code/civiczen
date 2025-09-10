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
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type IssuesTableProps = {
  issues: Issue[];
};

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
  Resolved: "default",
  "In Progress": "secondary",
  Pending: "secondary",
  Rejected: "destructive",
};

export function IssuesTable({ issues }: IssuesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Issue Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden sm:table-cell">Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{issue.title}</span>
                    <span className="text-sm text-muted-foreground md:hidden">{issue.department}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{issue.department}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={issue.priority === "High" ? "destructive" : "outline"}>
                    {issue.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[issue.status] || "secondary"}>
                    {issue.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
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
