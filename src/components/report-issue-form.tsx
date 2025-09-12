
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
import { Camera, MapPin, Loader2, Video, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useIssues } from "@/context/issue-context";
import { useUser } from "@/context/user-context";
import type { Issue } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";


const issueTypes = [
    "Pothole",
    "Garbage Overflow",
    "Streetlight Outage",
    "Graffiti",
    "Damaged Signage",
    "Electrical Line Damage",
    "Sewage Overflow",
    "Tree Damage",
    "Other"
];

const priorities = ["Low", "Medium", "High"];

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters.").max(1000),
  category: z.string({ required_error: "Please select a category." }),
  priority: z.enum(["Low", "Medium", "High"]),
  media: z.any().refine(file => file, "Please capture or upload a photo/video."),
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
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useLanguage();
  const { addIssue } = useIssues();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium"
    },
  });
  
  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
  
  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setMediaPreview(result);
        const newMediaType = file.type.startsWith('video') ? 'video' : 'image';
        setMediaType(newMediaType);
        form.setValue('media', result);
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
        form.setValue('media', dataUrl);
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!geolocation) {
      toast({ variant: "destructive", title: t('location_required'), description: t('location_required_description') });
      return;
    }
    
    setIsSubmitting(true);

    const newIssue: Omit<Issue, 'id' | 'createdAt'> = {
        title: values.title,
        description: values.description,
        status: 'Pending',
        category: values.category,
        priority: values.priority,
        department: 'Pending Assignment',
        location: { lat: geolocation.latitude, lng: geolocation.longitude },
        address: 'Fetching address...',
        imageUrl: mediaPreview as string,
        imageHint: "reported issue",
        reporter: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
    };

    try {
        const newIssueId = await addIssue(newIssue);
        
        toast({
            title: t('report_submitted_successfully'),
            description: `${t('tracking_id')}: #${newIssueId.substring(0,5)}.`,
        });
        
        form.reset();
        setMediaPreview(null);
        setMediaType(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "There was an error submitting your report. Please try again."
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t('new_issue_report')}</CardTitle>
        <CardDescription>{t('new_issue_report_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="media"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('media_label')}</FormLabel>
                    <FormControl>
                      <div className="space-y-4 text-center">
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
                          <Button type="button" variant="outline" onClick={() => {setMediaPreview(null); setMediaType(null); form.setValue('media', null); if (fileInputRef.current) fileInputRef.current.value = "";}} className="w-full">
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
                        
                        <Button asChild variant="link" className="cursor-pointer">
                            <label htmlFor="media-upload">{t('upload_from_device')}</label>
                        </Button>
                        <Input 
                            id="media-upload"
                            type="file" 
                            accept="image/*,video/*" 
                            className="sr-only" 
                            ref={fileInputRef}
                            onChange={handleMediaChange}
                        />
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
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                {t('title_label')}
                            </FormLabel>
                            <FormControl>
                                <Input placeholder={t('title_placeholder')} {...field} />
                            </FormControl>
                            <FormDescription>{t('title_description')}</FormDescription>
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
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('category')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('select_category_placeholder')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {issueTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('priority')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('select_priority_placeholder')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {priorities.map(p => (
                                <SelectItem key={p} value={p}>{t(p.toLowerCase() as any)}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
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
                             <div className="h-48 w-full rounded-md mt-2 overflow-hidden z-0">
                                <MapContainer center={[geolocation.latitude, geolocation.longitude]} zoom={16} scrollWheelZoom={false} className="h-full w-full">
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[geolocation.latitude, geolocation.longitude]} />
                                </MapContainer>
                            </div>
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
            
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('submitting')}</> : t('submit_report')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
