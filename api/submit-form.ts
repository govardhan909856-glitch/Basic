export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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
    const {
      formType,
      name,
      email,
      phone,
      subject,
      category,
      topic,
      rating,
      message,
    } = req.body || {};

    const submitterName =
      (name && name.trim()) || (formType === 'feedback' ? 'अतिथि विद्यार्थी' : 'विद्यार्थी');
    const submitterContact =
      (phone && phone.trim()) || (email && email.trim()) || 'उपलब्ध नहीं';
    const cleanEmail =
      (email && email.trim()) || (phone ? `Phone: ${phone}` : 'no-email@basics.local');

    const primaryEmail = process.env.NOTIFICATION_EMAIL || 'govardhan909856@gmail.com';
    const formattedDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    let subjectLine = '';
    if (formType === 'feedback') {
      const starStr = rating ? `${rating}★ Star` : 'Rating';
      subjectLine = `[BASICS] नई प्रतिक्रिया (${starStr} Feedback) - ${submitterName}`;
    } else if (formType === 'question') {
      subjectLine = `[BASICS] नया सवाल (Question: ${topic || 'Computer Help'}) - ${submitterName}`;
    } else {
      subjectLine = `[BASICS] नया संपर्क संदेश (Contact Inquiry: ${subject || 'General'}) - ${submitterName}`;
    }

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

      await fetch(`https://formsubmit.co/ajax/${primaryEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formPayload),
      }).catch(() => null);
    } catch {
      // Continue safely
    }

    res.status(200).json({
      success: true,
      message:
        formType === 'feedback'
          ? `आपकी बहुमूल्य ${rating || 5}★ स्टार रेटिंग और फीडबैक दर्ज कर लिया गया है!`
          : `आपका संदेश सफलतापूर्वक दर्ज कर लिया गया है।`,
      recipient: primaryEmail,
      id: `sub_${Date.now()}`,
    });
  } catch (err: any) {
    console.error('Submit form error on Vercel:', err);
    res.status(500).json({ error: 'Failed to process submission' });
  }
}
