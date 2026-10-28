// Seed catalogue used by demo mode and by `npm run seed:sql` (supabase/seed.sql).
// Image paths point at files bundled in /public so they work on web and in Capacitor.

export interface SeedCategory { slug: string; name: string; image: string; }
export interface SeedCollection { slug: string; name: string; tagline: string; image: string; }
export interface SeedProduct {
  sku: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  collection: string;
  style: string;
  metal: string;
  purity: string;
  weightMin: number;
  weightMax: number;
  stone: string;
  size: string;
  availability: 'Ready Stock' | 'Made to Order';
  price: number | null;
  showPrice: boolean;
  specifications: { label: string; value: string }[];
  isNew: boolean;
  isFeatured: boolean;
  views: number;
  images: string[];
  /** Used to spread created_at so "Newest" sorting is stable. */
  ageDays: number;
}

export const seedCategories: SeedCategory[] = [
  {
    "slug": "necklaces",
    "name": "Necklaces",
    "image": "/images/gold-necklace.jpg"
  },
  {
    "slug": "earrings",
    "name": "Earrings",
    "image": "/images/jhumka.jpg"
  },
  {
    "slug": "rings",
    "name": "Rings",
    "image": "/images/gold-ring.jpg"
  },
  {
    "slug": "bangles",
    "name": "Bangles",
    "image": "/images/bangles.jpg"
  },
  {
    "slug": "bracelets",
    "name": "Bracelets",
    "image": "/images/bracelet.jpg"
  },
  {
    "slug": "chains",
    "name": "Chains",
    "image": "/images/chain.jpg"
  },
  {
    "slug": "pendants",
    "name": "Pendants",
    "image": "/images/pendant.jpg"
  },
  {
    "slug": "mangalsutras",
    "name": "Mangalsutras",
    "image": "/images/mangalsutra.jpg"
  },
  {
    "slug": "jewellery-sets",
    "name": "Jewellery Sets",
    "image": "/images/bridal-set.jpg"
  },
  {
    "slug": "bridal",
    "name": "Bridal",
    "image": "/images/editorial-bridal.jpg"
  },
  {
    "slug": "mens",
    "name": "Men's Jewellery",
    "image": "/images/mens.jpg"
  },
  {
    "slug": "kids",
    "name": "Kids",
    "image": "/images/lightweight.jpg"
  }
];

export const seedCollections: SeedCollection[] = [
  {
    "slug": "bridal",
    "name": "Bridal Collection",
    "tagline": "Ceremonial polki, kundan and temple sets for the big day.",
    "image": "/images/editorial-bridal.jpg"
  },
  {
    "slug": "everyday",
    "name": "Everyday Elegance",
    "tagline": "Light, wearable pieces made for every day.",
    "image": "/images/editorial-everyday.jpg"
  },
  {
    "slug": "traditional",
    "name": "Traditional Gold",
    "tagline": "Nakshi, antique and temple work rooted in heritage craft.",
    "image": "/images/temple.jpg"
  },
  {
    "slug": "modern",
    "name": "Modern Minimal",
    "tagline": "Sculptural, featherlight designs with a contemporary edge.",
    "image": "/images/editorial-modern.jpg"
  },
  {
    "slug": "statement",
    "name": "Statement Jewellery",
    "tagline": "Showstopping pieces that turn every head in the room.",
    "image": "/images/editorial-statement.jpg"
  },
  {
    "slug": "mens",
    "name": "Men's Collection",
    "tagline": "Kadas, cuban links and signets crafted for him.",
    "image": "/images/mens.jpg"
  }
];

