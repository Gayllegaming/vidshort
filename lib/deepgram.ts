import { DeepgramClient } from "@deepgram/sdk";

export const deepgram = new DeepgramClient(process.env.DEEPGRAM_API_KEY, {
  global: {
    timeout: 30000,
  },
});
