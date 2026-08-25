import ConciergeWidget from "./components/ConciergeWidget";

/* ─── DATA ─── */

const CITY = "Mumbai";

const CATEGORIES = [
  { label: "Biryani",   emoji: "🍛", bg: "#FFF3E0" },
  { label: "Rolls",     emoji: "🌯", bg: "#E3F2FD" },
  { label: "Pizzas",    emoji: "🍕", bg: "#FCE4EC" },
  { label: "Noodles",   emoji: "🍜", bg: "#E0F7FA" },
  { label: "Soup",      emoji: "🍲", bg: "#F3E5F5" },
  { label: "Pure Veg",  emoji: "🥗", bg: "#E8F5E9" },
  { label: "Paratha",   emoji: "🫓", bg: "#FFF8E1" },
  { label: "Chinese",   emoji: "🥢", bg: "#FBE9E7" },
  { label: "Coffee",    emoji: "☕", bg: "#FFF8E1" },
  { label: "Desserts",  emoji: "🍰", bg: "#FCE4EC" },
];

const CHAINS = [
  { name: "McDonald's", emoji: "🍔", bg: "from-yellow-400 to-yellow-300", rating: 4.3, time: "20-25 mins", offer: "FREE McFlurry above ₹299", tags: "Burgers · Wraps" },
  { name: "Pizza Hut",  emoji: "🍕", img: "/PizzaHutNew.png",    bg: "from-red-600 to-red-500",       rating: 4.1, time: "30-35 mins", offer: "Buy 1 Get 1 Free",        tags: "Pizzas · Pastas" },
  { name: "Domino's",   emoji: "🍕", bg: "from-blue-700 to-blue-500",     rating: 4.2, time: "25-30 mins", offer: "2 Pizzas at ₹99",          tags: "Pizzas · Sides" },
  { name: "KFC",        emoji: "🍗", bg: "from-red-700 to-red-600",       rating: 4.2, time: "30-35 mins", offer: "Treat Box at ₹199",        tags: "Chicken · Burgers" },
  { name: "Subway",     emoji: "🥖", bg: "from-green-600 to-lime-500",    rating: 4.0, time: "25-30 mins", offer: "15% off on ₹299+",         tags: "Wraps · Salads" },
  { name: "Behrouz",    emoji: "🍛", img: "/BehrouzBiryaniNew.png",   bg: "from-amber-800 to-amber-600",   rating: 4.4, time: "35-40 mins", offer: "40% OFF up to ₹80",        tags: "Biryani · Mughlai" },
  { name: "Wow! Momo", emoji: "🥟", img: "/wowMomoNew.png",          bg: "from-blue-500 to-cyan-400",     rating: 4.2, time: "25-30 mins", offer: "₹75 off on ₹299+",         tags: "Momos · Chinese" },
  { name: "Haldiram's",emoji: "🧆", img: "/HalidRamNew.png",   bg: "from-orange-500 to-amber-400",  rating: 4.5, time: "40-45 mins", offer: "Free delivery",            tags: "Snacks · Sweets" },
];

