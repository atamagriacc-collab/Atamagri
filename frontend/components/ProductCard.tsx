import React from 'react';
import Link from 'next/link';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
      <div className="relative mb-4">
        <span className="absolute -top-4 -left-4 w-16 h-16 bg-primary-500 rounded-full opacity-20 -z-10" />
        <img src={product.images[0]} alt={product.title} className="h-24 w-24 object-contain rounded-full shadow-lg" />
      </div>
      <h4 className="font-semibold text-lg text-primary-900 mb-1">{product.title}</h4>
      <p className="text-primary-700 text-sm mb-2">{product.short}</p>
      <ul className="text-primary-700 text-xs mb-2 list-disc list-inside">
        {product.features.slice(0, 3).map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <Link
        href={`/products/${product.slug}`}
        className="mt-4 w-full bg-green-600 text-white rounded-full py-2 font-semibold hover:bg-green-700 transition text-center block"
      >
        Pelajari Lebih Lanjut
      </Link>
    </div>
  );
}
