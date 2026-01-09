import { useLanguage } from "../context/LanguageContext";

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const isEnglish = language === "en";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEnglish}
      aria-label="Basculer la langue"
      onClick={toggleLanguage}
      className="group inline-flex items-center gap-2 rounded-full border border-[#dccfb9] bg-white/90 px-2 py-1 shadow-[0_8px_24px_rgba(52,34,18,0.12)] transition-transform duration-300 hover:-translate-y-0.5"
    >
      <span
        className={`text-[9px] font-semibold uppercase tracking-[0.2em] ${
          isEnglish ? "text-[#8c8170]" : "text-[#0f0f0f]"
        }`}
      >
        FR
      </span>
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full border border-[#d5c5ad] transition-colors duration-300 ${
          isEnglish ? "bg-[#0f0f0f]" : "bg-white"
        }`}
        aria-hidden="true"
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.18)] transition-transform duration-300 ${
            isEnglish ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
      <span
        className={`text-[9px] font-semibold uppercase tracking-[0.2em] ${
          isEnglish ? "text-[#0f0f0f]" : "text-[#8c8170]"
        }`}
      >
        EN
      </span>
    </button>
  );
}

export default LanguageToggle;
