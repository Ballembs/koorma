import textToSpeech from '@google-cloud/text-to-speech';

const client = new textToSpeech.TextToSpeechClient();

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text || text.length > 500) {
    return Response.json({ error: 'Invalid text' }, { status: 400 });
  }

  try {
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: 'te-IN',
        name: 'te-IN-Standard-A',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.75,
        pitch: 1.5,
      },
    });

    // Return as audio/mpeg
    return new Response(response.audioContent as BodyInit, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 24h
      },
    });
  } catch (error) {
    console.error('Dynamic TTS Fallback Error:', error);
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}
