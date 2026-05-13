const { DeepgramClient } = require("@deepgram/sdk");
const deepgram = new DeepgramClient("fake_key");
console.log("Transcribe URL function:", deepgram.listen.v1.media.transcribeUrl);