export const seedProducts: SeedProduct[] = [
  {
    "sku": "SJ-102847",
    "slug": "rajwadi-antique-bridal-choker-2847",
    "name": "Rajwadi Antique Bridal Choker",
    "description": "A ceremonial choker built on hand-drawn gold wire filigree with kundan setting across the central motif. Finished in matte antique with hanging pearl drops.",
    "category": "necklaces",
    "collection": "bridal",
    "style": "Bridal",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 62,
    "weightMax": 74,
    "stone": "Kundan polki with ruby & emerald accents",
    "size": "16 inch adjustable",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "Antique matte"
      }
    ],
    "isNew": true,
    "isFeatured": true,
    "views": 8420,
    "images": [
      "/images/gold-necklace.jpg",
      "/images/bridal-set.jpg",
      "/images/temple.jpg",
      "/images/editorial-bridal.jpg"
    ],
    "ageDays": 0
  },
  {
    "sku": "SJ-102853",
    "slug": "kundan-grand-bridal-set-2853",
    "name": "Kundan Grand Bridal Set",
    "description": "Complete bridal ensemble with choker, long haar, jhumkas and maang tikka. Nizami-inspired layout with graduated polki plates.",
    "category": "jewellery-sets",
    "collection": "bridal",
    "style": "Bridal",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 88,
    "weightMax": 104,
    "stone": "Uncut polki, ruby, emerald, south sea pearl",
    "size": "Necklace 15in, earrings 5.2cm, tikka included",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "Antique matte"
      }
    ],
    "isNew": true,
    "isFeatured": true,
    "views": 11240,
    "images": [
      "/images/bridal-set.jpg",
      "/images/gold-necklace.jpg",
      "/images/jhumka.jpg",
      "/images/editorial-bridal.jpg"
    ],
    "ageDays": 1
  },
  {
    "sku": "SJ-102861",
    "slug": "pearl-drop-temple-jhumkas-2861",
    "name": "Pearl Drop Temple Jhumkas",
    "description": "Classic dome jhumka with nakshi rim, laxmi motif top and a full row of pearl drops. Screw-back closure for daily comfort.",
    "category": "earrings",
    "collection": "traditional",
    "style": "Temple",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 14,
    "weightMax": 18,
    "stone": "Fresh water pearl drops",
    "size": "5.4 cm drop",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "Antique matte"
      }
    ],
    "isNew": true,
    "isFeatured": true,
    "views": 6310,
    "images": [
      "/images/jhumka.jpg",
      "/images/temple.jpg",
      "/images/bridal-set.jpg",
      "/images/gold-necklace.jpg"
    ],
    "ageDays": 2
  },
  {
    "sku": "SJ-102872",
    "slug": "engraved-band-signet-ring-2872",
    "name": "Engraved Band Signet Ring",
    "description": "Sculptural band with hand-engraved chevron detailing and a high-polish inner shank. Sits flush with stacking rings.",
    "category": "rings",
    "collection": "modern",
    "style": "Modern",
    "metal": "Gold",
    "purity": "18K",
    "weightMin": 4,
    "weightMax": 6,
    "stone": "None",
    "size": "US 5 – 14",
    "availability": "Ready Stock",
    "price": 41200,
    "showPrice": true,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": false,
    "isFeatured": false,
    "views": 3980,
    "images": [
      "/images/gold-ring.jpg",
      "/images/diamond-ring.jpg",
      "/images/pendant.jpg",
      "/images/bracelet.jpg"
    ],
    "ageDays": 3
  },
  {
    "sku": "SJ-102884",
    "slug": "solitaire-halo-engagement-ring-2884",
    "name": "Solitaire Halo Engagement Ring",
    "description": "Four-prong solitaire mount with a micro-pave halo and split shank. Available with lab-grown or natural centre stones.",
    "category": "rings",
    "collection": "modern",
    "style": "Modern",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 3,
    "weightMax": 5,
    "stone": "0.70 ct centre, 0.34 ct pave (IGI certified)",
    "size": "US 5 – 12",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Diamond certification",
        "value": "IGI certified"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": true,
    "views": 14210,
    "images": [
      "/images/diamond-ring.jpg",
      "/images/diamond-earrings.jpg",
      "/images/gold-ring.jpg",
      "/images/pendant.jpg"
    ],
    "ageDays": 4
  },
  {
    "sku": "SJ-102890",
    "slug": "nakshi-carved-bangle-set-of-6-2890",
    "name": "Nakshi Carved Bangle Set of 6",
    "description": "Six-piece bangle stack with alternating floral and paisley carving. Antique matte finish with selective stone setting.",
    "category": "bangles",
    "collection": "traditional",
    "style": "Traditional",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 46,
    "weightMax": 58,
    "stone": "Ruby & emerald cabochon accents",
    "size": "2.4 / 2.6 / 2.8",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": false,
    "isFeatured": true,
    "views": 7420,
    "images": [
      "/images/bangles.jpg",
      "/images/diamond-bangle.jpg",
      "/images/gold-necklace.jpg",
      "/images/temple.jpg"
    ],
    "ageDays": 5
  },
  {
    "sku": "SJ-102903",
    "slug": "diamond-line-tennis-bracelet-2903",
    "name": "Diamond Line Tennis Bracelet",
    "description": "Slim four-prong tennis line with box clasp and safety latch. A timeless gift that goes with everything.",
    "category": "bracelets",
    "collection": "everyday",
    "style": "Daily Wear",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 8,
    "weightMax": 11,
    "stone": "1.10 ct total, SI-GH",
    "size": "6.5 / 7 inch",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Diamond certification",
        "value": "IGI certified"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": false,
    "views": 5890,
    "images": [
      "/images/bracelet.jpg",
      "/images/diamond-bangle.jpg",
      "/images/diamond-earrings.jpg",
      "/images/chain.jpg"
    ],
    "ageDays": 6
  },
  {
    "sku": "SJ-102911",
    "slug": "classic-rope-chain-20-inch-2911",
    "name": "Classic Rope Chain 20 inch",
    "description": "Machine-made hollow rope chain with a laser-soldered lobster clasp. Consistent gauge across the full length run.",
    "category": "chains",
    "collection": "everyday",
    "style": "Daily Wear",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 9,
    "weightMax": 12,
    "stone": "None",
    "size": "18 / 20 / 22 inch",
    "availability": "Ready Stock",
    "price": 84900,
    "showPrice": true,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": false,
    "isFeatured": true,
    "views": 9320,
    "images": [
      "/images/chain.jpg",
      "/images/pendant.jpg",
      "/images/mens.jpg",
      "/images/bracelet.jpg"
    ],
    "ageDays": 7
  },
  {
    "sku": "SJ-102925",
    "slug": "teardrop-diamond-pendant-2925",
    "name": "Teardrop Diamond Pendant",
    "description": "A single pear-cut stone in a bezel-and-prong hybrid setting. Supplied with or without an 18 inch cable chain.",
    "category": "pendants",
    "collection": "everyday",
    "style": "Minimal",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 2,
    "weightMax": 4,
    "stone": "0.25 ct pear cut",
    "size": "1.8 cm with bail",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Diamond certification",
        "value": "IGI certified"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": false,
    "views": 4780,
    "images": [
      "/images/pendant.jpg",
      "/images/diamond-earrings.jpg",
      "/images/diamond-ring.jpg",
      "/images/lightweight.jpg"
    ],
    "ageDays": 8
  },
  {
    "sku": "SJ-102938",
    "slug": "contemporary-diamond-mangalsutra-2938",
    "name": "Contemporary Diamond Mangalsutra",
    "description": "Double-line black bead mangalsutra with a compact diamond floral pendant designed for daily office wear.",
    "category": "mangalsutras",
    "collection": "everyday",
    "style": "Modern",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 6,
    "weightMax": 9,
    "stone": "0.18 ct round brilliant cluster",
    "size": "24 inch",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Diamond certification",
        "value": "IGI certified"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": true,
    "views": 8140,
    "images": [
      "/images/mangalsutra.jpg",
      "/images/pendant.jpg",
      "/images/chain.jpg",
      "/images/lightweight.jpg"
    ],
    "ageDays": 9
  },
  {
    "sku": "SJ-102944",
    "slug": "mens-textured-gold-kada-2944",
    "name": "Men's Textured Gold Kada",
    "description": "Hinged kada with hand-chiselled chevron texture and a concealed push clasp. Heavy gauge, hollow core construction.",
    "category": "mens",
    "collection": "mens",
    "style": "Modern",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 34,
    "weightMax": 42,
    "stone": "None",
    "size": "2.6 / 2.8 inch",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": false,
    "isFeatured": true,
    "views": 6220,
    "images": [
      "/images/mens.jpg",
      "/images/bracelet.jpg",
      "/images/chain.jpg",
      "/images/gold-ring.jpg"
    ],
    "ageDays": 10
  },
  {
    "sku": "SJ-102957",
    "slug": "featherlight-geometric-necklace-2957",
    "name": "Featherlight Geometric Necklace",
    "description": "Hollow-form gold necklace under 5 grams with a small geometric charm. Light enough for every day.",
    "category": "necklaces",
    "collection": "modern",
    "style": "Lightweight",
    "metal": "Gold",
    "purity": "18K",
    "weightMin": 3,
    "weightMax": 5,
    "stone": "None",
    "size": "16 inch + 2 inch extender",
    "availability": "Ready Stock",
    "price": 38500,
    "showPrice": true,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": true,
    "views": 5210,
    "images": [
      "/images/lightweight.jpg",
      "/images/pendant.jpg",
      "/images/chain.jpg",
      "/images/editorial-everyday.jpg"
    ],
    "ageDays": 11
  },
  {
    "sku": "SJ-102968",
    "slug": "lakshmi-temple-haaram-2968",
    "name": "Lakshmi Temple Haaram",
    "description": "Long temple haaram with repeating Lakshmi and peacock plates, hand-set with cabochon rubies through the frame.",
    "category": "necklaces",
    "collection": "traditional",
    "style": "Temple",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 96,
    "weightMax": 118,
    "stone": "Burmese ruby, uncut emerald",
    "size": "28 inch long haaram",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "Antique matte"
      }
    ],
    "isNew": false,
    "isFeatured": true,
    "views": 7930,
    "images": [
      "/images/temple.jpg",
      "/images/gold-necklace.jpg",
      "/images/bridal-set.jpg",
      "/images/jhumka.jpg"
    ],
    "ageDays": 12
  },
  {
    "sku": "SJ-102979",
    "slug": "diamond-drop-cocktail-earrings-2979",
    "name": "Diamond Drop Cocktail Earrings",
    "description": "Detachable stud-and-drop construction giving you two looks from one pair.",
    "category": "earrings",
    "collection": "statement",
    "style": "Modern",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 7,
    "weightMax": 10,
    "stone": "1.42 ct total, VS-GH",
    "size": "3.2 cm drop",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Diamond certification",
        "value": "IGI certified"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": true,
    "views": 6650,
    "images": [
      "/images/diamond-earrings.jpg",
      "/images/diamond-ring.jpg",
      "/images/pendant.jpg",
      "/images/editorial-statement.jpg"
    ],
    "ageDays": 13
  },
  {
    "sku": "SJ-102986",
    "slug": "rose-gold-diamond-bangle-2986",
    "name": "Rose Gold Diamond Bangle",
    "description": "Openable rose gold bangle with a continuous pave face and matte side walls for contrast.",
    "category": "bangles",
    "collection": "everyday",
    "style": "Modern",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 16,
    "weightMax": 21,
    "stone": "0.86 ct pave",
    "size": "2.4 / 2.6",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Diamond certification",
        "value": "IGI certified"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": false,
    "isFeatured": false,
    "views": 5410,
    "images": [
      "/images/diamond-bangle.jpg",
      "/images/bangles.jpg",
      "/images/bracelet.jpg",
      "/images/diamond-earrings.jpg"
    ],
    "ageDays": 14
  },
  {
    "sku": "SJ-102994",
    "slug": "filigree-bridal-long-necklace-2994",
    "name": "Filigree Bridal Long Necklace",
    "description": "Jaipur filigree work across a graduated collar with a detachable central pendant that can be worn separately.",
    "category": "bridal",
    "collection": "bridal",
    "style": "Bridal",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 71,
    "weightMax": 84,
    "stone": "Kundan with pearl fringe",
    "size": "18 inch",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "Antique matte"
      }
    ],
    "isNew": false,
    "isFeatured": true,
    "views": 9010,
    "images": [
      "/images/gold-necklace.jpg",
      "/images/editorial-bridal.jpg",
      "/images/bridal-set.jpg",
      "/images/temple.jpg"
    ],
    "ageDays": 15
  },
  {
    "sku": "SJ-103002",
    "slug": "everyday-diamond-studs-3002",
    "name": "Everyday Diamond Studs",
    "description": "Classic four-prong diamond studs with secure screw backs. An everyday essential.",
    "category": "earrings",
    "collection": "everyday",
    "style": "Daily Wear",
    "metal": "Diamond",
    "purity": "14K",
    "weightMin": 1,
    "weightMax": 3,
    "stone": "0.20 ct pair",
    "size": "4 mm",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Diamond certification",
        "value": "IGI certified"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": false,
    "isFeatured": true,
    "views": 12100,
    "images": [
      "/images/diamond-earrings.jpg",
      "/images/pendant.jpg",
      "/images/diamond-ring.jpg",
      "/images/lightweight.jpg"
    ],
    "ageDays": 16
  },
  {
    "sku": "SJ-103015",
    "slug": "cuban-link-chain-22-inch-3015",
    "name": "Cuban Link Chain 22 inch",
    "description": "Heavy solid cuban link with a diamond-cut face and box-tongue clasp. The strongest performer in the men’s catalogue.",
    "category": "chains",
    "collection": "mens",
    "style": "Modern",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 28,
    "weightMax": 36,
    "stone": "None",
    "size": "20 / 22 / 24 inch",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": true,
    "views": 8830,
    "images": [
      "/images/mens.jpg",
      "/images/chain.jpg",
      "/images/bracelet.jpg",
      "/images/gold-ring.jpg"
    ],
    "ageDays": 17
  },
  {
    "sku": "SJ-103021",
    "slug": "antique-peacock-pendant-3021",
    "name": "Antique Peacock Pendant",
    "description": "Antique-finish peacock motif pendant with fine nakshi border and a single pearl drop at the base.",
    "category": "pendants",
    "collection": "traditional",
    "style": "Antique",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 11,
    "weightMax": 15,
    "stone": "Ruby, emerald, pearl drop",
    "size": "3.6 cm",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "Antique matte"
      }
    ],
    "isNew": false,
    "isFeatured": false,
    "views": 4320,
    "images": [
      "/images/pendant.jpg",
      "/images/temple.jpg",
      "/images/gold-necklace.jpg",
      "/images/jhumka.jpg"
    ],
    "ageDays": 18
  },
  {
    "sku": "SJ-103038",
    "slug": "slim-beaded-mangalsutra-3038",
    "name": "Slim Beaded Mangalsutra",
    "description": "Single-line lightweight mangalsutra with an understated gold vati. Designed for the sub-5 gram price band.",
    "category": "mangalsutras",
    "collection": "everyday",
    "style": "Lightweight",
    "metal": "Gold",
    "purity": "18K",
    "weightMin": 4,
    "weightMax": 6,
    "stone": "Black beads",
    "size": "20 / 24 inch",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": false,
    "isFeatured": false,
    "views": 6710,
    "images": [
      "/images/mangalsutra.jpg",
      "/images/chain.jpg",
      "/images/lightweight.jpg",
      "/images/pendant.jpg"
    ],
    "ageDays": 19
  },
  {
    "sku": "SJ-103044",
    "slug": "statement-emerald-collar-3044",
    "name": "Statement Emerald Collar",
    "description": "A bold collar with graduated emerald cabochons framed in uncut diamond. Built for flagship display windows.",
    "category": "necklaces",
    "collection": "statement",
    "style": "Traditional",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 58,
    "weightMax": 70,
    "stone": "Zambian emerald, uncut diamond",
    "size": "14 inch collar",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": true,
    "views": 7220,
    "images": [
      "/images/editorial-statement.jpg",
      "/images/gold-necklace.jpg",
      "/images/bridal-set.jpg",
      "/images/temple.jpg"
    ],
    "ageDays": 20
  },
  {
    "sku": "SJ-103057",
    "slug": "twisted-gold-cuff-bracelet-3057",
    "name": "Twisted Gold Cuff Bracelet",
    "description": "Two-tone twisted cuff finished in alternating matte and mirror polish. Adjustable open-back form.",
    "category": "bracelets",
    "collection": "modern",
    "style": "Modern",
    "metal": "Gold",
    "purity": "18K",
    "weightMin": 12,
    "weightMax": 16,
    "stone": "None",
    "size": "Free size cuff",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": false,
    "isFeatured": false,
    "views": 3110,
    "images": [
      "/images/bracelet.jpg",
      "/images/bangles.jpg",
      "/images/mens.jpg",
      "/images/chain.jpg"
    ],
    "ageDays": 21
  },
  {
    "sku": "SJ-103063",
    "slug": "polki-bridal-jhumka-3063",
    "name": "Polki Bridal Jhumka",
    "description": "Oversized bridal jhumka with detachable ear-chain sahara and a triple row of pearl fringe.",
    "category": "earrings",
    "collection": "bridal",
    "style": "Bridal",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 22,
    "weightMax": 28,
    "stone": "Uncut polki, pearl",
    "size": "6.8 cm drop with sahara",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "Antique matte"
      }
    ],
    "isNew": true,
    "isFeatured": true,
    "views": 8410,
    "images": [
      "/images/jhumka.jpg",
      "/images/bridal-set.jpg",
      "/images/editorial-bridal.jpg",
      "/images/temple.jpg"
    ],
    "ageDays": 22
  },
  {
    "sku": "SJ-103071",
    "slug": "minimal-stacking-ring-trio-3071",
    "name": "Minimal Stacking Ring Trio",
    "description": "Three slim bands — plain, twisted and single-stone — sold as a coordinated stack or individually.",
    "category": "rings",
    "collection": "modern",
    "style": "Minimal",
    "metal": "Gold",
    "purity": "14K",
    "weightMin": 2,
    "weightMax": 4,
    "stone": "Single 0.05 ct accent",
    "size": "US 5 – 10",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": false,
    "views": 3620,
    "images": [
      "/images/gold-ring.jpg",
      "/images/diamond-ring.jpg",
      "/images/lightweight.jpg",
      "/images/pendant.jpg"
    ],
    "ageDays": 23
  },
  {
    "sku": "SJ-103085",
    "slug": "heritage-kada-pair-3085",
    "name": "Heritage Kada Pair",
    "description": "Broad temple-style kada pair with deep repoussé work and a screw-open hinge for easy wear.",
    "category": "bangles",
    "collection": "traditional",
    "style": "Antique",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 68,
    "weightMax": 82,
    "stone": "Ruby accents",
    "size": "2.6 / 2.8",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "Antique matte"
      }
    ],
    "isNew": false,
    "isFeatured": false,
    "views": 5010,
    "images": [
      "/images/bangles.jpg",
      "/images/temple.jpg",
      "/images/gold-necklace.jpg",
      "/images/diamond-bangle.jpg"
    ],
    "ageDays": 24
  },
  {
    "sku": "SJ-103096",
    "slug": "diamond-cluster-cocktail-ring-3096",
    "name": "Diamond Cluster Cocktail Ring",
    "description": "Flower cluster head with illusion setting that reads two sizes larger than its carat weight.",
    "category": "rings",
    "collection": "statement",
    "style": "Modern",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 5,
    "weightMax": 8,
    "stone": "0.94 ct cluster",
    "size": "US 6 – 13",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Diamond certification",
        "value": "IGI certified"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": false,
    "isFeatured": false,
    "views": 4460,
    "images": [
      "/images/diamond-ring.jpg",
      "/images/diamond-earrings.jpg",
      "/images/gold-ring.jpg",
      "/images/editorial-statement.jpg"
    ],
    "ageDays": 25
  },
  {
    "sku": "SJ-103108",
    "slug": "sleek-box-chain-18-inch-3108",
    "name": "Sleek Box Chain 18 inch",
    "description": "Fine box chain suitable for pendant pairing. Supplied in bulk packs with individual poly sleeves.",
    "category": "chains",
    "collection": "everyday",
    "style": "Minimal",
    "metal": "Gold",
    "purity": "18K",
    "weightMin": 4,
    "weightMax": 7,
    "stone": "None",
    "size": "16 / 18 / 20 inch",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": false,
    "isFeatured": false,
    "views": 7020,
    "images": [
      "/images/chain.jpg",
      "/images/lightweight.jpg",
      "/images/pendant.jpg",
      "/images/bracelet.jpg"
    ],
    "ageDays": 26
  },
  {
    "sku": "SJ-103117",
    "slug": "bridal-maang-tikka-set-3117",
    "name": "Bridal Maang Tikka & Set",
    "description": "Coordinated tikka, passa and choker trio finished to match a bride’s primary necklace order.",
    "category": "bridal",
    "collection": "bridal",
    "style": "Bridal",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 44,
    "weightMax": 55,
    "stone": "Polki, pearl, emerald bead",
    "size": "Coordinated three-piece",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "Antique matte"
      }
    ],
    "isNew": true,
    "isFeatured": true,
    "views": 6890,
    "images": [
      "/images/editorial-bridal.jpg",
      "/images/bridal-set.jpg",
      "/images/jhumka.jpg",
      "/images/gold-necklace.jpg"
    ],
    "ageDays": 27
  },
  {
    "sku": "SJ-103126",
    "slug": "mens-signet-gold-ring-3126",
    "name": "Men's Signet Gold Ring",
    "description": "Broad-face signet with a brushed top plate, available blank or with your own engraving.",
    "category": "mens",
    "collection": "mens",
    "style": "Modern",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 9,
    "weightMax": 13,
    "stone": "Optional black onyx",
    "size": "US 8 – 16",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": false,
    "isFeatured": false,
    "views": 4180,
    "images": [
      "/images/gold-ring.jpg",
      "/images/mens.jpg",
      "/images/chain.jpg",
      "/images/bracelet.jpg"
    ],
    "ageDays": 28
  },
  {
    "sku": "SJ-103139",
    "slug": "delicate-layering-necklace-3139",
    "name": "Delicate Layering Necklace",
    "description": "Ultra-fine layering chain designed to be sold in threes. A strong entry price-point for younger buyers.",
    "category": "necklaces",
    "collection": "modern",
    "style": "Minimal",
    "metal": "Gold",
    "purity": "14K",
    "weightMin": 2,
    "weightMax": 4,
    "stone": "None",
    "size": "14 / 16 / 18 inch",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": true,
    "views": 5540,
    "images": [
      "/images/editorial-everyday.jpg",
      "/images/lightweight.jpg",
      "/images/chain.jpg",
      "/images/pendant.jpg"
    ],
    "ageDays": 29
  },
  {
    "sku": "SJ-103147",
    "slug": "emerald-drop-temple-necklace-3147",
    "name": "Emerald Drop Temple Necklace",
    "description": "Temple plates strung with graduated emerald beads and finished with a hand-knotted silk cord back.",
    "category": "necklaces",
    "collection": "traditional",
    "style": "Temple",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 54,
    "weightMax": 66,
    "stone": "Emerald bead drops",
    "size": "17 inch",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "Antique matte"
      }
    ],
    "isNew": false,
    "isFeatured": false,
    "views": 4970,
    "images": [
      "/images/temple.jpg",
      "/images/editorial-statement.jpg",
      "/images/gold-necklace.jpg",
      "/images/bridal-set.jpg"
    ],
    "ageDays": 30
  },
  {
    "sku": "SJ-103155",
    "slug": "diamond-bezel-pendant-set-3155",
    "name": "Diamond Bezel Pendant Set",
    "description": "Bezel-set pendant with matching studs, packaged as a ready gifting set with certificate.",
    "category": "jewellery-sets",
    "collection": "everyday",
    "style": "Daily Wear",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 5,
    "weightMax": 8,
    "stone": "0.32 ct total",
    "size": "Pendant + studs + 18in chain",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Diamond certification",
        "value": "IGI certified"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": false,
    "views": 6120,
    "images": [
      "/images/pendant.jpg",
      "/images/diamond-earrings.jpg",
      "/images/chain.jpg",
      "/images/lightweight.jpg"
    ],
    "ageDays": 31
  },
  {
    "sku": "SJ-103168",
    "slug": "broad-gold-choker-necklace-3168",
    "name": "Broad Gold Choker Necklace",
    "description": "Wide gold choker with a dense floral field and hidden hook closure at the nape.",
    "category": "necklaces",
    "collection": "traditional",
    "style": "Traditional",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 78,
    "weightMax": 92,
    "stone": "Kundan",
    "size": "15 inch",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": false,
    "isFeatured": false,
    "views": 5860,
    "images": [
      "/images/gold-necklace.jpg",
      "/images/bangles.jpg",
      "/images/temple.jpg",
      "/images/bridal-set.jpg"
    ],
    "ageDays": 32
  },
  {
    "sku": "SJ-103174",
    "slug": "kids-adjustable-gold-bangles-3174",
    "name": "Kids Adjustable Gold Bangles",
    "description": "Adjustable-screw kids bangle pair with rounded edges and a soft matte finish.",
    "category": "kids",
    "collection": "everyday",
    "style": "Lightweight",
    "metal": "Gold",
    "purity": "18K",
    "weightMin": 3,
    "weightMax": 5,
    "stone": "None",
    "size": "1.8 / 2.0 adjustable",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": false,
    "isFeatured": false,
    "views": 2410,
    "images": [
      "/images/bangles.jpg",
      "/images/lightweight.jpg",
      "/images/bracelet.jpg",
      "/images/chain.jpg"
    ],
    "ageDays": 33
  },
  {
    "sku": "SJ-103186",
    "slug": "platinum-eternity-band-3186",
    "name": "Platinum Eternity Band",
    "description": "Channel-set platinum eternity band with a comfort-fit profile, produced to exact finger size.",
    "category": "rings",
    "collection": "modern",
    "style": "Minimal",
    "metal": "Platinum",
    "purity": "18K",
    "weightMin": 4,
    "weightMax": 6,
    "stone": "0.52 ct full eternity",
    "size": "US 5 – 12",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": false,
    "views": 3890,
    "images": [
      "/images/diamond-ring.jpg",
      "/images/gold-ring.jpg",
      "/images/diamond-earrings.jpg",
      "/images/pendant.jpg"
    ],
    "ageDays": 34
  },
  {
    "sku": "SJ-103195",
    "slug": "silver-oxidised-statement-cuff-3195",
    "name": "Silver Oxidised Statement Cuff",
    "description": "Oxidised 92.5 silver cuff with tribal-inspired chiselling for a bold, fashion-forward look.",
    "category": "bracelets",
    "collection": "statement",
    "style": "Antique",
    "metal": "Silver",
    "purity": "14K",
    "weightMin": 24,
    "weightMax": 32,
    "stone": "None",
    "size": "Free size",
    "availability": "Ready Stock",
    "price": 6400,
    "showPrice": true,
    "specifications": [
      {
        "label": "Finish",
        "value": "Antique matte"
      }
    ],
    "isNew": false,
    "isFeatured": false,
    "views": 2180,
    "images": [
      "/images/bracelet.jpg",
      "/images/bangles.jpg",
      "/images/editorial-statement.jpg",
      "/images/mens.jpg"
    ],
    "ageDays": 35
  },
  {
    "sku": "SJ-103203",
    "slug": "layered-pearl-gold-haar-3203",
    "name": "Layered Pearl & Gold Haar",
    "description": "Three-layer pearl haar with polki spacers and a detachable central plate.",
    "category": "necklaces",
    "collection": "bridal",
    "style": "Traditional",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 64,
    "weightMax": 76,
    "stone": "South sea pearl, polki",
    "size": "22 inch",
    "availability": "Made to Order",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": true,
    "views": 6440,
    "images": [
      "/images/bridal-set.jpg",
      "/images/gold-necklace.jpg",
      "/images/temple.jpg",
      "/images/editorial-bridal.jpg"
    ],
    "ageDays": 36
  },
  {
    "sku": "SJ-103217",
    "slug": "rudraksha-gold-fusion-bracelet-3217",
    "name": "Rudraksha Gold Fusion Bracelet",
    "description": "Alternating rudraksha and gold cap beads on a reinforced steel core with gold clasp.",
    "category": "mens",
    "collection": "mens",
    "style": "Traditional",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 14,
    "weightMax": 19,
    "stone": "Rudraksha beads",
    "size": "7.5 / 8 inch",
    "availability": "Ready Stock",
    "price": null,
    "showPrice": false,
    "specifications": [
      {
        "label": "Hallmark",
        "value": "BIS hallmarked (HUID)"
      },
      {
        "label": "Finish",
        "value": "High polish"
      }
    ],
    "isNew": true,
    "isFeatured": false,
    "views": 3760,
    "images": [
      "/images/mens.jpg",
      "/images/bracelet.jpg",
      "/images/gold-ring.jpg",
      "/images/chain.jpg"
    ],
    "ageDays": 37
  }
];
