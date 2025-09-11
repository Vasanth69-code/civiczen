"use client";

import { Bell, Languages, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLanguage } from "@/context/language-context";
import { languages, TranslationKey } from "@/lib/translations";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden">
          <PanelLeft />
        </SidebarTrigger>
        <h1 className="font-headline text-xl font-semibold">{t(title as TranslationKey)}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Select value={language} onValueChange={(value) => setLanguage(value as keyof typeof languages)}>
          <SelectTrigger className="w-[180px] hidden sm:flex">
            <Languages className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t('language')} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(languages).map(([langCode, langData]) => (
                <SelectItem key={langCode} value={langCode}>{langData.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">{t('toggle_notifications')}</span>
        </Button>
      </div>
    </header>
  );
}
