export interface Product {
  id: string;
  title: string;
  short: string;
  slug: string;
  description: string;
  price?: number;
  images: string[];
  features: string[];
  recommendedFor?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  text: string;
  avatar?: string;
  rating?: number;
}

export interface Station {
  id: string;
  name: string;
  city?: string;
  temp?: number | null;
  humidity?: number | null;
  lastSeen?: string;
  status: 'active' | 'inactive';
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}
