// Seed catalogue used by demo mode and by `npm run seed:sql` (supabase/seed.sql).
// Image paths point at files bundled in /public so they work on web and in Capacitor.
// Weights, make and quantities are placeholder sample values.

export interface SeedCategory {
  slug: string;
  name: string;
  image: string | null;
  /** Slug of the parent category for sub-categories. */
  parent: string | null;
}
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
  make: string;
  grossWeight: number;
  stoneWeight: number;
  netWeight: number;
  quantity: number;
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
    "slug": "short-necklace",
    "name": "Short Necklace",
    "image": "/images/gold-necklace.jpg",
    "parent": null
  },
  {
    "slug": "long-necklace",
    "name": "Long Necklace",
    "image": "/images/editorial-bridal.jpg",
    "parent": null
  },
  {
    "slug": "pendant",
    "name": "Pendant",
    "image": "/images/pendant.jpg",
    "parent": null
  },
  {
    "slug": "rings",
    "name": "Rings",
    "image": "/images/gold-ring.jpg",
    "parent": null
  },
  {
    "slug": "gents-rings",
    "name": "Gents Rings",
    "image": null,
    "parent": "rings"
  },
  {
    "slug": "ladies-rings",
    "name": "Ladies Rings",
    "image": null,
    "parent": "rings"
  },
  {
    "slug": "kada",
    "name": "Kada",
    "image": null,
    "parent": "rings"
  },
  {
    "slug": "kan-chains",
    "name": "Kan Chains",
    "image": "/images/chain.jpg",
    "parent": null
  },
  {
    "slug": "earring",
    "name": "Earring",
    "image": "/images/diamond-earrings.jpg",
    "parent": null
  },
  {
    "slug": "tops",
    "name": "Tops",
    "image": "/images/diamond-earrings.jpg",
    "parent": null
  },
  {
    "slug": "karwari-tops",
    "name": "Karwari Tops",
    "image": null,
    "parent": "tops"
  },
  {
    "slug": "bangali-tops",
    "name": "Bangali Tops",
    "image": null,
    "parent": "tops"
  },
  {
    "slug": "tika",
    "name": "Tika",
    "image": "/images/bridal-set.jpg",
    "parent": null
  },
  {
    "slug": "nath",
    "name": "Nath",
    "image": null,
    "parent": null
  },
  {
    "slug": "vati",
    "name": "Vati",
    "image": "/images/mangalsutra.jpg",
    "parent": null
  },
  {
    "slug": "rajkot-vati",
    "name": "Rajkot Vati",
    "image": null,
    "parent": "vati"
  },
  {
    "slug": "karwari-vati",
    "name": "Karwari Vati",
    "image": null,
    "parent": "vati"
  },
  {
    "slug": "sui-dhaga",
    "name": "Sui Dhaga",
    "image": null,
    "parent": null
  },
  {
    "slug": "rajkot-vali",
    "name": "Rajkot Vali",
    "image": null,
    "parent": null
  },
  {
    "slug": "vali",
    "name": "Vali",
    "image": null,
    "parent": "rajkot-vali"
  },
  {
    "slug": "uv-vali",
    "name": "U V Vali",
    "image": null,
    "parent": "rajkot-vali"
  },
  {
    "slug": "singapore-vali",
    "name": "Singapore Vali",
    "image": null,
    "parent": "rajkot-vali"
  },
  {
    "slug": "ball-vali",
    "name": "Ball Vali",
    "image": null,
    "parent": "rajkot-vali"
  },
  {
    "slug": "locket",
    "name": "Locket",
    "image": "/images/pendant.jpg",
    "parent": null
  },
  {
    "slug": "casting-lockets",
    "name": "Casting Lockets",
    "image": null,
    "parent": "locket"
  },
  {
    "slug": "patra-lockets",
    "name": "Patra Lockets",
    "image": null,
    "parent": "locket"
  },
  {
    "slug": "laxmi-har",
    "name": "Laxmi Har",
    "image": "/images/temple.jpg",
    "parent": null
  },
  {
    "slug": "zumka",
    "name": "Zumka",
    "image": "/images/jhumka.jpg",
    "parent": null
  },
  {
    "slug": "coimbatore-zumka",
    "name": "Coimbatore Zumka",
    "image": null,
    "parent": "zumka"
  },
  {
    "slug": "karwari-zumka",
    "name": "Karwari Zumka",
    "image": null,
    "parent": "zumka"
  },
  {
    "slug": "casting-rings",
    "name": "Casting Rings",
    "image": "/images/diamond-ring.jpg",
    "parent": null
  },
  {
    "slug": "casting-gents-rings",
    "name": "Gents Rings",
    "image": null,
    "parent": "casting-rings"
  },
  {
    "slug": "casting-ladies-rings",
    "name": "Ladies Rings",
    "image": null,
    "parent": "casting-rings"
  },
  {
    "slug": "couple-band",
    "name": "Couple Band",
    "image": null,
    "parent": "casting-rings"
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
    "category": "short-necklace",
    "collection": "bridal",
    "style": "Bridal",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 62,
    "weightMax": 74,
    "make": "Handmade",
    "grossWeight": 74,
    "stoneWeight": 5.92,
    "netWeight": 68.08,
    "quantity": 1,
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
    "category": "long-necklace",
    "collection": "bridal",
    "style": "Bridal",
    "metal": "Gold",
    "purity": "92 Melting",
    "weightMin": 88,
    "weightMax": 104,
    "make": "Handmade",
    "grossWeight": 104,
    "stoneWeight": 8.32,
    "netWeight": 95.68,
    "quantity": 2,
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
    "category": "coimbatore-zumka",
    "collection": "traditional",
    "style": "Temple",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 14,
    "weightMax": 18,
    "make": "Handmade",
    "grossWeight": 18,
    "stoneWeight": 1.44,
    "netWeight": 16.56,
    "quantity": 3,
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
    "category": "gents-rings",
    "collection": "modern",
    "style": "Modern",
    "metal": "Gold",
    "purity": "18K",
    "weightMin": 4,
    "weightMax": 6,
    "make": "Machine Made",
    "grossWeight": 6,
    "stoneWeight": 0,
    "netWeight": 6,
    "quantity": 4,
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
    "category": "casting-ladies-rings",
    "collection": "modern",
    "style": "Modern",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 3,
    "weightMax": 5,
    "make": "Casting",
    "grossWeight": 5,
    "stoneWeight": 0.2,
    "netWeight": 4.8,
    "quantity": 5,
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
    "sku": "SJ-102925",
    "slug": "teardrop-diamond-pendant-2925",
    "name": "Teardrop Diamond Pendant",
    "description": "A single pear-cut stone in a bezel-and-prong hybrid setting. Supplied with or without an 18 inch cable chain.",
    "category": "pendant",
    "collection": "everyday",
    "style": "Minimal",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 2,
    "weightMax": 4,
    "make": "Casting",
    "grossWeight": 4,
    "stoneWeight": 0.16,
    "netWeight": 3.84,
    "quantity": 4,
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
    "ageDays": 5
  },
  {
    "sku": "SJ-102938",
    "slug": "contemporary-diamond-mangalsutra-2938",
    "name": "Contemporary Diamond Mangalsutra",
    "description": "Double-line black bead mangalsutra with a compact diamond floral pendant designed for daily office wear.",
    "category": "rajkot-vati",
    "collection": "everyday",
    "style": "Modern",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 6,
    "weightMax": 9,
    "make": "Casting",
    "grossWeight": 9,
    "stoneWeight": 0.36,
    "netWeight": 8.64,
    "quantity": 5,
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
    "ageDays": 6
  },
  {
    "sku": "SJ-102944",
    "slug": "mens-textured-gold-kada-2944",
    "name": "Men's Textured Gold Kada",
    "description": "Hinged kada with hand-chiselled chevron texture and a concealed push clasp. Heavy gauge, hollow core construction.",
    "category": "kada",
    "collection": "mens",
    "style": "Modern",
    "metal": "Gold",
    "purity": "92 Melting",
    "weightMin": 34,
    "weightMax": 42,
    "make": "Machine Made",
    "grossWeight": 42,
    "stoneWeight": 0,
    "netWeight": 42,
    "quantity": 1,
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
    "ageDays": 7
  },
  {
    "sku": "SJ-102957",
    "slug": "featherlight-geometric-necklace-2957",
    "name": "Featherlight Geometric Necklace",
    "description": "Hollow-form gold necklace under 5 grams with a small geometric charm. Light enough for every day.",
    "category": "short-necklace",
    "collection": "modern",
    "style": "Lightweight",
    "metal": "Gold",
    "purity": "18K",
    "weightMin": 3,
    "weightMax": 5,
    "make": "Machine Made",
    "grossWeight": 5,
    "stoneWeight": 0,
    "netWeight": 5,
    "quantity": 2,
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
    "ageDays": 8
  },
  {
    "sku": "SJ-102968",
    "slug": "lakshmi-temple-haaram-2968",
    "name": "Lakshmi Temple Haaram",
    "description": "Long temple haaram with repeating Lakshmi and peacock plates, hand-set with cabochon rubies through the frame.",
    "category": "laxmi-har",
    "collection": "traditional",
    "style": "Temple",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 96,
    "weightMax": 118,
    "make": "Handmade",
    "grossWeight": 118,
    "stoneWeight": 9.44,
    "netWeight": 108.56,
    "quantity": 3,
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
    "ageDays": 9
  },
  {
    "sku": "SJ-102979",
    "slug": "diamond-drop-cocktail-earrings-2979",
    "name": "Diamond Drop Cocktail Earrings",
    "description": "Detachable stud-and-drop construction giving you two looks from one pair.",
    "category": "earring",
    "collection": "statement",
    "style": "Modern",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 7,
    "weightMax": 10,
    "make": "Casting",
    "grossWeight": 10,
    "stoneWeight": 0.4,
    "netWeight": 9.6,
    "quantity": 4,
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
    "ageDays": 10
  },
  {
    "sku": "SJ-102994",
    "slug": "filigree-bridal-long-necklace-2994",
    "name": "Filigree Bridal Long Necklace",
    "description": "Jaipur filigree work across a graduated collar with a detachable central pendant that can be worn separately.",
    "category": "long-necklace",
    "collection": "bridal",
    "style": "Bridal",
    "metal": "Gold",
    "purity": "92 Melting",
    "weightMin": 71,
    "weightMax": 84,
    "make": "Handmade",
    "grossWeight": 84,
    "stoneWeight": 6.72,
    "netWeight": 77.28,
    "quantity": 1,
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
    "ageDays": 11
  },
  {
    "sku": "SJ-103002",
    "slug": "everyday-diamond-studs-3002",
    "name": "Everyday Diamond Studs",
    "description": "Classic four-prong diamond studs with secure screw backs. An everyday essential.",
    "category": "karwari-tops",
    "collection": "everyday",
    "style": "Daily Wear",
    "metal": "Diamond",
    "purity": "14K",
    "weightMin": 1,
    "weightMax": 3,
    "make": "Casting",
    "grossWeight": 3,
    "stoneWeight": 0.12,
    "netWeight": 2.88,
    "quantity": 2,
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
    "ageDays": 12
  },
  {
    "sku": "SJ-103021",
    "slug": "antique-peacock-pendant-3021",
    "name": "Antique Peacock Pendant",
    "description": "Antique-finish peacock motif pendant with fine nakshi border and a single pearl drop at the base.",
    "category": "pendant",
    "collection": "traditional",
    "style": "Antique",
    "metal": "Gold",
    "purity": "92 Melting",
    "weightMin": 11,
    "weightMax": 15,
    "make": "Handmade",
    "grossWeight": 15,
    "stoneWeight": 1.2,
    "netWeight": 13.8,
    "quantity": 4,
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
    "ageDays": 13
  },
  {
    "sku": "SJ-103038",
    "slug": "slim-beaded-mangalsutra-3038",
    "name": "Slim Beaded Mangalsutra",
    "description": "Single-line lightweight mangalsutra with an understated gold vati. Designed for the sub-5 gram price band.",
    "category": "karwari-vati",
    "collection": "everyday",
    "style": "Lightweight",
    "metal": "Gold",
    "purity": "18K",
    "weightMin": 4,
    "weightMax": 6,
    "make": "Machine Made",
    "grossWeight": 6,
    "stoneWeight": 0.48,
    "netWeight": 5.52,
    "quantity": 5,
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
    "ageDays": 14
  },
  {
    "sku": "SJ-103044",
    "slug": "statement-emerald-collar-3044",
    "name": "Statement Emerald Collar",
    "description": "A bold collar with graduated emerald cabochons framed in uncut diamond. Built for flagship display windows.",
    "category": "short-necklace",
    "collection": "statement",
    "style": "Traditional",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 58,
    "weightMax": 70,
    "make": "Handmade",
    "grossWeight": 70,
    "stoneWeight": 5.6,
    "netWeight": 64.4,
    "quantity": 1,
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
    "ageDays": 15
  },
  {
    "sku": "SJ-103063",
    "slug": "polki-bridal-jhumka-3063",
    "name": "Polki Bridal Jhumka",
    "description": "Oversized bridal jhumka with detachable ear-chain sahara and a triple row of pearl fringe.",
    "category": "karwari-zumka",
    "collection": "bridal",
    "style": "Bridal",
    "metal": "Gold",
    "purity": "92 Melting",
    "weightMin": 22,
    "weightMax": 28,
    "make": "Handmade",
    "grossWeight": 28,
    "stoneWeight": 2.24,
    "netWeight": 25.76,
    "quantity": 3,
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
    "ageDays": 16
  },
  {
    "sku": "SJ-103071",
    "slug": "minimal-stacking-ring-trio-3071",
    "name": "Minimal Stacking Ring Trio",
    "description": "Three slim bands — plain, twisted and single-stone — sold as a coordinated stack or individually.",
    "category": "ladies-rings",
    "collection": "modern",
    "style": "Minimal",
    "metal": "Gold",
    "purity": "14K",
    "weightMin": 2,
    "weightMax": 4,
    "make": "Machine Made",
    "grossWeight": 4,
    "stoneWeight": 0.32,
    "netWeight": 3.68,
    "quantity": 4,
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
    "ageDays": 17
  },
  {
    "sku": "SJ-103096",
    "slug": "diamond-cluster-cocktail-ring-3096",
    "name": "Diamond Cluster Cocktail Ring",
    "description": "Flower cluster head with illusion setting that reads two sizes larger than its carat weight.",
    "category": "ladies-rings",
    "collection": "statement",
    "style": "Modern",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 5,
    "weightMax": 8,
    "make": "Casting",
    "grossWeight": 8,
    "stoneWeight": 0.32,
    "netWeight": 7.68,
    "quantity": 1,
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
    "ageDays": 18
  },
  {
    "sku": "SJ-103117",
    "slug": "bridal-maang-tikka-set-3117",
    "name": "Bridal Maang Tikka & Set",
    "description": "Coordinated tikka, passa and choker trio finished to match a bride’s primary necklace order.",
    "category": "tika",
    "collection": "bridal",
    "style": "Bridal",
    "metal": "Gold",
    "purity": "92 Melting",
    "weightMin": 44,
    "weightMax": 55,
    "make": "Handmade",
    "grossWeight": 55,
    "stoneWeight": 4.4,
    "netWeight": 50.6,
    "quantity": 3,
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
    "ageDays": 19
  },
  {
    "sku": "SJ-103126",
    "slug": "mens-signet-gold-ring-3126",
    "name": "Men's Signet Gold Ring",
    "description": "Broad-face signet with a brushed top plate, available blank or with your own engraving.",
    "category": "casting-gents-rings",
    "collection": "mens",
    "style": "Modern",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 9,
    "weightMax": 13,
    "make": "Machine Made",
    "grossWeight": 13,
    "stoneWeight": 1.04,
    "netWeight": 11.96,
    "quantity": 4,
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
    "ageDays": 20
  },
  {
    "sku": "SJ-103139",
    "slug": "delicate-layering-necklace-3139",
    "name": "Delicate Layering Necklace",
    "description": "Ultra-fine layering chain designed to be sold in threes. A strong entry price-point for younger buyers.",
    "category": "long-necklace",
    "collection": "modern",
    "style": "Minimal",
    "metal": "Gold",
    "purity": "14K",
    "weightMin": 2,
    "weightMax": 4,
    "make": "Machine Made",
    "grossWeight": 4,
    "stoneWeight": 0,
    "netWeight": 4,
    "quantity": 5,
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
    "ageDays": 21
  },
  {
    "sku": "SJ-103147",
    "slug": "emerald-drop-temple-necklace-3147",
    "name": "Emerald Drop Temple Necklace",
    "description": "Temple plates strung with graduated emerald beads and finished with a hand-knotted silk cord back.",
    "category": "laxmi-har",
    "collection": "traditional",
    "style": "Temple",
    "metal": "Gold",
    "purity": "92 Melting",
    "weightMin": 54,
    "weightMax": 66,
    "make": "Handmade",
    "grossWeight": 66,
    "stoneWeight": 5.28,
    "netWeight": 60.72,
    "quantity": 1,
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
    "ageDays": 22
  },
  {
    "sku": "SJ-103155",
    "slug": "diamond-bezel-pendant-set-3155",
    "name": "Diamond Bezel Pendant Set",
    "description": "Bezel-set pendant with matching studs, packaged as a ready gifting set with certificate.",
    "category": "casting-lockets",
    "collection": "everyday",
    "style": "Daily Wear",
    "metal": "Diamond",
    "purity": "18K",
    "weightMin": 5,
    "weightMax": 8,
    "make": "Casting",
    "grossWeight": 8,
    "stoneWeight": 0.32,
    "netWeight": 7.68,
    "quantity": 2,
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
    "ageDays": 23
  },
  {
    "sku": "SJ-103168",
    "slug": "broad-gold-choker-necklace-3168",
    "name": "Broad Gold Choker Necklace",
    "description": "Wide gold choker with a dense floral field and hidden hook closure at the nape.",
    "category": "short-necklace",
    "collection": "traditional",
    "style": "Traditional",
    "metal": "Gold",
    "purity": "22K",
    "weightMin": 78,
    "weightMax": 92,
    "make": "Handmade",
    "grossWeight": 92,
    "stoneWeight": 7.36,
    "netWeight": 84.64,
    "quantity": 3,
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
    "ageDays": 24
  },
  {
    "sku": "SJ-103186",
    "slug": "platinum-eternity-band-3186",
    "name": "Platinum Eternity Band",
    "description": "Channel-set platinum eternity band with a comfort-fit profile, produced to exact finger size.",
    "category": "couple-band",
    "collection": "modern",
    "style": "Minimal",
    "metal": "Platinum",
    "purity": "18K",
    "weightMin": 4,
    "weightMax": 6,
    "make": "Machine Made",
    "grossWeight": 6,
    "stoneWeight": 0.48,
    "netWeight": 5.52,
    "quantity": 5,
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
    "ageDays": 25
  },
  {
    "sku": "SJ-103203",
    "slug": "layered-pearl-gold-haar-3203",
    "name": "Layered Pearl & Gold Haar",
    "description": "Three-layer pearl haar with polki spacers and a detachable central plate.",
    "category": "long-necklace",
    "collection": "bridal",
    "style": "Traditional",
    "metal": "Gold",
    "purity": "92 Melting",
    "weightMin": 64,
    "weightMax": 76,
    "make": "Handmade",
    "grossWeight": 76,
    "stoneWeight": 6.08,
    "netWeight": 69.92,
    "quantity": 2,
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
    "ageDays": 26
  }
];
