import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import ContactCard from '../components/ContactCard';
import MapEmbed from '../components/MapEmbed';
import PartnerLogos from '../components/PartnerLogos';
import ContactHero from '../components/ContactHero';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us - ATAMAGRI</title>
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        {/* 1. Tulisan "Contact Us" + background tulisan */}
        <ContactHero title="Contact Us" backgroundImage="/images/contact-bg.png" subtitle="We'd love to hear from you!" />
        {/* 2. Partner & Incubation */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="font-serif text-2xl font-bold text-primary-900 mb-6 text-center">Partner & Incubation</h2>
          <PartnerLogos />
        </section>
        {/* 3. Map Location */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="font-serif text-2xl font-bold text-primary-900 mb-6 text-center">Our Location Map</h2>
          <iframe
            title="ATAMAGRI Location"
            src="https://www.google.com/maps?q=Daratan,+RT+2+RW+6,+Senden,+Tohudan,+Kecamatan+Colomadu,+Kabupaten+Karanganyar,+Jawa+Tengah&output=embed"
            width="100%"
            height="350"
            className="rounded-xl border-2 border-primary-200 w-full"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </section>
        {/* 4. Kontak yang dapat dihubungi */}
        <section className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-8 mb-12 justify-center items-center text-center">
          <ContactCard icon={Mail} title="Mail Us" value="atamagriacc@gmail.com" href="mailto:atamagriacc@gmail.com" />
          <ContactCard icon={Phone} title="Call Us" value="+62 819-1199-8210" href="tel:+6281911998210" />
          <ContactCard icon={MapPin} title="Our Location" value="Jawa Tengah, Indonesia" />
        </section>
        {/* 5. Section "Have any questions? Get in touch" */}
        <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch mb-12">
          <div className="flex justify-center">
            <img
              src="/images/team-photo.png"
              alt="ATAMAGRI Expo"
              className="rounded-2xl shadow-lg object-cover w-full h-full max-h-[700px]"
            />
          </div>
          <div className="flex">
            <ContactForm />
          </div>
        </section>
  {/* 6. Footer */}
      </main>
      <Footer />
    </>
  );
}
