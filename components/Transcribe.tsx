"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Upload,
  ArrowRight,
  ArrowLeft,
  Trash,
  CircleCheck,
} from "lucide-react";
import { transcribeAudio } from "@/lib/assemblyai/transcribe";
import { uploadAudioToCloudinary } from "@/lib/assemblyai/upload";
import { AutoHighlightResult, Chapter, ContentSafetyLabelResult, Entity, SentimentAnalysisResult, TopicDetectionResult, Transcript } from "assemblyai";
import AudioRecorder from "./AudioRecorder";


type TranscriptionType = {
  title: string;
  desc: string;
  value: string;
};

type LanguageOption = {
  language: string;
  code: string;
};

const TRANSCRIPTION_TYPES: TranscriptionType[] = [
  {
    title: "Speech To Text",
    desc: "Generate the text of your audio.",
    value: "text",
  },
  {
    title: "Summarization",
    desc: "Generate a summary of your audio.",
    value: "summarise",
  },
  {
    title: "Content Moderation",
    desc: "Detect sensitive content in audio.",
    value: "moderate",
  },
  {
    title: "Auto Chapters",
    desc: "Summarize audio into chapters.",
    value: "chapter",
  },
  {
    title: "Sentiment Analysis",
    desc: "Analyze speech sentiment.",
    value: "analyse",
  },
  {
    title: "Entity Detection",
    desc: "Extract named entities.",
    value: "entity",
  },
  {
    title: "Topic Detection",
    desc: "Label topics mentioned in audio.",
    value: "topic",
  },
  {
    title: "Key Phrases",
    desc: "Identify key phrases spoken.",
    value: "phrases",
  },
];

const LANGUAGES: LanguageOption[] = [
  { language: "Global English", code: "en" },
  { language: "Australian English", code: "en_au" },
  { language: "British English", code: "en_uk" },
  { language: "US English", code: "en_us" },
  { language: "Spanish", code: "es" },
  { language: "French", code: "fr" },
  { language: "German", code: "de" },
  { language: "Italian", code: "it" },
  { language: "Portuguese", code: "pt" },
  { language: "Russian", code: "ru" },
  { language: "Japanese", code: "ja" },
  { language: "Korean", code: "ko" },
  { language: "Chinese (Simplified)", code: "zh_cn" },
  { language: "Chinese (Traditional)", code: "zh_tw" },
];

