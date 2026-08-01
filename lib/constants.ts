import { AmenityOption, City, CityInfo, Hotel, RoomTypeOption } from "@/types";

const now = new Date().toISOString();

export const SEED_CITIES: City[] = [
  { id: 1, name: { ar: "مكّة المكرمة", en: "Makkah", tr: "Mekke", ur: "مکہ مکرمہ" }, createdAt: now, updatedAt: now },
  { id: 2, name: { ar: "المدينة المنورة", en: "Madinah", tr: "Medine", ur: "مدینہ منورہ" }, createdAt: now, updatedAt: now },
  { id: 3, name: { ar: "جدّة", en: "Jeddah", tr: "Cidde", ur: "جدہ" }, createdAt: now, updatedAt: now },
  { id: 4, name: { ar: "الرياض", en: "Riyadh", tr: "Riyad", ur: "ریاض" }, createdAt: now, updatedAt: now },
  { id: 5, name: { ar: "الطائف", en: "Taif", tr: "Taif", ur: "طائف" }, createdAt: now, updatedAt: now },
];

export const CITY_LABELS: Record<string, CityInfo> = {
  "1": { ar: "مكّة المكرمة", en: "Makkah", tr: "Mekke", ur: "مکہ مکرمہ" },
  "2": { ar: "المدينة المنورة", en: "Madinah", tr: "Medine", ur: "مدینہ منورہ" },
  "3": { ar: "جدّة", en: "Jeddah", tr: "Cidde", ur: "جدہ" },
  "4": { ar: "الرياض", en: "Riyadh", tr: "Riyad", ur: "ریاض" },
  "5": { ar: "الطائف", en: "Taif", tr: "Taif", ur: "طائف" },
};

export const CITY_KEYS = Object.keys(CITY_LABELS);

export const ROOM_TYPES: RoomTypeOption[] = [
  { key: "single", ar: "فردي", en: "Single", tr: "Tek Kişilik", ur: "سنگل" },
  { key: "double", ar: "ثنائي", en: "Double", tr: "Çift Kişilik", ur: "ڈبل" },
  { key: "triple", ar: "ثلاثي", en: "Triple", tr: "Üç Kişilik", ur: "ٹرپل" },
  { key: "quad", ar: "رباعي", en: "Quad", tr: "Dört Kişilik", ur: "کواڈ (چار افراد)" },
  { key: "quint", ar: "خماسي", en: "Quintuple", tr: "Beş Kişilik", ur: "کوئنٹ (پانچ افراد)" },
];

export const AMENITIES: AmenityOption[] = [
  { key: "wifi", ar: "واي فاي مجاني", en: "Free Wi-Fi", tr: "Ücretsiz Wi-Fi", ur: "مفت وائی فائی" },
  { key: "breakfast", ar: "إفطار مجاني", en: "Free breakfast", tr: "Ücretsiz kahvaltı", ur: "مفت ناشتہ" },
  { key: "parking", ar: "موقف سيارات", en: "Parking", tr: "Otopark", ur: "پارکنگ" },
  { key: "pool", ar: "مسبح", en: "Pool", tr: "Havuz", ur: "سوئمنگ پول" },
  { key: "gym", ar: "صالة رياضية", en: "Gym", tr: "Spor salonu", ur: "جم" },
  { key: "ac", ar: "تكييف", en: "Air conditioning", tr: "Klima", ur: "ایئر کنڈیشنگ" },
  { key: "roomService", ar: "خدمة الغرف", en: "Room service", tr: "Oda servisi", ur: "روم سروس" },
  { key: "shuttle", ar: "مواصلات مجانية للحرم", en: "Free shuttle to Haram", tr: "Harem'e ücretsiz servis", ur: "حرم کے لیے مفت شٹل" },
];

