// Define the TypeScript interface for a Laptop
interface Laptop {
  id: number;
  brand: string;
  model: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
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
export default async function Home() {
  const laptops = await getLaptops();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Refurbished Laptop Inventory</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {laptops.map((laptop) => (
          <div key={laptop.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-2xl font-semibold mb-2">{laptop.brand} {laptop.model}</h2>
            <p className="text-gray-600 mb-4">{laptop.stockQuantity} in stock</p>
            <p className="text-3xl font-extrabold text-indigo-600">${laptop.price.toFixed(2)}</p>
            <button className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-150">
              View Details
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}