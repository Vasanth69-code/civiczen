import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, VenetianMask } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
           <VenetianMask className="h-12 w-12 text-primary" />
           <h1 className="font-headline text-5xl font-bold ml-2">CityZen</h1>
        </div>
        <p className="text-muted-foreground text-lg">Your voice for a better city.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="items-center text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Citizen Portal</CardTitle>
            <CardDescription>Report issues, track progress, and be a part of the change.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild size="lg" className="w-full">
              <Link href="/report">Enter as a Citizen</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="items-center text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Admin Portal</CardTitle>
            <CardDescription>Manage reports, assign tasks, and view city analytics.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild size="lg" className="w-full" variant="secondary">
              <Link href="/admin/dashboard">Enter as an Admin</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CityZen. Empowering Communities.</p>
      </footer>
    </div>
  );
}