export const SEED_HOTELS: Hotel[] = [
  {
    id: 1,
    name: { ar: "فندق أفق مكة", en: "Ufuq Makkah Hotel", tr: "Ufuq Mekke Oteli", ur: "افق مکہ ہوٹل" },
    city: SEED_CITIES[0],
    price: 850, totalRooms: 40, availableRooms: 12,
    description: {
      ar: "يبعد 400 متر عن الحرم المكي، إطلالة جزئية ومواصلات مجانية على مدار الساعة.",
      en: "Just 400 meters from the Grand Mosque, with a partial view and free 24-hour shuttle service.",
      tr: "Mescid-i Haram'a sadece 400 metre uzaklıkta, kısmi manzara ve 7/24 ücretsiz servis imkanı.",
      ur: "مسجد الحرام سے صرف 400 میٹر کی دوری پر، جزوی منظر اور 24 گھنٹے مفت شٹل سروس کے ساتھ۔",
    },
    image: "https://picsum.photos/seed/h_seed1/480/300",
    gallery: ["https://picsum.photos/seed/h_seed1b/480/300", "https://picsum.photos/seed/h_seed1c/480/300"],
    roomTypes: ["double", "quad"], amenities: ["wifi", "breakfast", "shuttle", "ac"],
    locationUrl: "https://maps.google.com/?q=Makkah+Clock+Royal+Tower",
    checkInTime: "من الساعة 3:00 عصرًا", checkOutTime: "حتى الساعة 12:00 ظهرًا", featured: true,
    createdAt: now, updatedAt: now,
  },
  {
    id: 2,
    name: { ar: "أجنحة نور المدينة", en: "Noor Al-Madinah Suites", tr: "Nur El-Medine Suitleri", ur: "نور المدینہ سوئٹس" },
    city: SEED_CITIES[1],
    price: 620, totalRooms: 30, availableRooms: 5,
    description: {
      ar: "على بعد خطوات من المسجد النبوي، غرف عائلية واسعة وإفطار سعودي أصيل.",
      en: "Just steps from the Prophet's Mosque, with spacious family rooms and an authentic Saudi breakfast.",
      tr: "Mescid-i Nebevi'ye sadece birkaç adım mesafede, geniş aile odaları ve otantik Suudi kahvaltısı.",
      ur: "مسجد نبوی سے چند قدم کے فاصلے پر، کشادہ فیملی کمرے اور روایتی سعودی ناشتہ۔",
    },
    image: "https://picsum.photos/seed/h_seed2/480/300",
    gallery: ["https://picsum.photos/seed/h_seed2b/480/300"],
    roomTypes: ["triple", "quad", "quint"], amenities: ["wifi", "breakfast", "parking"],
    locationUrl: "https://maps.google.com/?q=Al+Masjid+an+Nabawi",
    checkInTime: "من الساعة 2:00 عصرًا", checkOutTime: "حتى الساعة 12:00 ظهرًا", featured: true,
    createdAt: now, updatedAt: now,
  },
  {
    id: 3,
    name: { ar: "فندق مرسى جدة", en: "Marsa Jeddah Hotel", tr: "Marsa Cidde Oteli", ur: "مرسیٰ جدہ ہوٹل" },
    city: SEED_CITIES[2],
    price: 410, totalRooms: 25, availableRooms: 0,
    description: {
      ar: "إطلالة كاملة على الكورنيش، مناسب للعائلات ورجال الأعمال.",
      en: "Full view of the Corniche, ideal for families and business travelers.",
      tr: "Sahil şeridine tam manzara, aileler ve iş insanları için ideal.",
      ur: "کورنیش کا مکمل نظارہ، خاندانوں اور کاروباری افراد کے لیے موزوں۔",
    },
    image: "https://picsum.photos/seed/h_seed3/480/300",
    gallery: [],
    roomTypes: ["single", "double"], amenities: ["wifi", "pool", "gym", "parking"],
    locationUrl: "",
    checkInTime: "من الساعة 3:00 عصرًا", checkOutTime: "حتى الساعة 1:00 ظهرًا", featured: false,
    createdAt: now, updatedAt: now,
  },
];
