'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher({ currentLang }: { currentLang: 'en' | 'fi' }) {
    const pathname = usePathname();
    const router = useRouter();

    const switchLanguage = (newLang: string) => {
    if (!pathname) return;

    // Splits the URL: "/en/laptops" becomes ["", "en", "laptops"]
    const segments = pathname.split('/');

    // Replace the language segment (index 1)
    segments[1] = newLang;

    const newPath = segments.join('/');
    router.push(newPath);
    };

    return (
    <div className="flex items-center gap-2 text-xs font-bold tracking-tighter">
        <button 
        onClick={() => switchLanguage('fi')}
        className={`w-8 h-8 rounded-full border transition-all ${
            currentLang === 'fi' 
            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
            : 'bg-secondary text-foreground border-gray-200 dark:border-gray-800 hover:border-primary'
        }`}
        >
        FI
        </button>
        <button 
        onClick={() => switchLanguage('en')}
        className={`w-8 h-8 rounded-full border transition-all ${
            currentLang === 'en' 
            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
            : 'bg-secondary text-foreground border-gray-200 dark:border-gray-800 hover:border-primary'
        }`}
        >
        EN
        </button>
    </div>
    );
}