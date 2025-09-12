
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

export function LoginForm() {
  const { t } = useLanguage();
  const { login, loginAsAdmin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>, isAdmin: boolean) => {
    e.preventDefault();
    if (isAdmin) {
      setAdminLoading(true);
    } else {
      setLoading(true);
    }

    try {
      if (isAdmin) {
        await loginAsAdmin(email, password);
        toast({ title: t('sign_in_successful') });
        router.push('/admin');
      } else {
        await login(email, password);
        toast({ title: t('sign_in_successful') });
        router.push('/report');
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('sign_in_failed'),
        description: error.message || t('sign_in_failed_description'),
      });
    } finally {
      if (isAdmin) {
        setAdminLoading(false);
      } else {
        setLoading(false);
      }
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
            <div className="space-y-2">
                <Label htmlFor="email">{t('email_address')}</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
             <div className="text-right text-sm">
                <Link href="/forgot-password" passHref>
                  <span className="text-primary underline cursor-pointer">{t('forgot_password')}</span>
                </Link>
            </div>
            <div className="flex flex-col space-y-2 pt-4">
                 <Button onClick={(e) => handleLogin(e, false)} disabled={loading || adminLoading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Users className="mr-2 h-5 w-5" />}
                    {t('sign_in_as_citizen')}
                </Button>
                <Button onClick={(e) => handleLogin(e, true)} variant="secondary" disabled={loading || adminLoading}>
                    {adminLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Shield className="mr-2 h-5 w-5" />}
                    {t('sign_in_as_admin')}
                </Button>
            </div>
             <div className="text-center text-sm text-muted-foreground pt-4">
                {t('admin_demo_credentials')} <code className="font-code text-xs">demo@example.com</code> / <code className="font-code text-xs">password</code>
            </div>
            <div className="text-center text-sm text-muted-foreground pt-4">
                {t('dont_have_account')} <Link href="/signup" className="text-primary underline">{t('sign_up')}</Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
