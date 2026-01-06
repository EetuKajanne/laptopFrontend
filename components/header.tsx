'use client';

import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useRouter, useSearchParams } from 'next/navigation';

interface HeaderProps {
    lang: 'en' | 'fi';
    dict: {
        searchPlaceholder: string;
        about: string;
        login: string;
        cart: string;
        categories: string;
        laptops: string;
        desktops: string;
        peripherals: string;
        shopNamePrimary: string;
        shopNameSecondary: string;
    };
}
export default function Header({ lang, dict }: HeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
        params.set('query', term);
        } else {
        params.delete('query');
        }
        // This updates the URL to: /fi?query=thinkpad
        router.push(`/${lang}?${params.toString()}`);
    };
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-background/95 backdrop-blur">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
            
            {/* 1. Logo */}
            <Link href={`/${lang}`} className="text-2xl font-extrabold tracking-tight">
                <span className="text-primary">{dict.shopNamePrimary}</span>
                <span className="text-foreground">{dict.shopNameSecondary}</span>
            </Link>

            {/* 2. Categories Dropdown & Search (Hidden on mobile, visible on desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8 gap-2">
                <select className="bg-secondary text-foreground text-sm rounded-l-lg px-4 py-2 border-r border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary">
                <option>{dict.categories}</option>
                <option>{dict.laptops}</option>
                <option>{dict.desktops}</option>
                <option>{dict.peripherals}</option>
                </select>
                
                <div className="relative flex-1">
                <input 
                    type="text" 
                    placeholder={dict.searchPlaceholder}
                    defaultValue={searchParams.get('query')?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-secondary text-foreground rounded-r-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    🔍
                </button>
                </div>
            </div>

            {/* 3. Right Side Actions */}
            <div className="flex items-center gap-6">
                <Link href="/about" className="hidden lg:block text-sm font-medium hover:text-primary transition">
                {dict.about}
                </Link>
                
                <Link href="/login" className="text-sm font-medium hover:text-primary transition">
                {dict.login}
                </Link>

                <Link href="/cart" className="relative group">
                <span className="text-2xl">🛒</span>
                {/* Badge example */}
                <span className="absolute -top-2 -right-2 bg-action text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    0
                </span>
                </Link>
            </div>
            <LanguageSwitcher currentLang={lang} />
            </div>
        </header>
    );
}