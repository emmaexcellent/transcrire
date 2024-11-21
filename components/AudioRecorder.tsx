"use client"
import React, { useState, useRef, useEffect } from "react";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [time, setTime] = useState(0); // Recording time in seconds
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null); // <-- Use browser timer type

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        // <-- Use window.setInterval
        setTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current !== null) {
      clearInterval(timerRef.current); // <-- No more error here
      timerRef.current = null; // <-- Reset the timer reference
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current); // Clear interval on component unmount
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
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setTime(0);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const pauseRecording = () => {
    mediaRecorderRef.current?.pause();
    setIsPaused(true);
  };

  const resumeRecording = () => {
    mediaRecorderRef.current?.resume();
    setIsPaused(false);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setIsPaused(false);
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setTime(0);
    audioChunksRef.current = [];
  };

  const saveRecording = () => {
    if (!audioBlob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(audioBlob);
    link.download = "recording.wav";
    link.click();
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Audio Recorder</h1>

      <div>
        {!isRecording && !audioBlob && (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={startRecording}
          >
            Start Recording
          </button>
        )}
        {isRecording && (
          <div className="flex space-x-4">
            {!isPaused ? (
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={pauseRecording}
              >
                Pause
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={resumeRecording}
              >
                Resume
              </button>
            )}
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={stopRecording}
            >
              Stop
            </button>
          </div>
        )}
        {audioBlob && (
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={deleteRecording}
            >
              Delete
            </button>
            <button
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              onClick={saveRecording}
            >
              Save
            </button>
          </div>
        )}
      </div>

      {isRecording && (
        <div className="text-lg font-mono text-gray-700">
          Recording Time: {formatTime(time)}
        </div>
      )}

      {audioUrl && (
        <div>
          <h2 className="text-lg font-semibold">Recorded Audio:</h2>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
