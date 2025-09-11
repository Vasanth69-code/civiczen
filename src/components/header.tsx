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
import { useState } from "react";

type HeaderProps = {
  title: string;
};

const translations: Record<string, Record<string, string>> = {
    en: {
        title: "Report an Issue",
        language: "Language",
        notifications: "Toggle notifications"
    },
    hi: {
        title: "समस्या की रिपोर्ट करें",
        language: "भाषा",
        notifications: "सूचनाएं टॉगल करें"
    },
    bn: {
        title: "সমস্যা রিপোর্ট করুন",
        language: "ভাষা",
        notifications: "বিজ্ঞপ্তি টগল করুন"
    },
    te: {
        title: "సమస్యను నివేదించండి",
        language: "భాష",
        notifications: "నోటిఫికేషన్‌లను టోగుల్ చేయండి"
    },
    mr: {
        title: "समस्येचा अहवाल द्या",
        language: "भाषा",
        notifications: "सूचना टॉगल करा"
    },
    ta: {
        title: "சிக்கலைப் புகாரளிக்கவும்",
        language: "மொழி",
        notifications: "அறிவிப்புகளை நிலைமாற்று"
    },
    gu: {
        title: "समस्याની જાણ કરો",
        language: "ભાષા",
        notifications: "સૂચનાઓ ટૉગલ કરો"
    },
    ur: {
        title: "مسئلہ کی اطلاع دیں",
        language: "زبان",
        notifications: "اطلاعات کو ٹوگل کریں۔"
    },
    kn: {
        title: "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
        language: "ಭಾಷೆ",
        notifications: "ಅಧಿಸೂಚನೆಗಳನ್ನು ಟಾಗಲ್ ಮಾಡಿ"
    },
    or: {
        title: "ସମସ୍ୟା ରିପୋର୍ଟ କରନ୍ତୁ |",
        language: "ଭାଷା",
        notifications: "ବିଜ୍ଞପ୍ତିଗୁଡ଼ିକୁ ଟୋଗଲ୍ କରନ୍ତୁ |"
    },
    ml: {
        title: "പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക",
        language: "ഭാഷ",
        notifications: "അറിയിപ്പുകൾ ടോഗിൾ ചെയ്യുക"
    },
    pa: {
        title: "ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕਰੋ",
        language: "ਭਾਸ਼ਾ",
        notifications: "ਸੂਚਨਾਵਾਂ ਨੂੰ ਟੌਗਲ ਕਰੋ"
    },
    as: {
        title: "समस्याৰ প্রতিবেদন দিয়ক",
        language: "ভাষা",
        notifications: "জাননীসমূহ টগল কৰক"
    }
};

export function Header({ title: initialTitle }: HeaderProps) {
  const [lang, setLang] = useState('en');
  
  const getTitle = () => {
    if (initialTitle !== "Report an Issue") {
        return initialTitle;
    }
    return translations[lang]?.title || translations['en'].title;
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden">
          <PanelLeft />
        </SidebarTrigger>
        <h1 className="font-headline text-xl font-semibold">{getTitle()}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Select defaultValue="en" onValueChange={setLang}>
          <SelectTrigger className="w-[180px] hidden sm:flex">
            <Languages className="mr-2 h-4 w-4" />
            <SelectValue placeholder={translations[lang]?.language || "Language"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
            <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
            <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
            <SelectItem value="mr">मराठी (Marathi)</SelectItem>
            <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
            <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
            <SelectItem value="ur">اردو (Urdu)</SelectItem>
            <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
            <SelectItem value="or">ଓଡ଼ିଆ (Odia)</SelectItem>
            <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
            <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
            <SelectItem value="as">অসমীয়া (Assamese)</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">{translations[lang]?.notifications || "Toggle notifications"}</span>
        </Button>
      </div>
    </header>
  );
}
