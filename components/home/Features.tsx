import { Captions, CloudDownload, Languages, LetterText, Mic, Share } from "lucide-react";
import React from "react";

const FeatureCard = ({ icon, title, description }: {icon: React.JSX.Element, title: string, description: string}) => {
  return (
    <div className="group relative size-full border bg-gradient-to-br from-primary/10 rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg h-full flex flex-col">
      <div className="relative z-10">
        <div className="p-8 flex-grow">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-6 mx-auto group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-center">
            {title}
          </h3>
          <p className="text-foreground/70 text-center mb-6">{description}</p>
        </div>
      </div>
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          opacity: 0.8,
          background:
            "radial-gradient(200px at -200px -200px, rgba(217, 217, 217, 0.333), transparent 100%)",
        }}
      ></div>
    </div>
  );
};

const Features = () => {
  const featureData = [
    {
      icon: <Mic size={30} />,
      title: "Audio Transcription",
      description:
        "Convert your audio recordings into text with high accuracy using advanced AI technology.",
    },
    {
      icon: <Captions size={30} />,
      title: "Intelligent Summarization",
      description:
        "Get concise summaries of your transcribed content, highlighting key points and main ideas.",
    },
    {
      icon: <LetterText size={30} />,
      title: "Custom Formatting",
      description:
        "Customize the format of your transcriptions for various use cases such as captions or notes.",
    },
    {
      icon: <Languages size={30} />,
      title: "Multi-language Support",
      description:
        "Transcribe and summarize content in multiple languages with seamless translations.",
    },
    {
      icon: <CloudDownload size={30} />,
      title: "Export Options",
      description:
        "Export your transcriptions and summaries in multiple formats like TXT, PDF, and DOCX.",
    },
    {
      icon: (<Share size={30} />),
      title: "Collaboration Tools",
      description:
        "Share transcriptions and summaries with your team and collaborate effortlessly.",
    },
  ];

  return (
    <section
      id="features" className="w-full max-w-6xl mx-auto py-24 select-none"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-16 text-foreground/80">
          Powerful Features for AI Transcribing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features