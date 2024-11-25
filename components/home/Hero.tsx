"use client";
import React from "react";
import Transcribe from "../Transcribe";
import Link from "next/link";
import { Notebook } from "lucide-react";

const Hero = () => {
  return (
    <section id="try" className="">
      <div className="w-full max-w-6xl mx-auto p-4 lg:p-6">
        <div className="w-full max-w-3xl mx-auto my-10 lg:my-16">
          <h1 className="text-3xl md:text-4xl leading-normal font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent text-center">
            🎙️ Turn Speech into Actionable Insights with AI
          </h1>
          <p className="text-center pt-5 text-foreground/70 text-sm px-12">
            Use AI to convert your audio & video into concise, structured note.
            Save time and boost productivity.
          </p>
          <div className="w-full flex justify-center gap-3">
            <Link
              className="text-foreground/60 group gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 bg-primary/60 hover:bg-primary/80 inline-flex items-center gap-2 mt-10"
              href="/notes"
            >
              <Notebook className="text-foreground/50" />
              See All Notes
            </Link>
          </div>
        </div>
        <Transcribe />
      </div>
    </section>
  );
};

export default Hero;
