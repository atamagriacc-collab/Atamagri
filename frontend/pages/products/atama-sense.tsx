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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Real-time Analytics',
    description: 'Monitor your farm conditions 24/7 with instant data updates and visual dashboards.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI-Powered Insights',
    description: 'Receive intelligent recommendations based on your crop data and weather patterns.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Mobile Access',
    description: 'Access your farm dashboard from anywhere using our mobile-friendly platform.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Data Security',
    description: 'Your farm data is securely stored with enterprise-grade encryption and backup.',
  },
];

const benefits = [
  'Hyperlocal weather data collection 24/7',
  'Lifetime access to the platform',
  'Real-time monitoring and alerts',
  'AI-powered crop recommendations',
  'Historical data analysis and trends',
  'Export reports in multiple formats',
];

export default function AtamaSense() {
  return (
    <>
      <Head>
        <title>Atama Sense - Farm Dashboard | ATAMAGRI</title>
        <meta name="description" content="Monitor your farm in real-time with AI-powered insights. Atama Sense provides comprehensive farm analytics and intelligent recommendations." />
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        {/* Hero Section */}
        <ProductHero 
          title="Atama Sense" 
          backgroundImage="/images/products-bg.png" 
          subtitle="Smart Farm Dashboard & Analytics Platform" 
          subtitleClassName="text-white" 
        />

        {/* Product Overview */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-accent-yellow text-primary-900 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Farm Dashboard
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                Monitor Your Farm with Intelligence
              </h2>
              <p className="text-primary-700 text-lg mb-6 leading-relaxed">
                Atama Sense is your comprehensive farm management dashboard that brings together all your agricultural data in one place. With AI-powered analytics, you can make informed decisions that boost productivity and reduce costs.
              </p>
              <p className="text-primary-700 mb-8 leading-relaxed">
                Our platform integrates seamlessly with IoT sensors, weather stations, and drone data to give you a complete picture of your farm&apos;s health and performance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/dashboard" 
                  className="inline-block bg-primary-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
                >
                  Try Demo Dashboard
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-block border-2 border-primary-900 text-primary-900 px-6 py-3 rounded-full font-semibold hover:bg-primary-900 hover:text-white transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500/20 to-primary-900/30 rounded-2xl p-8">
                <img 
                  src="/images/product-laptop.png" 
                  alt="Atama Sense Dashboard" 
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-accent-yellow rounded-full p-4 shadow-lg">
                <span className="text-primary-900 font-bold text-xl">$59</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-primary-900 text-center mb-4">Key Features</h2>
            <p className="text-center text-primary-700 mb-12 max-w-2xl mx-auto">
              Everything you need to manage your farm efficiently in one powerful platform.
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

        {/* Benefits Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="/images/farm1.png" 
                alt="Smart Farming" 
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-primary-900 mb-6">Why Choose Atama Sense?</h2>
              <ul className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-primary-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
