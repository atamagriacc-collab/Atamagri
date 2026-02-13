import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: 'Weather Monitoring',
    description: 'Track temperature, humidity, rainfall, wind speed, and atmospheric pressure in real-time.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Long Battery Life',
    description: 'Solar-powered with backup battery ensures continuous operation in all conditions.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    title: 'Wireless Connectivity',
    description: 'LoRa and WiFi connectivity for seamless data transmission to your dashboard.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* ═══════ Hero Section ═══════ */}
        <section className="relative bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-20 md:py-28 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url("/images/products-bg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />
          </div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent-yellow/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left — Text */}
              <div>
                <span className="inline-block bg-accent-yellow text-primary-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
                  Professional IoT Weather Station
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Atama <span className="text-accent-yellow">Climate</span>
                </h1>
                <p className="text-xl text-neutral-200 mb-8 leading-relaxed">
                  Professional-grade weather station designed for agriculture. Monitor hyperlocal weather conditions with precision sensors and make data-driven farming decisions.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="inline-block bg-accent-yellow text-primary-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-colors"
                  >
                    Request Quote
                  </Link>
                  <Link
                    href="#specs"
                    className="inline-block border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
                  >
                    View Specs
                  </Link>
                </div>
              </div>

              {/* Right — Product Image */}
              <div className="flex justify-center">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-sm w-full">
                  <img
                    src="/images/product-sensor.png"
                    alt="Atama Climate Weather Station"
                    className="w-full h-auto max-h-72 object-contain rounded-lg mx-auto"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-accent-yellow rounded-xl px-5 py-3 shadow-lg">
                    <span className="text-primary-900 font-bold text-xl">$365</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ Stats Bar ═══════ */}
        <section className="relative -mt-8 z-10 max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl py-8 px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: '6', label: 'Precision Sensors' },
                { value: '24/7', label: 'Continuous Monitoring' },
                { value: 'IP65', label: 'Weatherproof Rating' },
                { value: '2 yr', label: 'Warranty Included' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-4xl font-bold text-primary-900">{stat.value}</p>
                  <p className="text-sm text-primary-700 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ Overview ═══════ */}
        <section className="max-w-7xl mx-auto px-4 pt-20 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
              Precision Weather Monitoring for Smart Farming
            </h2>
            <p className="text-primary-700 text-lg leading-relaxed">
              Built to withstand harsh outdoor conditions, Atama Climate delivers reliable 24/7 monitoring with minimal maintenance. Solar-powered and wirelessly connected, it seamlessly integrates with the Atama Sense dashboard.
            </p>
          </div>
        </section>

        {/* ═══════ Features Grid ═══════ */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="inline-block bg-primary-900/10 text-primary-900 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Key Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">Why Atama Climate?</h2>
              <p className="text-primary-700 max-w-2xl mx-auto text-lg">
                Professional-grade sensors with robust connectivity for reliable agricultural weather monitoring.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="group bg-beige border border-primary-900/5 p-7 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/15 text-primary-900 rounded-xl mb-5 group-hover:bg-primary-500/25 transition-colors mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-primary-900 mb-2">{feature.title}</h3>
                  <p className="text-primary-700/80 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ Sensor Specifications Table ═══════ */}
        <section id="specs" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="inline-block bg-accent-yellow/30 text-primary-900 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Detailed Specs
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">Sensor Specifications</h2>
              <p className="text-primary-700 max-w-2xl mx-auto text-lg">
                High-precision sensors for accurate agricultural weather data collection.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-primary-900/5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-primary-900 to-primary-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Sensor</th>
                      <th className="px-6 py-4 text-left font-semibold">Range</th>
                      <th className="px-6 py-4 text-left font-semibold">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensors.map((sensor, idx) => (
                      <tr key={idx} className={`${idx % 2 === 0 ? 'bg-beige' : 'bg-white'} hover:bg-primary-500/5 transition-colors`}>
                        <td className="px-6 py-4 text-primary-900 font-medium">{sensor.name}</td>
                        <td className="px-6 py-4 text-primary-700">{sensor.range}</td>
                        <td className="px-6 py-4 text-primary-700 font-semibold">{sensor.accuracy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ Technical Specifications ═══════ */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              {/* Left — Specs Grid */}
              <div>
                <span className="inline-block bg-primary-900/10 text-primary-900 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  Hardware Details
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-8">Technical Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="bg-beige border border-primary-900/5 p-5 rounded-xl hover:shadow-md transition-shadow">
                      <span className="text-xs text-primary-700/60 font-medium uppercase tracking-wider">{spec.label}</span>
                      <p className="text-primary-900 font-semibold mt-1">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Image */}
              <div className="flex justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-xl max-w-md w-full">
                  <img
                    src="/images/farm2.png"
                    alt="Weather Station in field installation"
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-bold text-lg">Built for the Field</p>
                    <p className="text-white/80 text-sm">IP65-rated for all weather conditions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
