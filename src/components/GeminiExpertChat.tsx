import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  User,
  Sparkles,
  Flame,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  RadioTower,
  Play,
  Square,
  MessageSquare,
  RefreshCw,
  PhoneCall,
  PhoneOff,
  Headphones,
  Sliders,
  AlertCircle,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

// Convert Float32 audio samples from 16kHz microphone to 16-bit PCM Base64
function floatTo16BitPCMBase64(float32Array: Float32Array): string {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const uint8 = new Uint8Array(int16Array.buffer);
  let binary = '';
  const len = uint8.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  return btoa(binary);
}

export const GeminiExpertChat: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'live' | 'text'>('live');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content:
        'Guten Tag! Hier ist Brandmeister Franz. Ich brenne für Oldtimer-Feuerwehrwagen! Starte jetzt die Live-Funkverbindung (Gemini 3.8 Live) und sprich direkt über dein Mikrofon mit mir. Ich antworte dir live per Sprache!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Live API state
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isMicStreaming, setIsMicStreaming] = useState(false);
  const [isFranzSpeaking, setIsFranzSpeaking] = useState(false);
  const [liveLog, setLiveLog] = useState<string[]>([
    'Kanal 464 (4m-Band) bereit.',
    'Klicke auf "Live-Funkverbindung starten" um direkt mit Franz zu sprechen.',
  ]);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [liveAudioLevel, setLiveAudioLevel] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  // Audio & WebSocket refs
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const scheduleStateRef = useRef<{ nextStartTime: number }>({ nextStartTime: 0 });
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const liveLogEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    liveLogEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, liveLog, liveTranscript, loading]);

  // Clean up audio resources on unmount
  useEffect(() => {
    return () => {
      stopLiveSession();
      stopAudioPlayback();
    };
  }, []);

  const addLiveLog = (text: string) => {
    setLiveLog((prev) => [...prev.slice(-15), text]);
  };

  // Play 24kHz PCM chunk received from Gemini Live
  const playLiveAudioChunk = useCallback((base64Audio: string) => {
    try {
      if (!outputAudioCtxRef.current) {
        outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });
      }
      const ctx = outputAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Int16Array(len / 2);
      for (let i = 0; i < len; i += 2) {
        bytes[i / 2] = binaryString.charCodeAt(i) | (binaryString.charCodeAt(i + 1) << 8);
      }
      const float32 = new Float32Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) {
        float32[i] = bytes[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const now = ctx.currentTime;
      const startTime = Math.max(now, scheduleStateRef.current.nextStartTime);
      source.start(startTime);
      scheduleStateRef.current.nextStartTime = startTime + audioBuffer.duration;

      activeSourcesRef.current.push(source);
      setIsFranzSpeaking(true);

      source.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
        if (activeSourcesRef.current.length === 0) {
          setIsFranzSpeaking(false);
        }
      };
    } catch (e) {
      console.error('Error playing 24kHz PCM chunk:', e);
    }
  }, []);

  const stopAllModelAudio = () => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch (e) {}
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      scheduleStateRef.current.nextStartTime = outputAudioCtxRef.current.currentTime;
    }
    setIsFranzSpeaking(false);
  };

  // Start Live Session (WebSocket to Gemini 3.8 Live)
  const startLiveSession = async () => {
    setMicError(null);
    stopLiveSession();

    try {
      addLiveLog('Verbinde mit Gemini 3.8 Live Server...');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}/ws/live`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsLiveConnected(true);
        addLiveLog('Live-Funkkanal 464 etabliert. Starte Audio-Aufnahme...');
        startMicCapture();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'ready') {
            addLiveLog('Brandmeister Franz ist auf Empfang!');
          } else if (data.type === 'audio' && data.audio) {
            playLiveAudioChunk(data.audio);
          } else if (data.type === 'text' && data.text) {
            setLiveTranscript((prev) => prev + data.text);
          } else if (data.type === 'interrupted') {
            stopAllModelAudio();
            addLiveLog('Funkspruch unterbrochen.');
          } else if (data.type === 'error') {
            addLiveLog(`Warnung: ${data.error}`);
          }
        } catch (e) {
          console.error(e);
        }
      };

      ws.onerror = (e) => {
        console.error('Live WS error:', e);
        addLiveLog('Verbindungsfehler zum Live-Funkkanal.');
        setIsLiveConnected(false);
      };

      ws.onclose = () => {
        setIsLiveConnected(false);
        setIsMicStreaming(false);
        addLiveLog('Live-Funkverbindung beendet.');
      };
    } catch (err: any) {
      console.error('Failed to start Live session:', err);
      setMicError(err.message || 'Live session initialization failed');
    }
  };

  // Capture Microphone and stream 16kHz PCM to WebSocket
  const startMicCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      inputAudioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      // ScriptProcessor for 16kHz PCM chunk streaming
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);

        // Calculate visualizer volume level
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += Math.abs(inputData[i]);
        }
        const rms = Math.sqrt(sum / inputData.length);
        setLiveAudioLevel(Math.min(100, Math.round(rms * 250)));

        // Send PCM chunk to WebSocket if open
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const base64PCM = floatTo16BitPCMBase64(inputData);
          wsRef.current.send(JSON.stringify({ audio: base64PCM }));
        }
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
      setIsMicStreaming(true);
      addLiveLog('Mikrofon aktiv: Sprich jetzt frei mit Brandmeister Franz!');
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setMicError(
        'Mikrofonzugriff nicht gestattet oder nicht verfügbar. Du kannst unten auch Fragen eintippen, die Franz per Live-Sprache beantwortet.'
      );
      addLiveLog('Hinweis: Mikrofon gesperrt. Live-Text-Sprachmodus aktiv.');
    }
  };

  // Stop Live Session
  const stopLiveSession = () => {
    setIsMicStreaming(false);
    setIsLiveConnected(false);
    setIsFranzSpeaking(false);
    setLiveAudioLevel(0);

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    stopAllModelAudio();
  };

  // Send text query into the Live API session (or HTTP fallback)
  const sendLiveTextMessage = (text: string) => {
    if (!text.trim()) return;
    addLiveLog(`Du: "${text}"`);
    setLiveTranscript('');

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text }));
      addLiveLog('Franz denkt nach und antwortet gleich per Sprache...');
    } else {
      // If Live session isn't open yet, start it or use HTTP chat + TTS
      processQuestion(text);
    }
    setInput('');
  };

  // HTTP Chat + TTS fallback
  const processQuestion = async (queryText: string) => {
    const userMsg = queryText.trim();
    if (!userMsg) return;
    setInput('');
    const newHistory = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const reply = data.reply;
        setMessages([...newHistory, { role: 'model', content: reply }]);
        if (autoSpeak || activeSubTab === 'live') {
          speakWithFranzVoice(reply);
        }
      } else {
        const errText = `Kamerad, da gab es eine Funkstörung: ${data.error || 'Fehler'}`;
        setMessages([...newHistory, { role: 'model', content: errText }]);
        if (autoSpeak) speakWithFranzVoice(errText);
      }
    } catch (err) {
      console.error(err);
      const connErr = 'Verbindungsabbruch zur Leitstelle. Bitte versuche es erneut!';
      setMessages([...newHistory, { role: 'model', content: connErr }]);
      if (autoSpeak) speakWithFranzVoice(connErr);
    } finally {
      setLoading(false);
    }
  };

  const speakWithFranzVoice = async (text: string) => {
    stopAudioPlayback();
    setIsFranzSpeaking(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audio}`);
          currentAudioElementRef.current = audio;
          audio.onended = () => setIsFranzSpeaking(false);
          audio.onerror = () => fallbackBrowserSpeech(text);
          await audio.play();
          return;
        }
      }
      fallbackBrowserSpeech(text);
    } catch (err) {
      console.warn('Server TTS failed, using browser speech fallback:', err);
      fallbackBrowserSpeech(text);
    }
  };

  const fallbackBrowserSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setIsFranzSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'de-DE';
    utterance.pitch = 0.9;
    utterance.rate = 1.0;
    utterance.onend = () => setIsFranzSpeaking(false);
    utterance.onerror = () => setIsFranzSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopAudioPlayback = () => {
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
      currentAudioElementRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    stopAllModelAudio();
  };

  const samplePrompts = [
    'Was ist der Unterschied zwischen Magirus Rundhauber und Mercedes Kurzhauber?',
    'Wie pflege und überhole ich eine alte Magirus FP 16/8 Kreiselpumpe?',
    'Welche Auflagen gibt es für Blaulicht und Martinshorn bei Oldtimern mit H-Kennzeichen?',
    'Erzähle mir die Geschichte der Drehleiter und Vorbaupumpen in den 1950ern.',
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#090d16] text-slate-100 py-6 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-5">
        {/* Header & Radio Status Bar */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-950/60 border border-red-500/30">
                <Flame className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 flex items-center justify-center ${
                  isLiveConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-white">Brandmeister Franz</h1>
                <span className="bg-red-950 text-red-300 border border-red-800/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Gemini 3.8 Live API
                </span>
                <span className="bg-slate-800 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  <span>Kanal 464 (4m Funk)</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                „Ich brenne für Oldtimer-Feuerwehrwagen! Sprich in Echtzeit mit mir – Live Audioübertragung.“
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-center">
            <button
              onClick={() => {
                setActiveSubTab('live');
                stopAudioPlayback();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'live'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-white" />
              <span>Live-Sprechfunk (Live API)</span>
            </button>
            <button
              onClick={() => {
                setActiveSubTab('text');
                stopAudioPlayback();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'text'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Text-Archiv &amp; Chat</span>
            </button>
          </div>
        </div>

        {/* 1. LIVE VOICE MODE: Gemini 3.8 Live WebSocket Streaming */}
        {activeSubTab === 'live' && (
          <div className="bg-gradient-to-b from-[#131b2e] to-[#0a101d] rounded-2xl border-2 border-slate-700/80 p-6 sm:p-8 flex flex-col justify-between shadow-2xl space-y-6 relative overflow-hidden">
            {/* Top Bar with Status Indicators */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <RadioTower className="w-5 h-5 text-red-500 animate-pulse" />
                <div>
                  <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase block">
                    BOS-Funkgerät FuG 8b-1 (Echtzeit Gemini Live)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Modell: <strong className="text-red-400">gemini-3.8-live</strong> · 16kHz PCM Audio In / 24kHz PCM Out
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isMicStreaming ? 'bg-red-500 animate-ping' : 'bg-slate-600'
                    }`}
                  ></span>
                  <span className={isMicStreaming ? 'text-red-400 font-bold' : 'text-slate-500'}>
                    TX (Du sprichst)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isFranzSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'
                    }`}
                  ></span>
                  <span className={isFranzSpeaking ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    RX (Franz antwortet)
                  </span>
                </div>
              </div>
            </div>

            {/* Central Interactive Console */}
            <div className="flex flex-col items-center text-center space-y-6 py-4">
              {/* Animated Vintage Speaker / Visualizer Dial */}
              <div className="relative">
                <div
                  className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 ${
                    isFranzSpeaking
                      ? 'border-emerald-500 bg-emerald-950/40 shadow-[0_0_60px_rgba(16,185,129,0.4)] scale-105'
                      : isMicStreaming
                      ? 'border-red-500 bg-red-950/40 shadow-[0_0_60px_rgba(239,68,68,0.5)] scale-105'
                      : isLiveConnected
                      ? 'border-blue-500 bg-blue-950/30'
                      : 'border-slate-700 bg-slate-900/80 shadow-xl'
                  }`}
                >
                  {isFranzSpeaking ? (
                    <>
                      <Volume2 className="w-16 h-16 text-emerald-400 animate-bounce" />
                      <span className="text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wider mt-1">
                        Franz spricht live...
                      </span>
                    </>
                  ) : isMicStreaming ? (
                    <>
                      <Mic className="w-16 h-16 text-red-500 animate-pulse" />
                      <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-wider mt-1">
                        Auf Sendung...
                      </span>
                      {/* Audio Level Meter */}
                      <div className="w-20 bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-red-500 h-full transition-all duration-75"
                          style={{ width: `${liveAudioLevel}%` }}
                        ></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Headphones className="w-14 h-14 text-slate-500" />
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mt-2">
                        Funk-Standby
                      </span>
                    </>
                  )}
                </div>

                {/* Animated Pulsing Waves */}
                {(isFranzSpeaking || isMicStreaming) && (
                  <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping pointer-events-none"></div>
                )}
              </div>

              {/* Status & Help Text */}
              <div className="space-y-1 max-w-lg">
                <h3 className="text-lg font-bold text-white">
                  {isFranzSpeaking
                    ? 'Brandmeister Franz antwortet über Live-Audio'
                    : isMicStreaming
                    ? 'Mikrofon ist auf Sendung – sprich frei deine Frage!'
                    : isLiveConnected
                    ? 'Live-Kanal aktiv. Bereit zum Sprechen!'
                    : 'Live-Sprechfunk mit Brandmeister Franz'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isMicStreaming
                    ? 'Stelle jede Frage über Oldtimer-Löschfahrzeuge, Motoren (z.B. Deutz V8 luftgekühlt), Pumpen (FP 16/8) oder H-Zulassung.'
                    : 'Klicke auf den roten Knopf unten, um die Echtzeit-Funkverbindung (Gemini 3.8 Live) zu starten.'}
                </p>
              </div>

              {/* Mic error notice if blocked in iframe */}
              {micError && (
                <div className="bg-amber-950/60 border border-amber-600/50 text-amber-200 text-xs p-3 rounded-xl max-w-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{micError}</span>
                </div>
              )}

              {/* Action Buttons: Start / Stop Live Call */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {!isLiveConnected ? (
                  <button
                    onClick={startLiveSession}
                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-red-950/80 border border-red-400/40 flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer"
                  >
                    <PhoneCall className="w-6 h-6 animate-pulse" />
                    <span>Live-Funkverbindung starten (Sprechen)</span>
                  </button>
                ) : (
                  <button
                    onClick={stopLiveSession}
                    className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer"
                  >
                    <PhoneOff className="w-6 h-6 text-red-400" />
                    <span>Funkverbindung beenden</span>
                  </button>
                )}

                {isFranzSpeaking && (
                  <button
                    onClick={stopAudioPlayback}
                    className="px-4 py-4 bg-slate-800/90 hover:bg-slate-700 text-red-400 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <VolumeX className="w-4 h-4" />
                    <span>Ton stummschalten</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Radio Log & Transcript Box */}
            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold uppercase text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Funkprotokoll &amp; Live-Übertragung</span>
                </span>
                <span className="font-mono text-emerald-400 text-[10px]">
                  {isLiveConnected ? 'STATUS: ONLINE (464)' : 'STATUS: STANDBY'}
                </span>
              </div>

              <div className="max-h-32 overflow-y-auto space-y-1 text-xs font-mono text-slate-300">
                {liveLog.map((log, idx) => (
                  <div key={idx} className="leading-tight">
                    <span className="text-slate-500 mr-2">›</span>
                    <span>{log}</span>
                  </div>
                ))}
                {liveTranscript && (
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 text-slate-100 mt-2 font-sans italic">
                    <strong>Franz:</strong> „{liveTranscript}“
                  </div>
                )}
                <div ref={liveLogEndRef} />
              </div>

              {/* Live Text Query input directly for the live voice channel */}
              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Thema oder Frage an Franz senden (Franz spricht sofort die Antwort)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      sendLiveTextMessage(input);
                    }
                  }}
                  className="flex-1 px-3.5 py-2.5 bg-[#0b1120] border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={() => sendLiveTextMessage(input)}
                  disabled={!input.trim()}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>Senden &amp; Anhören</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. TEXT & CHAT ARCHIVE MODE */}
        {activeSubTab === 'text' && (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Quick sample prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(prompt);
                  }}
                  className="p-3 bg-[#0f172a] hover:bg-slate-800/80 border border-slate-800 hover:border-red-500/40 rounded-lg text-xs text-slate-300 text-left transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <Sparkles className="w-3.5 h-3.5 text-red-400 shrink-0 opacity-70 group-hover:opacity-100" />
                </button>
              ))}
            </div>

            {/* Chat Messages Box */}
            <div className="flex-1 bg-[#0f172a] rounded-xl border border-slate-800 p-4 sm:p-6 flex flex-col justify-between shadow-xl min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user'
                          ? 'bg-slate-700 text-white'
                          : 'bg-red-600 text-white shadow-md shadow-red-950/50'
                      }`}
                    >
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-red-600 text-white rounded-tr-none'
                          : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-line'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">{msg.content}</div>
                        {msg.role === 'model' && (
                          <button
                            onClick={() => speakWithFranzVoice(msg.content)}
                            title="Mit Franz' Stimme vorlesen"
                            className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors shrink-0"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center animate-pulse">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]"></span>
                      <span className="ml-1">Brandmeister Franz schlägt in den Feuerwehr-Archiven nach...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Form with Send Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                processQuestion(input);
              }}
              className="space-y-2"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Stelle deine Frage an Brandmeister Franz..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-[#0f172a] border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 shadow-inner"
                />

                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-medium text-xs sm:text-sm rounded-xl shadow-lg transition-colors flex items-center gap-2 shrink-0"
                >
                  <span>Senden</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Auto Speak Toggle */}
              <div className="flex items-center justify-between px-1 text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={autoSpeak}
                    onChange={(e) => setAutoSpeak(e.target.checked)}
                    className="rounded border-slate-700 text-red-600 focus:ring-0 bg-slate-800"
                  />
                  <span>Antworten immer automatisch vorlesen</span>
                </label>

                {isFranzSpeaking && (
                  <button
                    type="button"
                    onClick={stopAudioPlayback}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 font-medium"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stimme anhalten</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