const Transcribe = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [transcriptionType, setTranscriptionType] = useState<string>("");
  const [language, setLanguage] = useState<string>("auto");
  const [loadingText, setLoadingText] = useState("");
  const [transcriptionResult, setTranscriptionResult] =
    useState<Transcript | null>(null);

  const [transcription, setTranscription] = useState<string | null>(null);

  const generateTranscription = async () => {
    if (!audioBlob) {
      console.error("No audio blob found. Please record or upload audio.");
      return;
    }
    
    const getLanguageOptions = (language: string) => ({
      language_detection: language === "auto",
      ...(language !== "auto" && { language_code: language }),
    });

    const transcriptionOptions: Record<string, object> = {
      text: {
        format_text: true,
        summary_model: "informative",
        summary_type: "paragraph",
        language_detection: true,
      },
      summarise: {
        summarization: true,
        ...getLanguageOptions(language),
      },
      moderate: {
        content_safety: true,
        ...getLanguageOptions(language),
      },
      chapter: {
        auto_chapters: true,
        ...getLanguageOptions(language),
      },
      analyse: {
        sentiment_analysis: true,
        ...getLanguageOptions(language),
      },
      entity: {
        entity_detection: true,
        ...getLanguageOptions(language),
      },
      topic: {
        iab_categories: true,
        ...getLanguageOptions(language),
      },
      phrases: {
        auto_highlights: true,
        ...getLanguageOptions(language),
      },
    };

    const transcribeOption = transcriptionOptions[transcriptionType];

    if (!transcribeOption) {
      console.error("Invalid transcription type selected.");
      return;
    }

    try {
      // Step 1: Upload Audio
      setLoadingText("Generating...");
      const uploadedAudioUrl = await uploadAudioToCloudinary(audioBlob);

      // Step 2: Transcribe Audio
      setLoadingText("Transcribing...");
      const result = await transcribeAudio(uploadedAudioUrl, transcribeOption);
      setTranscriptionResult(result);

      switch (transcriptionType) {
        case "summarise":
          setTranscription(result.summary || "");
          break;
        case "moderate":
          const safetyLabels = result.content_safety_labels?.results || [];
          setTranscription(
            safetyLabels
              .map((res: ContentSafetyLabelResult) => `- ${" "}${res.text} -> ${res.labels[0].label}`)
              .join(".<br><br>")
          );
          break;
        case "chapter":
          const chapters = result.chapters! || [];
          setTranscription(
            chapters
              .map((res: Chapter) => `- ${" "}${res.headline}`)
              .join(".<br><br>")
          );
          break;
        case "analyse":
          const sentiment_analysis = result.sentiment_analysis_results! || [];
          setTranscription(
            sentiment_analysis
              .map((res: SentimentAnalysisResult) => `- ${" "}${res.text} -> ${res.sentiment}`)
              .join(".<br><br>")
          );
          break;
        case "entity":
          const entities = result.entities! || [];
          setTranscription(
            entities
              .map((res: Entity) => `- ${" "}${res.text} -> ${res.entity_type}`)
              .join(".<br><br>")
          );
          break;
        case "topic":
          const topics = result.iab_categories_result!.results || [];
          setTranscription(
            topics
              .map(
                (res: TopicDetectionResult) => `- ${" "}${res.labels![1].label} -> ${res.text}`
              )
              .join(".<br><br>")
          ); 
          break;
        case "phrases":
          const phrases = result.auto_highlights_result!.results || [];
          setTranscription(
            phrases
              .map((res: AutoHighlightResult) => `${" "}${res.text},`)
              .join(" ")
          ); 
          break;
        default:
          setTranscription(result.text || "");
          break;
      }
    } catch (error) {
      console.error("Error during transcription process:", error);
    } finally {
      setLoadingText("");
      setOpenDialog(false);
    }
  };

  const handleResetStateProps = () => {
    setAudioBlob(null);
    setTranscriptionType("");
    setLanguage("auto");
    setLoadingText("");
    setTranscription(null);
    setTranscriptionResult(null);
  };

  return (
    <>
      <Card className="w-full max-w-xl mx-auto flex flex-col justify-center items-center bg-muted/40">
        {transcriptionResult ? (
          <TranscriptionCard
            transcription={transcription}
            handleResetStateProps={handleResetStateProps}
          />
        ) : (
          <GetAudio
            audioBlob={audioBlob}
            setAudioBlob={setAudioBlob}
            setOpenDialog={setOpenDialog}
          />
        )}
      </Card>
      <SelectTranscriptionType
        transcriptionType={transcriptionType}
        setTranscriptionType={setTranscriptionType}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        language={language}
        setLanguage={setLanguage}
        generateTranscription={generateTranscription}
        loadingText={loadingText}
      />
    </>
  );
};

const GetAudio = ({
  audioBlob,
  setAudioBlob,
  setOpenDialog,
}: {
  audioBlob: Blob | null;
  setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(null);

  const deleteAudio = () => {
    setAudioBlob(null);
    setLocalAudioUrl(null);
  };

  return (
    <>
      <CardHeader>
        <CardDescription className="text-center text-xs sm:text-sm">
          Record your voice or upload your audio to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-center items-center">
          {/* Record audio */}
          <AudioRecorder setAudioBlob={setAudioBlob} setLocalAudioUrl={setLocalAudioUrl} />
        </div>

        {localAudioUrl && (
          <div className="mt-5 mb-10 flex items-center gap-4">
            {/* Play recorded or uploaded audio */}
            <audio controls src={localAudioUrl} className="w-full !h-[50px]" />
            <Button onClick={deleteAudio} variant="destructive">
              <Trash />
            </Button>
          </div>
        )}

        <div className="w-full flex items-center justify-between gap-5 md:gap-10">
          <div className="flex flex-col items-center">
            {/* Upload audio */}
            <label
              htmlFor="audio-upload"
              className="px-5 py-2 bg-muted/70 text-foreground/80 hover:bg-muted rounded cursor-pointer inline-flex items-center gap-1.5 text-sm md:text-base text-nowrap"
            >
              <Upload size={16} />
              <span>Upload Audio</span>
            </label>
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  const tempUrl = URL.createObjectURL(file);
                  setAudioBlob(file);
                  setLocalAudioUrl(tempUrl);
                }
              }}
              className="hidden"
            />
          </div>

          <div>
            {/* Continue button */}
            <Button
              size="lg"
              disabled={!audioBlob}
              onClick={() => setOpenDialog(true)}
            >
              Continue <ArrowRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
};

