import BestAgriculture from '../components/BestAgriculture';
import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatsBox from '../components/StatsBox';
import PartnerLogos from '../components/PartnerLogos';
import TestimonialCard from '../components/TestimonialCard';
import Marquee from '../components/Marquee';
import ExpertValidation from '../components/ExpertValidation';
import AboutHero from '../components/AboutHero';
import AgricultureMatters from '../components/AgricultureMatters';
import { testimonials } from '../data/testimonials';
import { Leaf, Activity, Brain, Eye, GraduationCap, Wrench, Users, Target, Lightbulb, Cpu, Code, FlaskConical } from 'lucide-react';


const marqueeText = ['Agriculture', 'AI', 'IoT', 'Vegetables'];
const awards = [
  { photo: '/images/award1.png', position: '1st Place', competition: 'elevAte Indonesia Hackathon' },
  { photo: '/images/award2.png', position: '1st Place', competition: 'International Walisongo Competition' },
  { photo: '/images/award3.png', position: '1st Place', competition: 'Creativity and Innovation Competition (KRENOVA)' },
  { photo: '/images/award4.png', position: 'Finalist', competition: 'Indonesia AI Innovation Challenge' },
  { photo: '/images/award5.png', position: 'Finalist', competition: 'SMESTA x KemenKop UKM' },
  { photo: '/images/award6.png', position: 'Top 5', competition: 'TDC Business Competition' },
  { photo: '/images/award7.png', position: 'Top 30', competition: 'Pertamuda (Pertamina Young Entrepreneurs)' },
  { photo: '/images/award8.png', position: 'etc.', competition: '' },
];

/* ─────────── Product Line Data ─────────── */
const products = [
  {
    icon: Activity,
    name: 'Atama Climate',
    stage: 'Production',
    description: 'IoT weather station for hyperlocal microclimate monitoring. Tracks temperature, humidity, wind speed, rainfall, light intensity, and solar power using ESP32 sensors with real-time data streaming.',
  },
  {
    icon: Brain,
    name: 'Atama Sense',
    stage: 'Production',
    description: 'Web-based analytics dashboard providing real-time sensor visualization, trend analysis, weather forecasting, data export, and AI-powered agricultural recommendations.',
  },
  {
    icon: Eye,
    name: 'Atama Vis',
    stage: 'Production',
    description: 'Drone-based aerial monitoring system with AI vision (ResNet9 deep learning model) capable of detecting 48+ plant diseases across 14 crop species in real-time.',
  },
  {
    icon: GraduationCap,
    name: 'Atama Academy',
    stage: 'Active',
    description: 'Smart farming training program — a 15-day intensive course covering IoT, AI, and drone technology for modern agriculture. Includes hands-on practice and certification.',
  },
  {
    icon: Wrench,
    name: 'Atama Custom',
    stage: 'Available',
    description: 'Custom IoT solutions including smart irrigation farming, IoT monitoring modules, and AI-powered decision recommendation systems — tailored to specific farm needs.',
  },
];

