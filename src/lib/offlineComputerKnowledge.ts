export interface KnowledgeResult {
  answer: string;
  sources: { title: string; uri: string }[];
  isOfflineFallback?: boolean;
}

export function getOfflineKnowledgeAnswer(query: string): KnowledgeResult {
  const q = query.toLowerCase().trim();

  // 1. कंप्यूटर चालू कैसे करें (How to turn on computer)
  if (
    q.includes('चालू') ||
    q.includes('start') ||
    q.includes('on kaise') ||
    q.includes('turn on') ||
    q.includes('power on') ||
    q.includes('chalu')
  ) {
    return {
      answer: `### 🖥️ कंप्यूटर चालू करने का सही तरीका (Step-by-Step Guide)

1. **पावर केबल व स्विच चेक करें:**
   - मुख्य बिजली बोर्ड का स्विच ऑन करें।
   - यदि आपके पास **UPS (Uninterruptible Power Supply)** है, तो उसका पावर बटन दबाकर उसे ऑन करें।
2. **CPU (Cabinet) का पावर बटन दबाएं:**
   - सीपीयू कैबिनेट के सामने लगे बड़े **Power Button** को एक बार दबाएं।
   - कैबिनेट की पावर लाइट (LED) जल जाएगी और पंखों की हल्की आवाज आएगी।
3. **मॉनिटर चालू करें:**
   - मॉनिटर के निचले या पिछले हिस्से में दिए गए पावर बटन को दबाएं।
4. **विंडोज लोड होने की प्रतीक्षा करें:**
   - स्क्रीन पर मदरबोर्ड का लोगो दिखेगा, फिर Windows लोड होगी।
   - अपना पासवर्ड या पिन दर्ज करें और एंटर दबाएं।

#### 💡 जरूरी टिप्स (Pro-Tips):
- कभी भी सीपीयू का मुख्य पावर बटन बार-बार न दबाएं।
- यदि डिस्प्ले नहीं आ रहा है, तो मॉनिटर की **HDMI / VGA केबल** चेक करें।`,
      sources: [
        { title: 'विंडोज बेसिक गाइड - हार्डवेयर सेटअप', uri: '#hero' },
      ],
      isOfflineFallback: true,
    };
  }

  // 2. स्क्रीनशॉट लेने का तरीका (Screenshot shortcut)
  if (
    q.includes('screenshot') ||
    q.includes('स्क्रीनशॉट') ||
    q.includes('screen shot') ||
    q.includes('screen capture')
  ) {
    return {
      answer: `### 📸 स्क्रीनशॉट लेने के सबसे आसान शॉर्टकट्स (Windows)

1. **चुनिंदा हिस्से का स्क्रीनशॉट (Snipping Tool):**
   - शॉर्टकट: \`[Win] + [Shift] + [S]\`
   - स्क्रीन थोड़ी धुंधली होगी, माउस से मनचाहा हिस्सा सिलेक्ट करें। स्क्रीनशॉट क्लिपबोर्ड में कॉपी हो जाएगा।
2. **पूरी स्क्रीन को सीधे इमेज फाइल के रूप में सेव करना:**
   - शॉर्टकट: \`[Win] + [PrtScn]\`
   - स्क्रीन एक पल के लिए ब्लिंक होगी और फोटो सीधे आपके **Pictures > Screenshots** फोल्डर में सेव हो जाएगी।
3. **केवल चालू (Active) विंडो का स्क्रीनशॉट:**
   - शॉर्टकट: \`[Alt] + [PrtScn]\`
   - केवल वही विंडो कॉपी होगी जिसमें आप काम कर रहे हैं। फिर \`[Ctrl] + [V]\` दबाकर Paint या Word में पेस्ट कर लें।

#### 💡 प्रो-टिप:
- स्क्रीनशॉट को तुरंत किसी को भेजने के लिए व्हाट्सएप वेब या वर्ड में सिर्फ \`[Ctrl] + [V]\` दबाएं।`,
      sources: [
        { title: 'Windows 10/11 Snipping & Shortcuts Guide', uri: '#hero' },
      ],
      isOfflineFallback: true,
    };
  }

  // 3. टास्क मैनेजर (Task Manager)
  if (
    q.includes('task manager') ||
    q.includes('टास्क मैनेजर') ||
    q.includes('taskmanager') ||
    q.includes('hang') ||
    q.includes('हैंग') ||
    q.includes('not responding')
  ) {
    return {
      answer: `### ⚡ Task Manager कैसे खोलें और हैंग ऐप कैसे बंद करें

1. **सबसे तेज डायरेक्ट शॉर्टकट:**
   - दबाएं: \`[Ctrl] + [Shift] + [Esc]\`
   - यह तुरंत बिना किसी अतिरिक्त मेनू के टास्क मैनेजर खोल देता है।
2. **वैकल्पिक शॉर्टकट:**
   - दबाएं: \`[Ctrl] + [Alt] + [Delete]\` और सूची में से **Task Manager** चुनें।
3. **माउस से खोलने का तरीका:**
   - नीचे टास्कबार (Taskbar) पर खाली जगह में राइट-क्लिक करें और **Task Manager** पर क्लिक करें।

#### 🛑 हैंग हुआ प्रोग्राम कैसे बंद करें (Force Close):
- टास्क मैनेजर में उस ऐप पर क्लिक करें जो 'Not Responding' दिखा रहा है।
- नीचे दाईं ओर दिए गए **End Task** बटन पर क्लिक करें।`,
      sources: [
        { title: 'Windows Process & Task Management Guide', uri: '#hero' },
      ],
      isOfflineFallback: true,
    };
  }

  // 4. कॉपी और पेस्ट (Copy and Paste)
  if (
    q.includes('copy') ||
    q.includes('paste') ||
    q.includes('कॉपी') ||
    q.includes('पेस्ट') ||
    q.includes('कट') ||
    q.includes('cut')
  ) {
    return {
      answer: `### 📋 कॉपी, कट और पेस्ट के शॉर्टकट कीज

1. **कॉपी (Copy):** \`[Ctrl] + [C]\`
   - चयनित टेक्स्ट या फाइल की कॉपी बनाता है (मूल फाइल वहीं रहती है)।
2. **कट (Cut):** \`[Ctrl] + [X]\`
   - चयनित टेक्स्ट या फाइल को वहां से हटाकर मूव करने के लिए उठा लेता है।
3. **पेस्ट (Paste):** \`[Ctrl] + [V]\`
   - कॉपी या कट की गई चीज को नई जगह रखता है।
4. **सब कुछ सिलेक्ट करना (Select All):** \`[Ctrl] + [A]\`
   - पेज का सारा टेक्स्ट या फोल्डर की सभी फाइल्स एक साथ चुनता है।
5. **अनडू (Undo / गलती सुधारना):** \`[Ctrl] + [Z]\`
   - पिछली की गई क्रिया को वापस पलटता है।

#### 💡 सुपर प्रो-टिप (Windows Clipboard History):
- दबाएं: \`[Win] + [V]\`
- इससे आपका क्लिपबोर्ड इतिहास खुल जाएगा, जिससे आप पहले कॉपी की गई कई चीजों को चुनकर पेस्ट कर सकते हैं।`,
      sources: [
        { title: 'Universal Keyboard Shortcuts & Clipboard', uri: '#hero' },
      ],
      isOfflineFallback: true,
    };
  }

  // 5. सीपीयू और जीपीयू (CPU vs GPU)
  if (
    q.includes('cpu') ||
    q.includes('gpu') ||
    q.includes('processor') ||
    q.includes('प्रोसेसर') ||
    q.includes('graphics') ||
    q.includes('ग्राफिक्स')
  ) {
    return {
      answer: `### 🧠 CPU और GPU में मुख्य अंतर (CPU vs GPU Explained)

| विशेषता | CPU (Central Processing Unit) | GPU (Graphics Processing Unit) |
| :--- | :--- | :--- |
| **भूमिका** | कंप्यूटर का मुख्य दिमाग (Brain of Computer) | विजुअल्स और ग्राफिक्स को प्रोसेस करना |
| **कोर (Cores)** | कम लेकिन बहुत ताकतवर कोर (उदा. 4 से 16 कोर) | हजारों छोटे समानांतर कोर (उदा. 2000+ कोर) |
| **काम का प्रकार** | क्रमिक कार्य (Sequential tasks, OS, फाइल्स, गणना) | भारी समानांतर कार्य (Gaming, Video Rendering, 3D, AI) |
| **उदाहरण** | Intel Core i5/i7, AMD Ryzen 5/7 | NVIDIA GeForce RTX, AMD Radeon |

#### 📌 संक्षेप में:
- **CPU** कंप्यूटर के हर सामान्य काम, सॉफ्टवेयर चलाने और आदेशों को नियंत्रित करने के लिए आवश्यक है।
- **GPU** स्क्रीन पर बेहतरीन 3D गेमिंग, 4K वीडियो एडिटिंग और ग्राफिक्स डिस्प्ले को स्मूथ बनाने के लिए जिम्मेदार है।`,
      sources: [
        { title: 'Computer Architecture: Hardware Fundamentals', uri: '#hero' },
      ],
      isOfflineFallback: true,
    };
  }

  // 6. रैम और स्टोरेज (RAM vs SSD / HDD)
  if (
    q.includes('ram') ||
    q.includes('rom') ||
    q.includes('ssd') ||
    q.includes('hdd') ||
    q.includes('रैम') ||
    q.includes('मेमोरी') ||
    q.includes('स्टोरेज')
  ) {
    return {
      answer: `### 💾 RAM (मेमोरी) और SSD/HDD (स्टोरेज) में क्या अंतर है?

1. **RAM (Random Access Memory) - अस्थायी मेमोरी:**
   - जब कंप्यूटर चालू होता है, तो चल रहे ऐप्स और विंडोज का डेटा रैम में लोड होता है।
   - यह बहुत तेज गति से काम करती है।
   - कंप्यूटर बंद होते ही इसका डेटा खाली हो जाता है (वोलैटाइल)।
2. **SSD / Hard Disk (Storage) - स्थायी स्टोरेज:**
   - आपकी फोटो, वीडियो, गाने, विंडोज फाइल्स और सॉफ्टवेयर हमेशा के लिए यहाँ सुरक्षित रहते हैं।
   - कंप्यूटर बंद होने पर भी डेटा सुरक्षित रहता है।
3. **SSD बनाम HDD:**
   - **SSD (Solid State Drive):** पुरानी हार्ड डिस्क से 5 से 10 गुना ज्यादा तेज होती है, जिससे पीसी 10 सेकंड में बूट हो जाता है।
   - **HDD (Hard Disk Drive):** धीमी लेकिन कम कीमत में ज्यादा जीबी स्टोरेज देती है।

#### 💡 सामान्य सिफारिश:
- स्मूथ मल्टीटास्किंग के लिए कम से कम **8GB या 16GB RAM** और विंडोज के लिए **SSD** का उपयोग करें।`,
      sources: [
        { title: 'PC Hardware Specs & Memory Guide', uri: '#hero' },
      ],
      isOfflineFallback: true,
    };
  }

  // 7. कंप्यूटर बंद / शटडाउन (How to shutdown computer)
  if (
    q.includes('बंद') ||
    q.includes('shutdown') ||
    q.includes('shut down') ||
    q.includes('restart') ||
    q.includes('रीस्टार्ट')
  ) {
    return {
      answer: `### 🛑 कंप्यूटर को सुरक्षित रूप से बंद (Shutdown) करने के तरीके

1. **माउस से सही तरीका (Standard Way):**
   - स्क्रीन पर नीचे बाएँ कोने में **Start बटन (Windows Icon)** पर क्लिक करें।
   - **Power आइकन** पर क्लिक करें और **Shut down** चुनें।
2. **कीबोर्ड शॉर्टकट (Fastest Shortcut):**
   - पहले डेस्कटॉप पर क्लिक करें या \`[Win] + [D]\` दबाएं।
   - फिर दबाएं: \`[Alt] + [F4]\`
   - स्क्रीन पर 'Shut Down' का विकल्प आएगा, सिर्फ **Enter** दबाएं।
3. **पावर मेनू शॉर्टकट:**
   - दबाएं: \`[Win] + [X]\` और फिर दो बार \`[U]\` दबाएं (\`[Win] + [X], U, U\`)।

⚠️ **महत्वपूर्ण चेतावनी:**
- कभी भी सीपीयू का पावर प्लग सीधे स्विच से बंद न करें! इससे ऑपरेटिंग सिस्टम करप्ट हो सकता है और आपकी खुली फाइल्स खराब हो सकती हैं।`,
      sources: [
        { title: 'Windows Safe Power Management', uri: '#hero' },
      ],
      isOfflineFallback: true,
    };
  }

  // 8. शॉर्टकट कीज की सूची (Windows Shortcut Keys)
  if (
    q.includes('शॉर्टकट') ||
    q.includes('shortcut') ||
    q.includes('keys') ||
    q.includes('कीज')
  ) {
    return {
      answer: `### ⌨️ सबसे महत्वपूर्ण विंडोज शॉर्टकट कीज (Essential Keyboard Shortcuts)

| शॉर्टकट | कार्य (Function) |
| :--- | :--- |
| \`[Win] + [D]\` | सीधे डेस्कटॉप पर जाएं (सभी ऐप्स मिनिमाइज करें) |
| \`[Win] + [E]\` | File Explorer (My Computer) खोलें |
| \`[Win] + [L]\` | कंप्यूटर स्क्रीन तुरंत लॉक करें |
| \`[Alt] + [Tab]\` | खुले हुए ऐप्स के बीच स्विच करें |
| \`[Ctrl] + [Shift] + [Esc]\` | Task Manager तुरंत खोलें |
| \`[Win] + [Shift] + [S]\` | चुनिंदा स्क्रीनशॉट लें |
| \`[Win] + [R]\` | Run कमांड डायलॉग बॉक्स खोलें |
| \`[Ctrl] + [Z]\` | Undo (गलती वापस लें) |
| \`[Ctrl] + [Y]\` | Redo (दोबारा लागू करें) |
| \`[Ctrl] + [Shift] + [N]\` | नया फोल्डर बनाएं |
| \`[F2]\` | सिलेक्टेड फाइल का नाम बदलें (Rename) |
| \`[Alt] + [F4]\` | चालू ऐप बंद करें या पीसी शटडाउन करें |`,
      sources: [
        { title: 'Master Windows Shortcuts Cheatsheet', uri: '#hero' },
      ],
      isOfflineFallback: true,
    };
  }

  // 9. BIOS या Boot Menu
  if (
    q.includes('bios') ||
    q.includes('बायोस') ||
    q.includes('boot') ||
    q.includes('बूट')
  ) {
    return {
      answer: `### ⚙️ BIOS / Boot Menu कैसे खोलें?

1. **कंप्यूटर रीस्टार्ट करें:**
   - कंप्यूटर को रीस्टार्ट करें या बंद करके ऑन करें।
2. **की लगातार दबाएं:**
   - जैसे ही स्क्रीन पर कंपनी का लोगो दिखे (Dell, HP, Lenovo, Asus, Gigabyte), तुरंत संबंधित की को बार-बार दबाएं:
   - **Dell:** \`[F2]\` (BIOS) या \`[F12]\` (Boot Menu)
   - **HP:** \`[F10]\` (BIOS) या \`[Esc]\` / \`[F9]\` (Boot Menu)
   - **Lenovo:** \`[F2]\` या \`[Fn] + [F2]\` (Boot Menu के लिए \`[F12]\`)
   - **Asus:** \`[Del]\` या \`[F2]\` (Boot Menu के लिए \`[F8]\`)
   - **Gigabyte / MSI:** \`[Del]\` या \`[F11]\`

#### 💡 विंडोज 10/11 से डायरेक्ट BIOS में जाना:
- Settings > Update & Security / System > Recovery > **Advanced Startup (Restart Now)** पर क्लिक करें।
- फिर Troubleshoot > Advanced options > **UEFI Firmware Settings** चुनें।`,
      sources: [
        { title: 'Motherboard UEFI & BIOS Access Guide', uri: '#hero' },
      ],
      isOfflineFallback: true,
    };
  }

  // 10. आवाज या डिस्प्ले की समस्या (Troubleshooting)
  if (
    q.includes('आवाज') ||
    q.includes('sound') ||
    q.includes('audio') ||
    q.includes('display') ||
    q.includes('black screen') ||
    q.includes('स्क्रीन')
  ) {
    return {
      answer: `### 🔧 कंप्यूटर डिस्प्ले व ऑडियो समस्या निवारण (Troubleshooting Guide)

1. **यदि आवाज (Sound/Audio) नहीं आ रही है:**
   - टास्कबार के दाईं ओर स्पीकर आइकन पर क्लिक करके चेक करें कि वॉल्यूम म्यूट तो नहीं है।
   - स्पीकर आइकन पर राइट-क्लिक करें और **Sound settings** खोलकर सही आउटपुट डिवाइस (Headphones/Speakers) चुनें।
   - हेडफोन जैक को 3.5mm पोर्ट में दोबारा ठीक से लगाएं।
2. **यदि स्क्रीन पर कुछ नहीं दिख रहा (Black Screen):**
   - मॉनिटर की पावर लाइट चेक करें (नीली/सफेद है या नारंगी)।
   - HDMI / DisplayPort / VGA केबल को सीपीयू और मॉनिटर दोनों तरफ से निकाल कर दोबारा मजबूती से लगाएं।
   - यदि आपके पास अलग ग्राफिक्स कार्ड (GPU) है, तो केबल मदरबोर्ड में नहीं बल्कि नीचे ग्राफिक्स कार्ड के पोर्ट में लगाएं।
   - रैम (RAM) को निकाल कर साफ रबड़ (eraser) से उसके गोल्डन पिन साफ करके दोबारा लगाएं।`,
      sources: [
        { title: 'Hardware Diagnostics & Troubleshooting', uri: '#hero' },
      ],
      isOfflineFallback: true,
    };
  }

  // Generic intelligent fallback for any other computer query
  return {
    answer: `### 💻 कंप्यूटर गाइड: "${query}"

1. **बुनियादी सिद्धांत (Overview):**
   - कंप्यूटर में किसी भी कमांड या टास्क को पूरा करने के लिए विंडोज कीबोर्ड शॉर्टकट्स और सेटिंग्स सबसे प्रभावी माध्यम हैं।
2. **महत्वपूर्ण शॉर्टकट्स एवं चरण:**
   - सेटिंग्स खोलने के लिए: \`[Win] + [I]\` दबाएं।
   - फाइल खोजने या खोलने के लिए: \`[Win] + [S]\` दबाएं और नाम टाइप करें।
   - सिस्टम डिटेल्स और स्पेक्स देखने के लिए: \`[Win] + [Pause/Break]\` दबाएं या 'This PC' पर राइट-क्लिक करके Properties देखें।
   - किसी भी काम को वापस सामान्य करने के लिए: \`[Ctrl] + [Z]\` (Undo) या \`[Esc]\` (Cancel) दबाएं।
3. **कंप्यूटर को सुरक्षित व तेज रखने के टिप्स:**
   - नियमित रूप से रीसायकल बिन खाली करें।
   - \`[Win] + [R]\` दबाकर \`temp\` और \`%temp%\` टाइप करें और गैर-जरूरी अस्थायी फाइल्स डिलीट करें।
   - किसी भी ऐप को बंद करने के लिए \`[Alt] + [F4]\` का उपयोग करें।`,
    sources: [
      { title: 'BASICS Computer Literacy Knowledge Base', uri: '#hero' },
    ],
    isOfflineFallback: true,
  };
}
