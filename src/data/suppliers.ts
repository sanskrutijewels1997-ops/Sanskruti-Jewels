import { IMG } from './images';
import type { Supplier } from '../types';

export const suppliers: Supplier[] = [
{
  id: 'SUP-01',
  name: 'Rajmandir Jewels',
  city: 'Jaipur',
  state: 'Rajasthan',
  logo: 'RJ',
  verified: true,
  designs: 1842,
  categories: ['Bridal', 'Necklace', 'Temple'],
  rating: 4.8,
  since: 1994,
  responseTime: 'Under 4 hours',
  about:
  'Three generations of Jaipur craftsmanship specialising in kundan, polki and temple bridal sets. In-house karigar studio of 120 artisans with BIS hallmarked production.',
  cover: IMG.editorialBridal
},
{
  id: 'SUP-02',
  name: 'Shree Ganesh Gold',
  city: 'Rajkot',
  state: 'Gujarat',
  logo: 'SG',
  verified: true,
  designs: 2610,
  categories: ['Chain', 'Bangle', 'Lightweight'],
  rating: 4.6,
  since: 2001,
  responseTime: 'Under 2 hours',
  about:
  'High volume machine-made chain and bangle manufacturer serving 900+ retail counters across western India. Ready stock across 22K and 18K.',
  cover: IMG.editorialEveryday
},
{
  id: 'SUP-03',
  name: 'Aurum Diamonds',
  city: 'Surat',
  state: 'Gujarat',
  logo: 'AD',
  verified: true,
  designs: 1394,
  categories: ['Diamond', 'Ring', 'Pendant'],
  rating: 4.9,
  since: 2009,
  responseTime: 'Under 1 hour',
  about:
  'IGI certified natural diamond jewellery manufacturer. Specialists in solitaire mounts, everyday diamond and light-weight studded lines.',
  cover: IMG.editorialModern
},
{
  id: 'SUP-04',
  name: 'Meenakshi Creations',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  logo: 'MC',
  verified: true,
  designs: 987,
  categories: ['Temple', 'Necklace', 'Earrings'],
  rating: 4.7,
  since: 1987,
  responseTime: 'Under 6 hours',
  about:
  'South Indian temple jewellery house known for nagas work, antique finish and traditional bridal haaram sets in 22K.',
  cover: IMG.temple
},
{
  id: 'SUP-05',
  name: 'Kalash Ornaments',
  city: 'Kolkata',
  state: 'West Bengal',
  logo: 'KO',
  verified: true,
  designs: 1533,
  categories: ['Lightweight', 'Bangle', 'Mangalsutra'],
  rating: 4.5,
  since: 2004,
  responseTime: 'Under 5 hours',
  about:
  'Bengali filigree and hollow-form lightweight gold specialists. Strong daily-wear catalogue with 3–8 gram design range.',
  cover: IMG.lightweight
},
{
  id: 'SUP-06',
  name: 'Veer Jewellers',
  city: 'Mumbai',
  state: 'Maharashtra',
  logo: 'VJ',
  verified: true,
  designs: 726,
  categories: ["Men's", 'Chain', 'Bracelet'],
  rating: 4.4,
  since: 2012,
  responseTime: 'Under 3 hours',
  about:
  "India's fastest growing men's jewellery label — kadas, cuban chains, signet rings and rudraksha-gold fusion lines.",
  cover: IMG.mens
},
{
  id: 'SUP-07',
  name: 'Anantara Fine Jewels',
  city: 'Hyderabad',
  state: 'Telangana',
  logo: 'AF',
  verified: true,
  designs: 1105,
  categories: ['Bridal', 'Diamond', 'Jewellery Set'],
  rating: 4.8,
  since: 1998,
  responseTime: 'Under 4 hours',
  about:
  'Nizami-inspired uncut diamond and emerald bridal jewellery, made-to-order for premium retail counters.',
  cover: IMG.editorialStatement
},
{
  id: 'SUP-08',
  name: 'Nakshatra Gold Works',
  city: 'Bengaluru',
  state: 'Karnataka',
  logo: 'NG',
  verified: false,
  designs: 418,
  categories: ['Ring', 'Pendant', 'Minimal'],
  rating: 4.2,
  since: 2018,
  responseTime: 'Under 12 hours',
  about:
  'Contemporary minimal studio producing sculptural rings and pendants for modern urban retail formats.',
  cover: IMG.editorialModern
}];


export const supplierById = (id: string) => suppliers.find((s) => s.id === id);