
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

export function ForgotPasswordForm() {
  const { t } = useLanguage();
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitted(false);
    try {
      await resetPassword(email);
      toast({
        title: t('password_reset_sent'),
        description: t('password_reset_sent_description'),
      });
      setIsSubmitted(true);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: error.message,
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
            <CardTitle className="font-headline text-2xl">{t('reset_password')}</CardTitle>
            <CardDescription>{t('reset_password_description')}</CardDescription>
        </CardHeader>
        <CardContent>
            {isSubmitted ? (
                <div className="text-center text-sm text-muted-foreground">
                    <p>{t('password_reset_sent_description')}</p>
                </div>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('email_address')}</Label>
                        <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="pt-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {t('send_reset_link')}
                        </Button>
                    </div>
                </form>
            )}
            <div className="text-center text-sm text-muted-foreground pt-4 mt-4 border-t">
                <Link href="/login" className="text-primary underline">{t('back_to_login')}</Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
