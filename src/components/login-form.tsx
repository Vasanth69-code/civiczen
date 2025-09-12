
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCitizenLoading, setIsCitizenLoading] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);


  const handleCitizenLogin = () => {
    setIsCitizenLoading(true);
    // Simulate API call
    setTimeout(() => {
      router.push("/report");
      setIsCitizenLoading(false);
    }, 1500);
  };

  const handleAdminLogin = () => {
    setIsAdminLoading(true);
    // Simulate API call
    setTimeout(() => {
      router.push("/admin/dashboard");
      setIsAdminLoading(false);
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
              This is a simulated login for demonstration purposes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground">Click the button below to proceed as a demo citizen user.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleCitizenLogin} disabled={isCitizenLoading}>
              {isCitizenLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login as Demo Citizen
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="department">
        <Card>
          <CardHeader>
            <CardTitle>Department & Admin Portal</CardTitle>
            <CardDescription>
              This is a simulated login for demonstration purposes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Click the button below to proceed as a demo admin user.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleAdminLogin} disabled={isAdminLoading}>
              {isAdminLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login as Demo Admin
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
