const { DeepgramClient } = require("@deepgram/sdk");
require("dotenv").config();

async function test() {
  const deepgram = new DeepgramClient(process.env.DEEPGRAM_API_KEY);
  console.log("Deepgram keys:", Object.keys(deepgram));
  console.log("Deepgram.listen keys:", Object.keys(deepgram.listen));
  if (deepgram.listen.v1) {
    console.log("Deepgram.listen.v1 keys:", Object.keys(deepgram.listen.v1));
    if (deepgram.listen.v1.media) {
      console.log("Deepgram.listen.v1.media keys:", Object.keys(deepgram.listen.v1.media));
    }
  }
}

test();
