import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

/* ─────────── Main Pricing Tiers ─────────── */
const tiers = [
  {
    name: 'Paket Uji Coba',
    price: 'Gratis',
    priceNote: null,
    badge: null,
    description: 'Coba platform kami tanpa biaya. Cocok untuk mengenal fitur-fitur dasar Atamagri.',
    features: [
      'Akses dashboard Atama Sense (terbatas)',
      'Data monitoring dasar',
      'Dukungan komunitas',
      'Berlaku 14 hari',
    ],
    cta: 'Mulai Gratis',
    href: '/contact',
    highlight: false,
  },
  {
    name: 'Bundling',
    price: 'Rp 3.500.000',
    priceNote: null,
    badge: 'Popular',
    description: 'Paket lengkap untuk memulai smart farming dengan harga terjangkau.',
    features: [
      'Atama Climate (Weather Station)',
      'Atama Sense (Dashboard & Analytics)',
      'Atama Vis (Drone Monitoring)',
      'Full platform access',
      'Dukungan prioritas',
    ],
    note: 'Bisa di-custom atau downgrade dengan harga yang lebih murah sesuai kebutuhan customer.',
    cta: 'Pilih Bundling',
    href: '/contact',
    highlight: true,
  },
  {
    name: 'Kingdom',
    price: 'Rp 5.500.000',
    priceNote: null,
    badge: 'Best Value',
    description: 'Solusi premium lengkap untuk pertanian skala besar dan enterprise.',
    features: [
      'Semua fitur paket Bundling',
      'Kapasitas sensor diperluas',
      'AI-powered recommendations',
      'Laporan dan analitik lanjutan',
      'Dedicated account manager',
      'SLA & dukungan 24/7',
    ],
    cta: 'Pilih Kingdom',
    href: '/contact',
    highlight: false,
  },
];

/* ─────────── Atama Custom Modules ─────────── */
const customModules = [
  {
    name: 'Smart Irrigation Farming',
    price: 'Rp 5.155.000',
    description: 'Sistem irigasi cerdas berbasis IoT yang mengoptimalkan penggunaan air secara otomatis.',
  },
  {
    name: 'Monitoring IoT',
    price: 'Rp 360.000',
    description: 'Pantau kondisi lahan secara real-time dengan perangkat IoT presisi tinggi.',
  },
  {
    name: 'Monitoring IoT + Rekomendasi Keputusan AI',
    price: 'Rp 530.000',
    description: 'Monitoring IoT dilengkapi rekomendasi cerdas berbasis kecerdasan buatan.',
  },
];

