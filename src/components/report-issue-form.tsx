
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
import { useLanguage } from "@/context/language-context";
import { TranslationKey } from "@/lib/translations";

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
  const { t } = useLanguage();

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
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: t('camera_access_denied'),
          description: t('camera_permission_description'),
        });
      }
    };

    getCameraPermission();
  }, [toast, t]);

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
          toast({ variant: "destructive", title: t('error'), description: t('location_error_description') });
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast({ variant: "destructive", title: t('error'), description: t('geolocation_not_supported') });
      setIsLocating(false);
    }
  }, [toast, t]);
  
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
      toast({ variant: "destructive", title: t('ai_analysis_failed'), description: t('ai_analysis_failed_description') });
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
      toast({ variant: "destructive", title: t('location_required'), description: t('location_required_description') });
      return;
    }
    
    if (!mediaPreview) {
        toast({ variant: "destructive", title: t('media_required'), description: t('media_required_description') });
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
        toast({ variant: "destructive", title: t('submission_failed'), description: t('submission_failed_description') });
        setIsRouting(false);
        return;
      }
      setIsRouting(false);
    }

    console.log("AI Routing Info:", finalRoutingInfo);

    toast({
        title: t('report_submitted_successfully'),
        description: (
          <div>
            <p>{t('report_submitted_description', { department: finalRoutingInfo.department })}</p>
            <p>{t('priority')}: <strong>{t(finalRoutingInfo.priority.toLowerCase() as TranslationKey)}</strong>. {t('tracking_id')}: #CITY{Math.floor(1000 + Math.random() * 9000)}</p>
            <p className="text-xs mt-2">{t('sms_notification')}</p>
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
        <CardTitle className="font-headline">{t('new_issue_report')}</CardTitle>
        <CardDescription>{t('new_issue_report_description')}</CardDescription>
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
                                            <p className="font-semibold">{t('camera_not_available')}</p>
                                            <p className="text-xs text-center">{t('camera_permission_prompt')}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Card>

                                {!mediaPreview ? (
                                  <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission} className="w-full">
                                      <Camera className="mr-2"/> {t('capture_photo')}
                                  </Button>
                                ) : (
                                  <Button type="button" variant="outline" onClick={() => {setMediaPreview(null); setMediaType(null); setRoutingResult(null);}} className="w-full">
                                      {t('retake_or_upload_new')}
                                  </Button>
                                )}
                                <canvas ref={canvasRef} className="hidden" />

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                        {t('or')}
                                        </span>
                                    </div>
                                </div>

                                <label htmlFor="media-upload" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                                    {t('upload_from_device')}
                                    <Input id="media-upload" type="file" accept="image/*,video/*" className="sr-only" onChange={handleMediaChange} />
                                </label>
                            </div>
                        </FormControl>
                         {hasCameraPermission === false && !mediaPreview && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTitle>{t('camera_access_required')}</AlertTitle>
                                <AlertDescription>
                                {t('camera_access_required_description')}
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
                        <FormLabel>{t('description_label')}</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder={t('description_placeholder')}
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
                        <Wand2 className="text-primary"/> {t('ai_analysis')}
                      </FormLabel>
                      <Card className="bg-secondary/50">
                        <CardContent className="p-4">
                          {isRouting ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin"/> {t('analyzing_image')}
                            </div>
                          ) : routingResult ? (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{t('suggested_category')}</span>
                                <Badge variant="outline">{routingResult.issueType}</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{t('assigned_department')}</span>
                                <Badge variant="outline">{routingResult.department}</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{t('recommended_priority')}</span>
                                <Badge variant={routingResult.priority === 'High' ? "destructive" : "outline"}>{t(routingResult.priority.toLowerCase() as TranslationKey)}</Badge>
                              </div>
                              <div className="flex justify-end gap-2 pt-2">
                                <Button size="sm" variant="ghost" onClick={() => setRoutingResult(null)}><X className="mr-1 h-4 w-4" /> {t('incorrect')}</Button>
                                <Button size="sm" disabled><Check className="mr-1 h-4 w-4" /> {t('looks_good')}</Button>
                              </div>
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                      <FormDescription>{t('ai_analysis_description')}</FormDescription>
                  </FormItem>
                )}

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                {t('title_label')}
                                {isSuggesting && <Loader2 className="h-4 w-4 animate-spin"/>}
                            </FormLabel>
                            <FormControl>
                                <Input ref={titleRef} placeholder={t('title_placeholder')} {...field} />
                            </FormControl>
                            <FormDescription>{t('title_description')}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel>{t('location_label')}</FormLabel>
                    <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-secondary text-secondary-foreground">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5"/>
                                {isLocating ? (
                                    <span className="text-sm">{t('getting_location')}</span>
                                ) : geolocation ? (
                                    <span className="text-sm">{`Lat: ${geolocation.latitude.toFixed(4)}, Lng: ${geolocation.longitude.toFixed(4)}`}</span>
                                ) : (
                                    <span className="text-sm">{t('location_not_available')}</span>
                                )}
                            </div>
                            {geolocation && (
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={`https://www.openstreetmap.org/?mlat=${geolocation.latitude}&mlon=${geolocation.longitude}#map=16/${geolocation.latitude}/${geolocation.longitude}`} target="_blank">
                                        {t('view_on_map')} <ExternalLink className="ml-2 h-4 w-4" />
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
                            <AlertTitle>{t('location_error')}</AlertTitle>
                            <AlertDescription>
                            {t('location_error_fetching_description')}
                            </AlertDescription>
                        </Alert>
                    )}
                </FormItem>
            </div>
            
            <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting || isRouting}>
              {(form.formState.isSubmitting || isRouting) ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('submitting')}</> : t('submit_report')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    
    