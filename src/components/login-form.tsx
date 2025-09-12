
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCitizenLogin = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      router.push("/report");
      setIsLoading(false);
    }, 1500);
  };

  const handleAdminLogin = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      router.push("/admin/dashboard");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Tabs defaultValue="citizen" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="citizen">Citizen Login</TabsTrigger>
        <TabsTrigger value="department">Department/Admin Login</TabsTrigger>
      </TabsList>
      <TabsContent value="citizen">
        <Card>
          <CardHeader>
            <CardTitle>Citizen Portal</CardTitle>
            <CardDescription>
              Sign in with your phone number to report issues and track their status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="citizen-phone">Phone Number</Label>
              <Input
                id="citizen-phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            {/* We can add OTP field later */}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleCitizenLogin} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send OTP & Login
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="department">
        <Card>
          <CardHeader>
            <CardTitle>Department & Admin Portal</CardTitle>
            <CardDescription>
              Official use only. Sign in to manage and resolve reported issues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-phone">Phone Number</Label>
              <Input
                id="admin-phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
            </div>
             {/* We can add OTP field later */}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleAdminLogin} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send OTP & Login
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