const RESTAURANTS = [
  { name: "Nom Nom Express",     tags: "Chinese, Pan-Asian, Thai, Asian", rating: 4.0, time: "20-25 mins", area: "Andheri East · 0.9 km", offer: "70% OFF\nUPTO ₹140", emoji: "🍜", img: "/nomnomExpressNew.png", bg: "from-[#5C2300] via-[#A84000] to-[#D45200]" },
  { name: "Faasos — Wraps",      tags: "Wraps, Rolls, Biryani",           rating: 4.3, time: "20-25 mins", area: "Bandra West · 1.2 km",  offer: "BUY 1\nGET 1",      emoji: "🌯", img: "/FaasosNew.png",       bg: "from-[#3B0764] via-[#7E22CE] to-[#A855F7]" },
  { name: "Wow! Momo",          tags: "Momos, Chinese, Tibetan",          rating: 4.1, time: "15-20 mins", area: "Juhu · 0.8 km",         offer: "BUY 1\nGET 1",      emoji: "🥟", img: "/wowMomoNew.png",           bg: "from-[#713F12] via-[#CA8A04] to-[#EAB308]" },
  { name: "Nothing But Chicken", tags: "Salads, Biryani, Kebabs",         rating: 4.4, time: "10-15 mins", area: "Andheri East · 0.8 km", offer: "ITEMS\nAT ₹118",    emoji: "🍗", img: "/nothingButChickenNew.png", bg: "from-[#7F1D1D] via-[#B91C1C] to-[#EF4444]" },
  { name: "Behrouz Biryani",     tags: "Biryani, Mughlai, North Indian",  rating: 4.4, time: "35-40 mins", area: "Bandra West · 2.1 km",  offer: "40% OFF\nUPTO ₹80", emoji: "🍛", img: "/BehrouzBiryaniNew.png",    bg: "from-[#5C2300] via-[#92400E] to-[#D97706]" },
  { name: "Pizza Hut",           tags: "Pizzas, Pastas, Desserts",        rating: 4.1, time: "30-35 mins", area: "Andheri West · 1.5 km", offer: "BUY 1\nGET 1 FREE", emoji: "🍕", img: "/PizzaHutNew.png",       bg: "from-[#7F1D1D] via-[#C2410C] to-[#F97316]" },
  { name: "Taco Bell",           tags: "Mexican, Tacos, Burritos",        rating: 4.0, time: "25-30 mins", area: "Kurla · 3.2 km",        offer: "ITEMS\nAT ₹49",     emoji: "🌮", img: "/TacoBellNew.png",      bg: "from-[#3F3000] via-[#854D0E] to-[#D97706]" },
  { name: "Haldiram's",          tags: "North Indian, Sweets, Snacks",    rating: 4.5, time: "40-45 mins", area: "Santacruz East · 2.8 km",offer: "FREE\nDELIVERY",   emoji: "🍮", img: "/HalidRamNew.png",      bg: "from-[#713F12] via-[#B45309] to-[#F59E0B]" },
];

const INSTAMART = [
  { label: "Fruits & Veggies", emoji: "🥦", bg: "#E8F5E9" },
  { label: "Dairy & Bread",    emoji: "🥛", bg: "#E3F2FD" },
  { label: "Snacks & Chips",   emoji: "🍟", bg: "#FFF8E1" },
  { label: "Cold Drinks",      emoji: "🥤", bg: "#F3E5F5" },
  { label: "Ice Creams",       emoji: "🍦", bg: "#FCE4EC" },
  { label: "Bakery",           emoji: "🥐", bg: "#FBE9E7" },
];

const DINEOUT = [
  { name: "Fatty Bao",       cuisine: "Pan-Asian",         rating: 4.6, area: "Bandra West", deal: "20% off on pre-booking",  emoji: "🍜", bg: "from-red-700 to-pink-500"  },
  { name: "Social",          cuisine: "Continental · Bar", rating: 4.4, area: "Lower Parel", deal: "Free mocktail on ₹1500+", emoji: "🍹", bg: "from-gray-800 to-gray-600"  },
  { name: "The Black Pearl", cuisine: "Seafood · Coastal", rating: 4.3, area: "Juhu",        deal: "15% off on weekdays",      emoji: "🦞", bg: "from-blue-900 to-blue-700"  },
];

/* ─── SHARED COMPONENTS ─── */

function RatingBadge({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded bg-green-600 px-1.5 py-0.5 text-[11px] font-bold text-white leading-none">
      ★ {rating}
    </span>
  );
}

