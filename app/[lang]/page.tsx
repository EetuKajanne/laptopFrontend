import Header from '@/components/header';
import Link from 'next/link';
import { getDictionary } from '../dictionaries';

interface Laptop {
  id: number;
  brand: string;
  model: string;
  price: number;
  description: string;
  stockQuantity: number;
  imageUrl: string;
  hasCharger: boolean;
  dateAdded: string;
}

// Function to fetch data from your running .NET API
async function getLaptops(): Promise<Laptop[]> {
  const res = await fetch('https://localhost:7296/api/Laptops', {
    // This setting ensures the data is fresh on every request (important for e-commerce)
    cache: 'no-store' 
  });
  
  if (!res.ok) {
    // This will activate the nearest Error Boundary in Next.js
    throw new Error('Failed to fetch laptop data from API');
  }

  return res.json();
}

// Next.js Server Component to display the data
export default async function Home({ params, searchParams }: { params: { lang: 'en' | 'fi' }, searchParams: { query?: string } }) {
  const { lang } = await params;
  const { query } = await searchParams;
  const dict = await getDictionary(lang); // Load English or Finnish words
  let laptops = await getLaptops();

  // Filter the laptops based on the search query
  if (query) {
    laptops = laptops.filter(l => 
      l.brand.toLowerCase().includes(query.toLowerCase()) || 
      l.model.toLowerCase().includes(query.toLowerCase())
    );
  }

  // feature the newest laptop first
  const featuredLaptop = laptops[0]; 

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header lang={lang} dict={dict.header} />
      
      <main>
        {/* HERO SECTION: Carousel Style */}
        <section className="relative w-full h-[500px] bg-secondary overflow-hidden">
          {featuredLaptop ? (
            <div className="container mx-auto h-full flex items-center px-4">
              <div className="w-full md:w-1/2 z-10">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary text-sm font-bold mb-4 border border-primary">
                  {dict.hero.justIn}
                </span>
                <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">
                  {featuredLaptop.brand} <span className="text-primary">{featuredLaptop.model}</span>
                </h2>
                <p className="text-xl mb-8 max-w-lg opacity-90">
                  {dict.hero.featuredDescription} 
                  <span className="block mt-2 text-sm opacity-75">{featuredLaptop.price}€</span>
                </p>
                <Link 
                  href={`/${lang}/laptops/${featuredLaptop.id}`}
                  className="bg-action text-white px-8 py-3 rounded-lg font-bold hover:brightness-110 transition shadow-lg shadow-action/25"
                >
                  {dict.hero.shopNow}
                </Link>
              </div>
              
              {}
              <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent blur-3xl" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">{dict.hero.noStock}</div>
          )}
        </section>

        {/* CATEGORIES ROW */}
        <section className="container mx-auto px-4 mt-10 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[dict.hero.laptops, dict.hero.gamingPCs, dict.hero.peripherals].map((cat) => (
              <div key={cat} className="bg-background border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-xl hover:-translate-y-1 transition duration-300 flex items-center justify-between cursor-pointer group">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition">{cat}</h3>
                  <p className="text-sm text-gray-500">{dict.hero.categories} &rarr;</p>
                </div>
                <div className="text-4xl opacity-50 grayscale group-hover:grayscale-0 transition">
                  {cat === dict.hero.laptops && '💻'}
                  {cat === dict.hero.gamingPCs && '🖥️'}
                  {cat === dict.hero.peripherals && '🖱️'}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LATEST ARRIVALS GRID */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            {dict.hero.justIn}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {laptops.map((laptop) => (
              <Link href={`/laptops/${laptop.id}`} key={laptop.id} className="group">
                <div className="bg-background border border-gray-100 dark:border-gray-800 p-6 rounded-xl shadow-sm hover:shadow-2xl hover:border-primary/30 transition duration-300">
                  <div className="h-48 bg-secondary rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">💻</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition">
                    {laptop.brand} {laptop.model}
                  </h3>
                  <div className="flex justify-between items-end mt-4">
                    <p className="text-2xl font-extrabold text-foreground">
                      ${laptop.price.toFixed(0)}<span className="text-sm align-top">.99</span>
                    </p>
                    <span className="text-action font-semibold text-sm">{dict.hero.view} &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}