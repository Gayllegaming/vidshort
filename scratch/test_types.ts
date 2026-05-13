import { DeepgramClient } from "@deepgram/sdk";
const deepgram = new DeepgramClient({ apiKey: "test" });
async function test() {
  await deepgram.listen.v1.media.transcribeUrl(
    { 
      url: "test",
      smart_format: true,
      model: "nova-2",
      detect_language: true,
      utterances: true,
      paragraphs: true,
    }
  );
}
