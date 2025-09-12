
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/user-context";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  avatar: z.any().optional(),
});

export function UserSettingsForm() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user, setUser } = useUser();
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: "aarav.sharma@example.com", // Mock email
      phone: "123-456-7890", // Mock phone
    },
  });

  useEffect(() => {
    form.reset({ name: user.name });
    setAvatarPreview(user.avatarUrl);
  }, [user, form]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result as string;
        setAvatarPreview(newAvatarUrl);
        form.setValue("avatar", file);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically upload the avatar to a storage service
    // and update the user's profile in your database.
    // For this demo, we'll just update the shared state.

    setUser({
        ...user,
        name: values.name,
        avatarUrl: avatarPreview,
    });

    toast({
      title: t('profile_updated_successfully'),
      description: t('profile_updated_description'),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t('user_profile')}</CardTitle>
        <CardDescription>{t('user_profile_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview} data-ai-hint={user.imageHint} alt={form.watch('name')} />
                    <AvatarFallback>{form.watch('name').charAt(0)}</AvatarFallback>
                </Avatar>
                <Input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange}
                    accept="image/png, image/jpeg, image/gif"
                />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    {t('change_photo')}
                </Button>
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('full_name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('full_name_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email_address')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone_number')}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('phone_number_description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('save_changes')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
