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

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden">
          <PanelLeft />
        </SidebarTrigger>
        <h1 className="font-headline text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Select defaultValue="en">
          <SelectTrigger className="w-[180px] hidden sm:flex">
            <Languages className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Language" />
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
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
    </header>
  );
}
