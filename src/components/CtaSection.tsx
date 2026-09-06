import { useState } from 'react';
import { Phone, Mail, MessageCircle, Copy, Check, ArrowUpRight } from 'lucide-react';

export default function CtaSection() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const phoneNumber = '+91 9098564648';
  const whatsappNumber = '+91 9098564648';
  const emailAddress = 'govardhan909856@gmail.com';
  const whatsappUrl = 'https://wa.me/919098564648?text=Hello%20Govardhan%20ji,%20I%20visited%20the%20Basics%20website.';

  return (
    <section
      id="contact"
      className="relative min-h-[60vh] flex items-center justify-center text-center py-20 sm:py-28 px-5 sm:px-8 z-10 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center w-full">
        {/* Section tag */}
        <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#c8ff00] mb-5">
          <span className="w-6 h-px bg-[#c8ff00] shadow-[0_0_8px_#c8ff00]" />
          <span>DIRECT CONTACT // सीधे संपर्क करें</span>
          <span className="w-6 h-px bg-[#c8ff00] shadow-[0_0_8px_#c8ff00]" />
        </div>

        {/* Big Headline */}
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.2]">
          संपर्क करें
          <br />
          <span className="text-[#c8ff00] drop-shadow-[0_0_35px_rgba(200,255,0,0.3)]">
            Govardhan Yadav
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-4 max-w-xl text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
          कंप्यूटर बेसिक्स या किसी भी सवाल व जानकारी के लिए आप सीधे कॉल, व्हाट्सएप या ईमेल द्वारा संपर्क कर सकते हैं:
        </p>

        {/* ── 3 DEDICATED CONTACT CARDS: NUMBER, WHATSAPP, EMAIL ONLY ── */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl">
          {/* 1. Phone Card */}
          <div className="group relative p-6 rounded-3xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/15 hover:border-[#c8ff00]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(200,255,0,0.2)] flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#c8ff00]/10 border border-[#c8ff00]/30 text-[#c8ff00] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>

            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
              फोन नंबर / Mobile
            </span>

            <a
              href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
              className="font-mono text-base sm:text-lg font-bold text-white hover:text-[#c8ff00] transition-colors mb-4 flex items-center gap-1.5"
            >
              <span>{phoneNumber}</span>
              <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <div className="mt-auto flex items-center gap-2 w-full">
              <a
                href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#c8ff00] hover:bg-[#d8ff33] text-black text-xs font-bold transition-all text-center"
              >
                कॉल करें
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard(phoneNumber, 'phone')}
                className="p-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-neutral-300 hover:text-white border border-white/10 transition-colors"
                title="नंबर कॉपी करें"
                aria-label="Copy phone number"
              >
                {copiedField === 'phone' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* 2. WhatsApp Card */}
          <div className="group relative p-6 rounded-3xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-400/80 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-7 h-7" />
            </div>

            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
              व्हाट्सएप / WhatsApp
            </span>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-base sm:text-lg font-bold text-white hover:text-emerald-400 transition-colors mb-4 flex items-center gap-1.5"
            >
              <span>{whatsappNumber}</span>
              <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <div className="mt-auto flex items-center gap-2 w-full">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all text-center"
              >
                व्हाट्सएप चैट
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard(whatsappNumber, 'whatsapp')}
                className="p-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-neutral-300 hover:text-white border border-white/10 transition-colors"
                title="व्हाट्सएप नंबर कॉपी करें"
                aria-label="Copy WhatsApp number"
              >
                {copiedField === 'whatsapp' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* 3. Email Card */}
          <div className="group relative p-6 rounded-3xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/15 hover:border-[#c8ff00]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(200,255,0,0.2)] flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#c8ff00]/10 border border-[#c8ff00]/30 text-[#c8ff00] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>

            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
              ईमेल / Email
            </span>

            <a
              href={`mailto:${emailAddress}`}
              className="font-mono text-xs sm:text-sm font-bold text-white hover:text-[#c8ff00] transition-colors mb-4 break-all flex items-center gap-1"
            >
              <span>{emailAddress}</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>

            <div className="mt-auto flex items-center gap-2 w-full">
              <a
                href={`mailto:${emailAddress}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#c8ff00] hover:bg-[#d8ff33] text-black text-xs font-bold transition-all text-center"
              >
                ईमेल भेजें
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard(emailAddress, 'email')}
                className="p-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-neutral-300 hover:text-white border border-white/10 transition-colors"
                title="ईमेल पता कॉपी करें"
                aria-label="Copy email address"
              >
                {copiedField === 'email' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
