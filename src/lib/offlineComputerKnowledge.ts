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

  // 11. कंप्यूटर क्या है (What is a Computer)
  if (
    q.includes('कंप्यूटर क्या') ||
    q.includes('what is computer') ||
    q.includes('what is a computer') ||
    q.includes('computer kya') ||
    q.includes('कंप्यूटर की परिभाषा')
  ) {
    return {
      answer: `### 🖥️ कंप्यूटर क्या है? (What is a Computer)

**कंप्यूटर** एक इलेक्ट्रॉनिक उपकरण (Electronic Device) है जो यूज़र से कच्चा डेटा (Input) लेता है, उसे अपने प्रोसेसर (CPU) की मदद से प्रोसेस करता है, और अंत में एक सार्थक परिणाम (Output/Information) प्रदान करता है।

#### 🔄 कंप्यूटर का बुनियादी कार्य-चक्र (IPO Cycle):
1. **इनपुट (Input):** कीबोर्ड, माउस, स्कैनर आदि से निर्देश प्राप्त करना।
2. **प्रोसेसिंग (Processing):** CPU द्वारा गणना, तर्क और विश्लेषण करना।
3. **आउटपुट (Output):** मॉनिटर स्क्रीन, प्रिंटर या स्पीकर पर परिणाम दिखाना।
4. **स्टोरेज (Storage):** भविष्य में उपयोग के लिए हार्ड डिस्क/SSD में डेटा सहेजना।

#### 🔑 कंप्यूटर के मुख्य लाभ:
- **तीव्र गति (High Speed):** करोड़ों गणनाएं प्रति सेकंड करना।
- **सटीकता (100% Accuracy):** सही इनपुट पर कभी गलती न करना।
- **मेमोरी (Huge Storage):** विशाल मात्रा में किताबें, फाइल्स व मीडिया सुरक्षित रखना।`,
      sources: [{ title: 'Fundamentals of Computing', uri: '#hero' }],
      isOfflineFallback: true,
    };
  }

  // 12. हार्डवेयर और सॉफ्टवेयर (Hardware vs Software)
  if (
    q.includes('hardware') ||
    q.includes('software') ||
    q.includes('हार्डवेयर') ||
    q.includes('सॉफ्टवेयर')
  ) {
    return {
      answer: `### ⚙️ हार्डवेयर और सॉफ्टवेयर में अंतर (Hardware vs Software)

| बिंदु | हार्डवेयर (Hardware) | सॉफ्टवेयर (Software) |
| :--- | :--- | :--- |
| **परिभाषा** | कंप्यूटर के वे भौतिक अंग जिन्हें हम छू सकते हैं और देख सकते हैं। | निर्देशों और प्रोग्रामों का समूह जो हार्डवेयर को काम करने का आदेश देता है। |
| **प्रकृति** | भौतिक (Physical Tangible) | आभासी/डिजिटल (Intangible) |
| **खराबी** | खराब होने पर बदलना या रिपेयर करना पड़ता है। | क्रैश होने पर री-इंस्टॉल या अपडेट किया जाता है। |
| **उदाहरण** | कीबोर्ड, माउस, मॉनिटर, CPU, RAM, मदरबोर्ड, हार्ड डिस्क। | Windows 11, MS Office, Google Chrome, Photoshop, VLC Player। |

#### 💡 सरल शब्दों में:
हार्डवेयर कंप्यूटर का **शरीर** है और सॉफ्टवेयर उसकी **आत्मा** (निर्देश)। बिना सॉफ्टवेयर के हार्डवेयर केवल एक खाली डिब्बा है!`,
      sources: [{ title: 'Hardware vs Software Fundamentals', uri: '#hero' }],
      isOfflineFallback: true,
    };
  }

  // 13. इंटरनेट, वाई-फाई और नेटवर्क (Internet & Wi-Fi)
  if (
    q.includes('internet') ||
    q.includes('इंटरनेट') ||
    q.includes('wifi') ||
    q.includes('वाईफाई') ||
    q.includes('router') ||
    q.includes('नेटवर्क') ||
    q.includes('network')
  ) {
    return {
      answer: `### 🌐 इंटरनेट और वाई-फाई क्या है और कैसे काम करता है?

1. **इंटरनेट (Internet):**
   - यह दुनिया भर के अरबों कंप्यूटरों और सर्वरों का एक विशाल वैश्विक नेटवर्क है (International Network)।
   - इसके माध्यम से जानकारी, ईमेल, वीडियो, वेबसाइट्स और फाइलों का सेकंडों में आदान-प्रदान होता है।
2. **वाई-फाई (Wi-Fi - Wireless Fidelity):**
   - बिना किसी तार (Wireless) के रेडियो तरंगों (Radio Waves) द्वारा आपके कंप्यूटर या मोबाइल को इंटरनेट से जोड़ने की तकनीक है।
3. **कंप्यूटर को Wi-Fi से कैसे जोड़ें:**
   - टास्कबार के नीचे दाएँ कोने में **Wi-Fi/Network आइकन** पर क्लिक करें।
   - अपने नेटवर्क का नाम चुनें और **Connect** दबाएं।
   - वाई-फाई का सही पासवर्ड दर्ज करें।

#### 💡 यदि इंटरनेट न चले (Troubleshooting):
- राउटर को 30 सेकंड के लिए बंद करके दोबारा चालू (Restart) करें।
- कीबोर्ड पर \`[Win] + [I]\` दबाएं ➔ **Network & Internet** ➔ **Network troubleshooter** चलाएं।`,
      sources: [{ title: 'Networking & Internet Protocols Guide', uri: '#hero' }],
      isOfflineFallback: true,
    };
  }

  // 14. वायरस, एंटीवायरस और सुरक्षा (Virus, Malware & Security)
  if (
    q.includes('virus') ||
    q.includes('वायरस') ||
    q.includes('antivirus') ||
    q.includes('एंटीवायरस') ||
    q.includes('malware') ||
    q.includes('सुरक्षा') ||
    q.includes('security')
  ) {
    return {
      answer: `### 🛡️ कंप्यूटर वायरस और एंटीवायरस क्या है?

1. **कंप्यूटर वायरस (Virus):**
   - यह एक दुर्भावनापूर्ण सॉफ्टवेयर प्रोग्राम (Malware) है जो आपकी अनुमति के बिना कंप्यूटर में घुसकर फाइलों को खराब करता है, सिस्टम को धीमा करता है या डेटा चुराता है।
   - यह संदिग्ध लिंक, संक्रमित पेनड्राइव या पायरेटेड सॉफ्टवेयर डाउनलोड करने से फैलता है।
2. **एंटीवायरस (Antivirus):**
   - यह एक सुरक्षा सॉफ्टवेयर है जो वायरस को स्कैन करके उन्हें हटाता है (उदा. Windows Defender, Quick Heal, Avast, Kaspersky)।
3. **विंडोज का इनबिल्ट एंटीवायरस (Windows Defender):**
   - Windows 10 और 11 में पहले से ही शक्तिशाली **Windows Security** मौजूद होता है।
   - इसे खोलने के लिए: \`[Win] + [S]\` दबाएं और टाइप करें **Windows Security** ➔ **Quick Scan** करें।

#### 🔒 कंप्यूटर को सुरक्षित रखने के 4 नियम:
- कभी भी किसी अनजान ईमेल अटैचमेंट को न खोलें।
- किसी दूसरे की पेनड्राइव लगाने से पहले उसे स्कैन करें।
- विंडोज को हमेशा अप-टू-डेट रखें।`,
      sources: [{ title: 'Cybersecurity & Windows Defender Guide', uri: '#hero' }],
      isOfflineFallback: true,
    };
  }

  // 15. एमएस ऑफिस - वर्ड, एक्सेल, पावरपॉइंट (MS Office / Word / Excel)
  if (
    q.includes('word') ||
    q.includes('excel') ||
    q.includes('powerpoint') ||
    q.includes('office') ||
    q.includes('वर्ड') ||
    q.includes('एक्सेल') ||
    q.includes('पावरपॉइंट')
  ) {
    return {
      answer: `### 📄 Microsoft Office के मुख्य सॉफ्टवेयर और उनके कार्य

1. **Microsoft Word (दस्तावेज़ / डॉक्यूमेंट):**
   - पत्र, बायोडाटा (Resume), नोट्स, रिपोर्ट और किताबें लिखने के लिए।
   - शॉर्टकट: सेव करने के लिए \`[Ctrl] + [S]\`, प्रिंट के लिए \`[Ctrl] + [P]\`, बोल्ड के लिए \`[Ctrl] + [B]\`।
2. **Microsoft Excel (स्प्रेडशीट / डेटा गणना):**
   - गणितीय गणनाएं, मार्कशीट, बजट, वित्तीय आंकड़े और टेबल बनाने के लिए।
   - मुख्य सूत्र (Formulas): जोड़ने के लिए \`=SUM(A1:A10)\`, औसत के लिए \`=AVERAGE(A1:A10)\`।
3. **Microsoft PowerPoint (प्रस्तुति / Presentations):**
   - स्लाइड्स, प्रेजेंटेशन, एनिमेशन और सेमिनार प्रोजेक्ट्स बनाने के लिए।
   - फुल स्क्रीन प्रेजेंटेशन शुरू करने के लिए: \`[F5]\` दबाएं।

#### 💡 प्रो-टिप:
- रन बॉक्स में \`winword\` टाइप करने से Word, \`excel\` टाइप करने से Excel और \`powerpnt\` टाइप करने से PowerPoint तुरंत खुल जाता है।`,
      sources: [{ title: 'MS Office Suite Comprehensive Guide', uri: '#hero' }],
      isOfflineFallback: true,
    };
  }

  // 16. कंप्यूटर धीमा / स्पीड कैसे बढ़ाएं (Slow PC Speedup)
  if (
    q.includes('धीमा') ||
    q.includes('slow') ||
    q.includes('speed') ||
    q.includes('स्पीड') ||
    q.includes('hang') ||
    q.includes('हैंग') ||
    q.includes('कचरा') ||
    q.includes('clean') ||
    q.includes('temp')
  ) {
    return {
      answer: `### 🚀 कंप्यूटर की स्पीड कैसे बढ़ाएं? (5 आसान और असरदार तरीके)

1. **अस्थायी (Temporary/Junk) फाइल्स डिलीट करें:**
   - \`[Win] + [R]\` दबाएं और टाइप करें \`temp\` ➔ सारी फाइलें सिलेक्ट करके डिलीट करें।
   - दोबारा \`[Win] + [R]\` दबाएं और टाइप करें \`%temp%\` ➔ सभी फाइल्स सिलेक्ट कर \`[Shift] + [Delete]\` दबाएं।
   - \`[Win] + [R]\` दबाकर \`prefetch\` टाइप करें और फाइल्स साफ करें।
2. **स्टार्टअप ऐप्स बंद करें (Startup Apps Disable):**
   - \`[Ctrl] + [Shift] + [Esc]\` दबाकर Task Manager खोलें।
   - **Startup apps** टैब में जाएं और उन ऐप्स को Disable करें जो कंप्यूटर ऑन होते ही खुद खुल जाते हैं।
3. **डिस्क क्लीनअप चलाएं:**
   - स्टार्ट मेनू में **Disk Cleanup** सर्च करके C: ड्राइव की बेकार सिस्टम फाइलें खाली करें।
4. **रीसायकल बिन (Recycle Bin) खाली करें:**
   - डेस्कटॉप पर Recycle Bin पर राइट-क्लिक करें और **Empty Recycle Bin** चुनें।
5. **SSD और RAM अपग्रेड:**
   - यदि आपकी मुख्य ड्राइव HDD (हार्ड डिस्क) है, तो उसमें SATA/NVMe SSD लगवाएं — इससे स्पीड 10 गुना बढ़ जाएगी!`,
      sources: [{ title: 'Windows Performance Optimization Guide', uri: '#hero' }],
      isOfflineFallback: true,
    };
  }

  // 17. ब्राउज़र और सर्च इंजन (Browser vs Search Engine)
  if (
    q.includes('browser') ||
    q.includes('ब्राउज़र') ||
    q.includes('chrome') ||
    q.includes('क्रोम') ||
    q.includes('search engine') ||
    q.includes('गूगल')
  ) {
    return {
      answer: `### 🌐 ब्राउज़र और सर्च इंजन में अंतर

1. **वेब ब्राउज़र (Web Browser):**
   - वह सॉफ्टवेयर जो आपको इंटरनेट पर वेबसाइट्स खोलने और देखने की सुविधा देता है।
   - **उदाहरण:** Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, Brave।
2. **सर्च इंजन (Search Engine):**
   - इंटरनेट पर मौजूद लाखों वेबसाइटों में से आपके द्वारा पूछे गए सवाल की जानकारी ढूंढकर लाने वाली वेबसाइट।
   - **उदाहरण:** Google, Bing, Yahoo, DuckDuckGo।

#### ⌨️ ब्राउज़र के सबसे उपयोगी शॉर्टकट्स:
- नया टैब खोलना: \`[Ctrl] + [T]\`
- गलती से बंद हुआ टैब दोबारा खोलना: \`[Ctrl] + [Shift] + [T]\`
- इनकॉग्निटो / प्राइवेट विंडो: \`[Ctrl] + [Shift] + [N]\`
- हिस्ट्री देखना: \`[Ctrl] + [H]\`
- डाउनलोड्स देखना: \`[Ctrl] + [J]\``,
      sources: [{ title: 'Web Browsers & Navigation Guide', uri: '#hero' }],
      isOfflineFallback: true,
    };
  }

  // 18. कंप्यूटर फुल फॉर्म्स (Computer Full Forms)
  if (
    q.includes('full form') ||
    q.includes('फुल फॉर्म') ||
    q.includes('फुलफॉर्म') ||
    q.includes('फुलनेम')
  ) {
    return {
      answer: `### 📚 महत्वपूर्ण कंप्यूटर फुल फॉर्म्स (Essential Computer Full Forms)

| संक्षिप्त नाम | पूरा नाम (Full Form) |
| :--- | :--- |
| **CPU** | Central Processing Unit (कंप्यूटर का दिमाग) |
| **RAM** | Random Access Memory (अस्थायी मेमोरी) |
| **ROM** | Read Only Memory (स्थायी शुरुआती मेमोरी) |
| **SSD** | Solid State Drive (अल्ट्रा-फास्ट स्टोरेज) |
| **HDD** | Hard Disk Drive (हार्ड ड्राइव) |
| **USB** | Universal Serial Bus |
| **GPU** | Graphics Processing Unit |
| **OS** | Operating System (जैसे Windows, Linux) |
| **URL** | Uniform Resource Locator (वेबसाइट का पता) |
| **HTTP/HTTPS**| Hypertext Transfer Protocol (Secure) |
| **PDF** | Portable Document Format |
| **LAN/WAN**| Local Area Network / Wide Area Network |
| **GUI** | Graphical User Interface |
| **BIOS** | Basic Input Output System |`,
      sources: [{ title: 'Computer Abbreviations & Terminology', uri: '#hero' }],
      isOfflineFallback: true,
    };
  }

  // 19. फॉर्मेट और विंडोज इंस्टॉलेशन (Format & Windows Install)
  if (
    q.includes('format') ||
    q.includes('फॉर्मेट') ||
    q.includes('install windows') ||
    q.includes('विंडोज इंस्टॉल') ||
    q.includes('reset pc') ||
    q.includes('रीसेट')
  ) {
    return {
      answer: `### 🔄 कंप्यूटर को रीसेट या फॉर्मेट कैसे करें? (Safe Reset Guide)

Windows 10/11 में कंप्यूटर को फॉर्मेट या रीसेट करने के लिए किसी बाहरी डिस्क की जरूरत नहीं होती:

1. **सेटिंग्स खोलें:**
   - दबाएं: \`[Win] + [I]\`
2. **रिकवरी में जाएं:**
   - Windows 11: **System** ➔ **Recovery** ➔ **Reset PC**
   - Windows 10: **Update & Security** ➔ **Recovery** ➔ **Reset this PC (Get started)**
3. **विकल्प चुनें:**
   - **Keep my files:** आपकी फोटो, गाने और दस्तावेज सुरक्षित रहेंगे, केवल सॉफ्टवेयर और सेटिंग्स नई जैसी हो जाएंगी।
   - **Remove everything:** पूरा कंप्यूटर पूरी तरह से खाली और नया हो जाएगा (फॉर्मेट)।
4. **Cloud Download या Local Reinstall:**
   - 'Local Reinstall' चुनें और निर्देशों का पालन करें। कंप्यूटर अपने आप रीस्टार्ट होकर बिल्कुल नया हो जाएगा।

⚠️ **चेतावनी:** प्रक्रिया शुरू करने से पहले अपने जरूरी डेटा का बैकअप किसी पेनड्राइव या गूगल ड्राइव पर अवश्य लें!`,
      sources: [{ title: 'Windows 10/11 Reset & Recovery Guide', uri: '#hero' }],
      isOfflineFallback: true,
    };
  }

  // 20. प्रिंटर कैसे जोड़ें / प्रिंट कैसे करें (Printer & Print Shortcut)
  if (
    q.includes('printer') ||
    q.includes('प्रिंटर') ||
    q.includes('print') ||
    q.includes('प्रिंट')
  ) {
    return {
      answer: `### 🖨️ कंप्यूटर से प्रिंट कैसे निकालें और प्रिंटर कैसे जोड़ें?

1. **किसी भी फाइल या पेज को प्रिंट करने का शॉर्टकट:**
   - दबाएं: \`[Ctrl] + [P]\`
   - स्क्रीन पर प्रिंट विंडो खुलेगी।
   - अपना प्रिंटर चुनें, प्रतियों की संख्या (Copies) डालें और **Print** पर क्लिक करें।
2. **नया प्रिंटर कंप्यूटर में कैसे जोड़ें:**
   - प्रिंटर को बिजली से जोड़ें और ऑन करें।
   - USB केबल को कंप्यूटर के CPU पोर्ट में लगाएं।
   - दबाएं: \`[Win] + [I]\` ➔ **Bluetooth & devices** ➔ **Printers & scanners**
   - **Add device** पर क्लिक करें। विंडोज अपने आप प्रिंटर ढूंढकर ड्राइवर इंस्टॉल कर लेगा।

#### 💡 प्रो-टिप:
- बिना प्रिंटर के किसी भी पेज को PDF के रूप में सेव करने के लिए प्रिंटर में **"Microsoft Print to PDF"** चुनें!`,
      sources: [{ title: 'Peripherals & Printer Management', uri: '#hero' }],
      isOfflineFallback: true,
    };
  }

  // Generic intelligent fallback for any other computer query
  return {
    answer: `### 💻 कंप्यूटर गाइड: "${query}"

1. **त्वरित सहायता व शॉर्टकट्स:**
   - सेटिंग्स खोलने के लिए: \`[Win] + [I]\` दबाएं।
   - कोई भी फाइल या ऐप खोजने के लिए: \`[Win] + [S]\` दबाएं।
   - कार्य प्रबंधक (Task Manager): \`[Ctrl] + [Shift] + [Esc]\`
   - गलती सुधारने के लिए (Undo): \`[Ctrl] + [Z]\`
2. **अधिक जानकारी के लिए:**
   - आप सर्च बार में कंप्यूटर से जुड़े मुख्य विषय जैसे: **"RAM", "CPU", "स्क्रीनशॉट", "शॉर्टकट", "कंप्यूटर चालू/बंद", "वायरस", "इंटरनेट", "धीमा कंप्यूटर", "फॉर्मेट", "प्रिंटर", "फुल फॉर्म"** आदि टाइप करके तुरंत विस्तृत उत्तर पा सकते हैं।
   - *टिप:* Google Gemini AI द्वारा किसी भी सवाल का रीयल-टाइम उत्तर पाने के लिए वेबसाइट को **Vercel** पर डिप्लॉय करें।`,
    sources: [
      { title: 'BASICS Computer Literacy Knowledge Base', uri: '#hero' },
    ],
    isOfflineFallback: true,
  };
}
