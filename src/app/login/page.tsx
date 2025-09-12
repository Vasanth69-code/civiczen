
import { LoginForm } from "@/components/login-form";
import { VenetianMask } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
            <Link href="/">
              <VenetianMask className="size-12 text-primary" />
            </Link>
            <h1 className="mt-4 font-headline text-4xl font-bold">Welcome to CityZen</h1>
            <p className="mt-2 text-muted-foreground">Sign in to start making a difference.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
