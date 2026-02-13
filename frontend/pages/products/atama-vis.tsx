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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Aerial Imaging',
    description: 'High-resolution aerial photography for comprehensive crop monitoring and mapping.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Disease Detection',
    description: 'Machine learning algorithms identify plant diseases early, before visible symptoms appear.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: 'Automated Missions',
    description: 'Pre-programmed flight paths for consistent coverage and efficient field surveys.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Detailed Reports',
    description: 'Generate comprehensive field health reports with actionable insights and recommendations.',
  },
];

const capabilities = [
  { title: 'NDVI Analysis', description: 'Normalized Difference Vegetation Index for crop health assessment' },
  { title: 'Thermal Imaging', description: 'Detect water stress and irrigation issues through thermal cameras' },
  { title: 'Multispectral Analysis', description: 'Capture data across multiple wavelengths for detailed analysis' },
  { title: 'Plant Counting', description: 'Automated plant counting for accurate yield prediction' },
  { title: 'Weed Detection', description: 'Identify weed infestations for targeted treatment' },
  { title: '3D Mapping', description: 'Create detailed 3D terrain models of your fields' },
];

const specifications = [
  { label: 'Flight Time', value: 'Up to 45 minutes' },
  { label: 'Range', value: '10+ km' },
  { label: 'Camera', value: '48MP RGB + Multispectral' },
  { label: 'GPS Accuracy', value: 'RTK: 1cm + 1ppm' },
  { label: 'Wind Resistance', value: 'Up to 12 m/s' },
  { label: 'Coverage', value: 'Up to 200 hectares/flight' },
];

export default function AtamaVis() {
  return (
    <>
      <Head>
        <title>Atama Vis - Drone Monitoring System | ATAMAGRI</title>
        <meta name="description" content="Advanced drone monitoring system for aerial crop surveillance and AI-powered disease detection. Transform your farm management with precision agriculture." />
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        {/* Hero Section */}
        <ProductHero 
          title="Atama Vis" 
          backgroundImage="/images/products-bg.png" 
          subtitle="Aerial Monitoring & AI Disease Detection" 
          subtitleClassName="text-white" 
        />

        {/* Product Overview */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary-700 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Drone System
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                See Your Farm From Above
              </h2>
              <p className="text-primary-700 text-lg mb-6 leading-relaxed">
                Atama Vis combines advanced drone technology with artificial intelligence to provide comprehensive aerial monitoring of your crops. Detect diseases early, assess crop health, and make data-driven decisions with precision agriculture.
              </p>
              <p className="text-primary-700 mb-8 leading-relaxed">
                Our drone system integrates seamlessly with the Atama Sense dashboard, providing a complete picture of your farm from ground sensors to aerial imagery.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/drone-detection" 
                  className="inline-block bg-primary-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
                >
                  Try Disease Detection
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-block border-2 border-primary-900 text-primary-900 px-6 py-3 rounded-full font-semibold hover:bg-primary-900 hover:text-white transition-colors"
                >
                  Request Demo
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-700/20 to-primary-900/30 rounded-2xl p-8">
                <img 
                  src="/images/product-drone.png" 
                  alt="Atama Vis Drone System" 
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary-700 rounded-full p-4 shadow-lg">
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
              Advanced aerial monitoring capabilities powered by AI and precision sensors.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="text-center p-6 rounded-xl hover:bg-neutral-200 transition-colors">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-700/20 text-primary-900 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-primary-900 mb-2">{feature.title}</h3>
                  <p className="text-primary-700/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Capabilities */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {capabilities.map((cap, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-primary-900 font-bold mb-2">{cap.title}</h3>
                    <p className="text-sm text-primary-700/80">{cap.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-primary-900 mb-6">AI-Powered Analysis</h2>
              <p className="text-primary-700 text-lg mb-6 leading-relaxed">
                Our advanced machine learning models analyze aerial imagery to detect issues before they become visible to the naked eye. From disease detection to yield prediction, Atama Vis provides actionable insights.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-primary-700">95%+ accuracy in disease detection</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-primary-700">Real-time processing and alerts</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-primary-700">Historical trend analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="bg-primary-900/5 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-primary-900 text-center mb-12">Technical Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {specifications.map((spec, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl text-center shadow-md">
                  <span className="text-sm text-primary-700/70 block mb-1">{spec.label}</span>
                  <p className="text-primary-900 font-bold">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
