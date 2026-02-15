import React from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import ProductHero from '../../components/ProductHero';
import { products } from '../../data/products';
import Link from 'next/link';

const pricingTiers = [
  { name: 'Paket Uji Coba', price: 'Gratis', highlight: false },
  { name: 'Bundling', price: 'Rp 3.500.000', highlight: true },
  { name: 'Kingdom', price: 'Rp 5.500.000', highlight: false },
];

const productLinks = [
  { name: 'Atama Sense', href: '/products/atama-sense', image: '/images/product-laptop.png', description: 'Farm Dashboard & Real-time Analytics' },
  { name: 'Atama Climate', href: '/products/atama-climate', image: '/images/product-sensor.png', description: 'Weather Station & IoT Sensors' },
  { name: 'Atama Vis', href: '/products/atama-vis', image: '/images/product-drone.png', description: 'Drone Monitoring & Disease Detection' },
  { name: 'Atama Academy', href: '/products/atama-academy', image: '/images/farm1.png', description: 'Agricultural Education & Training' },
  { name: 'Atama Custom', href: '/products/atama-custom', image: '/images/farm2.png', description: 'Custom IoT & AI Solutions' },
];

export default function Products() {
  return (
    <>
      <Head>
        <title>Our Products - ATAMAGRI</title>
        <meta name="description" content="Explore ATAMAGRI's innovative agricultural technology products including Atama Sense, Atama Climate, Atama Vis, and more." />
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        {/* Hero Section */}
        <ProductHero 
          title="Our Products" 
          backgroundImage="/images/products-bg.png" 
          subtitle="Digital & IoT Solutions for Modern Agriculture" 
          subtitleClassName="text-white" 
        />

        {/* Product Categories Navigation */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-primary-900 text-center mb-4">Explore Our Solutions</h2>
          <p className="text-center text-primary-700 mb-10 max-w-2xl mx-auto">
            Choose from our comprehensive range of agricultural technology solutions designed to transform your farming operations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productLinks.map((product) => (
              <Link 
                key={product.name}
                href={product.href}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 bg-gradient-to-br from-primary-500/20 to-primary-900/20 flex items-center justify-center p-6">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="h-full w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-primary-700/80">{product.description}</p>
                  <div className="mt-4 flex items-center text-primary-500 font-medium">
                    Learn More 
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Individual Products */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-primary-900 text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Sensor Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-primary-900 text-center mb-8">Sensor Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                name: 'Sensor Curah Hujan',
                image: '/images/sensor_curah_hujan-removebg-preview.png',
                link: 'https://www.tokopedia.com/evoteknologi/evoteknologi-sensor-curah-hujan-ombrometer-tipping-bucket-rain-gauge-kotak-1731404751579350692/review',
              },
              {
                name: 'Sensor Kecepatan Angin',
                image: null,
                link: 'https://www.tokopedia.com/evoteknologi/evoteknologi-sensor-kecepatan-angin-anemometer-wind-speed-support-arduino-1731404691734431396?extParam=ivf%3Dfalse%26keyword%3Dsensor+anemometer%26search_id%3D2025070811370311B9842E0A271F123K4W%26src%3Dsearch',
              },
              {
                name: 'Sensor Suhu dan Kelembapan',
                image: '/images/sensor_suhu_dan_kelembapan-removebg-preview.png',
                link: null,
              },
              {
                name: 'Sensor Lain 1',
                image: null,
                link: null,
              },
              {
                name: 'Sensor Lain 2',
                image: null,
                link: null,
              },
            ].map((sensor, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 min-h-[260px] justify-between"
              >
                <div className="flex-1 flex flex-col items-center justify-center">
                  {sensor.image ? (
                    <img
                      src={sensor.image}
                      alt={sensor.name}
                      className="h-20 mb-2 object-contain"
                    />
                  ) : (
                    <div className="h-20 w-full flex items-center justify-center bg-gray-100 text-gray-400 mb-2 rounded">
                      No Image
                    </div>
                  )}
                  <div className="font-semibold text-center mb-4">{sensor.name}</div>
                </div>
                {sensor.link ? (
                  <a
                    href={sensor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 px-3 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition text-sm font-medium"
                  >
                    Beli di Tokopedia
                  </a>
                ) : (
                  <button
                    className="mt-2 px-3 py-2 bg-gray-300 text-gray-500 rounded shadow text-sm font-medium cursor-not-allowed"
                    disabled
                  >
                    Beli di Tokopedia
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-primary-900 mb-3">Paket Harga</h2>
            <p className="text-primary-700 max-w-xl mx-auto">Pilih paket yang sesuai dengan kebutuhan Anda.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  tier.highlight
                    ? 'bg-gradient-to-br from-primary-900 to-primary-700 text-white shadow-xl ring-2 ring-primary-500'
                    : 'bg-white shadow-lg'
                }`}
              >
                <h3 className={`text-lg font-bold mb-3 ${tier.highlight ? 'text-white' : 'text-primary-900'}`}>
                  {tier.name}
                </h3>
                <p className={`text-3xl md:text-4xl font-extrabold ${tier.highlight ? 'text-accent-yellow' : 'text-primary-900'}`}>
                  {tier.price}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/pricing"
              className="inline-block bg-primary-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg"
            >
              Lihat Detail Harga
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
