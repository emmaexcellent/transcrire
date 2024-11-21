import { Lightbulb, Mic, Notebook } from "lucide-react";
import Link from "next/link";
import React from "react";

const Step = ({
  icon,
  title,
  description,
  arrowStyle,
}: {
  icon: React.JSX.Element;
  title: string;
  description: string;
  arrowStyle?: { left: string };
}) => (
  <div
    id="how-it-works"
    className="flex flex-col items-center text-center w-full md:w-1/3 mb-12 md:mb-0 relative bg-gradient-br from-primary/10"
  >
    <div className="bg-muted p-6 rounded-full shadow-lg mb-6 text-purple-500">{icon}</div>
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p className="text-foreground/70 max-w-xs">{description}</p>
  </div>
);

const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-16 text-foreground/80">
          How Transcrire Works
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <Step
            icon={<Mic size={30}/>}
            title="Record or Upload"
            description="Start by recording your audio directly in the app or uploading an existing audio file."            
          />
          <Step
            icon={<Notebook size={30} />}
            title="AI Transcription"
            description="Our advanced AI accurately transcribes your audio into text, handling multiple languages and accents."            
          />
          <Step
            icon={<Lightbulb size={30} />}
            title="Smart Summarization"
            description="The AI analyzes the transcription and generates a concise, well-structured summary of the key points."
          />
        </div>
        <div className="mt-16 text-center">
          <Link
            className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out text-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
            href="#try"
          >
            Try It Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
