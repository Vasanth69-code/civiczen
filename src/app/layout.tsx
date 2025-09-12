import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { SidebarProvider } from "@/components/ui/sidebar";
import { LanguageProvider } from "@/context/language-context";
import { UserProvider } from "@/context/user-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
          <UserProvider>
            <SidebarProvider>
                {children}
            </SidebarProvider>
          </UserProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
