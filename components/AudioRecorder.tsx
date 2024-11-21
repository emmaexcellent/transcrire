"use client";

import { CircleStop } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

const AudioRecorder = ({
  setAudioBlob,
  setLocalAudioUrl,
}: {
  setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
  setLocalAudioUrl: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0); // Recording time in seconds
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        setLocalAudioUrl(URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setTime(0);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Failed to access microphone. Please check your permissions.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="py-5 space-y-4">
      <div className="flex flex-col items-center justify-center gap-6">
        {!isRecording ? (
          <button
            className="p-3 rounded-full bg-gradient-to-tr from-primary via-primary hover:via-purple-500 to-pink-500 mb-10"
            onClick={startRecording}
            aria-label="Start Recording"
          >
            <Image
              src="/mic.svg"
              width={80}
              height={80}
              alt="Start Recording"
            />
          </button>
        ) : (
          <>
            <button
              className="p-3 rounded-full bg-gradient-to-tr from-primary via-primary hover:via-purple-500 to-pink-500 text-white"
              onClick={isPaused ? resumeRecording : pauseRecording}
              aria-label={isPaused ? "Resume Recording" : "Pause Recording"}
            >
              <Image
                src={isPaused ? "/play.svg" : "/pause.svg"}
                width={80}
                height={80}
                alt={isPaused ? "Resume Recording" : "Pause Recording"}
              />
            </button>
            <div className="text-2xl font-mono text-foreground/60">
              {formatTime(time)}
            </div>

            <div className="flex space-x-4">
              <Button
                size="icon"
                variant="destructive"
                onClick={stopRecording}
                aria-label="Stop Recording"
              >
                <CircleStop />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
