import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  Search,
  Loader2,
  Copy,
  Check,
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Sparkles,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import Markdown from 'react-markdown';
import {
  recordMicAccessResult,
  isMicPermanentlyMutedOrDenied,
} from '@/lib/micPermission';
import { getOfflineKnowledgeAnswer } from '../lib/offlineComputerKnowledge';

interface SearchSource {
  title: string;
  uri: string;
}

interface SearchResult {
  query: string;
  answer: string;
  sources: SearchSource[];
  timestamp: Date;
}

interface ComputerKnowledgeSearchProps {
  isOpenModal?: boolean;
  onCloseModal?: () => void;
  className?: string;
  variant?: 'navbar' | 'hero';
}

const QUICK_QUESTIONS = [
  'कंप्यूटर चालू कैसे करें?',
  'स्क्रीनशॉट लेने का शॉर्टकट क्या है?',
  'Task Manager कैसे खोलें?',
  'CPU और GPU में क्या अंतर है?',
  'कॉपी और पेस्ट का शॉर्टकट क्या है?',
];

function isCreatorOrPurposeQuery(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return (
    lower.includes('kisne banai') ||
    lower.includes('kisne banaya') ||
    lower.includes('kisne banayi') ||
    lower.includes('kisne banaye') ||
    lower.includes('who made') ||
    lower.includes('who created') ||
    lower.includes('who is the creator') ||
    lower.includes('uddeshy') ||
    lower.includes('purpose') ||
    lower.includes('kyon banai') ||
    lower.includes('kyu banai') ||
    lower.includes('why was this website') ||
    lower.includes('ai kiska') ||
    lower.includes('govardhan') ||
    lower.includes('किसने बनाई') ||
    lower.includes('किसने बनाया') ||
    lower.includes('उद्देश्य') ||
    lower.includes('क्यों बनाई') ||
    lower.includes('वेबसाइट किसने') ||
    lower.includes('किस काम के लिए बनाई')
  );
}

function getSearchApiUrl(): string {
  const customUrl = (import.meta as any).env?.VITE_API_URL;
  if (customUrl && typeof customUrl === 'string' && customUrl.trim()) {
    return `${customUrl.trim().replace(/\/$/, '')}/api/search-knowledge`;
  }
  // When running on GitHub Pages or Vercel,
  // automatically route to the active Cloud Run server where the Gemini AI API runs securely
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname.includes('github.io') ||
      window.location.hostname.includes('vercel.app'))
  ) {
    return 'https://ais-pre-ep6vknroswpwqicftot3se-851804173696.asia-southeast1.run.app/api/search-knowledge';
  }
  return '/api/search-knowledge';
}

function parseErrorMessage(msg: string): string {
  try {
    if (msg.includes('{') && msg.includes('}')) {
      const jsonStart = msg.indexOf('{');
      const jsonEnd = msg.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const parsed = JSON.parse(msg.slice(jsonStart, jsonEnd + 1));
        if (parsed?.error?.message) return parsed.error.message;
        if (parsed?.message) return parsed.message;
      }
    }
  } catch {
    // Keep original string if JSON parsing fails
  }
  return msg;
}

// Splits markdown into clean, individual natural sentences so the voice never cuts off
function splitTextIntoSentences(markdown: string): string[] {
  if (!markdown) return [];
  const clean = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/#+\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/---+/g, ' ')
    .replace(/^[*-]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\r\n/g, '\n')
    .trim();

  // Split on sentence boundaries: Hindi danda (।), period, question mark, exclamation, or newline
  const rawParts = clean
    .split(/(?<=[।!?.\n])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s !== '.' && s !== '।');

  const sentences: string[] = [];
  let buffer = '';

  for (const part of rawParts) {
    // If an individual part is very long without punctuation, sub-split by comma or semicolon
    if (part.length > 140) {
      if (buffer) {
        sentences.push(buffer.trim());
        buffer = '';
      }
      const subParts = part.split(/(?<=[,;])\s+/).filter(Boolean);
      for (const sp of subParts) {
        if (!buffer) {
          buffer = sp;
        } else if ((buffer + ' ' + sp).length < 130) {
          buffer = buffer + ' ' + sp;
        } else {
          sentences.push(buffer.trim());
          buffer = sp;
        }
      }
    } else {
      if (!buffer) {
        buffer = part;
      } else if ((buffer + ' ' + part).length < 130) {
        buffer = buffer + ' ' + part;
      } else {
        sentences.push(buffer.trim());
        buffer = part;
      }
    }
  }

  if (buffer && buffer.trim()) {
    sentences.push(buffer.trim());
  }

  return sentences.length > 0 ? sentences : [clean];
}