const SelectTranscriptionType = ({
  transcriptionType,
  setTranscriptionType,
  openDialog,
  setOpenDialog,
  language,
  setLanguage,
  generateTranscription,
  loadingText,
}: {
  transcriptionType: string;
  setTranscriptionType: React.Dispatch<React.SetStateAction<string>>;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  generateTranscription: () => void;
  loadingText: string;
}) => {
  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader className="mb-3">
            <DialogTitle>Select Transcription Option</DialogTitle>
            <DialogDescription/>
          </DialogHeader>
          <Select
            defaultValue="auto"
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue
                placeholder={language ? language : "Select Language"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto" onClick={() => setLanguage("auto")}>
                Auto Detect
              </SelectItem>
              {LANGUAGES.map(({ language, code }) => (
                <SelectItem key={code} value={code}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="max-h-[20rem] overflow-auto mt-5">
            <ul className="space-y-5 mr-3">
              {TRANSCRIPTION_TYPES.map(({ title, desc, value }) => (
                <li
                  key={title}
                  className={`border border-muted hover:border-primary rounded p-3 hover:bg-primary/10 transition-colors flex items-center justify-between gap-5 group ${
                    transcriptionType === value &&
                    "border-primary bg-primary/10"
                  }`}
                  onClick={() => setTranscriptionType(value)}
                >
                  <div>
                    <p className="font-medium text-lg text-foreground/80">
                      {title}
                    </p>
                    <p className="text-xs text-foreground/70">{desc}</p>
                  </div>
                  <CircleCheck
                    className={`text-primary opacity-0 transition-opacity group-hover:opacity-100 ${
                      transcriptionType === value && "opacity-100"
                    }`}
                  />
                </li>
              ))}
              <li className="border border-muted rounded p-3 bg-primary/10">
                <p className="font-medium text-lg text-foreground/80 py-2">
                  More Option Comming Soon...
                </p>
              </li>
            </ul>
          </div>
          <div className="flex justify-center py-3">
            <Button
              size="lg"
              disabled={!transcriptionType && !loadingText}
              className={`text-white ${loadingText && "animate-pulse"}`}
              onClick={generateTranscription}
            >
              {loadingText ? loadingText : "Generate Transcription"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const TranscriptionCard = ({
  transcription,
  handleResetStateProps,
}: {
  transcription: string | null;
  handleResetStateProps: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [copy, setCopy] = useState<string>("Copy");

  useEffect(() => {
    if (transcription) {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + transcription[index]);
        index++;
        if (index >= transcription.length) {
          clearInterval(interval);
        }
      }, 50); // Adjust the delay (in milliseconds) for typing speed

      return () => clearInterval(interval);
    }
    return;
  }, [transcription]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(transcription || "")
      .then(() => {
        setCopy("Copied!");
        setTimeout(() => setCopy("Copy"), 2000); // Clear success message after 2 seconds
      })
      .catch(() => {
        setCopy("Failed to copy.");
        setTimeout(() => setCopy("Copy"), 2000);
      });
  };

  return (
    <div>
      <CardContent>
        <div
          className="max-h-[20rem] overflow-y-auto mt-8 group relative cursor-pointer"
          onClick={handleCopy}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: displayedText
                ? displayedText.replace(/undefined$/, "")
                : "",
            }}
            className="text-sm font-moo leading-relaxed"
          />

          <Button
            size="sm"
            variant={copy === "Copy" ? "outline" : "default"}
            className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
          >
            {copy}
          </Button>
        </div>

        <div className="flex items-center justify-between mt-10 border-t pt-5 gap-5">
          <Button size="lg" variant="outline" onClick={handleResetStateProps}>
            <ArrowLeft /> Go Back
          </Button>
          <Button size="lg">Save To Note</Button>
        </div>
      </CardContent>
    </div>
  );
};

export default Transcribe;
