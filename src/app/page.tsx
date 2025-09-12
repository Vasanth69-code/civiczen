
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, CheckCircle, Smartphone, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
    const heroImage = PlaceHolderImages.find(img => img.id === 'home-hero');
    const featureImage1 = PlaceHolderImages.find(img => img.id === 'home-feature-1');
    const featureImage2 = PlaceHolderImages.find(img => img.id === 'home-feature-2');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="font-headline text-2xl font-bold">CityZen</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              How It Works
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild>
                <Link href="/login">View All Reports <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 text-center md:px-6 md:py-24 lg:py-32">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Be the Change in Your City
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
            CityZen empowers you to report local issues, track their resolution, and collaborate with your community to build a better neighborhood.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
                <Link href="/login">View Reports</Link>
            </Button>
          </div>
          {heroImage && (
            <div className="relative mt-12 aspect-video w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
                 <Image 
                    src={heroImage.imageUrl} 
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint} 
                    fill
                    className="object-cover"
                    priority
                />
            </div>
          )}
        </section>

        <section id="how-it-works" className="bg-muted py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Reporting an issue is as easy as 1, 2, 3.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Smartphone className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold">1. Snap & Describe</h3>
                        <p className="mt-2 text-muted-foreground">Take a photo or video of the issue and add a quick description. Our AI helps you title and categorize it.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <MapPin className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold">2. Pin the Location</h3>
                        <p className="mt-2 text-muted-foreground">Your location is automatically captured to ensure city services can find the exact spot.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold">3. Track to Resolution</h3>
                        <p className="mt-2 text-muted-foreground">Receive real-time updates as your report is assigned, actioned, and resolved by the city department.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="features" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {featureImage1 && (
                         <div className="relative aspect-square">
                            <Image 
                                src={featureImage1.imageUrl} 
                                alt={featureImage1.description} 
                                data-ai-hint={featureImage1.imageHint}
                                fill
                                className="rounded-lg object-cover shadow-lg"
                            />
                        </div>
                    )}
                    <div className="space-y-4">
                        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">AI-Powered Routing</h2>
                        <p className="text-muted-foreground">Our intelligent system analyzes your report's image and description to automatically categorize the issue, assess its priority, and route it to the correct city department. No more guessing where to send your concerns.</p>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Automatic Department Assignment</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Smart Priority Recommendation</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Faster Response Times</li>
                        </ul>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-center mt-16 md:mt-24">
                     <div className="space-y-4 md:order-2">
                        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Community Leaderboard</h2>
                        <p className="text-muted-foreground">Earn points for every report you submit and see your contributions recognized on the community leaderboard. Compete with fellow citizens to become a top contributor and help make your city a better place.</p>
                         <Button variant="link" asChild className="p-0">
                            <Link href="/leaderboard">View the Leaderboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                    {featureImage2 && (
                        <div className="relative aspect-square md:order-1">
                            <Image 
                                src={featureImage2.imageUrl} 
                                alt={featureImage2.description} 
                                data-ai-hint={featureImage2.imageHint}
                                fill
                                className="rounded-lg object-cover shadow-lg"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>

      </main>

      <footer className="border-t bg-muted">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} CityZen. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
