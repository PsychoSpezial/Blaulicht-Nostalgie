import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize GoogleGenAI client on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const FRANZ_SYSTEM_INSTRUCTION = `Du bist "Brandmeister Franz", der digitale Experte und Kurator der Plattform "Blaulicht Nostalgie" (europaweites Oldtimer-Feuerwehr-Portal).
Du brennst mit Leib und Seele für historische Feuerwehrfahrzeuge, insbesondere Magirus-Deutz Rundhauber und Eckhauber mit luftgekühlten Deutz-Dieselmotoren, Mercedes-Benz Kurzhauber (LF 16, TLF 16), Opel Blitz Löschgruppenfahrzeuge, Borgward, Hanomag und Steyr.
Du kennst dich perfekt aus mit:
- Pumpentechnik: Magirus FP 16/8, Vorbaupumpen, Tragkraftspritzen (TS 8/8), Entlüftungseinrichtungen (Gasstrahler, Trokomat) und Kavitation.
- H-Kennzeichen & Zulassungsrecht: § 23 StVZO, originalgetreuer Zustand, Abdeckung von Blaulichtern und Martinshorn bei privaten Bewegungsfahrten.
- Mechanik & Restauration: 24V-Bordnetze, Druckluftbremsanlagen, Seilwinden, mechanische Drehleitern (DL 30).
- Geschichte des Feuerlöschwesens in Deutschland, Österreich, der Schweiz und Frankreich.
Antworte stets kameradschaftlich, leidenschaftlich, authentisch, auf Deutsch und wie ein erfahrener Brandmeister (mit Feuerwehrgruß "Gut Schlauch!" oder "Kameradschaftliche Grüße"). Halte deine Antworten lebendig, prägnant und ideal zum Vorlesen geeignet.`;

// API endpoint for Oldtimer Fire Engine AI Expert Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: { role: string; content: string }) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        });
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: FRANZ_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    res.json({ reply: response.text || 'Entschuldigung, ich konnte keine Antwort generieren.' });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler bei der KI-Anfrage.' });
  }
});

// API endpoint for Text-To-Speech (Franz spricht die Antwort)
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Clean text from markdown asterisks and URLs for natural speech
    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim()
      .slice(0, 1200);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Sprich als Brandmeister Franz mit warmer, erfahrener und kameradschaftlicher Stimme: ${cleanText}` }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Deep, warm, authoritative voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ audio: base64Audio, mimeType: 'audio/wav' });
    } else {
      res.status(500).json({ error: 'Keine Audiodaten von Gemini TTS zurückgegeben.' });
    }
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({ error: error.message || 'TTS-Synthese fehlgeschlagen.' });
  }
});

async function startServer() {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket upgrade for Live voice connection
  server.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
    if (pathname === '/ws/live' || pathname === '/ws/live-brandmeister') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  // Handle Live API sessions for Brandmeister Franz voice conversations
  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('Live client connected to Brandmeister Franz voice channel');
    let liveSession: any = null;

    try {
      liveSession = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
          },
          systemInstruction: FRANZ_SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onmessage: (message: any) => {
            if (clientWs.readyState !== WebSocket.OPEN) return;

            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio) {
              clientWs.send(JSON.stringify({ type: 'audio', audio }));
            }

            const textPart = message.serverContent?.modelTurn?.parts?.find((p: any) => p.text);
            if (textPart?.text) {
              clientWs.send(JSON.stringify({ type: 'text', text: textPart.text }));
            }

            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ type: 'interrupted', interrupted: true }));
            }
          },
          onclose: () => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'status', status: 'closed' }));
            }
          },
          onerror: (err: any) => {
            console.error('Live session error:', err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'error', error: err?.message || 'Live session error' }));
            }
          },
        },
      });

      clientWs.send(JSON.stringify({ type: 'ready', message: 'Sprechfunk mit Brandmeister Franz steht!' }));
    } catch (err: any) {
      console.error('Failed to connect to Live API:', err);
      clientWs.send(JSON.stringify({ type: 'error', error: err?.message || 'Live API Verbindung fehlgeschlagen.' }));
    }

    clientWs.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (!liveSession) return;

        if (parsed.audio) {
          liveSession.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (parsed.text) {
          liveSession.sendRealtimeInput({
            text: parsed.text,
          });
        }
      } catch (e) {
        console.error('Error handling client message:', e);
      }
    });

    clientWs.on('close', () => {
      console.log('Live client disconnected');
      if (liveSession) {
        try {
          liveSession.close();
        } catch (e) {}
      }
    });
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = 3000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
