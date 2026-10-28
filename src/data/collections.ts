import type { CustomerCollection, Order, QuoteRequest } from '../types';

export const initialCollections: CustomerCollection[] = [
{
  id: 'COL-01',
  name: "Priya's Wedding Collection",
  customer: 'Priya Deshmukh',
  occasion: 'Wedding — Nov 2026',
  productIds: ['KYJ-102847', 'KYJ-102853', 'KYJ-103063', 'KYJ-103117', 'KYJ-102994'],
  note: 'Budget band 8–12L. Prefers polki over meena. Mother wants a long haar included.',
  updated: '2 hours ago',
  preference: 'Loved the antique choker'
},
{
  id: 'COL-02',
  name: 'Mrs. Shah Anniversary',
  customer: 'Reema Shah',
  occasion: '25th Anniversary',
  productIds: ['KYJ-102979', 'KYJ-102986', 'KYJ-102903'],
  note: 'Only diamond. Wants rose gold tones. Delivery before 14 Sep.',
  updated: 'Yesterday',
  preference: 'Shortlisted two'
},
{
  id: 'COL-03',
  name: 'Daily Wear Options',
  customer: 'Walk-in shortlist',
  occasion: 'Counter display',
  productIds: ['KYJ-103002', 'KYJ-102938', 'KYJ-103038', 'KYJ-102957', 'KYJ-103139', 'KYJ-103108'],
  note: 'Sub-6 gram pieces to keep on the front counter this quarter.',
  updated: '3 days ago',
  preference: 'Pending review'
},
{
  id: 'COL-04',
  name: 'Premium Bridal Customer',
  customer: 'Anaya Kapoor',
  occasion: 'Engagement + Wedding',
  productIds: ['KYJ-103044', 'KYJ-103203', 'KYJ-102884'],
  note: 'Emerald preference confirmed. Needs matching earrings quoted separately.',
  updated: '5 days ago',
  preference: 'Awaiting customer visit'
}];


export const initialQuotes: QuoteRequest[] = [
{
  id: 'QR-4821',
  productId: 'KYJ-102847',
  supplierId: 'SUP-01',
  quantity: 1,
  size: '16 inch',
  deliveryDate: '2026-09-18',
  notes: 'Need matching jhumkas quoted alongside.',
  status: 'Supplier Responded',
  raised: '22 Aug 2026'
},
{
  id: 'QR-4817',
  productId: 'KYJ-102884',
  supplierId: 'SUP-03',
  quantity: 2,
  size: 'US 7',
  deliveryDate: '2026-09-05',
  notes: 'Lab grown option also required for comparison.',
  status: 'Negotiation',
  raised: '21 Aug 2026'
},
{
  id: 'QR-4809',
  productId: 'KYJ-103015',
  supplierId: 'SUP-06',
  quantity: 6,
  size: '22 inch',
  deliveryDate: '2026-09-01',
  notes: 'Repeat order, same specs as last cycle.',
  status: 'Confirmed',
  raised: '19 Aug 2026'
},
{
  id: 'QR-4796',
  productId: 'KYJ-103002',
  supplierId: 'SUP-03',
  quantity: 12,
  size: '4 mm',
  deliveryDate: '2026-08-30',
  notes: 'Assorted tray packing.',
  status: 'Sent',
  raised: '18 Aug 2026'
},
{
  id: 'QR-4780',
  productId: 'KYJ-103147',
  supplierId: 'SUP-04',
  quantity: 1,
  size: '17 inch',
  deliveryDate: '2026-10-12',
  notes: 'Customer dropped the enquiry.',
  status: 'Cancelled',
  raised: '14 Aug 2026'
}];


export const orders: Order[] = [
{
  id: 'ORD-90214',
  productId: 'KYJ-102853',
  supplierId: 'SUP-07',
  quantity: 1,
  status: 'In Production',
  placed: '09 Aug 2026',
  eta: '12 Sep 2026',
  value: '₹ 14,80,000',
  stageIndex: 3
},
{
  id: 'ORD-90208',
  productId: 'KYJ-103015',
  supplierId: 'SUP-06',
  quantity: 6,
  status: 'Shipped',
  placed: '02 Aug 2026',
  eta: '25 Aug 2026',
  value: '₹ 9,42,000',
  stageIndex: 6
},
{
  id: 'ORD-90197',
  productId: 'KYJ-103002',
  supplierId: 'SUP-03',
  quantity: 12,
  status: 'Delivered',
  placed: '18 Jul 2026',
  eta: '05 Aug 2026',
  value: '₹ 2,16,000',
  stageIndex: 7
},
{
  id: 'ORD-90223',
  productId: 'KYJ-102847',
  supplierId: 'SUP-01',
  quantity: 1,
  status: 'Quote Pending',
  placed: '22 Aug 2026',
  eta: 'Awaiting supplier',
  value: 'To be quoted',
  stageIndex: 0
},
{
  id: 'ORD-90219',
  productId: 'KYJ-102890',
  supplierId: 'SUP-02',
  quantity: 4,
  status: 'Confirmed',
  placed: '16 Aug 2026',
  eta: '20 Sep 2026',
  value: '₹ 21,05,000',
  stageIndex: 2
},
{
  id: 'ORD-90211',
  productId: 'KYJ-102979',
  supplierId: 'SUP-03',
  quantity: 2,
  status: 'Ready',
  placed: '05 Aug 2026',
  eta: '28 Aug 2026',
  value: '₹ 6,74,000',
  stageIndex: 5
}];


export const orderStages = [
'Quote Requested',
'Supplier Confirmed',
'Order Confirmed',
'In Production',
'Quality Check',
'Ready to Ship',
'Shipped',
'Delivered'];