import 'server-only';

// Define valid locales
const dictionaries = {
    en: () => import('../dictionaries/en.json').then((module) => module.default),
    fi: () => import('../dictionaries/fi.json').then((module) => module.default),
};
export const getDictionary = async (locale: 'en' | 'fi') => {
    if (!dictionaries[locale]) {
    return dictionaries['en'](); 
    }
    return dictionaries[locale]();
};