import type { Category, ConditionGrade, Lot, LotType, SortOption } from "./types";

const img = {
  warehouse1:
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=80",
  warehouse2:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
  warehouse3:
    "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1600&q=80",
  electronics:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  gadgets:
    "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80",
  apparel:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
  bags: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
  shoes:
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=80",
  sneakers:
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
  home: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80",
  interior:
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
  kitchen:
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1600&q=80",
  kitchen2:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
  grocery:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
  pantry:
    "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80",
  sport:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80",
  outdoor:
    "https://images.unsplash.com/photo-1517649763962-0c6230660277?auto=format&fit=crop&w=1200&q=80",
  toys: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=1600&q=80",
  kids: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80",
  play: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1600&q=80",
  office:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
  desk: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
  supplies:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  pallets:
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1600&q=80",
  forklift:
    "https://images.unsplash.com/photo-1605745341112-85968b19345a?auto=format&fit=crop&w=1200&q=80",
};

export const categories: Category[] = [
  "Electronics",
  "Apparel",
  "Home Goods",
  "Grocery",
  "Sporting Goods",
  "Toys",
  "Office",
  "Mixed Pallets",
];

export const conditionGrades: ConditionGrade[] = [
  "A",
  "B",
  "C",
  "Customer Returns",
  "Shelf Pulls",
];

export const lotTypes: LotType[] = ["Pallet", "Truckload", "Mixed"];

