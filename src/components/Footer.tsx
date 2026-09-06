import { Phone, Mail, MessageCircle, ArrowUp, Sparkles } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 bg-background border-t border-border py-12 px-5 sm:px-8 text-muted-foreground">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Brand Logo & Tagline */}
        <a
          href="#"
          className="font-sans text-2xl font-extrabold tracking-[0.16em] text-foreground flex items-center gap-1 group"
        >
          <span>BASICS</span>
          <span className="text-primary group-hover:scale-125 transition-transform">
            .
          </span>
        </a>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium tracking-wide">
          Learn Computer Basics the Easy Way.
        </p>

        {/* Dedicated Social/Contact Icons: ONLY WhatsApp, Phone, and Email */}
        <div className="mt-8 flex items-center justify-center gap-4">
          {/* WhatsApp Icon */}
          <a
            href="https://wa.me/919098564648?text=Hello%20Basics%20Team"
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-full bg-muted hover:bg-emerald-500/20 text-emerald-500 border border-border hover:border-emerald-500/40 flex items-center justify-center transition-all duration-300 shadow-sm floating-option interactive-option"
            aria-label="WhatsApp"
            title="Chat on WhatsApp: +91 9098564648"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          {/* Phone Icon */}
          <a
            href="tel:+919098564648"
            className="w-12 h-12 rounded-full bg-muted hover:bg-primary/20 text-foreground hover:text-primary border border-border hover:border-primary flex items-center justify-center transition-all duration-300 shadow-sm floating-option interactive-option"
            aria-label="Phone"
            title="Call: +91 9098564648"
          >
            <Phone className="w-5 h-5" />
          </a>

          {/* Email Icon */}
          <a
            href="mailto:govardhan909856@gmail.com?cc=govardhan808516@gmail.com"
            className="w-12 h-12 rounded-full bg-muted hover:bg-primary/20 text-foreground hover:text-primary border border-border hover:border-primary flex items-center justify-center transition-all duration-300 shadow-sm floating-option interactive-option"
            aria-label="Email"
            title="Email: govardhan909856@gmail.com"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Contact info labels */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-muted-foreground">
          <span>Phone: +91 9098564648</span>
          <span className="hidden sm:inline">&bull;</span>
          <span>Email: govardhan909856@gmail.com</span>
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="mt-8 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted border border-border hover:border-primary text-xs font-mono text-muted-foreground hover:text-primary transition-colors cursor-pointer group floating-option interactive-option"
          title="ऊपर जाएं / Scroll to top"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
        </button>

        {/* Copyright */}
        <div className="mt-10 pt-7 border-t border-border w-full text-center flex flex-col items-center gap-3">
          <p className="text-[11px] font-mono text-muted-foreground max-w-md leading-relaxed">
            बच्चों और बिगिनर्स को कंप्यूटर के बेसिक्स सिखाने के लिए विशेष रूप से निर्मित।
          </p>

          <p className="text-[11px] font-mono text-muted-foreground/70">
            &copy; 2026 BASICS. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
