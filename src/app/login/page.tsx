import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, VenetianMask, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your portal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username">Username or Phone Number</Label>
                <Input id="username" placeholder="e.g., user@example.com or 1234567890" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
            </div>
            <div className="flex flex-col space-y-2 pt-4">
                 <Button asChild size="lg">
                    <Link href="/report">
                        <Users className="mr-2 h-5 w-5" />
                        Sign in as Citizen
                    </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                    <Link href="/admin">
                        <Shield className="mr-2 h-5 w-5" />
                        Sign in as Admin
                    </Link>
                </Button>
            </div>
             <div className="text-center text-sm text-muted-foreground pt-4">
                Admin Demo: <code className="font-code text-xs">demo@example.com</code> / <code className="font-code text-xs">password</code>
            </div>
            <div className="text-center text-sm text-muted-foreground pt-4">
                Don't have an account? <Link href="#" className="text-primary underline">Sign Up</Link>
            </div>
        </CardContent>
      </Card>


      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CityZen. Empowering Communities.</p>
      </footer>
    </div>
  );
}
