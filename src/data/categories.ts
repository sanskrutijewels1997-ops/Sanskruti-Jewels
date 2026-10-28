import { IMG } from './images';
import type { Category } from '../types';

export const categories: Category[] = [
{ slug: 'necklaces', name: 'Necklaces', designs: 2148, image: IMG.goldNecklace },
{ slug: 'earrings', name: 'Earrings', designs: 1876, image: IMG.jhumka },
{ slug: 'rings', name: 'Rings', designs: 1642, image: IMG.goldRing },
{ slug: 'bangles', name: 'Bangles', designs: 1309, image: IMG.bangles },
{ slug: 'bracelets', name: 'Bracelets', designs: 964, image: IMG.bracelet },
{ slug: 'chains', name: 'Chains', designs: 812, image: IMG.chain },
{ slug: 'pendants', name: 'Pendants', designs: 1104, image: IMG.pendant },
{ slug: 'mangalsutras', name: 'Mangalsutras', designs: 736, image: IMG.mangalsutra },
{ slug: 'bridal', name: 'Bridal Jewellery', designs: 1523, image: IMG.bridalSet },
{ slug: 'mens', name: "Men's Jewellery", designs: 588, image: IMG.mens },
{ slug: 'lightweight', name: 'Lightweight Jewellery', designs: 1471, image: IMG.lightweight },
{ slug: 'diamond', name: 'Diamond Jewellery', designs: 1209, image: IMG.diamondRing }];


export const filterCategories = [
'Necklace',
'Earrings',
'Ring',
'Bangle',
'Bracelet',
'Chain',
'Pendant',
'Mangalsutra',
'Jewellery Set',
'Bridal',
"Men's",
'Kids'];


export const materials = ['Gold', 'Diamond', 'Platinum', 'Silver'];
export const purities = ['14K', '18K', '22K', '24K'];
export const styles = [
'Traditional',
'Modern',
'Bridal',
'Antique',
'Temple',
'Lightweight',
'Daily Wear',
'Minimal'];

export const availabilities = ['Ready Stock', 'Made to Order'];