// Selects the highest quality natural Hindi or English voice
function chooseBestVoice(voices: SpeechSynthesisVoice[], sampleText: string): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const hasDevanagari = /[\u0900-\u097F]/.test(sampleText);
  if (hasDevanagari) {
    const googleHindi = voices.find((v) => v.lang.toLowerCase().includes('hi') && v.name.includes('Google'));
    const swara = voices.find((v) => v.name.includes('Swara'));
    const lekha = voices.find((v) => v.name.includes('Lekha'));
    const anyHindi = voices.find((v) => v.lang.toLowerCase().includes('hi'));
    return googleHindi || swara || lekha || anyHindi || null;
  }

  const indianEng = voices.find((v) => v.lang === 'en-IN' || v.name.includes('India'));
  const naturalFemale = voices.find((v) => v.name.includes('Natural') || v.name.includes('Google US English'));
  const anyEng = voices.find((v) => v.lang.startsWith('en'));

  return indianEng || naturalFemale || anyEng || voices[0] || null;
}

export default function ComputerKnowledgeSearch({
  isOpenModal = false,
  onCloseModal,
  className = '',
  variant = 'navbar',
}: ComputerKnowledgeSearchProps) {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Voice Interaction State
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechProgress, setSpeechProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSentencesRef = useRef<string[]>([]);
  const activeSentenceIndexRef = useRef<number>(0);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isStopRequestedRef = useRef<boolean>(false);
  const keepAliveIntervalRef = useRef<any>(null);
  const lastSpokenQueryRef = useRef<string>('');
  const handleSearchRef = useRef<((q: string, speak?: boolean) => void) | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
        lastSpokenQueryRef.current = '';
        recordMicAccessResult('granted');
        setVoiceNotice('सुन रहा हूँ... बोलिए');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          lastSpokenQueryRef.current = transcript.trim();
          setQuery(transcript);
          setVoiceNotice(`"${transcript}"`);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          recordMicAccessResult('denied');
          setShowPermissionModal(true);
          setVoiceNotice('माइक्रोफ़ोन अनुमति आवश्यक है।');
        } else if (event.error === 'no-speech') {
          setVoiceNotice('कोई आवाज़ नहीं आई। नीचे लिखकर सर्च करें।');
        } else {
          setVoiceNotice(`सूचना: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (lastSpokenQueryRef.current.trim() && handleSearchRef.current) {
          const queryToSearch = lastSpokenQueryRef.current.trim();
          lastSpokenQueryRef.current = '';
          handleSearchRef.current(queryToSearch, true);
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Keyboard shortcut (Escape to close result) & click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismissAll();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const dismissAll = () => {
    stopSpeaking();
    stopListening();
    setResult(null);
    setError(null);
    setLoading(false);
    setIsDropdownOpen(false);
    onCloseModal?.();
  };

  // Speaks a specific sentence from the queue
  const speakSentenceAt = (index: number) => {
    if (isStopRequestedRef.current) return;
    const sentences = speechSentencesRef.current;
    if (!sentences || index >= sentences.length) {
      stopSpeaking();
      return;
    }

    if (!('speechSynthesis' in window)) return;

    activeSentenceIndexRef.current = index;
    setSpeechProgress({ current: index + 1, total: sentences.length });
    const currentSentence = sentences[index];

    try {
      const utterance = new SpeechSynthesisUtterance(currentSentence);
      currentUtteranceRef.current = utterance;
      // CRITICAL FIX: Keep reference on window to prevent Chrome's Garbage Collector from killing it mid-speech
      (window as any).__activeTTSUtterance = utterance;

      const voices = window.speechSynthesis.getVoices();
      const bestVoice = chooseBestVoice(voices, currentSentence);
      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        utterance.lang = /[\u0900-\u097F]/.test(currentSentence) ? 'hi-IN' : 'en-IN';
      }

      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        currentUtteranceRef.current = null;
        (window as any).__activeTTSUtterance = null;
        if (isStopRequestedRef.current) return;
        const next = index + 1;
        if (next < sentences.length) {
          // Natural slight pause between sentences
          setTimeout(() => {
            if (!isStopRequestedRef.current) {
              speakSentenceAt(next);
            }
          }, 80);
        } else {
          stopSpeaking();
        }
      };

      utterance.onerror = (e: any) => {
        currentUtteranceRef.current = null;
        (window as any).__activeTTSUtterance = null;
        // Don't advance if user explicitly stopped or canceled
        if (isStopRequestedRef.current || e?.error === 'canceled' || e?.error === 'interrupted') return;
        console.warn('Utterance notice:', e?.error);
        // Continue to next sentence smoothly
        const next = index + 1;
        if (next < sentences.length) {
          setTimeout(() => {
            if (!isStopRequestedRef.current) {
              speakSentenceAt(next);
            }
          }, 80);
        } else {
          stopSpeaking();
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech error:', err);
      stopSpeaking();
    }
  };

  const speakAnswer = (text: string) => {
    if (!text) return;
    stopSpeaking();
    isStopRequestedRef.current = false;

    const sentences = splitTextIntoSentences(text);
    if (sentences.length === 0) return;

    speechSentencesRef.current = sentences;
    activeSentenceIndexRef.current = 0;
    setSpeechProgress({ current: 1, total: sentences.length });
    setIsPaused(false);
    setIsSpeaking(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    // Small delay ensures Chrome has reset internal speech state
    setTimeout(() => {
      if (!isStopRequestedRef.current) {
        speakSentenceAt(0);
      }
    }, 80);
  };

  const pauseSpeaking = () => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } catch (err) {
      console.warn('Pause error:', err);
    }
  };

  const resumeSpeaking = () => {
    if (!('speechSynthesis' in window)) return;
    try {
      setIsPaused(false);
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        speakSentenceAt(activeSentenceIndexRef.current);
      }
    } catch (err) {
      console.warn('Resume error:', err);
      speakSentenceAt(activeSentenceIndexRef.current);
    }
  };

  const stopSpeaking = () => {
    isStopRequestedRef.current = true;
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    (window as any).__activeTTSUtterance = null;
    currentUtteranceRef.current = null;
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setSpeechProgress({ current: 0, total: 0 });
  };

  const requestMicPermissionAndStart = async () => {
    stopSpeaking();
    setError(null);
    setVoiceNotice(null);

    // If already active, stop
    if (isListening) {
      stopListening();
      if (query.trim()) {
        handleSearch(query, true);
      }
      return;
    }

    // Prompt for microphone permission directly on user click
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsRequestingPermission(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Clean up test stream immediately
        stream.getTracks().forEach((track) => track.stop());

        recordMicAccessResult('granted');
        setShowPermissionModal(false);

        // Immediately start voice recognition
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch {
            recognitionRef.current.stop();
            setTimeout(() => {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.warn('Recognition restart error:', e);
              }
            }, 100);
          }
        } else {
          setVoiceNotice('माइक्रोफ़ोन चालू है। कृपया बोलिए...');
        }
      } catch (err: any) {
        console.warn('Microphone permission request failed/denied:', err);
        recordMicAccessResult('denied');
        setIsListening(false);
        setShowPermissionModal(true);
      } finally {
        setIsRequestingPermission(false);
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          setShowPermissionModal(true);
        }
      } else {
        setVoiceNotice('इस ब्राउज़र में वॉइस उपलब्ध नहीं है, आप टाइप करके पूछ सकते हैं।');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      if (query.trim()) {
        handleSearch(query, true);
      }
    } else {
      requestMicPermissionAndStart();
    }
  };

  const handleSearch = async (searchQuery: string, shouldSpeak: boolean = true) => {
    const q = searchQuery.trim();
    if (!q) return;

    stopListening();
    stopSpeaking();
    setLoading(true);
    setError(null);
    setVoiceNotice(null);
    setQuery(q);
    setIsDropdownOpen(false);

    // Instant direct answer for creator and website purpose queries
    if (isCreatorOrPurposeQuery(q)) {
      const creatorAnswer = `### 🌐 BASICS वेबसाइट एवं AI के बारे में\n\n- **निर्माता (Creator):** यह वेबसाइट और इसका AI **गोवर्धन यादव (Govardhan Yadav)** ने बनाई है।\n- **उद्देश्य (Purpose):** इस वेबसाइट का मुख्य उद्देश्य **बिगिनर्स (Beginners) और बच्चों को कंप्यूटर के बेसिक्स सिखाना** तथा बच्चों को कंप्यूटर के उपयोग में सक्षम बनाना है।\n- **यह किस काम के लिए बनाई गई है?**\n  1. **कंप्यूटर के बुनियादी कौशल:** कंप्यूटर चालू करने से लेकर विंडोज नेविगेशन, कीबोर्ड शॉर्टकट्स और फाइल मैनेजमेंट को सरल तरीके से सिखाना।\n  2. **डिजिटल ज्ञान व दक्षता:** बच्चों और नए सीखने वालों को तकनीक और कंप्यूटर के आवश्यक सिद्धांतों से परिचित कराना।\n  3. **24/7 AI वॉइस असिस्टेंट:** बोलकर या लिखकर कंप्यूटर से जुड़ा कोई भी सवाल पूछने पर तुरंत और सटीक समाधान प्रदान करना।\n\nगोवर्धन यादव ने इसे खासतौर पर बच्चों और नए सीखने वालों के ज्ञान और आत्मविश्वास को बढ़ाने के लिए बनाया है।`;

      const newResult: SearchResult = {
        query: q,
        answer: creatorAnswer,
        sources: [
          {
            title: 'BASICS — Learn Computer Basics the Easy Way',
            uri: '#hero',
          },
        ],
        timestamp: new Date(),
      };
      setResult(newResult);
      setLoading(false);
      if (shouldSpeak) {
        setTimeout(() => {
          speakAnswer(creatorAnswer);
        }, 300);
      }
      return;
    }

    try {
      const endpoint = getSearchApiUrl();
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        // Fallback for Vercel/static deployments when server returns 404 or error
        console.warn(`Server status ${res.status}, using built-in knowledge engine.`);
        const fallback = getOfflineKnowledgeAnswer(q);
        const newResult: SearchResult = {
          query: q,
          answer: fallback.answer,
          sources: fallback.sources || [],
          timestamp: new Date(),
        };
        setResult(newResult);

        if (shouldSpeak && fallback.answer) {
          setTimeout(() => {
            speakAnswer(fallback.answer);
          }, 300);
        }
        return;
      }

      const data = await res.json();
      const newResult: SearchResult = {
        query: q,
        answer: data.answer,
        sources: data.sources || [],
        timestamp: new Date(),
      };
      setResult(newResult);

      if (shouldSpeak && data.answer) {
        setTimeout(() => {
          speakAnswer(data.answer);
        }, 300);
      }
    } catch (err: any) {
      console.warn('Search request failed, falling back to built-in knowledge engine:', err);
      const fallback = getOfflineKnowledgeAnswer(q);
      const newResult: SearchResult = {
        query: q,
        answer: fallback.answer,
        sources: fallback.sources || [],
        timestamp: new Date(),
      };
      setResult(newResult);

      if (shouldSpeak && fallback.answer) {
        setTimeout(() => {
          speakAnswer(fallback.answer);
        }, 300);
      }
    } finally {
      setLoading(false);
    }
  };
  handleSearchRef.current = handleSearch;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleCopy = () => {
    if (!result?.answer) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* ── Question Input Box ── */}
      <form
        onSubmit={onSubmit}
        className={`relative flex items-center ${isHero ? 'w-full' : ''}`}
      >
        <div
          className={`absolute left-3.5 text-[#c8ff00] pointer-events-none flex items-center ${
            isHero ? 'left-4' : 'left-3'
          }`}
        >
          <Search className={isHero ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={
            isListening
              ? 'बोलिए, मैं सुन रहा हूँ...'
              : isHero
              ? 'कंप्यूटर का सवाल पूछें... (उदा: Shortcut keys, PC kaise on kare)'
              : 'सवाल पूछें...'
          }
          className={
            isHero
              ? `w-full bg-[#0d0d0d]/85 backdrop-blur-2xl hover:bg-[#141414]/90 focus:bg-[#080808]/95 text-white placeholder-neutral-400 pl-11 pr-24 py-3.5 rounded-full border ${
                  isListening
                    ? 'border-[#c8ff00] ring-2 ring-[#c8ff00]/40'
                    : 'border-[#c8ff00]/40 focus:border-[#c8ff00]'
                } focus:outline-none text-sm transition-all shadow-[0_8px_30px_rgba(0,0,0,0.7)]`
              : `w-48 sm:w-60 md:w-72 bg-black/60 backdrop-blur-xl hover:bg-black/80 focus:bg-[#0d0d0d] text-white placeholder-neutral-400 pl-8 pr-20 py-1.5 rounded-full border ${
                  isListening
                    ? 'border-[#c8ff00] ring-2 ring-[#c8ff00]/40'
                    : 'border-white/[0.18] focus:border-[#c8ff00]'
                } focus:outline-none text-xs font-mono transition-all shadow-[0_4px_16px_rgba(0,0,0,0.5)]`
          }
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          {/* Clear input button */}
          {query && !isListening && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsDropdownOpen(true);
              }}
              className="p-1 text-neutral-400 hover:text-white transition-colors"
              title="हटाएं"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={toggleMic}
            className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center backdrop-blur-md ${
              isListening
                ? 'bg-red-600 text-white animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.9)]'
                : 'text-neutral-300 hover:text-[#c8ff00] bg-black/40 hover:bg-[#c8ff00]/15 border border-white/10 hover:border-[#c8ff00]/40'
            }`}
            title={isListening ? 'माइक बंद करें' : 'बोलकर पूछें'}
            aria-label="Voice Mic"
          >
            {isListening ? (
              <MicOff className={isHero ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
            ) : (
              <Mic className={isHero ? 'w-4 h-4 text-[#c8ff00]' : 'w-3.5 h-3.5 text-[#c8ff00]'} />
            )}
          </button>

          {/* Submit Ask Button */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className={`rounded-full bg-[#c8ff00] text-black font-bold hover:bg-[#d6ff33] disabled:opacity-35 transition-all cursor-pointer shadow-[0_0_15px_rgba(200,255,0,0.3)] ${
              isHero ? 'px-4 py-1.5 text-xs' : 'px-2.5 py-0.5 text-[10px]'
            }`}
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Ask'}
          </button>
        </div>
      </form>

      {/* ── Active Listening Feedback Pod ── */}
      {isListening && (
        <div className="absolute left-0 right-0 top-full mt-2 p-3 bg-[#0c0c0c]/95 backdrop-blur-2xl border border-[#c8ff00]/60 rounded-2xl text-xs text-[#c8ff00] font-mono z-30 shadow-[0_12px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(200,255,0,0.15)] animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="font-semibold text-white">बोलिए, मैं सुन रहा हूँ...</span>
            </span>
            <div className="flex items-center gap-1.5">
              {query.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    stopListening();
                    handleSearch(query, true);
                  }}
                  className="interactive-option px-2.5 py-1 rounded-lg bg-[#c8ff00] text-black font-bold text-[11px] hover:bg-[#d4ff33] cursor-pointer"
                >
                  पूछें (Search)
                </button>
              )}
              <button
                type="button"
                onClick={stopListening}
                className="interactive-option text-neutral-400 hover:text-white text-[11px] px-2 py-1 rounded-lg bg-white/10 cursor-pointer"
              >
                रद्द करें
              </button>
            </div>
          </div>
          {query.trim() && (
            <div className="mt-2 text-xs text-neutral-200 bg-white/[0.06] px-3 py-1.5 rounded-xl border border-white/10 font-sans break-words">
              "{query}"
            </div>
          )}
        </div>
      )}

      {/* ── Voice Notice ── */}
      {voiceNotice && !isListening && (
        <div className="absolute left-0 right-0 top-full mt-2 flex items-center justify-between px-3 py-1.5 bg-[#1a140b]/95 backdrop-blur-xl border border-amber-500/40 rounded-xl text-xs text-amber-200 z-30 shadow-lg">
          <span>{voiceNotice}</span>
          <button onClick={() => setVoiceNotice(null)} className="p-0.5 text-neutral-400 hover:text-white">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ── Quick Example Questions (Clean, without tags or badges) ── */}
      {isDropdownOpen && !query && !result && !loading && !isListening && (
        <div
          className={`absolute z-50 bg-[#0c0c0c]/95 border border-white/20 rounded-2xl p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl ${
            isHero ? 'left-0 right-0 top-full mt-2' : 'right-0 top-full mt-2 w-72'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[11px] font-medium text-neutral-400 px-2 pb-1.5 mb-1.5 border-b border-white/10">
            उदाहरण सवाल (Click to ask):
          </div>
          <div className="space-y-1.5">
            {QUICK_QUESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSearch(item)}
                className="interactive-option w-full text-left px-3 py-2 rounded-xl bg-black/40 backdrop-blur-md hover:bg-[#c8ff00]/15 hover:border-[#c8ff00]/30 text-neutral-200 hover:text-white text-xs border border-white/5 cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Backdrop for dismiss ── */}
      {(result || loading || error) && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] cursor-pointer"
          onClick={dismissAll}
          title="Click to close"
        />
      )}

      {/* ── Loading Spinner ── */}
      {loading && (
        <div
          className="fixed top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-md bg-[#0d0d0d] border border-[#c8ff00]/40 rounded-2xl p-6 shadow-2xl z-50 text-center animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <Loader2 className="w-6 h-6 animate-spin text-[#c8ff00] mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white mb-1">उत्तर तैयार हो रहा है...</h4>
          <p className="text-xs text-neutral-400 truncate">"{query}"</p>
        </div>
      )}

      {/* ── Error Message ── */}
      {error && !loading && (
        <div
          className="fixed top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-md bg-red-950/95 border border-red-500/40 rounded-2xl p-5 shadow-2xl z-50 text-red-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-red-400">सूचना</span>
            <button onClick={dismissAll} className="text-red-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs">{error}</p>
        </div>
      )}

      {/* ── DIRECT CLEAN ANSWER CARD (NO EXTRA TEST ICONS OR OPTIONS) ── */}
      {result && !loading && (
        <div
          id="searchResultCard"
          className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 w-[94vw] max-w-2xl max-h-[82vh] overflow-y-auto z-50 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-[#c8ff00]/40 rounded-2xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Card Top Header: Question & Simple Clean Actions */}
          <div className="sticky top-0 z-10 bg-[#060606]/90 backdrop-blur-2xl border-b border-white/[0.1] px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3">
            <div className="truncate">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#c8ff00] block">
                सवाल / QUESTION
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {result.query}
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Voice playback controls: Play / Pause / Resume / Stop */}
              {isSpeaking ? (
                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-xl p-1 rounded-full border border-white/15">
                  {/* Status & Sentence count */}
                  <span className="text-[10px] font-mono px-2 text-[#c8ff00] flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-[#c8ff00] animate-pulse'}`} />
                    {isPaused ? 'पॉज़' : 'पढ़ रहा है'} {speechProgress.total > 0 ? `(${speechProgress.current}/${speechProgress.total})` : ''}
                  </span>

                  {/* Pause / Resume Button */}
                  {isPaused ? (
                    <button
                      type="button"
                      onClick={resumeSpeaking}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#c8ff00] text-black font-semibold hover:bg-[#d8ff33] transition-colors cursor-pointer"
                      title="जारी रखें / Resume"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>जारी रखें</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={pauseSpeaking}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/40 transition-colors cursor-pointer font-medium"
                      title="पॉज़ करें / Pause"
                    >
                      <Pause className="w-3 h-3" />
                      <span>पॉज़</span>
                    </button>
                  )}

                  {/* Stop Button */}
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="p-1 rounded-full text-red-400 hover:text-white hover:bg-red-500/20 transition-colors cursor-pointer"
                    title="पूरी आवाज़ बंद करें / Stop"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => speakAnswer(result.answer)}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md hover:bg-[#c8ff00]/20 text-[#c8ff00] border border-[#c8ff00]/40 transition-colors cursor-pointer font-medium shadow-sm"
                  title="पूरा उत्तर सुनें / Listen to Answer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>उत्तर सुनें</span>
                </button>
              )}

              {/* Copy answer */}
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md hover:bg-white/[0.15] text-neutral-300 hover:text-white border border-white/[0.15] transition-colors cursor-pointer"
                title="कॉपी करें"
              >
                {copied ? <Check className="w-4 h-4 text-[#c8ff00]" /> : <Copy className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={dismissAll}
                className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md hover:bg-[#c8ff00] text-neutral-400 hover:text-black transition-colors border border-white/[0.15] cursor-pointer"
                title="बंद करें"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Answer Text in Clean Markdown Typography */}
          <div className="p-5 sm:p-7">
            <div className="prose prose-invert max-w-none text-neutral-200 text-sm leading-relaxed space-y-3 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-white [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-[#c8ff00] [&_h3]:text-sm [&_h3]:font-semibold [&_p]:mb-2.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_code]:bg-white/10 [&_code]:text-[#c8ff00] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_strong]:text-white">
              <Markdown>{result.answer}</Markdown>
            </div>
          </div>
        </div>
      )}

      {/* ── Microphone Permission Explanation & Request Modal ── */}
      {showPermissionModal && (
        <div
          className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowPermissionModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#0d0d0d] border border-white/20 rounded-3xl p-6 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col items-center text-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background accent glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#c8ff00]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowPermissionModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Microphone Icon */}
            <div className="relative mb-4 mt-2">
              <div className="w-16 h-16 rounded-2xl bg-[#c8ff00]/15 border border-[#c8ff00]/40 flex items-center justify-center text-[#c8ff00] shadow-[0_0_30px_rgba(200,255,0,0.25)]">
                <Mic className="w-8 h-8" />
              </div>
            </div>

            {/* Heading */}
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
              माइक्रोफ़ोन अनुमति आवश्यक है
            </h3>
            <p className="text-xs text-[#c8ff00] font-mono mb-4 tracking-wider uppercase">
              Microphone Permission Required
            </p>

            {/* Explanation paragraph */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">
              बोलकर कोई भी प्रश्न पूछने के लिए आपके ब्राउज़र में माइक्रोफ़ोन की अनुमति देना आवश्यक है।
              जैसे ही आप नीचे दिए गए बटन पर क्लिक करेंगे, ब्राउज़र आपसे माइक्रोफ़ोन की अनुमति मांगेगा।
              अनुमति देते ही आप बिना टाइप किए सीधे अपनी आवाज़ में कोई भी सवाल पूछ सकेंगे।
            </p>

            {/* 3 Key Points */}
            <div className="w-full bg-black/50 border border-white/10 rounded-2xl p-3.5 mb-5 text-left space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#c8ff00] shrink-0 mt-0.5" />
                <span className="text-neutral-200">
                  <strong className="text-white">सीधे बोलकर पूछें:</strong> आपको कीबोर्ड से कुछ भी लिखने की ज़रूरत नहीं होगी।
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-neutral-200">
                  <strong className="text-white">सुरक्षित एवं निजी:</strong> माइक्रोफ़ोन केवल आपके सवाल को रिकॉर्ड कर सर्च करने के लिए उपयोग किया जाता है।
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-neutral-300 text-[11px]">
                  यदि ब्राउज़र ने अनुमति पहले रोक रखी है, तो ऊपर एड्रेस बार में लॉक (🔒) आइकन पर क्लिक करके Microphone को <strong>Allow</strong> करें।
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full space-y-2.5">
              <button
                type="button"
                onClick={requestMicPermissionAndStart}
                disabled={isRequestingPermission}
                className="interactive-option w-full py-3.5 px-6 rounded-2xl bg-[#c8ff00] hover:bg-[#d4ff33] text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(200,255,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isRequestingPermission ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>अनुमति मांगी जा रही है...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>माइक्रोफ़ोन अनुमति दें और बोलना शुरू करें</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowPermissionModal(false)}
                className="w-full py-2.5 px-4 rounded-xl text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                लिखकर सवाल पूछें / Type instead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
