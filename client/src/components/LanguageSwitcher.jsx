import { LANGUAGES, useI18n } from '../context/I18nContext';

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage } = useI18n();

  return (
    <label className="inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className={`rounded-lg border border-white/30 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/70 ${compact ? 'px-2 py-1' : 'px-3 py-2'}`}
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code} className="text-gray-900">
            {compact ? item.short : item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
