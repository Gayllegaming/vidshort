const { DeepgramClient } = require("@deepgram/sdk");
const deepgram = new DeepgramClient("fake_key");

async function test() {
  try {
    const response = await deepgram.listen.v1.media.transcribeUrl(
      { url: "https://example.com/audio.mp3" },
      { model: "nova-2" }
    );
    console.log("Response Keys:", Object.keys(response));
    if (response.result) {
        console.log("Result Keys:", Object.keys(response.result));
    }
  } catch (err) {
    console.log("Error during call (expected with fake key):", err.message);
  }
}

test();
