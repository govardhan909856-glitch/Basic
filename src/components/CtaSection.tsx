export default function CtaSection() {
  return (
    <section
      id="contact"
      className="relative min-h-[40vh] flex items-center justify-center text-center py-20 sm:py-28 px-5 sm:px-8 z-10 overflow-hidden"
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
            HELP
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-4 max-w-xl text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
          कंप्यूटर बेसिक्स या किसी भी सवाल व सहायता के लिए नीचे फ़ूटर में दिए गए व्हाट्सएप, फोन या ईमेल माध्यम से संपर्क कर सकते हैं।
        </p>
      </div>
    </section>
  );
}
