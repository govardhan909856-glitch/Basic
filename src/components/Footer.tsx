import { Phone, Mail, MessageCircle, ArrowUp, Sparkles } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 bg-[#070707] border-t border-white/[0.08] py-12 px-5 sm:px-8 text-neutral-400">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Brand Logo & Tagline */}
        <a
          href="#"
          className="font-display text-2xl font-extrabold tracking-[0.16em] text-white flex items-center gap-1 group"
        >
          <span>BASICS</span>
          <span className="text-[#c8ff00] drop-shadow-[0_0_8px_#c8ff00] group-hover:scale-125 transition-transform">
            .
          </span>
        </a>
        <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-medium tracking-wide">
          Learn Computer Basics the Easy Way.
        </p>

        {/* Dedicated Social/Contact Icons: ONLY WhatsApp, Phone, and Email */}
        <div className="mt-8 flex items-center justify-center gap-4">
          {/* WhatsApp Icon */}
          <a
            href="https://wa.me/919098564648?text=Hello%20Basics%20Team"
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-full bg-white/[0.04] hover:bg-emerald-500/20 text-emerald-400 border border-white/10 hover:border-emerald-500/40 flex items-center justify-center transition-all duration-300 shadow-lg floating-option interactive-option"
            aria-label="WhatsApp"
            title="Chat on WhatsApp: +91 9098564648"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          {/* Phone Icon */}
          <a
            href="tel:+919098564648"
            className="w-12 h-12 rounded-full bg-white/[0.04] hover:bg-[#c8ff00]/20 text-[#c8ff00] border border-white/10 hover:border-[#c8ff00]/40 flex items-center justify-center transition-all duration-300 shadow-lg floating-option interactive-option"
            aria-label="Phone"
            title="Call: +91 9098564648"
          >
            <Phone className="w-5 h-5" />
          </a>

          {/* Email Icon */}
          <a
            href="mailto:govardhan909856@gmail.com?cc=govardhan808516@gmail.com"
            className="w-12 h-12 rounded-full bg-white/[0.04] hover:bg-[#c8ff00]/20 text-[#c8ff00] border border-white/10 hover:border-[#c8ff00]/40 flex items-center justify-center transition-all duration-300 shadow-lg floating-option interactive-option"
            aria-label="Email"
            title="Email: govardhan909856@gmail.com"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Contact info labels */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-400">
          <span>Phone: +91 9098564648</span>
          <span className="text-neutral-600 hidden sm:inline">&bull;</span>
          <span>Email: govardhan909856@gmail.com</span>
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="mt-8 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#c8ff00]/40 text-xs font-mono text-neutral-400 hover:text-[#c8ff00] transition-colors cursor-pointer group floating-option interactive-option"
          title="ऊपर जाएं / Scroll to top"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
        </button>

        {/* Copyright & Floating Creator Attribution */}
        <div className="mt-10 pt-7 border-t border-white/[0.08] w-full text-center flex flex-col items-center gap-4">
          {/* Continuous Floating Creator Badge */}
          <div className="floating-creator-name py-2 px-5 rounded-full bg-[#0d0d0d] border border-[#c8ff00]/50 shadow-[0_0_25px_rgba(200,255,0,0.25)] backdrop-blur-md flex items-center justify-center gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#c8ff00] animate-pulse" />
            <span className="text-xs sm:text-sm font-mono text-neutral-200 font-medium">
              This website created by{' '}
              <span className="text-[#c8ff00] font-bold tracking-wide underline decoration-[#c8ff00]/50 decoration-2 underline-offset-4">
                Govardhan Yadav
              </span>
            </span>
          </div>

          <p className="text-[11px] font-mono text-neutral-400 max-w-md leading-relaxed">
            बच्चों और बिगिनर्स को कंप्यूटर के बेसिक्स सिखाने के लिए विशेष रूप से निर्मित।
          </p>

          <p className="text-[11px] font-mono text-neutral-500">
            &copy; 2026 BASICS. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