export default function Pricing() {
  return (
    <>
      <Head>
        <title>Pricing - ATAMAGRI</title>
        <meta name="description" content="Pilih paket Atamagri yang sesuai kebutuhan pertanian Anda. Mulai dari paket gratis hingga enterprise." />
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">

        {/* ═══════ Hero ═══════ */}
        <section className="relative bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-20 md:py-28 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent-yellow/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <span className="inline-block bg-accent-yellow text-primary-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
              Transparent Pricing
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Pilih Paket yang <span className="text-accent-yellow">Tepat</span> untuk Anda
            </h1>
            <p className="text-xl text-neutral-200 leading-relaxed max-w-2xl mx-auto">
              Dari uji coba gratis hingga solusi enterprise, kami punya paket untuk setiap skala pertanian.
            </p>
          </div>
        </section>

        {/* ═══════ Main Tier Cards ═══════ */}
        <section className="relative -mt-16 z-10 max-w-7xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  tier.highlight
                    ? 'bg-white ring-2 ring-primary-500 shadow-2xl scale-[1.03] md:scale-105'
                    : 'bg-white shadow-xl'
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute top-0 right-0">
                    <div className={`px-4 py-1.5 text-xs font-bold rounded-bl-xl ${
                      tier.highlight
                        ? 'bg-primary-900 text-white'
                        : 'bg-accent-yellow text-primary-900'
                    }`}>
                      {tier.badge}
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className={`p-8 pb-6 ${tier.highlight ? 'bg-gradient-to-br from-primary-900 to-primary-700 text-white' : ''}`}>
                  <h3 className={`text-xl font-bold mb-2 ${tier.highlight ? 'text-white' : 'text-primary-900'}`}>
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className={`text-4xl md:text-5xl font-extrabold tracking-tight ${tier.highlight ? 'text-accent-yellow' : 'text-primary-900'}`}>
                      {tier.price}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${tier.highlight ? 'text-neutral-200' : 'text-primary-700/80'}`}>
                    {tier.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex-1 p-8 pt-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-primary-700">
                        <svg className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Customization note for Bundling */}
                  {tier.note && (
                    <div className="mt-5 bg-accent-yellow/15 border border-accent-yellow/30 rounded-xl px-4 py-3">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-primary-700 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-primary-700 leading-relaxed">{tier.note}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="p-8 pt-0">
                  <Link
                    href={tier.href}
                    className={`block w-full text-center py-4 rounded-xl font-bold text-lg transition-all ${
                      tier.highlight
                        ? 'bg-gradient-to-r from-primary-900 to-primary-700 text-white hover:from-primary-700 hover:to-primary-900 shadow-lg hover:shadow-xl'
                        : 'bg-beige text-primary-900 hover:bg-primary-900 hover:text-white border border-primary-900/10'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ Atama Custom Section ═══════ */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="inline-block bg-primary-900/10 text-primary-900 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Solusi Tambahan
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">Atama Custom</h2>
              <p className="text-primary-700 max-w-2xl mx-auto text-lg">
                Modul khusus yang bisa ditambahkan sesuai kebutuhan spesifik lahan Anda.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {customModules.map((mod, idx) => (
                <div
                  key={idx}
                  className="group bg-beige border border-primary-900/5 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-primary-500 to-accent-yellow rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-lg font-bold text-primary-900 mb-2">{mod.name}</h3>
                  <p className="text-primary-700/80 text-sm leading-relaxed mb-5 flex-1">{mod.description}</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-primary-900">{mod.price}</span>
                    <Link
                      href="/contact"
                      className="text-sm font-semibold text-primary-500 hover:text-primary-700 transition-colors"
                    >
                      Hubungi Kami &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ Atama Academy Section ═══════ */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative bg-gradient-to-br from-primary-900 to-primary-700 rounded-3xl p-10 md:p-14 overflow-hidden">
              {/* Decorative */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent-yellow/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary-500/20 rounded-full blur-2xl" />

              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left — Info */}
                <div>
                  <span className="inline-block bg-accent-yellow text-primary-900 px-4 py-1.5 rounded-full text-sm font-bold mb-5">
                    Atama Academy
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Pelatihan Smart Farming
                  </h2>
                  <p className="text-neutral-200 leading-relaxed mb-6">
                    Program edukasi intensif untuk petani modern. Pelajari IoT, AI, dan teknologi drone untuk pertanian dari para ahli berpengalaman.
                  </p>
                  <Link
                    href="/products/atama-academy"
                    className="inline-block bg-accent-yellow text-primary-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-colors"
                  >
                    Pelajari Selengkapnya
                  </Link>
                </div>

                {/* Right — Pricing Details */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="mb-6">
                    <p className="text-sm text-neutral-300 mb-1">Mulai dari</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-accent-yellow">Rp 55.000</span>
                      <span className="text-neutral-300 text-sm">/ orang</span>
                    </div>
                    <p className="text-neutral-300 text-sm mt-1">Per Batch</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Durasi 15 hari</p>
                        <p className="text-neutral-300 text-xs">Program intensif terstruktur</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Total 8 jam per hari</p>
                        <p className="text-neutral-300 text-xs">Pembelajaran komprehensif</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Sertifikasi</p>
                        <p className="text-neutral-300 text-xs">Sertifikat resmi setelah menyelesaikan program</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ CTA ═══════ */}
        <section className="bg-white py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Butuh Bantuan Memilih?
            </h2>
            <p className="text-primary-700 text-lg mb-8 leading-relaxed">
              Tim kami siap membantu Anda menemukan paket yang paling sesuai dengan kebutuhan dan skala pertanian Anda.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-gradient-to-r from-primary-900 to-primary-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-primary-700 hover:to-primary-900 transition-all shadow-lg hover:shadow-xl"
              >
                Hubungi Tim Kami
              </Link>
              <Link
                href="/products"
                className="inline-block border-2 border-primary-900 text-primary-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-900 hover:text-white transition-colors"
              >
                Lihat Semua Produk
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
