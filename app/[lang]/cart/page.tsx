'use client';

import { useCartStore } from '@/app/store/userCartStore';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CartPage() {
  const { lang } = useParams();
  const { items, removeItem, clearCart } = useCartStore();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href={`/${lang}`} className="text-primary hover:underline">
          Go back to shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 italic uppercase tracking-tighter">Your Shopping Bag</h1>
      
      <div className="grid lg:grid-cols-3 gap-12">
        {/* List of items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="font-bold text-lg">{item.brand} {item.model}</h2>
                <p className="text-sm opacity-60">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-red-500 hover:underline mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className="bg-background border-2 border-primary p-6 rounded-xl h-fit shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-6 font-bold text-xl border-t border-gray-200 pt-4">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
          
          <Link 
            href={`/${lang}/checkout`}
            className="block text-center w-full bg-action text-white py-4 rounded-lg font-bold hover:brightness-110 transition shadow-lg shadow-action/25"
          >
            PROCEED TO CHECKOUT
          </Link>
          
          <button 
            onClick={() => clearCart()}
            className="block w-full text-center text-xs mt-4 opacity-50 hover:opacity-100"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}