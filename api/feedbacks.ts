export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Pre-seeded curated community reviews
  const reviews = [
    {
      id: 'fb_1',
      name: 'रोहित शर्मा',
      rating: 5,
      category: 'Keyboard & Shortcuts',
      message: 'शॉर्टकट कीज और कंप्यूटर चालू-बंद करने की जानकारी बहुत ही सरल हिंदी में दी गई है। बच्चों के लिए सबसे बेस्ट!',
      dateFormatted: 'कल, शाम 06:30 बजे',
    },
    {
      id: 'fb_2',
      name: 'अंजलि वर्मा',
      rating: 5,
      category: 'Components Guide',
      message: 'CPU और RAM के अंतर को जिस तरह उदाहरण देकर समझाया गया है, उससे सब कुछ पहली बार में ही समझ आ गया।',
      dateFormatted: '2 दिन पहले',
    },
    {
      id: 'fb_3',
      name: 'सोनू कुमार',
      rating: 5,
      category: 'Voice Assistant',
      message: 'AI वॉइस सर्च फीचर बहुत कमाल का है, बोलकर सवाल पूछने पर तुरंत जवाब मिलता है।',
      dateFormatted: '3 दिन पहले',
    },
  ];

  res.status(200).json({
    totalRatings: reviews.length,
    averageRating: '5.0',
    fiveStarPercent: 100,
    breakdown: { 5: reviews.length, 4: 0, 3: 0, 2: 0, 1: 0 },
    recentReviews: reviews,
  });
}
