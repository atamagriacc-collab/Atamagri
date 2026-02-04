import React from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductHero from '../../components/ProductHero';
import Link from 'next/link';

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: 'Weather Monitoring',
    description: 'Track temperature, humidity, rainfall, wind speed, and atmospheric pressure in real-time.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Long Battery Life',
    description: 'Solar-powered with backup battery ensures continuous operation in all conditions.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    title: 'Wireless Connectivity',
    description: 'LoRa and WiFi connectivity for seamless data transmission to your dashboard.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: 'Easy Installation',
    description: 'Quick setup with mounting hardware included. No technical expertise required.',
  },
];

const sensors = [
  { name: 'Temperature Sensor', range: '-40°C to 85°C', accuracy: '±0.3°C' },
  { name: 'Humidity Sensor', range: '0-100% RH', accuracy: '±2% RH' },
  { name: 'Rain Gauge', range: '0-999mm', accuracy: '±4%' },
  { name: 'Wind Speed Sensor', range: '0-60 m/s', accuracy: '±0.5 m/s' },
  { name: 'Barometric Pressure', range: '300-1100 hPa', accuracy: '±1 hPa' },
  { name: 'UV Index Sensor', range: '0-15 UV Index', accuracy: '±0.5' },
];

const specifications = [
  { label: 'Power', value: 'Solar + 18650 Li-ion Battery' },
  { label: 'Connectivity', value: 'LoRa, WiFi, ESP32' },
  { label: 'Data Interval', value: 'Configurable (1-60 min)' },
  { label: 'Operating Temp', value: '-20°C to 60°C' },
  { label: 'Enclosure', value: 'IP65 Weatherproof' },
  { label: 'Warranty', value: '2 Years' },
];

export default function AtamaClimate() {
  return (
    <>
      <Head>
        <title>Atama Climate - Weather Station | ATAMAGRI</title>
        <meta name="description" content="Professional IoT weather station for agriculture. Track weather conditions with precision sensors and wireless connectivity." />
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        {/* Hero Section */}
        <ProductHero 
          title="Atama Climate" 
          backgroundImage="/images/products-bg.png" 
          subtitle="Professional IoT Weather Station" 
          subtitleClassName="text-white" 
        />

        {/* Product Overview */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Weather Station
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                Precision Weather Monitoring
              </h2>
              <p className="text-primary-700 text-lg mb-6 leading-relaxed">
                Atama Climate is a professional-grade weather station designed specifically for agricultural applications. Monitor hyperlocal weather conditions with precision sensors that deliver accurate data to optimize your farming decisions.
              </p>
              <p className="text-primary-700 mb-8 leading-relaxed">
                Built to withstand harsh outdoor conditions, our weather station provides reliable 24/7 monitoring with minimal maintenance requirements.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/contact" 
                  className="inline-block bg-primary-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
                >
                  Request Quote
                </Link>
                <Link 
                  href="/iot-dashboard" 
                  className="inline-block border-2 border-primary-900 text-primary-900 px-6 py-3 rounded-full font-semibold hover:bg-primary-900 hover:text-white transition-colors"
                >
                  View IoT Dashboard
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500/20 to-accent-yellow/30 rounded-2xl p-8">
                <img 
                  src="/images/product-sensor.png" 
                  alt="Atama Climate Weather Station" 
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary-500 rounded-full p-4 shadow-lg">
                <span className="text-white font-bold text-xl">$365</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-primary-900 text-center mb-4">Key Features</h2>
            <p className="text-center text-primary-700 mb-12 max-w-2xl mx-auto">
              Professional-grade sensors with robust connectivity for reliable agricultural weather monitoring.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="text-center p-6 rounded-xl hover:bg-neutral-200 transition-colors">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 text-primary-900 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-primary-900 mb-2">{feature.title}</h3>
                  <p className="text-primary-700/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sensors Table */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-primary-900 text-center mb-4">Sensor Specifications</h2>
          <p className="text-center text-primary-700 mb-12 max-w-2xl mx-auto">
            High-precision sensors for accurate agricultural weather data collection.
          </p>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Sensor</th>
                    <th className="px-6 py-4 text-left font-semibold">Range</th>
                    <th className="px-6 py-4 text-left font-semibold">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {sensors.map((sensor, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-neutral-200' : 'bg-white'}>
                      <td className="px-6 py-4 text-primary-900 font-medium">{sensor.name}</td>
                      <td className="px-6 py-4 text-primary-700">{sensor.range}</td>
                      <td className="px-6 py-4 text-primary-700">{sensor.accuracy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="bg-primary-900/5 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-primary-900 mb-6">Technical Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg">
                      <span className="text-sm text-primary-700/70">{spec.label}</span>
                      <p className="text-primary-900 font-semibold">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <img 
                  src="/images/farm2.png" 
                  alt="Weather Station Installation" 
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-900 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Get Hyperlocal Weather Data</h2>
            <p className="text-neutral-200 mb-8 text-lg">
              Install Atama Climate and start collecting precise weather data for your farm.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact" 
                className="inline-block bg-accent-yellow text-primary-900 px-8 py-3 rounded-full font-semibold hover:bg-white transition-colors"
              >
                Order Now
              </Link>
              <Link 
                href="/products" 
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-900 transition-colors"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
