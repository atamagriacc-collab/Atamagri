import React, { useState, useRef, useCallback, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

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

  /* ── Drag / Pan ── */
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

  /* ── Touch support ── */
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

  /* ── Fullscreen API ── */
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

  /* ── Keyboard shortcuts ── */
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
      {/* Controls Bar */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style={{ opacity: isDragging ? 0 : undefined }}>
        <button
          onClick={handleZoomOut}
          disabled={scale <= MIN_SCALE}
          className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Zoom Out (−)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
        </button>

        <span className="text-xs font-semibold text-primary-900 w-12 text-center tabular-nums">{zoomPercent}%</span>

        <button
          onClick={handleZoomIn}
          disabled={scale >= MAX_SCALE}
          className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Zoom In (+)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg>
        </button>

        <div className="w-px h-5 bg-neutral-300 mx-1" />

        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-900 transition-colors"
          title="Reset Zoom (0)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-900 transition-colors"
          title="Fullscreen (F)"
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Controls (always visible) */}
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

      {/* Hint overlay */}
      <div className="absolute bottom-4 right-4 z-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
          Scroll to zoom · Double-click to toggle · Drag to pan
        </div>
      </div>
    </div>
  );
}

/* ─────────── Page Data ─────────── */
const stats = [
  { value: '3,500+', label: 'Students Enrolled' },
  { value: '25+', label: 'Expert Instructors' },
  { value: '50+', label: 'Courses Available' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Video Lessons',
    description: 'High-quality video content with practical demonstrations and real-world examples.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Certification',
    description: 'Earn recognized certificates upon completion to validate your expertise.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Expert Instructors',
    description: 'Learn from agricultural experts and technology professionals with years of experience.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Learning Resources',
    description: 'Access downloadable materials, guides, and reference documentation.',
  },
];

export default function AtamaAcademy() {
  return (
    <>
      <Head>
        <title>Atama Academy - Agricultural Education | ATAMAGRI</title>
        <meta name="description" content="Learn smart farming with Atama Academy. Access courses on IoT, AI, drone technology, and data-driven agriculture from expert instructors." />
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-20 md:py-28">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url("/images/poster-edukasi.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />
          </div>
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-accent-yellow text-primary-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
                  Agricultural Education Platform
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Learn Smart Farming with <span className="text-accent-yellow">Atama Academy</span>
                </h1>
                <p className="text-xl text-neutral-200 mb-8 leading-relaxed">
                  Master modern agricultural technology through comprehensive online courses. From IoT sensors to drone operations, we&apos;ve got you covered.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="#features"
                    className="inline-block bg-accent-yellow text-primary-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-colors"
                  >
                    Explore Features
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-block border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary-900 transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <PosterViewer
                    src="/images/poster-edukasi.png"
                    alt="Poster Edukasi Atamagri - Panduan Smart Farming"
                  />
                  {/* Floating Stats Card */}
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl z-10">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-500/20 p-3 rounded-full">
                        <svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <span className="block text-2xl font-bold text-primary-900">3,500+</span>
                        <span className="text-sm text-primary-700/70">Active Students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-12 -mt-8 relative z-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-primary-900 rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <span className="block text-3xl md:text-4xl font-bold text-accent-yellow mb-1">{stat.value}</span>
                    <span className="text-neutral-200 text-sm">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">Why Learn With Atama Academy?</h2>
            <p className="text-primary-700 max-w-2xl mx-auto">
              We provide comprehensive education for modern farmers who want to embrace technology and innovation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-accent-yellow/30 text-primary-900 rounded-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">{feature.title}</h3>
                <p className="text-primary-700/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