function DesktopRestaurantCard({ r }: { r: typeof RESTAURANTS[number] }) {
  const [line1, line2] = r.offer.split("\n");
  return (
    <div className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${r.bg} overflow-hidden`}>
        {r.img
          ? <img src={r.img} alt={r.name} className="absolute inset-0 h-full w-full object-cover" />
          : <span className="text-7xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{r.emoji}</span>
        }
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent pt-8 pb-2 px-3">
          <span className="text-xs font-bold text-white uppercase tracking-wide">{line1} {line2}</span>
        </div>
      </div>
      <div className="px-3 py-3">
        <h3 className="font-bold text-[15px] text-gray-900 leading-tight truncate">{r.name}</h3>
        <div className="mt-1.5 flex items-center gap-1.5">
          <RatingBadge rating={r.rating} />
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-500">{r.time}</span>
        </div>
        <p className="mt-1 text-xs text-gray-400 truncate">{r.tags}</p>
        <p className="mt-0.5 text-xs text-gray-400">{r.area.split("·")[0].trim()}</p>
      </div>
    </div>
  );
}

/* ─── PAGE ─── */

export default function Home() {
  return (
    <>
      {/* ════════════════════════════════════════
          MOBILE LAYOUT  (< md)
      ════════════════════════════════════════ */}
      <div className="md:hidden min-h-screen bg-[#09182A] font-sans">

        {/* ── Dark hero ── */}
        <div className="bg-[#09182A]">

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-5 pb-3">
            <button className="flex flex-col items-start">
              <div className="flex items-center gap-0.5">
                <span className="text-white font-black text-[20px] leading-tight tracking-tight">Home {CITY}</span>
                <svg viewBox="0 0 20 20" fill="white" className="h-5 w-5 shrink-0">
                  <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-[#5E7A96] text-[12px] mt-0.5 max-w-[220px] truncate">B-302, Patel Terrace, Jijamata Road,...</p>
            </button>
            <button className="flex items-center gap-2 bg-[#0D1E30] border border-[#1C3550]/60 rounded-full px-3 py-1.5 shrink-0">
              <div className="h-7 w-7 rounded-full bg-[#E03020] flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5">
                <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Service tabs */}
          <div className="flex gap-2 px-3 pb-4 overflow-x-auto scrollbar-hide">
            {/* Food — active */}
            <button className="shrink-0 flex flex-col items-center bg-[#1B3F62] rounded-[22px] px-2 pt-4 pb-3 w-[84px]">
              <span className="text-[34px] leading-none">🍔</span>
              <span className="text-white text-[12px] font-bold mt-2.5 whitespace-nowrap">Food</span>
            </button>
            {/* Instamart — badge is absolute, so same pt as others */}
            <button className="shrink-0 relative flex flex-col items-center bg-[#0B1A2B] rounded-[22px] px-2 pt-4 pb-3 w-[84px]">
              {/* <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1B68D4] text-white text-[9px] font-extrabold px-2.5 py-[3px] rounded-full whitespace-nowrap shadow-lg">17 mins</span> */}
              <span className="text-[34px] leading-none">🛒</span>
              <span className="text-[#5E7A96] text-[11px] mt-2.5 whitespace-nowrap">Instamart</span>
            </button>
            {/* Dineout */}
            <button className="shrink-0 flex flex-col items-center bg-[#0B1A2B] rounded-[22px] px-2 pt-4 pb-3 w-[84px]">
              <span className="text-[34px] leading-none">🍽</span>
              <span className="text-[#5E7A96] text-[11px] mt-2.5 whitespace-nowrap">Dineout</span>
            </button>
            {/* Scenes */}
            <button className="shrink-0 flex flex-col items-center bg-[#0B1A2B] rounded-[22px] px-2 pt-4 pb-3 w-[84px]">
              <span className="text-[34px] leading-none">🪩</span>
              <span className="text-[#5E7A96] text-[11px] mt-2.5 whitespace-nowrap">Scenes</span>
            </button>
          </div>

          {/* Search bar + VEG */}
          <div className="flex gap-2.5 px-3 pb-6">
            <div className="flex-1 flex items-center gap-2.5 bg-white rounded-2xl px-3.5 py-2.5 shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.2" className="h-5 w-5 shrink-0">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <span className="text-gray-400 text-[14px] flex-1 text-left">Search for &apos;Pizza&apos;</span>
              <svg viewBox="0 0 24 24" fill="#FC8019" className="h-5 w-5 shrink-0">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V22H8v2h8v-2h-3v-1.06A9 9 0 0 0 21 12v-2h-2Z" />
              </svg>
            </div>
            {/* <div className="bg-white rounded-2xl px-3 py-2.5 shadow-lg flex flex-col items-center justify-center gap-1.5 shrink-0 min-w-[64px]">
              <span className="text-[11px] font-bold text-[#1B7A40] tracking-wider">VEG</span>
              <div className="relative h-[22px] w-10 rounded-full bg-[#1B7A40] flex items-center shadow-inner">
                <div className="absolute right-[3px] h-4 w-4 rounded-full bg-white shadow" />
              </div>
            </div> */}
          </div>

          {/* 70% OFF promo */}
          <div className="relative flex items-center justify-around px-4 pb-8 pt-0 overflow-hidden">
            <span className="-mt-3 -left-0 top-2 text-[60px] leading-none select-none drop-shadow-2xl">🍔</span>
            <div className="text-center z-10 relative">
              <p
                className="font-black text-white leading-none tracking-tighter"
                style={{ fontSize: "32px", fontStyle: "italic" }}
              >
                70% OFF
              </p>
              <p className="font-extrabold text-[#FFC107] mt-1 tracking-tight" style={{ fontSize: "22px" }}>
                UP TO ₹140
              </p>
              <div className="flex items-center justify-center gap-[5px] mt-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="h-[4px] w-[4px] rounded-full bg-white/30 inline-block" />
                ))}
              </div>
            </div>
            <span className="-mt-3 -right-2 top-2 text-[60px] leading-none select-none drop-shadow-2xl">🍕</span>
          </div>
        </div>

        {/* ── White content (rounded top over dark) ── */}
        <div className="bg-white rounded-t-[32px] -mt-6 relative z-10 pb-28">

          {/* Yellow deal cards */}
         

          {/* REORDER / FAVS IN 15 MINS toggle */}
          <div className="px-3 mt-4 pt-5">
            <div className="flex bg-gray-100 rounded-full p-[5px]">
              <button className="flex-1 py-2.5 rounded-full bg-white shadow text-[12px] font-extrabold text-[#FC8019] tracking-widest">
                REORDER
              </button>
              <button className="flex-1 py-2.5 text-[12px] font-semibold text-gray-400 tracking-wider">
                FAVS IN 15 MINS
              </button>
            </div>
          </div>

          {/* Restaurant horizontal scroll */}
          <div className="mt-4 px-3">
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {RESTAURANTS.map((r) => {
                const [offerL1, offerL2] = r.offer.split("\n");
                return (
                  <div key={r.name} className="shrink-0 w-[150px] cursor-pointer">
                    <div className={`relative h-[155px] rounded-[20px] overflow-hidden bg-gradient-to-br ${r.bg}`}>
                      {/* one badge */}
                      <span className="absolute top-2 left-2 z-10 bg-[#E91E8C] text-white text-[10px] font-extrabold px-2.5 py-[3px] rounded-full leading-none shadow-md">
                        one
                      </span>
                      {/* heart */}
                      <button className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" className="h-3.5 w-3.5">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
                        </svg>
                      </button>
                      {/* food image or emoji */}
                      {r.img
                        ? <img src={r.img} alt={r.name} className="absolute inset-0 h-full w-full object-cover" />
                        : <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[70px] leading-none drop-shadow-2xl">{r.emoji}</span>
                          </div>
                      }
                      {/* offer overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-10 pb-2 px-2.5">
                        <p className="text-[12px] font-black text-white uppercase leading-tight">{offerL1}</p>
                        {offerL2 && <p className="text-[10px] font-bold text-white/85 uppercase leading-tight">{offerL2}</p>}
                      </div>
                    </div>
                    <div className="mt-1.5 px-0.5">
                      <p className="text-[13px] font-bold text-gray-900 truncate">{r.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <svg viewBox="0 0 12 12" fill="#22C55E" className="h-3 w-3 shrink-0">
                          <path d="M6 1l1.35 2.73 3.01.44-2.18 2.12.52 2.99L6 7.96 3.3 9.28l.52-2.99L1.64 4.17l3.01-.44z" />
                        </svg>
                        <span className="text-[11px] text-gray-500 font-medium">{r.rating} · {r.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{r.tags.split(",")[0].trim()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="h-2.5 bg-gray-50 mt-5" />

          {/* Category squares */}
          <div className="px-3 pt-4">
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((c) => (
                <button key={c.label} className="shrink-0 flex flex-col items-center gap-1.5 w-[72px]">
                  <div className="h-[72px] w-[72px] rounded-[18px] flex items-center justify-center text-[34px]" style={{ backgroundColor: c.bg }}>
                    {c.emoji}
                  </div>
                  <span className="text-[11px] text-gray-600 text-center leading-tight font-medium">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter chips */}
          <div className="px-3 mt-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button className="shrink-0 flex items-center gap-1.5 border border-gray-300 rounded-full px-3.5 py-2 text-[12px] font-semibold text-gray-700 bg-white shadow-sm">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
                  <path d="M3 5h14M6 10h8M9 15h2" />
                </svg>
                Filter
              </button>
              <button className="shrink-0 flex items-center gap-1 border border-gray-300 rounded-full px-3.5 py-2 text-[12px] font-semibold text-gray-700 bg-white shadow-sm">
                Sort by
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="shrink-0 flex items-center gap-1 border border-gray-200 rounded-full px-3.5 py-2 text-[12px] text-gray-600 bg-white">
                <span className="font-extrabold text-orange-500">one</span>
                <span className="font-medium">Extra off</span>
              </button>
              <button className="shrink-0 border border-gray-200 rounded-full px-3.5 py-2 text-[12px] font-medium text-gray-600 bg-white whitespace-nowrap">
                99 Store
              </button>
            </div>
          </div>

          {/* Count heading */}
          <div className="px-3 mt-4">
            <p className="text-[15px] font-bold text-gray-900">Top 1983 restaurants to explore</p>
            <p className="text-xs text-gray-400 mt-0.5">Featured Restaurants</p>
          </div>

          {/* Vertical restaurant list */}
          <div className="px-3 mt-2">
            {RESTAURANTS.map((r, i) => {
              const [offerL1, offerL2] = r.offer.split("\n");
              return (
                <div
                  key={r.name}
                  className={["flex gap-3 py-4 cursor-pointer", i < RESTAURANTS.length - 1 ? "border-b border-gray-100" : ""].join(" ")}
                >
                  <div className={`relative shrink-0 h-28 w-28 rounded-[18px] bg-gradient-to-br ${r.bg} overflow-hidden`}>
                    {r.img
                      ? <img src={r.img} alt={r.name} className="absolute inset-0 h-full w-full object-cover" />
                      : <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[52px] leading-none">{r.emoji}</span>
                        </div>
                    }
                    <button className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-white/90 shadow flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" className="h-3 w-3">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
                      </svg>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1.5">
                      <p className="text-[10px] font-black text-white uppercase leading-tight">{offerL1}</p>
                      {offerL2 && <p className="text-[9px] font-bold text-white/90 uppercase leading-tight">{offerL2}</p>}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 flex items-center gap-0.5 leading-none">
                      <span className="font-bold text-[#FC8019]">Bolt</span>
                      <span className="text-[10px]">⚡</span>
                      <span>Food in 10-15 min</span>
                    </p>
                    <p className="text-[15px] font-bold text-gray-900 mt-1 truncate">{r.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="inline-flex items-center gap-0.5 bg-green-500 rounded text-[10px] text-white px-1.5 py-0.5 font-bold">★ {r.rating}</span>
                      <span className="text-[12px] text-gray-500">· {r.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{r.tags}</p>
                    <p className="text-[11px] text-gray-400">{r.area}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] font-bold text-[#FC8019]">FREE DELIVERY</span>
                      <div className="flex items-center gap-0.5 border border-orange-200 rounded-full px-2 py-0.5">
                        <span className="text-[9px] font-extrabold text-orange-500">one</span>
                        <span className="text-[9px] text-gray-500 font-medium">BENEFITS</span>
                      </div>
                    </div>
                  </div>
                  <button className="shrink-0 self-start mt-1.5 text-gray-300 text-[22px] leading-none">⋮</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Fixed bottom nav ── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.07)]">
          <div className="flex items-end justify-between px-2 pt-1 pb-2">
            {/* Food — active */}
            <button className="flex flex-col items-center gap-[3px] px-2">
              <svg viewBox="0 0 24 24" fill="#FC8019" className="h-6 w-6">
                <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-4.5-6.72-5-8.03-5-1.26 0-8 .5-8 5h16.03zm-2.85-9.01H3.82a4.97 4.97 0 0 0-2.07 2.14L1 8.99h14l-.48-.86a4.87 4.87 0 0 0-1.34-2.14z" />
              </svg>
              <span className="text-[10px] font-bold text-[#FC8019]">Food</span>
            </button>
            {/* Bolt */}
            <button className="flex flex-col items-center gap-[3px] px-2 relative pt-4">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#FC8019] text-white text-[8px] font-extrabold px-[6px] py-[2px] rounded-full whitespace-nowrap leading-none">15 MIN</span>
              <svg viewBox="0 0 24 24" fill="#B0BEC5" className="h-6 w-6">
                <path d="M11.5 2L2 13h7.5L8 22l14-13h-7.5z" />
              </svg>
              <span className="text-[10px] text-gray-400">Bolt</span>
            </button>
            {/* 99 store */}
            <button className="flex flex-col items-center gap-[3px] px-2">
              <div className="h-7 w-7 flex items-center justify-center">
                <span className="text-[18px] font-black text-gray-400 leading-none">99</span>
              </div>
              <span className="text-[10px] text-gray-400">99 store</span>
            </button>
            {/* EatRight */}
            <button className="flex flex-col items-center gap-[3px] px-2 relative pt-4">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#16A34A] text-white text-[8px] font-extrabold px-[6px] py-[2px] rounded-full leading-none">NEW</span>
              <svg viewBox="0 0 24 24" fill="#B0BEC5" className="h-6 w-6">
                <path d="M17 8C8 10 5.9 16.17 3.82 19.02 2.8 20.42 3.6 22 5.19 22c.76 0 1.43-.39 1.81-1 .36-.59.57-1.29.69-2.01C8.07 17.35 9.48 14 12 13c-.13.86-.19 1.73-.19 2.6C11.81 20.36 15.27 24 19 24h1V22h-1c-2.26 0-5.19-2.31-5.19-6.4 0-.99.12-2 .38-3.02C15.24 11.86 17 9.96 17 8zm-5-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              <span className="text-[10px] text-gray-400">EatRight</span>
            </button>
            {/* Reorder */}
            <button className="flex flex-col items-center gap-[3px] px-2">
              <svg viewBox="0 0 24 24" fill="#B0BEC5" className="h-6 w-6">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
              </svg>
              <span className="text-[10px] text-gray-400">Reorder</span>
            </button>
            {/* Win ₹1000 */}
            {/* <button className="bg-[#E91E8C] text-white font-extrabold rounded-full px-4 py-[11px] text-[12px] whitespace-nowrap shadow-lg leading-none">
              Win ₹1000
            </button> */}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          DESKTOP LAYOUT  (≥ md)
      ════════════════════════════════════════ */}
      <div className="hidden md:block min-h-screen bg-white font-sans">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
            <a href="/" className="flex items-center gap-1.5 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FC8019]">
                <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold text-[#FC8019] tracking-tight leading-none">swiggy</span>
            </a>
            <button className="flex items-center gap-1 shrink-0 border-b-2 border-black pb-0.5">
              <span className="text-sm font-bold text-black uppercase tracking-wide">Other</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-[#FC8019]">
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex-1" />
            <nav className="hidden md:flex items-center gap-5">
              <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#FC8019] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 0-4 0v2" />
                </svg>
                Swiggy Corporate
              </a>
              <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#FC8019] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                Search
              </a>
              <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#FC8019] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><circle cx="7" cy="7" r="1" fill="currentColor" />
                </svg>
                Offers
                <span className="rounded-full bg-[#FC8019] px-1.5 py-px text-[9px] font-extrabold text-white leading-none">NEW</span>
              </a>
              <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#FC8019] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r=".5" fill="currentColor" />
                </svg>
                Help
              </a>
              <button className="text-sm font-bold text-gray-800 hover:text-[#FC8019] transition-colors">Sign In</button>
              <button className="flex items-center gap-1.5 text-sm font-bold text-gray-800 hover:text-[#FC8019] transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                </svg>
                Cart <span className="text-gray-400 font-normal">(0)</span>
              </button>
            </nav>
          </div>
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex border-t border-gray-100">
              {[{ label: "Food", icon: "🍔", active: true }, { label: "Instamart", icon: "⚡", active: false }, { label: "Dineout", icon: "🍽", active: false }, { label: "Genie", icon: "🧞", active: false }].map((tab) => (
                <button key={tab.label} className={["flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors", tab.active ? "border-[#FC8019] text-[#FC8019]" : "border-transparent text-gray-500 hover:text-gray-800"].join(" ")}>
                  <span>{tab.icon}</span>{tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-28">

          {/* Categories */}
          <section className="mt-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-extrabold text-gray-900">What&apos;s on your mind?</h2>
              <div className="flex items-center gap-1">
                {[{ d: "M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" }, { d: "M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" }].map((btn, i) => (
                  <button key={i} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 transition-colors">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d={btn.d} clipRule="evenodd" /></svg>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((c) => (
                <button key={c.label} className="shrink-0 flex flex-col items-center gap-2 w-[88px]">
                  <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full text-4xl shadow-sm hover:scale-105 transition-transform" style={{ backgroundColor: c.bg }}>{c.emoji}</div>
                  <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{c.label}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="my-6 h-3 -mx-4 bg-gray-100" />

          {/* Chains */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-extrabold text-gray-900">Top restaurant chains in {CITY}</h2>
              <div className="flex items-center gap-1">
                {[{ d: "M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" }, { d: "M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" }].map((btn, i) => (
                  <button key={i} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 transition-colors">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d={btn.d} clipRule="evenodd" /></svg>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {CHAINS.map((c) => (
                <div key={c.name} className="group shrink-0 w-[186px] cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${c.bg} overflow-hidden`}>
                    {c.img
                      ? <img src={c.img} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
                      : <span className="text-6xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{c.emoji}</span>
                    }
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-6 pb-2 px-3">
                      <span className="text-[11px] font-bold text-white uppercase tracking-wide">{c.offer}</span>
                    </div>
                  </div>
                  <div className="px-3 py-2.5">
                    <h3 className="font-bold text-[14px] text-gray-900 truncate">{c.name}</h3>
                    <div className="mt-1 flex items-center gap-1.5">
                      <RatingBadge rating={c.rating} />
                      <span className="text-gray-300 text-xs">·</span>
                      <span className="text-xs text-gray-500">{c.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400 truncate">{c.tags}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="my-6 h-3 -mx-4 bg-gray-100" />

          {/* Restaurant grid */}
          <section>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Restaurants with online food delivery in {CITY}</h2>
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
              <button className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400 transition-colors shadow-sm">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-500">
                  <path d="M3 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM6 10a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1ZM9 15a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
                </svg>
                Sort By
              </button>
              {["Ratings 4.0+", "Offers", "Pure Veg", "Fast Delivery"].map((l) => (
                <button key={l} className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-400 transition-colors">{l}</button>
              ))}
            </div>
            <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {RESTAURANTS.map((r) => <DesktopRestaurantCard key={r.name} r={r} />)}
            </div>
          </section>

          <div className="my-8 h-3 -mx-4 bg-gray-100" />

          {/* Instamart */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FC8019]"><span>⚡</span></div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Instamart</h2>
                </div>
                <p className="mt-0.5 ml-11 text-xs text-gray-400">Groceries &amp; essentials in 10 minutes</p>
              </div>
              <a href="#" className="text-sm font-bold text-[#FC8019] hover:underline flex items-center gap-1">
                See all <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {INSTAMART.map((item) => (
                <button key={item.label} className="flex flex-col items-center gap-2 rounded-2xl p-4 hover:scale-105 transition-transform" style={{ backgroundColor: item.bg }}>
                  <span className="text-4xl">{item.emoji}</span>
                  <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="my-8 h-3 -mx-4 bg-gray-100" />

          {/* Dineout */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600"><span>🍽</span></div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Dineout</h2>
                </div>
                <p className="mt-0.5 ml-11 text-xs text-gray-400">Book a table · Pre-book meals · Get exclusive deals</p>
              </div>
              <a href="#" className="text-sm font-bold text-purple-600 hover:underline flex items-center gap-1">
                Explore <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {DINEOUT.map((r) => (
                <div key={r.name} className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className={`relative h-40 flex items-center justify-center bg-gradient-to-br ${r.bg} overflow-hidden`}>
                    <span className="text-6xl drop-shadow group-hover:scale-110 transition-transform duration-300">{r.emoji}</span>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2">
                      <span className="text-xs font-bold text-white">{r.deal}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-[15px] text-gray-900">{r.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{r.cuisine}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <RatingBadge rating={r.rating} />
                      <span className="text-gray-300 text-xs">·</span>
                      <span className="text-xs text-gray-500">{r.area}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-16 border-t border-gray-100 pt-8">
            <div className="grid gap-8 sm:grid-cols-4">
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FC8019]">
                    <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                  </div>
                  <span className="text-xl font-extrabold text-[#FC8019]">swiggy</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">© 2025 Bundl Technologies Pvt. Ltd.</p>
              </div>
              {[
                { heading: "Company", links: ["About", "Careers", "Team", "Swiggy One", "Swiggy Instamart"] },
                { heading: "Contact", links: ["Help & Support", "Partner with us", "Ride with us"] },
                { heading: "Legal",   links: ["Terms & Conditions", "Cookie Policy", "Privacy Policy"] },
              ].map((col) => (
                <div key={col.heading}>
                  <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-3">{col.heading}</h4>
                  <ul className="space-y-2">
                    {col.links.map((l) => <li key={l}><a href="#" className="text-xs text-gray-400 hover:text-[#FC8019] transition-colors">{l}</a></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </footer>
        </main>
      </div>

      <ConciergeWidget />
    </>
  );
}
