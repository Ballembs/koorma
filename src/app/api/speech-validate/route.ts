import speech from '@google-cloud/speech';

const client = new speech.SpeechClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get('audio') as Blob;
    const expectedLetter = formData.get('expectedLetter') as string; // e.g., "అ"
    const expectedWord = formData.get('expectedWord') as string;       // e.g., "అమ్మ"

    if (!audioBlob) {
      return Response.json({ error: "No audio provided" }, { status: 400 });
    }

    const audioBuffer = Buffer.from(await audioBlob.arrayBuffer());

    const [response] = await client.recognize({
      audio: { content: audioBuffer.toString('base64') },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'te-IN',
        model: 'default',
        // Boost expected words for better recognition
        speechContexts: [{
          phrases: [expectedLetter, expectedWord].filter(Boolean),
          boost: 20.0,
        }],
      },
    });

    const transcript = response.results
      ?.map(r => r.alternatives?.[0]?.transcript)
      .join(' ')
      .trim() || '';

    const confidence = response.results?.[0]?.alternatives?.[0]?.confidence || 0;

    // VERY GENEROUS matching for young children:
    // - Any Telugu speech detected = good attempt
    // - Transcript contains expected letter or word = success
    // - Confidence > 0.2 = success (extremely lenient)
    // - Even just detecting audio = "nice try!"
    const matched =
      transcript.includes(expectedLetter) ||
      transcript.includes(expectedWord) ||
      confidence > 0.2 ||
      transcript.length > 0; // any Telugu detected = encourage

    return Response.json({
      matched,
      transcript,
      confidence,
      feedback: matched ? 'success' : 'retry',
    });

  } catch (error) {
    console.error('STT Error:', error);
    // On ANY error, default to success — never block the child
    return Response.json({
      matched: true,
      transcript: '',
      confidence: 0,
      feedback: 'success',
      fallback: true,
    });
  }
}
