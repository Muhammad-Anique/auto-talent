'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TRANSLATION_LANGUAGES, type TranslationLanguage } from '@/lib/translation-config';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageSelect: (language: TranslationLanguage) => void;
  disabled?: boolean;
}

export function LanguageSelector({
  currentLanguage,
  onLanguageSelect,
  disabled = false
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = TRANSLATION_LANGUAGES[currentLanguage as TranslationLanguage] || TRANSLATION_LANGUAGES.en;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center gap-2 px-4 py-2 h-10",
          "bg-white border-2 border-zinc-200 rounded-md",
          "text-xs font-medium text-zinc-700",
          "hover:border-[#5b6949] hover:bg-[#5b6949]/5 transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <Globe className="w-4 h-4" />
        <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform ml-auto",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border-2 border-zinc-200 rounded-md shadow-lg py-1 z-50">
          {Object.entries(TRANSLATION_LANGUAGES).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => {
                onLanguageSelect(code as TranslationLanguage);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-left text-xs hover:bg-[#5b6949]/5 transition-colors",
                "flex items-center gap-2 text-zinc-800",
                currentLanguage === code && "bg-[#5b6949]/10 text-[#5b6949] font-medium"
              )}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
