import { AssemblyAI, Transcript } from "assemblyai";

const apiKey = process.env.NEXT_PUBLIC_ASSEMBLY_API_KEY!


const client = new AssemblyAI({
  apiKey: apiKey, // Replace this with your actual API key
});

/**
 * Function to transcribe an audio file with AssemblyAI
 * @param {string} audioUrl - URL of the audio file to transcribe.
 * @param {object} options - Additional parameters for transcription.
 * @returns {Promise<string>} - Returns a promise resolving to the transcription summary.
 */

export const transcribeAudio = async (
  audioUrl: string,
  options: object = {}
): Promise<Transcript> => {
  if (!audioUrl) {
    throw new Error("Audio URL is required");
  }

  const defaultParams = {
    audio: audioUrl
  };

  const params = { ...defaultParams, ...options };

  try {
    const transcript = await client.transcripts.transcribe(params);
    if (transcript.status === "error") {
      console.error(`Transcription failed: ${transcript.error}`);
      process.exit(1);
    }
    return transcript;
  } catch (error) {
    console.error("Error during transcription:", error);
    throw new Error("Failed to transcribe audio");
  }
};

class TranscribeAudio {

  summarize = () => {

  }
}
