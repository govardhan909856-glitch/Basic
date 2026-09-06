import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  Search,
  Loader2,
  Copy,
  Check,
  X,
  Mic,
  MicOff,
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
  return '/api/search-knowledge';
}

export default function ComputerKnowledgeSearch({
  isOpenModal = false,
  onCloseModal,
  className = '',
  variant = 'hero',
}: ComputerKnowledgeSearchProps) {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Voice Interaction State (Speech-to-Text only)
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const lastSpokenQueryRef = useRef<string>('');
  const handleSearchRef = useRef<((q: string) => void) | null>(null);

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
          handleSearchRef.current(queryToSearch);
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

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
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
    stopListening();
    setResult(null);
    setError(null);
    setLoading(false);
    setIsDropdownOpen(false);
    onCloseModal?.();
  };

  const requestMicPermissionAndStart = async () => {
    setError(null);
    setVoiceNotice(null);

    // If already active, stop
    if (isListening) {
      stopListening();
      if (query.trim()) {
        handleSearch(query);
      }
      return;
    }

    // Prompt for microphone permission directly on user click
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsRequestingPermission(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());

        recordMicAccessResult('granted');
        setShowPermissionModal(false);

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
        handleSearch(query);
      }
    } else {
      requestMicPermissionAndStart();
    }
  };

  const handleSearch = async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) return;

    stopListening();
    setLoading(true);
    setError(null);
    setVoiceNotice(null);
    setQuery(q);
    setIsDropdownOpen(false);

    // Instant direct answer for creator and website purpose queries
    if (isCreatorOrPurposeQuery(q)) {
      const creatorAnswer = `### 🌐 BASICS वेबसाइट एवं AI के बारे में\n\n- **निर्माता (Creator):** यह वेबसाइट और इसका AI **BASICS टीम** द्वारा विकसित किया गया है।\n- **उद्देश्य (Purpose):** इस वेबसाइट का मुख्य उद्देश्य **बिगिनर्स (Beginners) और बच्चों को कंप्यूटर के बेसिक्स सिखाना** तथा बच्चों को कंप्यूटर के उपयोग में सक्षम बनाना है।\n- **यह किस काम के लिए बनाई गई है?**\n  1. **कंप्यूटर के बुनियादी कौशल:** कंप्यूटर चालू करने से लेकर विंडोज नेविगेशन, कीबोर्ड शॉर्टकट्स और फाइल मैनेजमेंट को सरल तरीके से सिखाना।\n  2. **डिजिटल ज्ञान व दक्षता:** बच्चों और नए सीखने वालों को तकनीक और कंप्यूटर के आवश्यक सिद्धांतों से परिचित कराना।\n  3. **सटीक AI समाधान:** कंप्यूटर से जुड़ा कोई भी सवाल पूछने पर तुरंत और सटीक समाधान प्रदान करना।\n\nइसे खासतौर पर बच्चों और नए सीखने वालों के डिजिटल ज्ञान और आत्मविश्वास को बढ़ाने के लिए बनाया गया है।`;

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
        console.warn(`Server status ${res.status}, using built-in knowledge engine.`);
        const fallback = getOfflineKnowledgeAnswer(q);
        const newResult: SearchResult = {
          query: q,
          answer: fallback.answer,
          sources: fallback.sources || [],
          timestamp: new Date(),
        };
        setResult(newResult);
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
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* ── Question Input Box ── */}
      <form
        onSubmit={onSubmit}
        className="relative flex items-center w-full"
      >
        <div className="absolute left-4 text-primary pointer-events-none flex items-center">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isDropdownOpen) setIsDropdownOpen(true);
          }}
          onFocus={() => {
            if (!query && !result) setIsDropdownOpen(true);
          }}
          placeholder="कंप्यूटर से जुड़ा कोई भी सवाल पूछें (उदा. RAM क्या है?)..."
          className={`w-full bg-card/90 backdrop-blur-2xl text-foreground placeholder-muted-foreground pl-11 pr-24 py-3.5 rounded-full border ${
            isListening
              ? 'border-primary ring-2 ring-primary/40'
              : 'border-border focus:border-primary'
          } focus:outline-none text-sm transition-all shadow-sm`}
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
              className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
                ? 'bg-destructive text-destructive-foreground animate-pulse shadow-md'
                : 'text-muted-foreground hover:text-primary bg-muted/60 hover:bg-primary/15 border border-border hover:border-primary'
            }`}
            title={isListening ? 'माइक बंद करें' : 'बोलकर पूछें'}
            aria-label="Voice Mic"
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4 text-primary" />
            )}
          </button>

          {/* Submit Ask Button */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-35 transition-all cursor-pointer shadow-sm px-4 py-1.5 text-xs"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Ask'}
          </button>
        </div>
      </form>

      {/* ── Active Listening Feedback Pod ── */}
      {isListening && (
        <div className="mt-2 p-3 bg-card border border-primary/60 rounded-2xl text-xs text-primary font-mono shadow-md animate-in fade-in slide-in-from-top-1 duration-150 text-left">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
              </span>
              <span className="font-semibold text-foreground">बोलिए, मैं सुन रहा हूँ...</span>
            </span>
            <div className="flex items-center gap-1.5">
              {query.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    stopListening();
                    handleSearch(query);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground font-bold text-[11px] hover:opacity-90 cursor-pointer"
                >
                  पूछें (Search)
                </button>
              )}
              <button
                type="button"
                onClick={stopListening}
                className="text-muted-foreground hover:text-foreground text-[11px] px-2 py-1 rounded-lg bg-muted cursor-pointer"
              >
                रद्द करें
              </button>
            </div>
          </div>
          {query.trim() && (
            <div className="mt-2 text-xs text-foreground bg-muted/60 px-3 py-1.5 rounded-xl border border-border font-sans break-words">
              "{query}"
            </div>
          )}
        </div>
      )}

      {/* ── Voice Notice ── */}
      {voiceNotice && !isListening && (
        <div className="mt-2 flex items-center justify-between px-3 py-1.5 bg-card/95 backdrop-blur-xl border border-border rounded-xl text-xs text-foreground shadow-sm text-left">
          <span>{voiceNotice}</span>
          <button onClick={() => setVoiceNotice(null)} className="p-0.5 text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ── Quick Example Questions (Dropdown directly below search bar) ── */}
      {isDropdownOpen && !query && !result && !loading && !isListening && (
        <div
          className="mt-2 w-full bg-card/95 border border-border rounded-2xl p-3.5 shadow-lg backdrop-blur-2xl text-left animate-in fade-in slide-in-from-top-1 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[11px] font-medium text-muted-foreground px-2 pb-1.5 mb-1.5 border-b border-border">
            उदाहरण सवाल (Click to ask):
          </div>
          <div className="space-y-1.5">
            {QUICK_QUESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSearch(item)}
                className="w-full text-left px-3 py-2 rounded-xl bg-muted/50 backdrop-blur-md hover:bg-primary/15 hover:border-primary/30 text-foreground text-xs border border-border cursor-pointer transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Inline Loading Indicator (Right below search bar) ── */}
      {loading && (
        <div
          className="mt-3.5 w-full bg-card/95 backdrop-blur-2xl border border-primary/40 rounded-2xl p-6 shadow-lg text-center animate-in fade-in slide-in-from-top-2 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
          <h4 className="text-sm font-bold text-foreground mb-1">उत्तर तैयार हो रहा है...</h4>
          <p className="text-xs text-muted-foreground truncate">"{query}"</p>
        </div>
      )}

      {/* ── Inline Error Message (Right below search bar) ── */}
      {error && !loading && (
        <div
          className="mt-3.5 w-full bg-destructive/10 border border-destructive/40 rounded-2xl p-4 shadow-lg text-destructive text-left animate-in fade-in slide-in-from-top-2 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold">सूचना</span>
            <button onClick={dismissAll} className="text-destructive hover:opacity-80 cursor-pointer p-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs">{error}</p>
        </div>
      )}

      {/* ── SEARCH RESULT CARD (Directly below the search bar, no TTS) ── */}
      {result && !loading && (
        <div
          id="searchResultCard"
          className="mt-3.5 w-full bg-card/95 backdrop-blur-2xl border border-primary/40 rounded-2xl shadow-lg overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Card Header: Question Title, Copy, Close */}
          <div className="bg-muted/50 border-b border-border px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
            <div className="truncate">
              <span className="text-[10px] font-mono tracking-wider uppercase text-primary block">
                सवाल / QUESTION
              </span>
              <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                {result.query}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Copy answer */}
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-background hover:bg-muted text-foreground border border-border transition-colors cursor-pointer font-medium"
                title="उत्तर कॉपी करें"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-primary" />
                    <span className="text-primary text-[11px]">कॉपी हुआ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">कॉपी</span>
                  </>
                )}
              </button>

              {/* Close result */}
              <button
                type="button"
                onClick={dismissAll}
                className="p-1.5 rounded-xl bg-background hover:bg-primary text-muted-foreground hover:text-primary-foreground transition-colors border border-border cursor-pointer"
                title="हटाएं / Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Answer Text in Clean Markdown Typography */}
          <div className="p-4 sm:p-6 max-h-[65vh] overflow-y-auto">
            <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground text-xs sm:text-sm leading-relaxed space-y-3.5 [&_h1]:text-base sm:[&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:text-sm sm:[&_h2]:text-base [&_h2]:font-bold [&_h2]:text-primary [&_h3]:text-xs sm:[&_h3]:text-sm [&_h3]:font-semibold [&_p]:mb-2.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_code]:bg-muted [&_code]:text-primary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_strong]:text-foreground [&_table]:w-full [&_table]:border-collapse [&_table]:my-3 [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:bg-muted [&_th]:text-primary [&_td]:border [&_td]:border-border [&_td]:p-2">
              <Markdown>{result.answer}</Markdown>
            </div>
          </div>
        </div>
      )}

      {/* ── Microphone Permission Explanation & Request Modal ── */}
      {showPermissionModal && (
        <div
          className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowPermissionModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowPermissionModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Microphone Icon */}
            <div className="relative mb-4 mt-2">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
                <Mic className="w-8 h-8" />
              </div>
            </div>

            {/* Heading */}
            <h3 className="font-sans text-xl sm:text-2xl font-bold text-foreground mb-2 tracking-tight">
              माइक्रोफ़ोन अनुमति आवश्यक है
            </h3>
            <p className="text-xs text-primary font-mono mb-4 tracking-wider uppercase">
              Microphone Permission Required
            </p>

            {/* Explanation paragraph */}
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
              बोलकर कोई भी प्रश्न पूछने के लिए आपके ब्राउज़र में माइक्रोफ़ोन की अनुमति देना आवश्यक है।
              जैसे ही आप नीचे दिए गए बटन पर क्लिक करेंगे, ब्राउज़र आपसे माइक्रोफ़ोन की अनुमति मांगेगा।
              अनुमति देते ही आप बिना टाइप किए सीधे अपनी आवाज़ में कोई भी सवाल पूछ सकेंगे।
            </p>

            {/* 3 Key Points */}
            <div className="w-full bg-muted/60 border border-border rounded-2xl p-3.5 mb-5 text-left space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground">
                  <strong>सीधे बोलकर पूछें:</strong> आपको कीबोर्ड से कुछ भी लिखने की ज़रूरत नहीं होगी।
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-foreground">
                  <strong>सुरक्षित एवं निजी:</strong> माइक्रोफ़ोन केवल आपके सवाल को रिकॉर्ड कर सर्च करने के लिए उपयोग किया जाता है।
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-[11px]">
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
                className="interactive-option w-full py-3.5 px-6 rounded-2xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 hover:opacity-90"
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
                className="w-full py-2.5 px-4 rounded-xl text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
