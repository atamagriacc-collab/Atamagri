import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const productDropdownItems = [
  { name: 'Atama Sense', href: '/products/atama-sense', description: 'Farm Dashboard & Analytics' },
  { name: 'Atama Climate', href: '/products/atama-climate', description: 'Weather Station IoT' },
  { name: 'Atama Vis', href: '/products/atama-vis', description: 'Drone Monitoring System' },
  { name: 'Atama Academy', href: '/products/atama-academy', description: 'Agricultural Education' },
  { name: 'Atama Custom', href: '/products/atama-custom', description: 'Custom Solutions' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  return (
    <header className="bg-beige sticky top-0 z-30 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center px-4 py-3 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <img src="/images/logo.png" alt="Atama Agri Logo" className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full transition-transform hover:scale-105" />
        </Link>
        {/* Desktop Nav */}
        <ul className="hidden md:flex flex-1 justify-center gap-7 items-center mx-auto" aria-label="Main navigation">
          {navLinks.slice(0, 2).map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="text-primary-900 font-medium hover:text-primary-700 transition-colors px-2 py-1 rounded focus:outline focus:ring-2 focus:ring-primary-700">
                {link.name}
              </Link>
            </li>
          ))}
          {/* Products Dropdown */}
          <li 
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button 
              className="flex items-center gap-1 text-primary-900 font-medium hover:text-primary-700 transition-colors px-2 py-1 rounded focus:outline focus:ring-2 focus:ring-primary-700"
              onClick={() => setProductsOpen(!productsOpen)}
            >
              Products
              <ChevronDown size={16} className={`transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
            </button>
            {/* Dropdown Menu */}
            {productsOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-neutral-300 py-2 z-50">
                <Link 
                  href="/products" 
                  className="block px-4 py-2 text-primary-900 hover:bg-primary-500/10 transition-colors border-b border-neutral-300 font-medium"
                >
                  All Products
                </Link>
                {productDropdownItems.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href} 
                    className="block px-4 py-3 hover:bg-primary-500/10 transition-colors"
                  >
                    <span className="block text-primary-900 font-medium">{item.name}</span>
                    <span className="block text-sm text-primary-700/70">{item.description}</span>
                  </Link>
                ))}
              </div>
            )}
          </li>
          {navLinks.slice(2).map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="text-primary-900 font-medium hover:text-primary-700 transition-colors px-2 py-1 rounded focus:outline focus:ring-2 focus:ring-primary-700">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* CTA */}
        <Link href="/dashboard" className="hidden md:inline-block bg-accent-yellow text-primary-900 font-semibold px-5 py-2 rounded-full shadow hover:bg-primary-500 hover:text-white transition-colors flex-shrink-0 focus:outline focus:ring-2 focus:ring-accent-yellow">
          Dashboard Access
        </Link>
        {/* Mobile Hamburger */}
        <button className="md:hidden p-2 rounded focus:outline focus:ring-2 focus:ring-primary-700" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <Menu size={28} />
        </button>
        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)}>
            <div className="absolute top-0 right-0 w-64 h-full bg-beige shadow-lg p-6 flex flex-col gap-6" onClick={e => e.stopPropagation()}>
              <button className="self-end mb-2 p-1 rounded focus:outline focus:ring-2 focus:ring-primary-700" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <X size={28} />
              </button>
              <ul className="flex flex-col gap-4 mt-4" aria-label="Mobile navigation">
                {navLinks.slice(0, 2).map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="block text-lg text-primary-900 font-medium hover:text-primary-700 px-2 py-1 rounded focus:outline focus:ring-2 focus:ring-primary-700" onClick={() => setMobileOpen(false)}>
                      {link.name}
                    </Link>
                  </li>
                ))}
                {/* Mobile Products Accordion */}
                <li>
                  <button 
                    className="flex items-center justify-between w-full text-lg text-primary-900 font-medium hover:text-primary-700 px-2 py-1 rounded focus:outline focus:ring-2 focus:ring-primary-700"
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  >
                    Products
                    <ChevronDown size={18} className={`transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileProductsOpen && (
                    <ul className="ml-4 mt-2 space-y-2">
                      <li>
                        <Link href="/products" className="block text-primary-900 hover:text-primary-700 px-2 py-1" onClick={() => setMobileOpen(false)}>
                          All Products
                        </Link>
                      </li>
                      {productDropdownItems.map((item) => (
                        <li key={item.name}>
                          <Link href={item.href} className="block text-primary-900 hover:text-primary-700 px-2 py-1" onClick={() => setMobileOpen(false)}>
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                {navLinks.slice(2).map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="block text-lg text-primary-900 font-medium hover:text-primary-700 px-2 py-1 rounded focus:outline focus:ring-2 focus:ring-primary-700" onClick={() => setMobileOpen(false)}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="mt-8 bg-accent-yellow text-primary-900 font-semibold px-5 py-2 rounded-full shadow hover:bg-primary-500 hover:text-white transition-colors focus:outline focus:ring-2 focus:ring-accent-yellow text-center">
                Dashboard Access
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}