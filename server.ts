import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // CORS middleware allowing external frontends (e.g. GitHub Pages) to call the API
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json());

  let aiClient: GoogleGenAI | null = null;
  function getAI() {
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  let searchGroundingDisabledUntil = 0;

  // Google Search Grounded Knowledge Query Endpoint
  app.post('/api/search-knowledge', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string' || !query.trim()) {
        res.status(400).json({ error: 'Query is required.' });
        return;
      }

      // Check if user is asking about the website creator, purpose, or identity
      const lowerQuery = query.toLowerCase().trim();
      const isAboutWebsiteOrCreator =
        lowerQuery.includes('kisne banai') ||
        lowerQuery.includes('kisne banaya') ||
        lowerQuery.includes('kisne banayi') ||
        lowerQuery.includes('kisne banaye') ||
        lowerQuery.includes('kisne design') ||
        lowerQuery.includes('who made') ||
        lowerQuery.includes('who created') ||
        lowerQuery.includes('who is the creator') ||
        lowerQuery.includes('who developed') ||
        lowerQuery.includes('uddeshy') ||
        lowerQuery.includes('purpose') ||
        lowerQuery.includes('kyon banai') ||
        lowerQuery.includes('kyu banai') ||
        lowerQuery.includes('why was this website') ||
        lowerQuery.includes('ai kiska') ||
        lowerQuery.includes('kiska ai') ||
        lowerQuery.includes('govardhan') ||
        lowerQuery.includes('किसने बनाई') ||
        lowerQuery.includes('किसने बनाया') ||
        lowerQuery.includes('उद्देश्य') ||
        lowerQuery.includes('क्यों बनाई') ||
        lowerQuery.includes('वेबसाइट किसने') ||
        lowerQuery.includes('किस काम के लिए बनाई') ||
        lowerQuery.includes('किसने तैयार की');

      if (isAboutWebsiteOrCreator) {
        res.json({
          answer: `### 🌐 BASICS वेबसाइट एवं AI के बारे में\n\n- **निर्माता (Creator):** यह वेबसाइट और इसका AI **BASICS टीम** द्वारा विकसित किया गया है।\n- **उद्देश्य (Purpose):** इस वेबसाइट का मुख्य उद्देश्य **बिगिनर्स (Beginners) और बच्चों को कंप्यूटर के बेसिक्स सिखाना** तथा उन्हें डिजिटल रूप से सक्षम बनाना है।\n- **यह किस काम के लिए बनाई गई है?**\n  1. **कंप्यूटर के बुनियादी कौशल:** कंप्यूटर चालू करने से लेकर विंडोज नेविगेशन, कीबोर्ड शॉर्टकट्स और फाइल मैनेजमेंट को सरल तरीके से सिखाना।\n  2. **डिजिटल ज्ञान व दक्षता:** बच्चों और नए सीखने वालों को तकनीक और कंप्यूटर के आवश्यक सिद्धांतों से परिचित कराना।\n  3. **सटीक AI समाधान:** कंप्यूटर से जुड़ा कोई भी सवाल पूछने पर तुरंत और सटीक समाधान प्रदान करना।\n\nइसे खासतौर पर बच्चों और नए सीखने वालों के डिजिटल ज्ञान और आत्मविश्वास को बढ़ाने के लिए बनाया गया है।`,
          sources: [
            {
              title: 'BASICS — Learn Computer Basics the Easy Way',
              uri: '#hero',
            },
          ],
        });
        return;
      }

      const ai = getAI();
      const systemInstruction = `You are an expert, comprehensive, and friendly Computer Hardware, Software & IT Guide for students and learners.
The user might ask in English, Hindi, or Hinglish about:
- Computer hardware components (CPU, GPU, RAM, Motherboard, PSU, SSD, Cooling, Monitor, Peripheral devices, etc.)
- Keyboard shortcut keys for Windows, macOS, Linux, browsers, and popular applications (e.g., screenshots, Task Manager, force quit, virtual desktops, BIOS/UEFI boot keys, Command Prompt, etc.)
- Step-by-step procedures / processes (e.g., how to start a PC properly, how to enter BIOS, how to open Command Prompt / PowerShell, how to fix black screen, how to upgrade RAM, how to format a drive, what to do if audio stops working, how to check PC specs, etc.)
- Technical definitions (what something is called, why it exists, specs and functions)

IMPORTANT MANDATORY DIRECTIVE ABOUT THIS WEBSITE & ITS CREATOR:
- If the user asks who created/made this website, what its purpose is, why it was made, or whose AI this is:
You MUST state that this website and AI was created by the BASICS Team, and its purpose is to teach beginners and children computer basics and digital skills (बच्चों और बिगिनर्स को कंप्यूटर के बेसिक्स और डिजिटल ज्ञान सिखाने में मदद करने के लिए).

Structure your answer clearly with markdown:
1. **Summary / Definition**: A direct, easy-to-understand explanation.
2. **Step-by-Step Guide** (if applicable): Numbered steps [Step 1, Step 2, ...] detailing exactly what to click, press, or inspect.
3. **Shortcut Keys & Key Combos** (if applicable): Display the exact shortcut combinations clearly (e.g. \`[Ctrl] + [Shift] + [Esc]\`, \`[Win] + [R]\`, \`[Alt] + [F4]\`).
4. **Hardware / Component Notes**: Any relevant component details, ports, or compatibility points.
5. **Pro-Tips / Troubleshooting**: Practical advice, safety warnings (e.g. anti-static safety when opening a PC), or alternative methods.
6. If the user asks in Hindi or Hinglish, explain comfortably in easy-to-understand Hindi/Hinglish so they can grasp every step with zero confusion.`;

      let response: any = null;

      // Tier 1: Try Google Search Grounding with gemini-3.8-flash if not in quota cooldown
      if (Date.now() >= searchGroundingDisabledUntil) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: query.trim(),
            config: {
              tools: [{ googleSearch: {} }],
              systemInstruction,
            },
          });
        } catch {
          // Temporarily disable search tool for 15 minutes to avoid quota errors and delay
          searchGroundingDisabledUntil = Date.now() + 15 * 60 * 1000;
          response = null;
        }
      }

      // Tier 2: Directly generate with high-speed gemini-3.8-flash
      if (!response) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: query.trim(),
            config: {
              systemInstruction,
            },
          });
        } catch {
          // Tier 3: Fallback to gemini-3.1-flash-lite
          try {
            response = await ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: query.trim(),
              config: {
                systemInstruction,
              },
            });
          } catch {
            response = null;
          }
        }
      }

      const text = response?.text || 'Here is information on your query. Please try searching again in a moment.';
      const groundingChunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: { title: string; uri: string }[] = [];

      for (const chunk of groundingChunks) {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            uri: chunk.web.uri,
          });
        }
      }

      // Deduplicate sources by URI
      const uniqueSources = Array.from(new Map(sources.map((s) => [s.uri, s])).values());

      res.json({
        answer: text,
        sources: uniqueSources,
      });
    } catch {
      res.status(200).json({
        answer: `### Quick Guide for: ${req.body?.query || 'Computer Knowledge'}\n\n1. **Check Hardware & Power:** Ensure all power cables and display connectors are firmly plugged in.\n2. **Useful Shortcut:** Press \`[Ctrl] + [Shift] + [Esc]\` to open Task Manager, or \`[Win] + [D]\` to go directly to the desktop.\n3. Please refresh or retry in a few moments.`,
        sources: [],
      });
    }
  });

  // Helper to convert 16-bit linear PCM to standard playable WAV
  function pcmToWav(
    pcmBuffer: Buffer,
    sampleRate: number = 24000,
    numChannels: number = 1,
    bitsPerSample: number = 16
  ): Buffer {
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = pcmBuffer.length;
    const header = Buffer.alloc(44);

    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataSize, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20); // Linear PCM format
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(bitsPerSample, 34);
    header.write('data', 36);
    header.writeUInt32LE(dataSize, 40);

    return Buffer.concat([header, pcmBuffer]);
  }

  // Gemini Neural Text-To-Speech endpoint with Ursa voice
  app.post('/api/tts', async (req, res) => {
    try {
      const { text, voice = 'Ursa' } = req.body;
      if (!text || typeof text !== 'string' || !text.trim()) {
        res.status(400).json({ error: 'Text is required.' });
        return;
      }

      // Format and clean text for natural speech synthesis
      let clean = text
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/#+\s+/g, '')
        .replace(/[*_~\[\]()]/g, '')
        .replace(/\n+/g, '. ')
        .trim();

      // Cap at safe maximum chunk size to ensure fast neural synthesis
      if (clean.length > 500) {
        const lastSentenceEnd = Math.max(
          clean.lastIndexOf('.', 480),
          clean.lastIndexOf('।', 480),
          clean.lastIndexOf('?', 480)
        );
        if (lastSentenceEnd > 200) {
          clean = clean.slice(0, lastSentenceEnd + 1);
        } else {
          clean = clean.slice(0, 500).trim();
        }
      }

      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: clean,
        config: {
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voice, // Ursa voice
              },
            },
          },
        },
      });

      const part = response?.candidates?.[0]?.content?.parts?.[0];
      const base64Pcm = part?.inlineData?.data;

      if (!base64Pcm) {
        throw new Error('No audio returned by Gemini TTS');
      }

      const pcmBuffer = Buffer.from(base64Pcm, 'base64');
      const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16);
      const audioDataUrl = `data:audio/wav;base64,${wavBuffer.toString('base64')}`;

      res.json({
        audioUrl: audioDataUrl,
        voice: voice,
        spokenText: clean,
      });
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      const isQuota =
        err?.status === 429 ||
        errMsg.includes('429') ||
        errMsg.includes('quota') ||
        errMsg.includes('RESOURCE_EXHAUSTED');

      if (isQuota) {
        // Return 429 status cleanly without flooding logs
        console.info('Gemini TTS: Daily free-tier quota (10 reqs) reached. Client using continuous browser engine.');
        res.status(429).json({
          error: 'Gemini TTS daily quota reached',
          quotaExceeded: true,
        });
        return;
      }

      console.warn('Gemini Ursa TTS error:', errMsg.slice(0, 150));
      res.status(500).json({ error: 'Failed to generate voice audio' });
    }
  });

  // ── Persistent Submissions & Feedback Storage ──
  const SUBMISSIONS_FILE = path.join(process.cwd(), 'submissions_data.json');
  const FEEDBACKS_FILE = path.join(process.cwd(), 'feedbacks_data.json');

  function recordSubmissionLocally(record: any) {
    try {
      let entries: any[] = [];
      if (fs.existsSync(SUBMISSIONS_FILE)) {
        const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
        entries = JSON.parse(raw);
      }
      entries.unshift(record);
      if (entries.length > 200) entries = entries.slice(0, 200);
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(entries, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving submission locally:', err);
    }
  }

  function recordFeedbackLocally(feedback: any) {
    try {
      let list: any[] = [];
      if (fs.existsSync(FEEDBACKS_FILE)) {
        const raw = fs.readFileSync(FEEDBACKS_FILE, 'utf-8');
        list = JSON.parse(raw);
      }
      list.unshift(feedback);
      if (list.length > 200) list = list.slice(0, 200);
      fs.writeFileSync(FEEDBACKS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving feedback locally:', err);
    }
  }

  // ── Universal Form Submission Endpoint (Contact, Feedback & Question) ──
  app.post('/api/submit-form', async (req, res) => {
    try {
      const {
        formType, // 'contact' | 'feedback' | 'question'
        name,
        email,
        phone,
        subject,
        category,
        topic,
        rating,
        message,
      } = req.body;

      const submitterName = (name && name.trim()) || (formType === 'feedback' ? 'अतिथि विद्यार्थी' : 'विद्यार्थी');
      const submitterContact = (phone && phone.trim()) || (email && email.trim()) || 'उपलब्ध नहीं';
      const cleanEmail = (email && email.trim()) || (phone ? `Phone: ${phone}` : 'no-email@basics.local');

      const primaryEmail = process.env.NOTIFICATION_EMAIL || 'govardhan909856@gmail.com';
      const ccEmail = process.env.NOTIFICATION_CC_EMAIL || 'govardhan808516@gmail.com';
      const timestamp = new Date().toISOString();
      const formattedDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // Build subject line based on form type
      let subjectLine = '';
      if (formType === 'feedback') {
        const starStr = rating ? `${rating}★ Star` : 'Rating';
        subjectLine = `[BASICS] नई प्रतिक्रिया (${starStr} Feedback) - ${submitterName}`;
      } else if (formType === 'question') {
        subjectLine = `[BASICS] नया सवाल (Question: ${topic || 'Computer Help'}) - ${submitterName}`;
      } else {
        subjectLine = `[BASICS] नया संपर्क संदेश (Contact Inquiry: ${subject || 'General'}) - ${submitterName}`;
      }

      const submissionRecord = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        formType: formType || 'contact',
        name: submitterName,
        email: cleanEmail,
        phone: phone || '',
        subject: subject || topic || category || '',
        rating: rating ? Number(rating) : null,
        message: message || '',
        recipient: primaryEmail,
        ccRecipient: ccEmail,
        timestamp,
        dateFormatted: formattedDate,
      };

      // 1. Record locally in submissions file
      recordSubmissionLocally(submissionRecord);

      // 1b. If it's a feedback, immediately update feedbacks_data.json
      if (formType === 'feedback') {
        const fbRecord = {
          id: `fb_${Date.now()}`,
          name: submitterName,
          rating: Number(rating) || 5,
          category: category || 'General',
          message: message || '',
          dateFormatted: formattedDate,
        };
        recordFeedbackLocally(fbRecord);
      }

      // 2. Dispatch in background (without forcing user to open or deal with email)
      try {
        const formPayload: Record<string, any> = {
          _subject: subjectLine,
          _replyto: cleanEmail,
          _captcha: 'false',
          _template: 'table',
          'फॉर्म प्रकार (Form Type)': (formType || 'contact').toUpperCase(),
          'नाम (Name)': submitterName,
          'संपर्क विवरण (Contact)': submitterContact,
          'तारीख और समय (Date/Time IST)': formattedDate,
        };

        if (formType === 'feedback' && rating) {
          formPayload['स्टार रेटिंग (Rating)'] = `${rating} / 5 Stars ⭐⭐⭐⭐⭐`.slice(0, 10 + Number(rating));
          formPayload['फीडबैक श्रेणी (Category)'] = category || 'General';
          formPayload['फीडबैक विवरण (Feedback Message)'] = message || '';
        } else if (formType === 'question') {
          formPayload['सवाल का विषय (Question Topic)'] = topic || 'Computer Basics';
          formPayload['विद्यार्थी का सवाल (Question)'] = message || '';
        } else {
          formPayload['विषय (Subject)'] = subject || 'General Inquiry';
          formPayload['संदेश (Message)'] = message || '';
        }

        fetch(`https://formsubmit.co/ajax/${primaryEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(formPayload),
        }).catch(() => null);
      } catch {
        // Silently continue
      }
      res.json({
        success: true,
        message: formType === 'feedback'
          ? `आपकी बहुमूल्य ${rating || 5}★ स्टार रेटिंग और फीडबैक सफलतापूर्वक दर्ज कर लिया गया है!`
          : `आपका संदेश सफलतापूर्वक दर्ज कर लिया गया है।`,
        recipient: primaryEmail,
        id: submissionRecord.id,
      });
    } catch (err: any) {
      console.error('Submit form error:', err);
      res.status(500).json({ error: 'Failed to process submission' });
    }
  });

  // ── Feedback Stats & Live Reviews Endpoint ──
  app.get('/api/feedbacks', (req, res) => {
    try {
      let list: any[] = [];
      if (fs.existsSync(FEEDBACKS_FILE)) {
        const raw = fs.readFileSync(FEEDBACKS_FILE, 'utf-8');
        list = JSON.parse(raw);
      }

      const totalRatings = list.length;
      let sumRatings = 0;
      const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

      list.forEach((item) => {
        const r = Math.max(1, Math.min(5, Math.round(Number(item.rating) || 5)));
        breakdown[r] = (breakdown[r] || 0) + 1;
        sumRatings += r;
      });

      const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : '5.0';
      const fiveStarPercent = totalRatings > 0 ? Math.round(((breakdown[5] || 0) / totalRatings) * 100) : 100;

      res.json({
        totalRatings,
        averageRating: Number(averageRating),
        fiveStarPercent,
        breakdown,
        recentFeedbacks: list.slice(0, 30),
        status: Number(averageRating) >= 4.5 ? 'उत्कृष्ट (Outstanding)' : 'सकारात्मक (Positive)',
      });
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      res.status(500).json({ error: 'Failed to fetch feedbacks' });
    }
  });

  // ── Recent Submissions Count/Status Endpoint ──
  app.get('/api/submissions', (req, res) => {
    try {
      if (fs.existsSync(SUBMISSIONS_FILE)) {
        const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
        const list = JSON.parse(raw);
        res.json({ count: list.length, recent: list.slice(0, 10) });
      } else {
        res.json({ count: 0, recent: [] });
      }
    } catch {
      res.json({ count: 0, recent: [] });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite middleware for dev or static serving for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
