import React from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductHero from '../../components/ProductHero';
import Link from 'next/link';

const courses = [
  {
    title: 'Smart Farming Fundamentals',
    description: 'Learn the basics of IoT and AI in agriculture. Perfect for beginners.',
    duration: '4 weeks',
    level: 'Beginner',
    image: '/images/farm1.png',
    modules: 8,
    students: 1250,
  },
  {
    title: 'IoT Sensor Installation',
    description: 'Hands-on guide to installing and configuring agricultural IoT sensors.',
    duration: '2 weeks',
    level: 'Intermediate',
    image: '/images/farm2.png',
    modules: 5,
    students: 830,
  },
  {
    title: 'Drone Operation & Analysis',
    description: 'Master drone flying and crop analysis using aerial imaging technology.',
    duration: '6 weeks',
    level: 'Advanced',
    image: '/images/farm3.png',
    modules: 12,
    students: 620,
  },
  {
    title: 'Data-Driven Crop Management',
    description: 'Use analytics and AI recommendations to optimize your crop yields.',
    duration: '3 weeks',
    level: 'Intermediate',
    image: '/images/agriculture-matters.png',
    modules: 6,
    students: 980,
  },
];

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Video Lessons',
    description: 'High-quality video content with practical demonstrations and real-world examples.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Certification',
    description: 'Earn recognized certificates upon completion to validate your expertise.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Expert Instructors',
    description: 'Learn from agricultural experts and technology professionals with years of experience.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Learning Resources',
    description: 'Access downloadable materials, guides, and reference documentation.',
  },
];

const stats = [
  { value: '3,500+', label: 'Students Enrolled' },
  { value: '25+', label: 'Expert Instructors' },
  { value: '50+', label: 'Courses Available' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const testimonials = [
  {
    name: 'Pak Budi',
    role: 'Rice Farmer, Central Java',
    content: 'Atama Academy helped me understand how to use technology in my farm. Now I can monitor my crops using sensors!',
    avatar: '/images/avatar-1.jpg',
  },
  {
    name: 'Ibu Sari',
    role: 'Agricultural Extension Worker',
    content: 'The courses are very practical and easy to follow. I recommend this to all farmers who want to modernize.',
    avatar: '/images/avatar-2.jpg',
  },
  {
    name: 'Mas Anto',
    role: 'AgriTech Entrepreneur',
    content: 'The drone operation course was exactly what I needed. Professional content with great support.',
    avatar: '/images/avatar-3.jpg',
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
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url("/images/farm1.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />
          </div>
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-accent-yellow text-primary-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
                  🎓 Agricultural Education Platform
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Learn Smart Farming with <span className="text-accent-yellow">Atama Academy</span>
                </h1>
                <p className="text-xl text-neutral-200 mb-8 leading-relaxed">
                  Master modern agricultural technology through comprehensive online courses. From IoT sensors to drone operations, we&apos;ve got you covered.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="#courses"
                    className="inline-block bg-accent-yellow text-primary-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-colors"
                  >
                    Explore Courses
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
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
                    <img 
                      src="/images/farm2.png" 
                      alt="Smart Farming Education" 
                      className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                  </div>
                  {/* Floating Stats Card */}
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
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
        <section className="max-w-7xl mx-auto px-4 py-16">
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

        {/* Courses Section */}
        <section id="courses" className="bg-primary-900/5 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">Featured Courses</h2>
              <p className="text-primary-700 max-w-2xl mx-auto">
                Start your journey to becoming a smart farmer with our carefully curated courses.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courses.map((course, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        course.level === 'Beginner' ? 'bg-green-500 text-white' :
                        course.level === 'Intermediate' ? 'bg-accent-yellow text-primary-900' :
                        'bg-primary-700 text-white'
                      }`}>
                        {course.level}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary-900 mb-2 group-hover:text-primary-700 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-primary-700/80 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-primary-700/70 mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        {course.modules} Modules
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {course.students.toLocaleString()}
                      </span>
                    </div>
                    <button className="w-full bg-primary-900 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <button className="inline-flex items-center gap-2 text-primary-900 font-semibold hover:text-primary-700 transition-colors">
                View All Courses
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">What Our Students Say</h2>
            <p className="text-primary-700 max-w-2xl mx-auto">
              Hear from farmers and agricultural professionals who have transformed their practices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-primary-900">{testimonial.name}</h4>
                    <span className="text-sm text-primary-700/70">{testimonial.role}</span>
                  </div>
                </div>
                <p className="text-primary-700 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-accent-yellow" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary-900 to-primary-700 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Learning?</h2>
            <p className="text-xl text-neutral-200 mb-8">
              Join thousands of farmers who are already embracing smart agriculture.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact" 
                className="inline-block bg-accent-yellow text-primary-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-colors"
              >
                Get Started Free
              </Link>
              <Link 
                href="/products" 
                className="inline-block border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary-900 transition-colors"
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