export const lots: Lot[] = [
  {
    id: "ast-2401",
    title: "Consumer electronics returns mix, Grade B",
    category: "Electronics",
    condition: "Customer Returns",
    lotType: "Pallet",
    saleType: "Auction",
    currentBid: 1850,
    reserveMet: true,
    bidCount: 14,
    unitCount: 120,
    estimatedRetail: 18400,
    location: "Dallas, TX",
    endsAt: "2026-10-27T02:30:00.000Z",
    featured: true,
    images: [img.warehouse1, img.warehouse2, img.electronics, img.gadgets],
    manifestSummary:
      "Headphones, smart speakers, phone accessories, charging cables, and small gadgets across 38 SKUs. Manifest includes SKU, quantity, MSRP, and power-test flag where available. Top lines: wireless earbuds (22), Bluetooth speakers (18), USB-C hubs (31), phone cases and screen protectors (49).",
    conditionNotes:
      "Customer returns. Roughly 60% open-box with intact retail packaging, 25% missing accessories or manuals, 15% cosmetic damage. Not a Grade A lot. Sold as-is after visual sort only.",
    sellerNotes:
      "Returns wave from a national big-box electronics aisle. Units are sorted to electronics only, not by SKU. Ideal for refurbishers and secondary marketplaces comfortable with variance.",
    shipping:
      "LTL freight quote issued after award. Pallet is 48×40, approx 620 lb, shrink-wrapped. Liftgate available at buyer cost. Dimensional weight applies for parcel split if requested.",
    pickup:
      "Dallas DC, Mon through Fri, 8am to 3pm CT. Dock appointment required 24 hours ahead. Bring BOL and photo ID. Forklift on site for loading.",
  },
  {
    id: "ast-2402",
    title: "Apparel overstock, seasonal clearance",
    category: "Apparel",
    condition: "A",
    lotType: "Truckload",
    saleType: "Auction",
    currentBid: 9200,
    reserveMet: false,
    bidCount: 7,
    unitCount: 4800,
    estimatedRetail: 96000,
    location: "Columbus, OH",
    endsAt: "2026-10-27T18:00:00.000Z",
    featured: true,
    images: [img.apparel, img.bags, img.warehouse3],
    manifestSummary:
      "Men's and women's apparel, sizes S through XXL. Mix of tops (42%), denim (18%), outerwear (12%), activewear (16%), and basics (12%). New with tags. Cartons labeled by style family. Full size curve is uneven toward M/L.",
    conditionNotes:
      "Grade A shelf-ready overstock. No customer returns in this load. Packaging clean. Minor carton scuffs only.",
    sellerNotes:
      "Clearance from a mid-tier fashion brand after seasonal reset. Colorways skew fall/winter. Manifest PDF lists style, color, size, and piece count per carton.",
    shipping:
      "Full 53-ft truckload outbound. Carrier coordination after settlement. Floor-loaded cartons, approx 38,000 lb. Seal photo provided at departure.",
    pickup:
      "Columbus metro warehouse. Appointment 48 hours ahead. Trailer must be dry van. Live load window 2 hours.",
  },
  {
    id: "ast-2403",
    title: "Home goods pallet, mixed housewares",
    category: "Home Goods",
    condition: "B",
    lotType: "Pallet",
    saleType: "Buy Now",
    currentBid: 640,
    buyNowPrice: 640,
    reserveMet: true,
    bidCount: 0,
    unitCount: 85,
    estimatedRetail: 4200,
    location: "Phoenix, AZ",
    endsAt: "2026-10-30T16:00:00.000Z",
    featured: true,
    images: [img.home, img.interior, img.kitchen],
    manifestSummary:
      "Kitchen tools, food storage, small decor, bedding accessories, and bath organizers. 85 sellable units across 22 SKUs. Condition B with light packaging wear. No furniture frames or mattresses.",
    conditionNotes:
      "Grade B. Outer cartons show shelf wear. Product mostly new or like-new. A few open display units included and noted on the manifest.",
    sellerNotes:
      "Fixed-price pallet from a regional home retailer. Manifest available after registration. No hazardous materials. Great starter lot for pop-up or online resellers.",
    shipping:
      "Small parcel multi-box or single LTL pallet. Dimensional weight applies. Quote tool available after purchase confirmation.",
    pickup:
      "Phoenix fulfillment center. Same-week slots open Tue through Sat. Dock level; pallet jack recommended.",
  },
  {
    id: "ast-2404",
    title: "Grocery dry goods, shelf pulls",
    category: "Grocery",
    condition: "Shelf Pulls",
    lotType: "Pallet",
    saleType: "Auction",
    currentBid: 1100,
    reserveMet: true,
    bidCount: 21,
    unitCount: 640,
    estimatedRetail: 7800,
    location: "Atlanta, GA",
    endsAt: "2026-10-27T01:15:00.000Z",
    featured: true,
    images: [img.grocery, img.pantry, img.warehouse2],
    manifestSummary:
      "Packaged snacks, canned goods, pasta, rice, and pantry staples. 640 units. Best-by dates listed line by line on the manifest (nearest date 45 days out). No refrigerated, frozen, or alcohol.",
    conditionNotes:
      "Shelf pulls. Packaging intact. Dates verified within 7 days of listing. A small share has dented cans noted as Grade C within the lot.",
    sellerNotes:
      "Regional grocery DC rotation. Buyer is responsible for state food resale rules. Manifest includes UPC, description, qty, and best-by.",
    shipping:
      "Ambient freight only. Temperature control not included. Pallet height capped at 72 inches. Food-grade wrap applied.",
    pickup:
      "Atlanta DC. Forklift available. Appointment required. Food-handler credentials not required for pickup, but recommended for resale compliance.",
  },
  {
    id: "ast-2405",
    title: "Sporting goods truckload, mixed brands",
    category: "Sporting Goods",
    condition: "Customer Returns",
    lotType: "Truckload",
    saleType: "Auction",
    currentBid: 14500,
    reserveMet: true,
    bidCount: 9,
    unitCount: 2100,
    estimatedRetail: 125000,
    location: "Reno, NV",
    endsAt: "2026-10-28T18:00:00.000Z",
    images: [img.sport, img.outdoor, img.warehouse3],
    manifestSummary:
      "Fitness accessories, outdoor gear, water bottles, and athletic apparel. Returns sorted by department. Approx 2100 units. Hardgoods ~55%, softgoods ~45%. Manifest by carton with department codes.",
    conditionNotes:
      "Customer returns. Expect cosmetic damage on hardgoods and missing parts on a minority. Softgoods mostly wearable with tags removed on some pieces.",
    sellerNotes:
      "High-volume returns wave from Q3. Photo sample set of 12 cartons available on request. Suited for processors with repair capacity.",
    shipping:
      "53-ft trailer. Load-out scheduled with winner within 5 business days. Floor load with load bars.",
    pickup:
      "Reno distribution hub. Photo ID and BOL required. Appointment window 7am to 2pm PT.",
  },
  {
    id: "ast-2406",
    title: "Toys and games, pallet liquidation",
    category: "Toys",
    condition: "A",
    lotType: "Pallet",
    saleType: "Auction",
    currentBid: 980,
    reserveMet: false,
    bidCount: 5,
    unitCount: 210,
    estimatedRetail: 9600,
    location: "Chicago, IL",
    endsAt: "2026-10-29T12:00:00.000Z",
    images: [img.toys, img.kids, img.play],
    manifestSummary:
      "Board games, plurals, STEM kits, and preschool toys. New in box. Age ranges mixed from 3+ through teen. 210 units, 41 SKUs. No battery-included items with expired cells.",
    conditionNotes:
      "Grade A overstock. Sealed cartons. No customer returns. Outer shippers show warehouse labels only.",
    sellerNotes:
      "Specialty retailer overstock after planogram change. Manifest includes UPC, age grade, and MSRP.",
    shipping:
      "LTL preferred. Liftgate optional at buyer cost. Keep upright labels on game cartons.",
    pickup:
      "Chicago South warehouse. Dock level loading. Appointment same week if available.",
  },
  {
    id: "ast-2407",
    title: "Smart home devices, Grade C salvage",
    category: "Electronics",
    condition: "C",
    lotType: "Mixed",
    saleType: "Auction",
    currentBid: 420,
    reserveMet: true,
    bidCount: 11,
    unitCount: 95,
    estimatedRetail: 11200,
    location: "Newark, NJ",
    endsAt: "2026-10-27T08:30:00.000Z",
    images: [img.gadgets, img.electronics, img.warehouse1],
    manifestSummary:
      "Smart plugs, bulbs, hubs, doorbells, and indoor cameras. Grade C for parts or repair. 95 units. Not power tested as a consolidated lot. Manifest lists model and failure code when known.",
    conditionNotes:
      "Grade C salvage. Expect non-functional units, cracked housings, and missing power supplies. Sold strictly as-is for parts or scrap channel.",
    sellerNotes:
      "Salvage channel inventory from a smart-home brand. No manufacturer warranty transfer. Serial list available after award.",
    shipping:
      "Parcel freight for sub-pallet or LTL. Quote on request. Lithium cells may appear in cameras; hazmat review required before air.",
    pickup:
      "Newark cross-dock. Appointment same day possible before 1pm ET.",
  },
  {
    id: "ast-2408",
    title: "Kitchen small appliances, returns pallet",
    category: "Home Goods",
    condition: "Customer Returns",
    lotType: "Pallet",
    saleType: "Auction",
    currentBid: 1320,
    reserveMet: true,
    bidCount: 16,
    unitCount: 64,
    estimatedRetail: 9800,
    location: "Memphis, TN",
    endsAt: "2026-10-27T05:00:00.000Z",
    images: [img.kitchen, img.kitchen2, img.warehouse2],
    manifestSummary:
      "Blenders, air fryers, coffee makers, toasters, and electric kettles. Open box and customer returns. 64 units across 19 models. Manifest by model with retail price.",
    conditionNotes:
      "Customer returns. Cosmetic and functional variance expected. Some units tested working; others untested. Packaging often incomplete.",
    sellerNotes:
      "Ideal for refurbishers and secondary markets. Power cords included on most units. No gas appliances.",
    shipping:
      "LTL from Memphis hub. Shrink-wrapped pallet ~780 lb. Fragile stickers applied.",
    pickup:
      "Buyer must bring pallet jack if using own truck without liftgate. Dock hours 8am to 4pm CT.",
  },
  {
    id: "ast-2409",
    title: "Footwear mixed sizes, truckload",
    category: "Apparel",
    condition: "B",
    lotType: "Truckload",
    saleType: "Buy Now",
    currentBid: 22000,
    buyNowPrice: 22000,
    reserveMet: true,
    bidCount: 0,
    unitCount: 3600,
    estimatedRetail: 210000,
    location: "Los Angeles, CA",
    endsAt: "2026-11-02T20:00:00.000Z",
    featured: true,
    images: [img.shoes, img.sneakers, img.warehouse3],
    manifestSummary:
      "Athletic and casual footwear. 3600 pairs. Size run skewed toward mid sizes (8–11 mens, 7–9 womens). Condition B with box wear. Brand families grouped on the manifest.",
    conditionNotes:
      "Grade B. Shoes paired. Boxes may be crushed or relabeled. No singles guarantee beyond the paired count on the manifest.",
    sellerNotes:
      "Fixed price truckload from a West Coast footwear distributor. Manifest sorted by brand family. Insurance certificate required for pickup.",
    shipping:
      "Full trailer. Destination freight arranged by buyer. Estimated cube 2800 cu ft.",
    pickup:
      "LA basin warehouse. Appointment and COI required. Loading Mon through Thu.",
  },
  {
    id: "ast-2410",
    title: "Outdoor toys and playsets, pallet",
    category: "Toys",
    condition: "Shelf Pulls",
    lotType: "Pallet",
    saleType: "Auction",
    currentBid: 760,
    reserveMet: false,
    bidCount: 3,
    unitCount: 48,
    estimatedRetail: 6400,
    location: "Charlotte, NC",
    endsAt: "2026-10-28T04:00:00.000Z",
    images: [img.play, img.kids, img.pallets],
    manifestSummary:
      "Ride-ons, water toys, and backyard play items. Seasonal shelf pulls. 48 units. Packaging intact on most SKUs. Some assembly required on larger playsets.",
    conditionNotes:
      "Shelf pulls. Seasonal packaging. Minor store sticker residue. Confirm cube before bidding; several SKUs are oversized.",
    sellerNotes:
      "Bulky items. Ideal for seasonal retailers clearing space into spring. Manifest lists assembled dimensions where available.",
    shipping:
      "Oversized freight. Dimensional fees likely. Keep dry; do not stack heavy freight on top.",
    pickup:
      "Charlotte DC with forklift assist. Appointment preferred morning slots.",
  },
  {
    id: "ast-2411",
    title: "Office furniture returns, mixed desks and chairs",
    category: "Office",
    condition: "Customer Returns",
    lotType: "Truckload",
    saleType: "Auction",
    currentBid: 6800,
    reserveMet: true,
    bidCount: 6,
    unitCount: 140,
    estimatedRetail: 92000,
    location: "Indianapolis, IN",
    endsAt: "2026-10-29T20:00:00.000Z",
    featured: true,
    images: [img.office, img.desk, img.warehouse3],
    manifestSummary:
      "Task chairs, standing desks, monitor arms, and filing pedestals. 140 large units plus accessory cartons. Mix of customer returns and open-box. Manifest includes model, finish, and piece count.",
    conditionNotes:
      "Customer returns and open box. Expect scuffs, missing hardware kits on ~20%, and incomplete gas cylinders on a few chairs. Not for white-glove retail without rework.",
    sellerNotes:
      "Corporate furniture brand liquidation. Hardware bags bagged by carton where present. Flat-pack desks dominate the cube.",
    shipping:
      "Full truckload. Soft goods and fabric chairs should stay dry. Load plan shared after award.",
    pickup:
      "Indy industrial park. Trailer must accept tall cartons (up to 84 in). Appointment 72 hours ahead.",
  },
  {
    id: "ast-2412",
    title: "Office supplies pallet, Grade A overstock",
    category: "Office",
    condition: "A",
    lotType: "Pallet",
    saleType: "Buy Now",
    currentBid: 480,
    buyNowPrice: 480,
    reserveMet: true,
    bidCount: 0,
    unitCount: 920,
    estimatedRetail: 5100,
    location: "Kansas City, MO",
    endsAt: "2026-11-01T15:00:00.000Z",
    images: [img.supplies, img.office, img.pallets],
    manifestSummary:
      "Paper, pens, binders, toner-compatible packaging (no toner powder inside), sticky notes, and desk organizers. 920 units. New sealed cartons. Manifest by case pack.",
    conditionNotes:
      "Grade A. Unopened cases. Warehouse dust on outer corrugate only.",
    sellerNotes:
      "Distributor overstock after contract change. Fast-moving SKUs for office resellers and Amazon FBA prep teams.",
    shipping:
      "LTL or multi-carton parcel. Pallet ~450 lb. No hazmat.",
    pickup:
      "Kansas City DC. Walk-up appointments often available same week.",
  },
  {
    id: "ast-2413",
    title: "Mixed retail pallet, general merchandise",
    category: "Mixed Pallets",
    condition: "B",
    lotType: "Pallet",
    saleType: "Auction",
    currentBid: 890,
    reserveMet: true,
    bidCount: 18,
    unitCount: 160,
    estimatedRetail: 7200,
    location: "Houston, TX",
    endsAt: "2026-10-27T14:00:00.000Z",
    featured: true,
    images: [img.pallets, img.forklift, img.warehouse1],
    manifestSummary:
      "Cross-category general merchandise: home accents, personal care (non-regulated), small electronics accessories, and pet supplies. 160 units. Manifest is by department percentage, not full UPC depth.",
    conditionNotes:
      "Grade B mixed. Packaging varies. Some open-box. Manifest depth is summary-level; expect discovery variance of ±15% by dollar.",
    sellerNotes:
      "Classic mystery-friendly pallet for experienced liquidation buyers. Photos of all four sides of the wrapped pallet included.",
    shipping:
      "Single pallet LTL. Approx 700 lb. Shrink and corner boards applied.",
    pickup:
      "Houston South DC. Dock appointment Mon through Fri.",
  },
  {
    id: "ast-2414",
    title: "Headphones and audio accessories truckload",
    category: "Electronics",
    condition: "A",
    lotType: "Truckload",
    saleType: "Auction",
    currentBid: 18500,
    reserveMet: false,
    bidCount: 4,
    unitCount: 5200,
    estimatedRetail: 240000,
    location: "Portland, OR",
    endsAt: "2026-10-31T17:00:00.000Z",
    images: [img.electronics, img.gadgets, img.warehouse2],
    manifestSummary:
      "Over-ear headphones, earbuds, and audio cables. New in sealed retail packaging. 5200 units. Manifest includes UPC, model, color, and MSRP. Top three models are 61% of unit count.",
    conditionNotes:
      "Grade A. Factory sealed. Cartons may show distributor labels. No returns mixed into this load.",
    sellerNotes:
      "Brand channel overstock after SKU sunset. High velocity for online and wholesale. Serial ranges listed for warranty registration where applicable.",
    shipping:
      "Full truckload. High value; sealed trailer and GPS preferred. Insurance rider recommended.",
    pickup:
      "Portland metro 3PL. Background-checked drivers preferred. Appointment 48 hours ahead.",
  },
  {
    id: "ast-2415",
    title: "Denim and casual wear returns, Grade B",
    category: "Apparel",
    condition: "B",
    lotType: "Pallet",
    saleType: "Auction",
    currentBid: 2100,
    reserveMet: true,
    bidCount: 12,
    unitCount: 780,
    estimatedRetail: 31200,
    location: "Nashville, TN",
    endsAt: "2026-10-28T11:00:00.000Z",
    images: [img.apparel, img.bags, img.shoes],
    manifestSummary:
      "Jeans, chinos, tees, and hoodies. Customer returns and try-ons. 780 units. Size curve spans XS through 2XL. Manifest by style with size breakdown.",
    conditionNotes:
      "Grade B. Most wearable. Expect fragrance, missing tags, and minor stains on ~10%. Not Grade A.",
    sellerNotes:
      "Apparel brand outlet channel. Garments hung or folded by style. Great for thrift processors and online thrift.",
    shipping:
      "LTL pallet. Keep dry. Do not crush softgoods cartons under hardgoods.",
    pickup:
      "Nashville warehouse. Appointment required. Softgoods carts available for count-out.",
  },
  {
    id: "ast-2416",
    title: "Bedding and bath overstock truckload",
    category: "Home Goods",
    condition: "A",
    lotType: "Truckload",
    saleType: "Auction",
    currentBid: 11200,
    reserveMet: true,
    bidCount: 8,
    unitCount: 2400,
    estimatedRetail: 86000,
    location: "Allentown, PA",
    endsAt: "2026-10-30T09:00:00.000Z",
    images: [img.home, img.interior, img.warehouse3],
    manifestSummary:
      "Sheet sets, towels, duvet covers, and shower curtains. New sealed. 2400 units. Color assortment listed. No mattresses or pillows with foam fill in this load.",
    conditionNotes:
      "Grade A. Retail ready. Outer cartons clean. Polybags sealed.",
    sellerNotes:
      "Home textiles brand season closeout. Strong for big-box secondary and e-commerce bundles.",
    shipping:
      "Full truckload. Softgoods cube is high; trailer will weigh light. Seal at origin.",
    pickup:
      "Allentown DC. Live load. Appointment 24 hours ahead.",
  },
  {
    id: "ast-2417",
    title: "Canned goods and beverages, short-date pallet",
    category: "Grocery",
    condition: "Shelf Pulls",
    lotType: "Pallet",
    saleType: "Buy Now",
    currentBid: 720,
    buyNowPrice: 720,
    reserveMet: true,
    bidCount: 0,
    unitCount: 500,
    estimatedRetail: 3200,
    location: "Tampa, FL",
    endsAt: "2026-10-28T22:00:00.000Z",
    images: [img.pantry, img.grocery, img.pallets],
    manifestSummary:
      "Canned vegetables, soups, shelf-stable juices, and sparkling water. 500 units. Best-by windows 30 to 90 days. Full date list on manifest. No alcohol, dairy, or meat.",
    conditionNotes:
      "Shelf pulls / short date. Packaging sound. Buyer must confirm local rules for short-date food resale.",
    sellerNotes:
      "Fixed price for fast movers. Ideal for discount grocers and community buyers with compliant channels.",
    shipping:
      "Ambient LTL. Keep upright. No refrigeration required.",
    pickup:
      "Tampa DC. Morning pickup preferred for same-day outbound.",
  },
  {
    id: "ast-2418",
    title: "Camping gear mixed pallet",
    category: "Sporting Goods",
    condition: "B",
    lotType: "Pallet",
    saleType: "Auction",
    currentBid: 1540,
    reserveMet: false,
    bidCount: 6,
    unitCount: 95,
    estimatedRetail: 14800,
    location: "Denver, CO",
    endsAt: "2026-10-29T06:00:00.000Z",
    images: [img.outdoor, img.sport, img.warehouse1],
    manifestSummary:
      "Tents, sleeping bags, camp chairs, lanterns, and coolers (non-electric). 95 units. Mix of Grade B open box and light returns. Manifest lists packed dimensions.",
    conditionNotes:
      "Grade B. Expect missing stakes or guy lines on some tents. Coolers may have cosmetic scrapes. Not field-tested as a lot.",
    sellerNotes:
      "Outdoor retailer consolidation. Seasonal timing favors fall/winter buyers. Photo set of open samples included.",
    shipping:
      "LTL. Bulky cube. Do not double-stack without load plan.",
    pickup:
      "Denver metro 3PL. High altitude dock; allow extra time for wrapping.",
  },
  {
    id: "ast-2419",
    title: "Printer paper and toner packaging mix",
    category: "Office",
    condition: "Shelf Pulls",
    lotType: "Mixed",
    saleType: "Auction",
    currentBid: 390,
    reserveMet: true,
    bidCount: 9,
    unitCount: 210,
    estimatedRetail: 4800,
    location: "Minneapolis, MN",
    endsAt: "2026-10-27T20:00:00.000Z",
    images: [img.supplies, img.desk, img.pallets],
    manifestSummary:
      "Copy paper cases, empty toner outer cartons (no powder), binders, and filing supplies. 210 units. Shelf pulls from office mega-store. Manifest by case.",
    conditionNotes:
      "Shelf pulls. Paper cases intact. Some outer toner boxes crushed and empty (no consumable toner). Read the manifest carefully.",
    sellerNotes:
      "Useful for office liquidators who separate paper from packaging scrap. Not a pure paper lot.",
    shipping:
      "Heavy for cube. Estimate 900 lb. LTL with residential liftgate optional.",
    pickup:
      "Minneapolis DC. Forklift required for loading.",
  },
  {
    id: "ast-2420",
    title: "Mixed pallet truckload, retailer GM",
    category: "Mixed Pallets",
    condition: "Customer Returns",
    lotType: "Truckload",
    saleType: "Auction",
    currentBid: 16800,
    reserveMet: true,
    bidCount: 11,
    unitCount: 3200,
    estimatedRetail: 145000,
    location: "Dallas, TX",
    endsAt: "2026-11-01T01:00:00.000Z",
    featured: true,
    images: [img.forklift, img.pallets, img.warehouse2, img.warehouse1],
    manifestSummary:
      "Full truck of mixed general merchandise returns: home, toys, apparel softgoods, and small electronics accessories. Approx 3200 units across ~24 pallets. Department mix percentages on summary manifest; line-level CSV after award.",
    conditionNotes:
      "Customer returns mixed. High variance. Expect 10–20% unsellable without rework depending on channel. Experienced buyers only.",
    sellerNotes:
      "National retailer returns program. Manifest depth improves after award with SKU CSV. Sample pallet photos available.",
    shipping:
      "53-ft dry van. Load bars and seals. Origin Dallas metro. Transit planning with winner.",
    pickup:
      "Not available for buyer pickup this week; freight-out only unless prearranged with seller ops.",
  },
  {
    id: "ast-2421",
    title: "LED lighting and smart bulbs pallet",
    category: "Electronics",
    condition: "A",
    lotType: "Pallet",
    saleType: "Auction",
    currentBid: 1180,
    reserveMet: true,
    bidCount: 10,
    unitCount: 640,
    estimatedRetail: 19200,
    location: "Salt Lake City, UT",
    endsAt: "2026-10-30T03:00:00.000Z",
    images: [img.gadgets, img.electronics, img.warehouse3],
    manifestSummary:
      "LED bulbs, smart bulbs, and under-cabinet light kits. New sealed. 640 units. Specs include lumen and color temperature on the manifest.",
    conditionNotes:
      "Grade A. Sealed retail packs. Cartons warehouse-clean.",
    sellerNotes:
      "Lighting brand channel fill. Strong for hardware secondary and online bundles.",
    shipping:
      "LTL. Fragile glass content; do not tip. Corner boards required.",
    pickup:
      "Salt Lake DC. Appointment Mon through Fri mornings.",
  },
  {
    id: "ast-2422",
    title: "Kids apparel seasonal pallet",
    category: "Apparel",
    condition: "A",
    lotType: "Pallet",
    saleType: "Auction",
    currentBid: 1420,
    reserveMet: false,
    bidCount: 4,
    unitCount: 1100,
    estimatedRetail: 22000,
    location: "Seattle, WA",
    endsAt: "2026-10-31T12:00:00.000Z",
    images: [img.apparel, img.kids, img.bags],
    manifestSummary:
      "Kids tops, bottoms, and outer layers. New with tags. Sizes 2T through 14. 1100 units. Season skew winter. Manifest by size run.",
    conditionNotes:
      "Grade A. No returns. Polybagged on hangers or folded by size.",
    sellerNotes:
      "Children's brand overstock. Clean labels. Good for boutiques and online kids resale.",
    shipping:
      "LTL pallet. Softgoods. Keep dry and clean.",
    pickup:
      "Seattle metro warehouse. Appointment 24 hours ahead.",
  },
];

export function getLotById(id: string): Lot | undefined {
  return lots.find((lot) => lot.id === id);
}

export function getFeaturedLots(): Lot[] {
  return lots.filter((lot) => lot.featured);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCountdown(endsAt: string, now: number): string {
  const diff = new Date(endsAt).getTime() - now;
  if (diff <= 0) return "Ended";
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatCondition(condition: ConditionGrade): string {
  return ["A", "B", "C"].includes(condition) ? `Grade ${condition}` : condition;
}

export function sortLots(list: Lot[], sort: SortOption): Lot[] {
  const next = [...list];
  switch (sort) {
    case "bid-high":
      return next.sort((a, b) => b.currentBid - a.currentBid);
    case "bid-low":
      return next.sort((a, b) => a.currentBid - b.currentBid);
    case "retail":
      return next.sort((a, b) => b.estimatedRetail - a.estimatedRetail);
    case "newest":
      return next.sort((a, b) => b.id.localeCompare(a.id));
    case "ending":
    default:
      return next.sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
  }
}
