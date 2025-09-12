
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VenetianMask, Users, Shield } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';

export function LoginForm() {
  const { t } = useLanguage();
  const { loginAsAdmin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [adminLoading, setAdminLoading] = useState(false);

  const handleAdminLogin = async () => {
    setAdminLoading(true);

    try {
      await loginAsAdmin(email, password);
      toast({ title: t('sign_in_successful') });
      router.push('/admin/dashboard');
      
    } catch (error: any) {
      let description = t('sign_in_failed_description');
       if (error instanceof FirebaseError) {
        switch(error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            description = "Invalid email or password. Please try again.";
            break;
          case 'auth/invalid-email':
            description = "Please enter a valid email address.";
            break;
          default:
            description = error.message;
        }
      } else {
        description = error.message;
      }
      
      toast({
        variant: 'destructive',
        title: t('sign_in_failed'),
        description: description,
      });
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
           <VenetianMask className="h-12 w-12 text-primary" />
           <h1 className="font-headline text-5xl font-bold ml-2">CityZen</h1>
        </div>
        <p className="text-muted-foreground text-lg">{t('app_greeting')}</p>
      </div>

      <Card>
        <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">{t('sign_in')}</CardTitle>
            <CardDescription>{t('sign_in_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                New user? <Link href="/signup" className="text-primary underline">{t('sign_up')}</Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('or')}
                </span>
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">{t('admin_email')}</Label>
                <Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
             <div className="text-right text-sm">
                <Link href="/forgot-password" passHref>
                  <span className="text-primary underline cursor-pointer">{t('forgot_password')}</span>
                </Link>
            </div>
            <div className="flex flex-col space-y-2 pt-4">
                <Button onClick={handleAdminLogin} variant="secondary" disabled={adminLoading}>
                    {adminLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Shield className="mr-2 h-5 w-5" />}
                    {t('sign_in_as_admin')}
                </Button>
            </div>
             <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                {t('admin_demo_credentials')} <code className="font-code text-xs">demo@example.com</code> / <code className="font-code text-xs">password</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
