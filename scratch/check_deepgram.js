const { DeepgramClient } = require("@deepgram/sdk");
console.log("Deepgram SDK Version:", require("@deepgram/sdk/package.json").version);
const deepgram = new DeepgramClient("fake_key");
console.log("Methods available on deepgram.listen.v1.media:", Object.keys(deepgram.listen.v1.media));
