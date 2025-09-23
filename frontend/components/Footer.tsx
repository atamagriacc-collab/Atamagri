import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-neutral-100 py-12 mt-16">
      <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 items-start overflow-hidden">
        {/* Logo & About */}
        <div className="flex flex-col">
          <div className="flex items-center mb-3">
            <img src="/images/logo.png" alt="Atama Agri Logo" className="h-12 w-12 rounded-full" />
          </div>
          <p className="text-neutral-200 text-sm mb-4 leading-relaxed">
            Climate intelligence for smart agriculture. Empowering farmers with data-driven tools, IoT, and AI for a sustainable future.
          </p>
          <div className="flex gap-4 mt-4">
            {/* Instagram */}
            <a href="https://instagram.com/atamagri" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-accent-yellow">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm6.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com/company/atamagri" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-accent-yellow">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com/@atamagri" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-accent-yellow">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.072 0 12 0 12s0 3.928.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.5 20.5 12 20.5 12 20.5s7.5 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.928 24 12 24 12s0-3.928-.502-5.814zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
            </a>
          </div>
          <p className="text-neutral-300 text-xs mt-4">&copy; {new Date().getFullYear()} Atamagri. All rights reserved.</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col">
          <h4 className="font-semibold mb-3 text-accent-yellow">Navigation</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Link href="/products" className="hover:underline">Products</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Info & Contact */}
        <div className="flex flex-col">
          <h4 className="font-semibold mb-3 text-accent-yellow">Info & Contact</h4>
          <p className="text-neutral-200 text-sm">Mon-Fri: 08.00 - 17.00</p>
          <p className="text-neutral-200 text-sm leading-relaxed">
            Daratan, RT 2 RW 6, Senden, Tohudan, Colomadu, Karanganyar, Jawa Tengah
          </p>
          <p className="text-neutral-200 text-sm">Phone: <a href="tel:+6281911998210" className="underline">+62 819-1199-8210</a></p>
          <p className="text-neutral-200 text-sm">Email: <a href="mailto:info@atamagri.com" className="underline">info@atamagri.com</a></p>
        </div>

        {/* Subscribe Email */}
        <div className="flex flex-col">
          <h4 className="font-semibold mb-3 text-accent-yellow">Subscribe</h4>
          <form className="mt-2 flex flex-wrap gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 min-w-[150px] max-w-xs px-3 py-2 rounded bg-neutral-200 text-primary-900 focus:outline-none"
              aria-label="Newsletter email"
            />
            <button
              type="submit"
              className="bg-accent-yellow text-primary-900 px-4 py-2 rounded font-semibold hover:bg-primary-500 hover:text-white transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}