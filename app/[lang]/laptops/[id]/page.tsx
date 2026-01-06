import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

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

async function getLaptop(id: string): Promise<Laptop | null> {
  const res = await fetch(`https://localhost:7296/api/Laptops/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function LaptopPage({ params }: { params: { id: string } }) {
  // Await the params object to access properties in Next.js 15+
  const { id } = await params;
  const laptop = await getLaptop(id);

  if (!laptop) {
    notFound(); // Shows the Next.js 404 page
  }

  return (
    <div className="container mx-auto p-8">
      {/* Back Button */}
      <Link href="/" className="text-indigo-600 hover:underline mb-4 inline-block">
        &larr; Back to Inventory
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
        {/* Left Column: Image Placeholder */}
        <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
             {/* If we had a real image, we'd use <img src={laptop.imageUrl} /> */}
             <span className="text-gray-500 text-lg">Image for {laptop.brand}</span>
        </div>

        {/* Right Column: Details */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{laptop.brand} {laptop.model}</h1>
          <p className="text-2xl text-indigo-600 font-bold mt-4">${laptop.price.toFixed(2)}</p>
          
          <div className="mt-6 space-y-4">
            <p className="text-gray-700 leading-relaxed">
              {laptop.description || "No description available for this unit."}
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <span className="font-semibold text-gray-700">Stock Status: </span>
              <span className={laptop.stockQuantity > 0 ? "text-green-600" : "text-red-600"}>
                  {laptop.stockQuantity > 0 ? `${laptop.stockQuantity} available` : "Out of Stock"}
              </span>
            </div>
          </div>

          <AddToCartButton laptop={laptop} />
        </div>
      </div>
    </div>
  );
}