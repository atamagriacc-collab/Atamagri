import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductHero from '../../components/ProductHero';
import Link from 'next/link';

const services = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    title: 'Custom IoT Solutions',
    description: 'Tailor-made IoT sensor networks designed specifically for your farm&apos;s unique requirements.',
    features: ['Custom sensor configurations', 'Scalable architecture', 'Integration support', 'Dedicated maintenance'],
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Model Development',
    description: 'Custom machine learning models trained on your specific crops and regional conditions.',
    features: ['Crop-specific models', 'Disease detection', 'Yield prediction', 'Continuous improvement'],
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'Software Integration',
    description: 'Seamless integration with your existing farm management systems and third-party tools.',
    features: ['API development', 'ERP integration', 'Mobile app development', 'Dashboard customization'],
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Enterprise Solutions',
    description: 'Comprehensive agricultural technology solutions for large-scale farming operations.',
    features: ['Multi-site management', 'Advanced analytics', 'Team collaboration', 'Priority support'],
  },
];

const process = [
  {
    step: '01',
    title: 'Consultation',
    description: 'We start by understanding your specific needs, challenges, and goals through detailed discussions.',
  },
  {
    step: '02',
    title: 'Assessment',
    description: 'Our team visits your site to assess existing infrastructure and identify the best solutions.',
  },
  {
    step: '03',
    title: 'Design',
    description: 'We create a customized solution blueprint tailored to your requirements and budget.',
  },
  {
    step: '04',
    title: 'Implementation',
    description: 'Professional installation and configuration of your custom agricultural technology system.',
  },
  {
    step: '05',
    title: 'Training',
    description: 'Comprehensive training for your team to ensure optimal utilization of the new systems.',
  },
  {
    step: '06',
    title: 'Support',
    description: 'Ongoing technical support, maintenance, and system updates to keep everything running smoothly.',
  },
];

const caseStudies = [
  {
    title: 'Large Rice Plantation',
    location: 'Central Java',
    challenge: 'Managing 500+ hectares with limited staff',
    solution: 'Deployed 50 IoT sensors with centralized monitoring dashboard',
    result: '30% reduction in water usage, 25% increase in yield',
    image: '/images/farm1.png',
  },
  {
    title: 'Vegetable Cooperative',
    location: 'West Java',
    challenge: 'Disease outbreaks causing significant losses',
    solution: 'Implemented drone monitoring with AI disease detection',
    result: 'Early detection reduced crop losses by 40%',
    image: '/images/farm2.png',
  },
  {
    title: 'Research Institute',
    location: 'Yogyakarta',
    challenge: 'Need for precise environmental data collection',
    solution: 'Custom sensor network with research-grade accuracy',
    result: 'Published 3 research papers using collected data',
    image: '/images/farm3.png',
  },
];

export default function AtamaCustom() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    farmSize: '',
    requirements: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    alert('Thank you for your inquiry! We will contact you soon.');
  };

  return (
    <>
      <Head>
        <title>Atama Custom - Custom Agricultural Solutions | ATAMAGRI</title>
        <meta name="description" content="Custom IoT, AI, and software solutions for agriculture. Tailored technology systems designed for your specific farming needs." />
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        {/* Hero Section */}
        <ProductHero 
          title="Atama Custom" 
          backgroundImage="/images/products-bg.png" 
          subtitle="Tailored Technology Solutions for Your Farm" 
          subtitleClassName="text-white" 
        />

        {/* Introduction */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-primary-900 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Custom Solutions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
              Your Farm is Unique. Your Technology Should Be Too.
            </h2>
            <p className="text-primary-700 text-lg leading-relaxed">
              Every farm has its own challenges, conditions, and goals. Our custom solutions team works closely with you to design and implement technology systems that perfectly fit your specific needs. From small family farms to large agricultural enterprises, we create solutions that scale with your growth.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-primary-900 text-center mb-4">Our Custom Services</h2>
            <p className="text-center text-primary-700 mb-12 max-w-2xl mx-auto">
              From hardware to software, we offer comprehensive customization options.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, idx) => (
                <div key={idx} className="bg-neutral-200 p-8 rounded-2xl hover:shadow-xl transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 text-primary-900 rounded-xl mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary-900 mb-3">{service.title}</h3>
                  <p className="text-primary-700/80 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-primary-700">
                        <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-primary-900 text-center mb-4">Our Process</h2>
          <p className="text-center text-primary-700 mb-12 max-w-2xl mx-auto">
            A systematic approach to delivering custom solutions that exceed expectations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-lg h-full">
                  <span className="absolute -top-4 -left-4 w-12 h-12 bg-primary-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold text-primary-900 mb-3 mt-4">{item.title}</h3>
                  <p className="text-primary-700/80">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Case Studies */}
        <section className="bg-primary-900/5 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-primary-900 text-center mb-4">Success Stories</h2>
            <p className="text-center text-primary-700 mb-12 max-w-2xl mx-auto">
              See how our custom solutions have transformed agricultural operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {caseStudies.map((study, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={study.image} 
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-primary-900">{study.title}</h3>
                      <span className="text-sm text-primary-700/70">{study.location}</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-semibold text-primary-900">Challenge:</span>
                        <p className="text-primary-700/80">{study.challenge}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-primary-900">Solution:</span>
                        <p className="text-primary-700/80">{study.solution}</p>
                      </div>
                      <div className="bg-primary-500/10 p-3 rounded-lg">
                        <span className="font-semibold text-primary-700">Result:</span>
                        <p className="text-primary-900 font-medium">{study.result}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                Let&apos;s Build Your Custom Solution
              </h2>
              <p className="text-primary-700 text-lg mb-6 leading-relaxed">
                Ready to transform your agricultural operations? Tell us about your needs and our team will get back to you with a tailored proposal.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-primary-700">atamagriacc@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-primary-700">+62 819-1199-8210</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1">Company/Farm</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Company or farm name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="+62 xxx-xxxx-xxxx"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-900 mb-1">Farm Size</label>
                  <select
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select farm size</option>
                    <option value="small">Small (&lt; 10 hectares)</option>
                    <option value="medium">Medium (10-100 hectares)</option>
                    <option value="large">Large (100-500 hectares)</option>
                    <option value="enterprise">Enterprise (500+ hectares)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-900 mb-1">Tell us about your requirements *</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Describe your challenges and what you're looking to achieve..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-900 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-900 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Prefer to Chat First?</h2>
            <p className="text-neutral-200 mb-8 text-lg">
              Schedule a free consultation call with our solutions team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact" 
                className="inline-block bg-accent-yellow text-primary-900 px-8 py-3 rounded-full font-semibold hover:bg-white transition-colors"
              >
                Schedule Call
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
