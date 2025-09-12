import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { SidebarProvider } from "@/components/ui/sidebar";
import { LanguageProvider } from "@/context/language-context";
import { UserProvider } from "@/context/user-context";
import { IssueProvider } from "@/context/issue-context";

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
         <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="font-body antialiased flex flex-col items-center min-h-screen">
        <LanguageProvider>
          <UserProvider>
            <IssueProvider>
              <SidebarProvider>
                  {children}
              </SidebarProvider>
            </IssueProvider>
          </UserProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
