
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
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { auth } from "@/lib/firebase";
import { useSignInWithPhoneNumber } from "react-firebase-hooks/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";


const phoneSchema = z.object({
  phoneNumber: z.string().min(10, "Please enter a valid 10-digit phone number.").max(15, "Phone number is too long."),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits."),
});

type LoginProps = {
  onLoginSuccess: (userType: 'citizen' | 'admin') => void;
}

const PhoneLoginForm = ({ onLoginSuccess, userType }: { onLoginSuccess: (userType: 'citizen' | 'admin') => void; userType: 'citizen' | 'admin' }) => {
  const router = useRouter();
  const [signInWithPhoneNumber, user, loading, error] = useSignInWithPhoneNumber(auth);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { toast } = useToast();

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });
  
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, []);

  const onPhoneSubmit = async (values: z.infer<typeof phoneSchema>) => {
    try {
      const appVerifier = window.recaptchaVerifier;
      // Firebase needs the phone number in E.164 format
      const phoneNumberE164 = `+1${values.phoneNumber.replace(/\D/g, '')}`;
      const result = await signInWithPhoneNumber(auth, phoneNumberE164, appVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
      toast({ title: "OTP Sent!", description: "Check your phone for the verification code." });
    } catch (err: any) {
      console.error("Phone sign-in error:", err);
      toast({ variant: "destructive", title: "Error", description: err.message });
      window.recaptchaVerifier.render().then((widgetId: any) => {
        grecaptcha.reset(widgetId);
      });
    }
  };

  const onOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    try {
      const credential = await confirmationResult.confirm(values.otp);
      if (credential.user) {
        toast({ title: "Login Successful!", description: "Redirecting..." });
        onLoginSuccess(userType);
      }
    } catch (err: any) {
      console.error("OTP confirmation error:", err);
      otpForm.setError("otp", { type: "manual", message: "Invalid OTP. Please try again." });
      toast({ variant: "destructive", title: "Login Failed", description: "The OTP you entered was incorrect." });
    }
  };

  if (!isOtpSent) {
    return (
        <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                 <FormField
                    control={phoneForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input type="tel" placeholder="e.g., 555-123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Login Error</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send OTP
                </Button>
            </form>
        </Form>
    )
  }

  return (
    <Form {...otpForm}>
      <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
        <FormField
          control={otpForm.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter 6-digit code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Login Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify & Login
        </Button>
         <Button variant="link" size="sm" className="w-full" onClick={() => setIsOtpSent(false)}>
            Use a different phone number
        </Button>
      </form>
    </Form>
  )

}


export function LoginForm() {
  const router = useRouter();

  const handleLoginSuccess = (userType: 'citizen' | 'admin') => {
    if (userType === 'citizen') {
      router.push("/report");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <>
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
              <PhoneLoginForm onLoginSuccess={handleLoginSuccess} userType="citizen" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="department">
          <Card>
            <CardHeader>
              <CardTitle>Department & Admin Portal</CardTitle>
              <CardDescription>
                Sign in with your official phone number to access the admin dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <PhoneLoginForm onLoginSuccess={handleLoginSuccess} userType="admin" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div id="recaptcha-container"></div>
    </>
  );
}

// Augment the Window interface
declare global {
  interface Window {
    recaptchaVerifier: any;
    grecaptcha: any;
  }
}
