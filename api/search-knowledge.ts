import { GoogleGenAI } from '@google/genai';
import { getOfflineKnowledgeAnswer } from '../src/lib/offlineComputerKnowledge';

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

export default async function handler(req: any, res: any) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { query } = req.body || {};
    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'Query is required.' });
      return;
    }

    const trimmedQuery = query.trim();
    const lowerQuery = trimmedQuery.toLowerCase();

    // Check if query is about the website or creator
    const isAboutWebsiteOrCreator =
      lowerQuery.includes('kisne banai') ||
      lowerQuery.includes('kisne banaya') ||
      lowerQuery.includes('who made') ||
      lowerQuery.includes('who created') ||
      lowerQuery.includes('govardhan') ||
      lowerQuery.includes('किसने बनाई') ||
      lowerQuery.includes('किसने बनाया');

    if (isAboutWebsiteOrCreator) {
      res.status(200).json({
        answer: `### 🌐 BASICS वेबसाइट एवं AI के बारे में\n\n- **निर्माता (Creator):** यह वेबसाइट और इसका AI **गोवर्धन यादव (Govardhan Yadav)** ने बनाई है।\n- **उद्देश्य (Purpose):** इस वेबसाइट का मुख्य उद्देश्य **बिगिनर्स (Beginners) और बच्चों को कंप्यूटर के बेसिक्स सिखाना** तथा उन्हें डिजिटल रूप से सक्षम बनाना है।\n- **यह किस काम के लिए बनाई गई है?**\n  1. **कंप्यूटर के बुनियादी कौशल:** कंप्यूटर चालू करने से लेकर विंडोज नेविगेशन, कीबोर्ड शॉर्टकट्स और फाइल मैनेजमेंट को सरल तरीके से सिखाना।\n  2. **डिजिटल ज्ञान व दक्षता:** बच्चों और नए सीखने वालों को तकनीक और कंप्यूटर के आवश्यक सिद्धांतों से परिचित कराना।\n  3. **24/7 AI वॉइस असिस्टेंट:** बोलकर या लिखकर कंप्यूटर से जुड़ा कोई भी सवाल पूछने पर तुरंत और सटीक समाधान प्रदान करना।\n\nगोवर्धन यादव ने इसे खासतौर पर बच्चों और नए सीखने वालों के ज्ञान और आत्मविश्वास को बढ़ाने के लिए बनाया है।`,
        sources: [
          {
            title: 'BASICS — Learn Computer Basics the Easy Way',
            uri: '#hero',
          },
        ],
      });
      return;
    }

    // If no GEMINI_API_KEY is configured on Vercel yet, respond with offline knowledge engine
    if (!process.env.GEMINI_API_KEY) {
      const fallback = getOfflineKnowledgeAnswer(trimmedQuery);
      res.status(200).json({
        answer: fallback.answer,
        sources: fallback.sources,
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
You MUST state that this website and AI was created by Govardhan Yadav (गोवर्धन यादव), and its purpose is to teach beginners and children computer basics and digital skills (बच्चों और बिगिनर्स को कंप्यूटर के बेसिक्स और डिजिटल ज्ञान सिखाने में मदद करने के लिए).

Structure your answer clearly with markdown:
1. **Summary / Definition**: A direct, easy-to-understand explanation.
2. **Step-by-Step Guide** (if applicable): Numbered steps [Step 1, Step 2, ...] detailing exactly what to click, press, or inspect.
3. **Shortcut Keys & Key Combos** (if applicable): Display the exact shortcut combinations clearly (e.g. \`[Ctrl] + [Shift] + [Esc]\`, \`[Win] + [R]\`, \`[Alt] + [F4]\`).
4. **Hardware / Component Notes**: Any relevant component details, ports, or compatibility points.
5. **Pro-Tips / Troubleshooting**: Practical advice, safety warnings, or alternative methods.
6. If the user asks in Hindi or Hinglish, explain comfortably in easy-to-understand Hindi/Hinglish.`;

    let response: any = null;

    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: trimmedQuery,
        config: {
          systemInstruction,
        },
      });
    } catch (aiErr) {
      console.warn('Vercel serverless AI error, switching to fallback:', aiErr);
    }

    if (response?.text) {
      res.status(200).json({
        answer: response.text,
        sources: [
          {
            title: 'Google AI Grounded Computer Knowledge',
            uri: '#hero',
          },
        ],
      });
      return;
    }

    // Fallback if AI call didn't yield text
    const fallback = getOfflineKnowledgeAnswer(trimmedQuery);
    res.status(200).json({
      answer: fallback.answer,
      sources: fallback.sources,
    });
  } catch (err: any) {
    console.error('Vercel serverless function error:', err);
    const fallback = getOfflineKnowledgeAnswer(req.body?.query || 'computer');
    res.status(200).json({
      answer: fallback.answer,
      sources: fallback.sources,
    });
  }
}
