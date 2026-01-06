'use client';

import { useCartStore } from '@/app/store/userCartStore';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { lang } = useParams();
    const router = useRouter();
    const { items, clearCart } = useCartStore();

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare the data for the .NET API
    const orderData = {
        customerName: name,
        customerEmail: email,
        totalAmount: total,
        orderItems: items.map(item => ({
        laptopId: item.id,
        quantity: item.quantity,
        priceAtPurchase: item.price
        }))
    };

    try {
        const response = await fetch('https://localhost:7296/api/Orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
        });

        if (response.ok) {
        const result = await response.json();
        clearCart();
        alert(`Order successful! Order ID: ${result.id}`);
        router.push(`/${lang}/thank-you?orderId=${result.id}`);
        } else {
        alert('Something went wrong with the order.');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Could not connect to the server.');
    } finally {
        setIsSubmitting(false);
    }
    };

    return (
    <div className="container mx-auto p-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 italic uppercase tracking-tighter">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-secondary p-8 rounded-xl border border-gray-200 dark:border-gray-800">
        <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Full Name</label>
            <input 
            required
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-background p-3 rounded border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
            placeholder="John Doe"
            />
        </div>

        <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Email Address</label>
            <input 
            required
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background p-3 rounded border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
            placeholder="student@example.com"
            />
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 pt-6">
            <div className="flex justify-between text-xl font-black mb-6">
            <span>Total to Pay:</span>
            <span className="text-primary">${total.toFixed(2)}</span>
            </div>
            
            <button 
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="w-full bg-action text-white py-4 rounded font-bold hover:brightness-110 transition disabled:opacity-50"
            >
            {isSubmitting ? 'Processing...' : 'CONFIRM ORDER'}
            </button>
        </div>
        </form>
    </div>
    );
}