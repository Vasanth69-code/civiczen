
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VenetianMask } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';

export function SignupForm() {
  const { t } = useLanguage();
  const { sendOtp, verifyOtp } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    // This div is necessary for Firebase reCAPTCHA
    if (!document.getElementById('recaptcha-container')) {
      const recaptchaContainer = document.createElement('div');
      recaptchaContainer.id = 'recaptcha-container';
      document.body.appendChild(recaptchaContainer);
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast({
        variant: 'destructive',
        title: "Name and phone number required",
        description: "Please enter your full name and a valid phone number.",
      });
      return;
    }
    setLoading(true);
    try {
      await sendOtp(phone);
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `An OTP has been sent to ${phone}.`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('sign_up_failed'),
        description: error.message || "Could not send OTP. Please check the phone number.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp(otp, name);
      toast({
        title: t('sign_up_successful'),
        description: "You are now logged in.",
      });
      router.push('/report');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: "OTP Verification Failed",
        description: error.message || "The OTP you entered is incorrect. Please try again.",
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
            <CardDescription>{t('create_account_phone_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="name">{t('full_name')}</Label>
                  <Input id="name" type="text" placeholder={t('full_name_placeholder')} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="phone">{t('phone_number')}</Label>
                  <Input id="phone" type="tel" placeholder="+15551234567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="pt-4">
                   <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                      {t('send_otp')}
                  </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input id="otp" type="text" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </div>
               <div className="pt-4">
                 <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    {t('verify_and_signup')}
                </Button>
              </div>
            </form>
          )}
          <div className="text-center text-sm text-muted-foreground pt-4 mt-4 border-t">
              {t('already_have_account')} <Link href="/login" className="text-primary underline">{t('sign_in')}</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
