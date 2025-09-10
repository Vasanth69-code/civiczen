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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, MapPin, Loader2, Video, Wand2, Check, X, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { suggestReportTitles } from "@/ai/flows/suggest-report-titles";
import { autoRouteIssueReport, AutoRouteIssueReportOutput } from "@/ai/flows/auto-route-issue-reports";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "./ui/badge";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters.").max(1000),
  media: z.any().optional(),
});

type Geolocation = {
  latitude: number;
  longitude: number;
}

export function ReportIssueForm() {
  const [geolocation, setGeolocation] = useState<Geolocation | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [routingResult, setRoutingResult] = useState<AutoRouteIssueReportOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLocating(false);
        },
        () => {
          toast({ variant: "destructive", title: "Error", description: "Could not get your location. Please enable location services." });
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast({ variant: "destructive", title: "Error", description: "Geolocation is not supported by this browser." });
      setIsLocating(false);
    }
  }, [toast]);
  
  const handleAutoRouting = async (mediaData: string, description: string) => {
    if (!geolocation || !mediaData || !description) return;
    setIsRouting(true);
    setRoutingResult(null);
    try {
      const result = await autoRouteIssueReport({
        photoDataUri: mediaData,
        description: description,
        location: `${geolocation.latitude}, ${geolocation.longitude}`,
      });
      setRoutingResult(result);
    } catch (error) {
      console.error("AI Routing Error:", error);
      toast({ variant: "destructive", title: "AI Analysis Failed", description: "Could not automatically categorize the issue." });
    } finally {
      setIsRouting(false);
    }
  };
  
  const triggerAIRoutinAndTitle = (description: string, mediaData: string) => {
    handleTitleSuggestion(description, mediaData);
    if(mediaType === 'image') {
        handleAutoRouting(mediaData, description);
    } else {
        setRoutingResult(null);
    }
  }

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setMediaPreview(result);
        const newMediaType = file.type.startsWith('video') ? 'video' : 'image';
        setMediaType(newMediaType);
        if (descriptionRef.current?.value) {
            triggerAIRoutinAndTitle(descriptionRef.current.value, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if(context){
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        setMediaPreview(dataUrl);
        setMediaType('image');
        if (descriptionRef.current?.value) {
            triggerAIRoutinAndTitle(descriptionRef.current.value, dataUrl);
        }
      }
    }
  };
  
  const handleTitleSuggestion = async (description: string, mediaDataUri?: string) => {
    if(description.length < 15) return;
    setIsSuggesting(true);
    try {
      const result = await suggestReportTitles({ description, mediaDataUri });
      if (result.suggestedTitle) {
        form.setValue("title", result.suggestedTitle);
        if (titleRef.current) {
            titleRef.current.focus();
        }
      }
    } catch (error) {
      console.error("AI Title Suggestion Error:", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!geolocation) {
      toast({ variant: "destructive", title: "Location required", description: "We need your location to submit the report." });
      return;
    }
    
    if (!mediaPreview) {
        toast({ variant: "destructive", title: "Photo or Video required", description: "Please provide media for the issue." });
        return;
    }
    
    let finalRoutingInfo = routingResult;

    if (!finalRoutingInfo) {
      setIsRouting(true);
      try {
        finalRoutingInfo = await autoRouteIssueReport({
          photoDataUri: mediaPreview,
          description: values.description,
          location: `${geolocation.latitude}, ${geolocation.longitude}`,
        });
      } catch (error) {
        console.error("Final AI Routing Error:", error);
        toast({ variant: "destructive", title: "Submission Failed", description: "Could not auto-route the issue. Please try again." });
        setIsRouting(false);
        return;
      }
      setIsRouting(false);
    }

    console.log("AI Routing Info:", finalRoutingInfo);

    toast({
        title: "Report Submitted Successfully!",
        description: (
          <div>
            <p>Your issue has been routed to the <strong>{finalRoutingInfo.department}</strong> department.</p>
            <p>Priority: <strong>{finalRoutingInfo.priority}</strong>. Tracking ID: #CITY{Math.floor(1000 + Math.random() * 9000)}</p>
            <p className="text-xs mt-2">An SMS with tracking details has been sent to your registered number.</p>
          </div>
        ),
    });
    form.reset();
    setMediaPreview(null);
    setMediaType(null);
    setRoutingResult(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">New Issue Report</CardTitle>
        <CardDescription>Fill in the details below. Our AI will help categorize and prioritize your report.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))} className="space-y-8">
            <div className="space-y-4">
                <FormField
                control={form.control}
                name="media"
                render={({ field }) => (
                    <FormItem className="text-center">
                        <FormControl>
                            <div className="space-y-4">
                               <Card className="p-2 border-dashed hover:border-primary transition-colors aspect-video flex justify-center items-center">
                                  {mediaPreview ? (
                                    <>
                                      {mediaType === 'image' && <Image src={mediaPreview} alt="Media preview" width={400} height={225} className="rounded-md object-contain max-h-[250px] w-auto"/>}
                                      {mediaType === 'video' && <video src={mediaPreview} controls className="rounded-md object-contain max-h-[250px] w-auto" />}
                                    </>
                                  ) : (
                                    <div className="relative w-full aspect-video">
                                      <video ref={videoRef} className="w-full aspect-video rounded-md bg-secondary" autoPlay muted playsInline />
                                      {hasCameraPermission === false && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4 rounded-md">
                                            <Video className="w-12 h-12 mb-2"/>
                                            <p className="font-semibold">Camera Not Available</p>
                                            <p className="text-xs text-center">Please grant camera permissions to continue.</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Card>

                                {!mediaPreview ? (
                                  <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission} className="w-full">
                                      <Camera className="mr-2"/> Capture Photo
                                  </Button>
                                ) : (
                                  <Button type="button" variant="outline" onClick={() => {setMediaPreview(null); setMediaType(null); setRoutingResult(null);}} className="w-full">
                                      Retake or Upload New
                                  </Button>
                                )}
                                <canvas ref={canvasRef} className="hidden" />

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                        Or
                                        </span>
                                    </div>
                                </div>

                                <label htmlFor="media-upload" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                                    upload a file from your device
                                    <Input id="media-upload" type="file" accept="image/*,video/*" className="sr-only" onChange={handleMediaChange} />
                                </label>
                            </div>
                        </FormControl>
                         {hasCameraPermission === false && !mediaPreview && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>
                                Please allow camera access in your browser settings to use the live photo feature. You can still upload a file.
                                </AlertDescription>
                            </Alert>
                         )}
                        <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description*</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Describe the issue in detail. What is it? Where is it? Why is it a problem?"
                                {...field}
                                rows={5}
                                ref={descriptionRef}
                                onBlur={(e) => { if(mediaPreview) { triggerAIRoutinAndTitle(e.target.value, mediaPreview) }}}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                {(isRouting || routingResult) && (
                  <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Wand2 className="text-primary"/> AI Analysis
                      </FormLabel>
                      <Card className="bg-secondary/50">
                        <CardContent className="p-4">
                          {isRouting ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin"/> Analyzing image...
                            </div>
                          ) : routingResult ? (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Suggested Category</span>
                                <Badge variant="outline">{routingResult.issueType}</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Assigned Department</span>
                                <Badge variant="outline">{routingResult.department}</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Recommended Priority</span>
                                <Badge variant={routingResult.priority === 'High' ? "destructive" : "outline"}>{routingResult.priority}</Badge>
                              </div>
                              <div className="flex justify-end gap-2 pt-2">
                                <Button size="sm" variant="ghost" onClick={() => setRoutingResult(null)}><X className="mr-1 h-4 w-4" /> Incorrect</Button>
                                <Button size="sm" disabled><Check className="mr-1 h-4 w-4" /> Looks good</Button>
                              </div>
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                      <FormDescription>Our AI has analyzed your report. If this looks wrong, you can discard the suggestion.</FormDescription>
                  </FormItem>
                )}

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                Title*
                                {isSuggesting && <Loader2 className="h-4 w-4 animate-spin"/>}
                            </FormLabel>
                            <FormControl>
                                <Input ref={titleRef} placeholder="e.g., Large pothole on Elm Street" {...field} />
                            </FormControl>
                            <FormDescription>A short, clear title for the issue. We can suggest one based on your description.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel>Location*</FormLabel>
                    <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-secondary text-secondary-foreground">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5"/>
                                {isLocating ? (
                                    <span className="text-sm">Getting your location...</span>
                                ) : geolocation ? (
                                    <span className="text-sm">{`Lat: ${geolocation.latitude.toFixed(4)}, Lng: ${geolocation.longitude.toFixed(4)}`}</span>
                                ) : (
                                    <span className="text-sm">Location not available</span>
                                )}
                            </div>
                            {geolocation && (
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={`https://www.openstreetmap.org/?mlat=${geolocation.latitude}&mlon=${geolocation.longitude}#map=16/${geolocation.latitude}/${geolocation.longitude}`} target="_blank">
                                        View on Map <ExternalLink className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                        {geolocation && (
                            <iframe
                                className="w-full h-48 rounded-md mt-2"
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${geolocation.longitude-0.01},${geolocation.latitude-0.01},${geolocation.longitude+0.01},${geolocation.latitude+0.01}&layer=mapnik&marker=${geolocation.latitude},${geolocation.longitude}`}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        )}
                    </div>
                     {!isLocating && !geolocation && (
                        <Alert variant="destructive">
                            <AlertTitle>Location Error</AlertTitle>
                            <AlertDescription>
                            Could not fetch your location. Please ensure location services are enabled in your browser and for this site.
                            </AlertDescription>
                        </Alert>
                    )}
                </FormItem>
            </div>
            
            <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting || isRouting}>
              {(form.formState.isSubmitting || isRouting) ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