/* ─────────── Team Data ─────────── */
const teamMembers = [
  {
    name: 'Aditya Wisnu Yudha Marsudi',
    role: 'Founder & CEO',
    expertise: 'IoT Engineering, Machine Learning, Agricultural Technology',
    description: '6+ years of experience in agri-tech innovation. Led Atamagri from concept to production, managing hardware R&D, AI model development, and business strategy.',
    icon: Target,
  },
  {
    name: 'Full-Stack Development',
    role: 'Engineering Team',
    expertise: 'Next.js, React, TypeScript, Firebase, Python',
    description: 'Building the web platform, real-time dashboards, API integrations, and cloud infrastructure that powers the entire Atamagri ecosystem.',
    icon: Code,
  },
  {
    name: 'Embedded Systems',
    role: 'Hardware Team',
    expertise: 'ESP32, Arduino, Sensor Integration, PCB Design',
    description: 'Designing and deploying IoT weather stations, sensor arrays, and solar-powered field devices for reliable outdoor operation.',
    icon: Cpu,
  },
  {
    name: 'AI & Data Science',
    role: 'Research Team',
    expertise: 'PyTorch, Computer Vision, ResNet, Data Analytics',
    description: 'Developing and training plant disease detection models, agricultural data pipelines, and AI recommendation engines.',
    icon: FlaskConical,
  },
];

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - ATAMAGRI | Smart Agriculture Solutions</title>
        <meta name="description" content="Atamagri empowers farmers with IoT, AI, and drone technology for precision agriculture. Learn about our mission, team, and products." />
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        {/* 1. Hero */}
        <AboutHero title="About Us" backgroundImage="/images/about-bg.png" subtitle="Empowering Agriculture with Technology" />

        {/* 2. Stats */}
        <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsBox label="Productivity Increase" value="70%" accent="yellow" />
          <StatsBox label="Years Experience" value={6} accent="green" />
          <StatsBox label="Awards" value={5} accent="yellow" />
          <StatsBox label="Happy Clients" value={1200} accent="green" />
        </section>

        {/* ═══════ BUSINESS DESCRIPTION ═══════ */}
        <section className="max-w-5xl mx-auto px-4 py-16" id="business-description">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary-900/10 text-primary-900 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Our Mission
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-6">
              What We Do
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col items-center text-center p-6 bg-beige rounded-xl">
                <Lightbulb className="w-10 h-10 text-primary-700 mb-4" />
                <h3 className="font-bold text-primary-900 mb-2">Problem We Solve</h3>
                <p className="text-sm text-primary-700 leading-relaxed">
                  Indonesian smallholder farmers lack access to affordable precision agriculture technology, leading to suboptimal yields, crop losses from undetected diseases, and inefficient resource usage.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-beige rounded-xl">
                <Target className="w-10 h-10 text-primary-700 mb-4" />
                <h3 className="font-bold text-primary-900 mb-2">Our Solution</h3>
                <p className="text-sm text-primary-700 leading-relaxed">
                  Atamagri combines IoT sensors, AI-powered analytics, and drone monitoring into an integrated platform that delivers real-time climate data, plant disease detection, and actionable recommendations.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-beige rounded-xl">
                <Users className="w-10 h-10 text-primary-700 mb-4" />
                <h3 className="font-bold text-primary-900 mb-2">Target Market</h3>
                <p className="text-sm text-primary-700 leading-relaxed">
                  Smallholder horticulture farmers, commercial agribusinesses, agricultural research institutions, and education providers across Indonesia and Southeast Asia.
                </p>
              </div>
            </div>
            <p className="text-primary-700 leading-relaxed text-center max-w-3xl mx-auto">
              Founded in 2025 and registered under NIB 1507250124399, Atamagri operates as a digital agricultural platform (KBLI 63122) headquartered in Karanganyar, Central Java. We are committed to democratizing precision agriculture and making data-driven farming accessible to every farmer.
            </p>
          </div>
        </section>

        {/* Marquee */}
        <Marquee text={marqueeText} speed={30} direction="left" />

        {/* Best Agriculture Services */}
        <BestAgriculture />

        {/* ═══════ TEAM INFORMATION ═══════ */}
        <section className="max-w-6xl mx-auto px-4 py-16" id="team-information">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary-900/10 text-primary-900 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Our Team
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Meet the People Behind Atamagri
            </h2>
            <p className="text-primary-700 max-w-2xl mx-auto">
              A multidisciplinary team combining deep expertise in agriculture, IoT engineering, artificial intelligence, and full-stack development.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member) => {
              const IconComponent = member.icon;
              return (
                <div
                  key={member.name}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-primary-900/5 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-700 to-primary-900 rounded-xl flex items-center justify-center shrink-0">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-primary-900">{member.name}</h3>
                      <p className="text-sm font-semibold text-primary-500 mb-1">{member.role}</p>
                      <p className="text-xs text-primary-700/70 mb-3">{member.expertise}</p>
                      <p className="text-sm text-primary-700 leading-relaxed">{member.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════ PRODUCT INFORMATION ═══════ */}
        <section className="bg-white py-16" id="product-information">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-accent-yellow text-primary-900 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                Our Products
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-4">
                What We&apos;re Building
              </h2>
              <p className="text-primary-700 max-w-2xl mx-auto">
                A complete ecosystem of hardware and software solutions for modern agriculture — all currently live and in production.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const IconComponent = product.icon;
                return (
                  <div
                    key={product.name}
                    className="group bg-beige rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-primary-900/5 flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary-900">{product.name}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.stage === 'Production'
                            ? 'bg-green-100 text-green-700'
                            : product.stage === 'Active'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                          {product.stage}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-primary-700 leading-relaxed flex-1">
                      {product.description}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-10 text-center">
              <p className="text-sm text-primary-700/70">
                All products are live at{' '}
                <a href="https://www.atamagri.app" className="text-primary-500 font-semibold underline underline-offset-2 hover:text-primary-700">
                  www.atamagri.app
                </a>
                {' '}with real-time IoT hardware deployed in the field.
              </p>
            </div>
          </div>
        </section>

        {/* Agriculture Matters */}
        <AgricultureMatters
          title="Agriculture Matters to the Future of Development"
          description="We believe agriculture is the backbone of sustainable development. Our solutions are designed to empower farmers, researchers, and agribusinesses to achieve more with less, using the latest in AI and IoT."
          image="/images/agriculture-matters.png"
        />

        {/* Validated by Experts */}
        <ExpertValidation awards={awards} />

        {/* Testimonials */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="font-serif text-2xl font-bold text-primary-900 mb-6 text-center">What Our Customers Say</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
        {/* Footer */}
      </main>
      <Footer />
    </>
  );
}
