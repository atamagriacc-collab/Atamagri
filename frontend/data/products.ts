import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    title: 'Atama Sense',
    short: 'Farm Dashboard',
    slug: 'atama-sense',
    description: 'Monitor your farm in real-time with AI-powered insights and analytics.',
    images: ['/images/product-laptop.png'],
    features: [
      'Hyperlocal data 24/7',
      'Lifetime access',
      'Real-time monitoring',
      'AI recommendations',
    ],
    recommendedFor: ['Farmers', 'Agronomists'],
  },
  {
    id: '2',
    title: 'Atama Climate',
    short: 'Weather Station',
    slug: 'atama-climate',
    description: 'Track weather and climate conditions with robust IoT sensors.',
    images: ['/images/product-sensor.png'],
    features: [
      'Weather sensors',
      'Long battery life',
      'Wireless connectivity',
      'Easy mounting',
    ],
    recommendedFor: ['Large Farms', 'Research'],
  },
  {
    id: '3',
    title: 'Atama Vis',
    short: 'Drone System',
    slug: 'atama-vis',
    description: 'Aerial crop monitoring and disease detection with smart drones.',
    images: ['/images/product-drone.png'],
    features: [
      'Aerial imagery',
      'Disease detection',
      'Automated missions',
      'High accuracy',
    ],
    recommendedFor: ['AgriTech', 'Cooperatives'],
  },
];
