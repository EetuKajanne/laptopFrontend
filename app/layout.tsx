import { getDictionary } from './dictionaries';
import ChatWidget from '@/components/ChatWidget';
import '../globals.css'; 

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: 'en' | 'fi' };
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang); // Load the JSON file

  return (
    <html lang={lang}>
      <body>
        {children}
        
        {}
        <ChatWidget lang={lang} dict={dict.chat} />
      </body>
    </html>
  );
}