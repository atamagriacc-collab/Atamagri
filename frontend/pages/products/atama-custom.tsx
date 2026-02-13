import React, { useState, useRef, useCallback, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

/* ─────────── Interactive Poster Viewer Component ─────────── */
function PosterViewer({ src, alt }: { src: string; alt: string }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 5;
  const ZOOM_STEP = 0.3;

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + ZOOM_STEP, MAX_SCALE));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => {
      const next = Math.max(prev - ZOOM_STEP, MIN_SCALE);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) handleZoomIn();
      else handleZoomOut();
    },
    [handleZoomIn, handleZoomOut],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale <= 1) return;
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    },
    [scale, position],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const lastTouchDist = useRef<number | null>(null);
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist.current = Math.hypot(dx, dy);
      } else if (e.touches.length === 1 && scale > 1) {
        setIsDragging(true);
        setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
      }
    },
    [scale, position],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && lastTouchDist.current !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const diff = dist - lastTouchDist.current;
        setScale((prev) => Math.min(Math.max(prev + diff * 0.005, MIN_SCALE), MAX_SCALE));
        lastTouchDist.current = dist;
      } else if (e.touches.length === 1 && isDragging) {
        setPosition({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
      }
    },
    [isDragging, dragStart],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    lastTouchDist.current = null;
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) document.exitFullscreen().catch(() => {});
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === '0') handleReset();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen, handleZoomIn, handleZoomOut, handleReset]);

  const zoomPercent = Math.round(scale * 100);

  return (
    <div
      ref={containerRef}
      className={`relative group rounded-2xl overflow-hidden select-none ${
        isFullscreen ? 'bg-black flex items-center justify-center' : 'bg-white shadow-xl border border-neutral-200'
      }`}
      style={{ touchAction: 'none' }}
    >
      {/* Desktop Controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style={{ opacity: isDragging ? 0 : undefined }}>
        <button onClick={handleZoomOut} disabled={scale <= MIN_SCALE} className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Zoom Out (−)">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
        </button>
        <span className="text-xs font-semibold text-primary-900 w-12 text-center tabular-nums">{zoomPercent}%</span>
        <button onClick={handleZoomIn} disabled={scale >= MAX_SCALE} className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Zoom In (+)">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg>
        </button>
        <div className="w-px h-5 bg-neutral-300 mx-1" />
        <button onClick={handleReset} className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-900 transition-colors" title="Reset Zoom (0)">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
        <button onClick={toggleFullscreen} className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-900 transition-colors" title="Fullscreen">
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2 md:hidden">
        <button onClick={handleZoomOut} disabled={scale <= MIN_SCALE} className="p-2 rounded-lg hover:bg-primary-100 text-primary-900 disabled:opacity-30 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
        </button>
        <span className="text-xs font-semibold text-primary-900 w-12 text-center tabular-nums">{zoomPercent}%</span>
        <button onClick={handleZoomIn} disabled={scale >= MAX_SCALE} className="p-2 rounded-lg hover:bg-primary-100 text-primary-900 disabled:opacity-30 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
        <button onClick={handleReset} className="p-2 rounded-lg hover:bg-primary-100 text-primary-900 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
        <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-primary-100 text-primary-900 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>
        </button>
      </div>

      {/* Image Area */}
      <div
        className={`overflow-hidden ${isFullscreen ? 'w-screen h-screen' : 'w-full'}`}
        style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={() => (scale > 1 ? handleReset() : setScale(2.5))}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          draggable={false}
          className="w-full h-auto transition-transform duration-200 ease-out pointer-events-none"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: 'center center',
          }}
        />
      </div>

      {/* Hint */}
      <div className="absolute bottom-4 right-4 z-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
          Scroll to zoom · Double-click to toggle · Drag to pan
        </div>
      </div>
    </div>
  );
}

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

        {/* ═══════ Hero Section ═══════ */}
        <section className="relative bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-20 md:py-28 overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url("/images/poster-custom.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent-yellow/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left — Text */}
              <div>
                <span className="inline-block bg-accent-yellow text-primary-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
                  Tailored for Your Farm
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Build Your <span className="text-accent-yellow">Custom Solution</span> with Atamagri
                </h1>
                <p className="text-xl text-neutral-200 mb-8 leading-relaxed">
                  Every farm is unique. We design and build IoT, AI, and software systems tailored to your specific agricultural challenges and goals.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="#contact"
                    className="inline-block bg-accent-yellow text-primary-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#services"
                    className="inline-block border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
                  >
                    Our Services
                  </Link>
                </div>
              </div>

              {/* Right — Poster Viewer */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 shadow-2xl">
                <PosterViewer
                  src="/images/poster-custom.png"
                  alt="Poster Custom Alat Atamagri - Solusi Pertanian Custom"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ Stats Bar ═══════ */}
        <section className="relative -mt-8 z-10 max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl py-8 px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: '50+', label: 'Custom Projects' },
                { value: '100%', label: 'Tailored Design' },
                { value: '24/7', label: 'Ongoing Support' },
                { value: '4.9★', label: 'Client Satisfaction' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-4xl font-bold text-primary-900">{stat.value}</p>
                  <p className="text-sm text-primary-700 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ Introduction ═══════ */}
        <section className="max-w-7xl mx-auto px-4 pt-20 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
              Your Farm is Unique. Your Technology Should Be Too.
            </h2>
            <p className="text-primary-700 text-lg leading-relaxed">
              From small family farms to large agricultural enterprises, our custom solutions team works closely with you to design and implement technology systems that perfectly fit your needs and scale with your growth.
            </p>
          </div>
        </section>

        {/* ═══════ Services Grid ═══════ */}
        <section id="services" className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="inline-block bg-primary-900/10 text-primary-900 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                What We Offer
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">Our Custom Services</h2>
              <p className="text-primary-700 max-w-2xl mx-auto text-lg">
                End-to-end customization — from hardware to software — designed around your farming operations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="group relative bg-beige border border-primary-900/5 p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Accent top border */}
                  <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-primary-500 to-accent-yellow rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/15 text-primary-900 rounded-xl mb-6 group-hover:bg-primary-500/25 transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary-900 mb-3">{service.title}</h3>
                  <p className="text-primary-700/80 mb-5 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2.5">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-primary-700">
                        <svg className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ Process Section ═══════ */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="inline-block bg-accent-yellow/30 text-primary-900 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                How It Works
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">Our Process</h2>
              <p className="text-primary-700 max-w-2xl mx-auto text-lg">
                A systematic, transparent approach from first conversation to ongoing support.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {process.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Connector line (horizontal on lg, hidden on last col) */}
                  {idx % 3 !== 2 && (
                    <div className="hidden lg:block absolute top-8 left-full w-8 border-t-2 border-dashed border-primary-500/30 z-0" />
                  )}
                  <div className="bg-white p-7 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 h-full border border-primary-900/5">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="w-12 h-12 bg-gradient-to-br from-primary-900 to-primary-700 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-lg">
                        {item.step}
                      </span>
                      <h3 className="text-xl font-bold text-primary-900">{item.title}</h3>
                    </div>
                    <p className="text-primary-700/80 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ Contact Form ═══════ */}
        <section id="contact" className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
              {/* Left — Info */}
              <div className="lg:sticky lg:top-28">
                <span className="inline-block bg-primary-900/10 text-primary-900 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  Get In Touch
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                  Let&apos;s Build Your Custom Solution
                </h2>
                <p className="text-primary-700 text-lg mb-8 leading-relaxed">
                  Ready to transform your agricultural operations? Tell us about your needs and our team will craft a tailored proposal for you.
                </p>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-primary-500/15 rounded-xl flex items-center justify-center group-hover:bg-primary-500/25 transition-colors">
                      <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-primary-700/60 font-medium uppercase tracking-wider">Email</p>
                      <p className="text-primary-900 font-semibold">atamagriacc@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-primary-500/15 rounded-xl flex items-center justify-center group-hover:bg-primary-500/25 transition-colors">
                      <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-primary-700/60 font-medium uppercase tracking-wider">Phone</p>
                      <p className="text-primary-900 font-semibold">+62 819-1199-8210</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-primary-500/15 rounded-xl flex items-center justify-center group-hover:bg-primary-500/25 transition-colors">
                      <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-primary-700/60 font-medium uppercase tracking-wider">Location</p>
                      <p className="text-primary-900 font-semibold">Indonesia</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Form */}
              <div className="bg-beige p-8 md:p-10 rounded-2xl shadow-xl border border-primary-900/5">
                <h3 className="text-xl font-bold text-primary-900 mb-6">Send Us Your Requirements</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-1.5">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-1.5">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-1.5">Company / Farm</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        placeholder="Company or farm name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-1.5">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        placeholder="+62 xxx-xxxx-xxxx"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1.5">Farm Size</label>
                    <select
                      name="farmSize"
                      value={formData.farmSize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    >
                      <option value="">Select farm size</option>
                      <option value="small">Small (&lt; 10 hectares)</option>
                      <option value="medium">Medium (10–100 hectares)</option>
                      <option value="large">Large (100–500 hectares)</option>
                      <option value="enterprise">Enterprise (500+ hectares)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1.5">Tell us about your requirements *</label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                      placeholder="Describe your challenges and what you're looking to achieve..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-900 to-primary-700 text-white py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-900 transition-all shadow-lg hover:shadow-xl"
                  >
                    Submit Inquiry →
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
