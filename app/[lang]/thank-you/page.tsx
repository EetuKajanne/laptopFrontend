'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ThankYouPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
    <div className="container mx-auto p-20 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-black mb-4 italic uppercase">Order Confirmed!</h1>
        <p className="text-lg opacity-80 mb-8">
        Thank you for your purchase. Your order ID is <span className="font-bold text-primary">#{orderId}</span>.
        </p>
        <Link href="/" className="bg-secondary px-8 py-3 rounded font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition">
        Back to Home
        </Link>
    </div>
    );
}