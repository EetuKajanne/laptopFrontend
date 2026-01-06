'use client';

import { useCartStore } from '../app/store/userCartStore';

export default function AddToCartButton({ laptop }: { laptop: any }) {
    const addItem = useCartStore((state) => state.addItem);

    return (
    <button 
        onClick={() => {
        addItem({
            id: laptop.id,
            brand: laptop.brand,
            model: laptop.model,
            price: laptop.price,
            quantity: 1
        });
        alert('Added to cart!');
        }}
        className="mt-8 w-full bg-action text-white py-4 rounded-lg font-bold hover:brightness-110 transition shadow-lg shadow-action/25"
    >
        Add to Cart
    </button>
    );
}