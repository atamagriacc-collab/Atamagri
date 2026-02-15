import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';

const packages = [
  {
    title: 'Paket Uji Coba',
    price: 'Gratis',
    features: [
      'Akses Atama Sense (dashboard)',
      'Monitoring data dasar',
      'Uji coba fitur AI terbatas',
      'Durasi 14 hari',
    ],
    accent: 'yellow',
    image: '/images/starter-package.png',
  },
  {
    title: 'Paket Bundling',
    price: 'Rp 3.500.000',
    features: [
      'Atama Sense + Atama Climate + Atama Vis',
      'Full dashboard access',
      'AI-powered recommendations',
      'Priority support',
    ],
    accent: 'green',
    best: true,
    image: '/images/pro-package.png',
  },
  {
    title: 'Paket Kingdom',
    price: 'Rp 5.500.000',
    features: [
      'Semua fitur Bundling',
      'Atama Custom modules',
      'Dedicated account manager',
      'Enterprise support 24/7',
    ],
    accent: 'green',
    image: '/images/pro-package.png',
  },
];

export default function CheckoutPackage() {
  const router = useRouter();
  const { title } = router.query;
  const kebab = (str) => str.toLowerCase().replace(/\s+/g, '-');
  const pkg = packages.find((p) => kebab(p.title) === String(title));
  const [form, setForm] = useState({ name: '', email: '', address: '', payment: '' });

  if (!pkg) {
    return (
      <>
        <Header />
        <main className="bg-beige min-h-screen flex flex-col items-center justify-center">
          <p className="text-xl text-primary-900">Package not found.</p>
          <Link href="/products" className="mt-6 text-primary-700 underline">Back to Products</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - {pkg.title}</title>
      </Head>
      <Header />
      <main className="bg-beige min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8">
          <Link href="/products" className="text-primary-700 text-sm mb-4 inline-block hover:underline">&larr; Back to Products</Link>
          <h1 className="font-serif text-2xl font-bold text-primary-900 mb-4 text-center">Checkout: {pkg.title}</h1>
          <div className="flex justify-center mb-4">
            <img src={pkg.image} alt={pkg.title} className="w-32 h-32 object-contain rounded-xl mx-auto block" />
          </div>
          <div className="mb-4 text-primary-700 text-center">{pkg.features.join(', ')}</div>
          <div className="mb-4 text-primary-900 font-bold text-xl text-center">{pkg.price}</div>
          <form className="space-y-4">
            <input type="text" placeholder="Name" className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input type="email" placeholder="Email" className="w-full border rounded px-3 py-2" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input type="text" placeholder="Address" className="w-full border rounded px-3 py-2" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            <select className="w-full border rounded px-3 py-2" value={form.payment} onChange={e => setForm(f => ({ ...f, payment: e.target.value }))}>
              <option value="">Select Payment Method</option>
              <option value="bank">Bank Transfer</option>
              <option value="cod">Cash on Delivery</option>
              <option value="ewallet">E-Wallet</option>
            </select>
            <button type="submit" className="w-full bg-green-600 text-white rounded-full py-2 font-semibold hover:bg-green-700 transition">Checkout</button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
