
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VenetianMask } from 'lucide-react';
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

export function SignupForm() {
  const { t } = useLanguage();
  const { signup } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: t('passwords_do_not_match'),
        description: "Please make sure your passwords match.",
      });
      return;
    }
    setLoading(true);
    try {
      await signup(email, password);
      toast({
        title: t('sign_up_successful'),
        description: "You are now logged in.",
      });
      router.push('/report');
    } catch (error: any) {
      let description = t('sign_up_failed_description');
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            description = 'This email address is already in use by another account.';
            break;
          case 'auth/invalid-email':
            description = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            description = 'The password is too weak. Please use at least 6 characters.';
            break;
          default:
            description = error.message;
        }
      }
      toast({
        variant: 'destructive',
        title: t('sign_up_failed'),
        description: description,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
       <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
           <VenetianMask className="h-12 w-12 text-primary" />
           <h1 className="font-headline text-5xl font-bold ml-2">CityZen</h1>
        </div>
      </div>
      <Card>
        <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">{t('create_an_account')}</CardTitle>
            <CardDescription>{t('create_account_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">{t('email_address')}</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm-password">{t('confirm_password')}</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <div className="pt-4">
                 <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    {t('sign_up')}
                </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                {t('already_have_account')} <Link href="/login" className="text-primary underline">{t('sign_in')}</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
