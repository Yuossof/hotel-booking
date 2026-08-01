import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin, Users, Mail, MessageCircle, Trash2, Pencil,
  CheckCircle2, XCircle, Building2, RefreshCw, X, BedDouble, Phone, Calendar, ArrowRight, ArrowLeft
} from 'lucide-react';

const STORAGE_KEY = "bir-platform-data-v2";
const IDENTITY_KEY = "bir-owner-identity";

const CITY_LABELS = {
  makkah: { ar: "مكّة المكرمة", en: "Makkah", tr: "Mekke", ur: "مکہ مکرمہ" },
  madinah: { ar: "المدينة المنورة", en: "Madinah", tr: "Medine", ur: "مدینہ منورہ" },
  jeddah: { ar: "جدّة", en: "Jeddah", tr: "Cidde", ur: "جدہ" },
  riyadh: { ar: "الرياض", en: "Riyadh", tr: "Riyad", ur: "ریاض" },
  taif: { ar: "الطائف", en: "Taif", tr: "Taif", ur: "طائف" },
};
const CITY_KEYS = Object.keys(CITY_LABELS);

const ROOM_TYPES = [
  { key: "single", ar: "فردي", en: "Single", tr: "Tek Kişilik", ur: "سنگل" },
  { key: "double", ar: "ثنائي", en: "Double", tr: "Çift Kişilik", ur: "ڈبل" },
  { key: "triple", ar: "ثلاثي", en: "Triple", tr: "Üç Kişilik", ur: "ٹرپل" },
  { key: "quad", ar: "رباعي", en: "Quad", tr: "Dört Kişilik", ur: "کواڈ (چار افراد)" },
  { key: "quint", ar: "خماسي", en: "Quintuple", tr: "Beş Kişilik", ur: "کوئنٹ (پانچ افراد)" },
];

const AMENITIES = [
  { key: "wifi", ar: "واي فاي مجاني", en: "Free Wi-Fi", tr: "Ücretsiz Wi-Fi", ur: "مفت وائی فائی" },
  { key: "breakfast", ar: "إفطار مجاني", en: "Free breakfast", tr: "Ücretsiz kahvaltı", ur: "مفت ناشتہ" },
  { key: "parking", ar: "موقف سيارات", en: "Parking", tr: "Otopark", ur: "پارکنگ" },
  { key: "pool", ar: "مسبح", en: "Pool", tr: "Havuz", ur: "سوئمنگ پول" },
  { key: "gym", ar: "صالة رياضية", en: "Gym", tr: "Spor salonu", ur: "جم" },
  { key: "ac", ar: "تكييف", en: "Air conditioning", tr: "Klima", ur: "ایئر کنڈیشنگ" },
  { key: "roomService", ar: "خدمة الغرف", en: "Room service", tr: "Oda servisi", ur: "روم سروس" },
  { key: "shuttle", ar: "مواصلات مجانية للحرم", en: "Free shuttle to Haram", tr: "Harem'e ücretsiz servis", ur: "حرم کے لیے مفت شٹل" },
];

const SEED_HOTELS = [
  {
    id: "h_seed1", ownerName: "فنادق الحرم الذهبية", ownerPhone: "+966500000001",
    name: { ar: "فندق أفق مكة", en: "Ufuq Makkah Hotel", tr: "Ufuq Mekke Oteli", ur: "افق مکہ ہوٹل" },
    city: "makkah", pricePerNight: 850, totalRooms: 40, availableRooms: 12,
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
  },
  {
    id: "h_seed2", ownerName: "مجموعة نور المدينة", ownerPhone: "+966500000002",
    name: { ar: "أجنحة نور المدينة", en: "Noor Al-Madinah Suites", tr: "Nur El-Medine Suitleri", ur: "نور المدینہ سوئٹس" },
    city: "madinah", pricePerNight: 620, totalRooms: 30, availableRooms: 5,
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
  },
  {
    id: "h_seed3", ownerName: "شركة الساحل للضيافة", ownerPhone: "+966500000003",
    name: { ar: "فندق مرسى جدة", en: "Marsa Jeddah Hotel", tr: "Marsa Cidde Oteli", ur: "مرسیٰ جدہ ہوٹل" },
    city: "jeddah", pricePerNight: 410, totalRooms: 25, availableRooms: 0,
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
  },
];

const T = {
  ar: {
    brand: "مقام", nav_guest: "واجهة الحجز", nav_owner: "لوحة صاحب الفندق",
    hero_title: "فنادق موثوقة، وتواصل فوري بخصوص توفر الغرفة",
    hero_subtitle: "اختر فندقك وأرسل طلب حجز — يتواصل معك صاحب الفندق مباشرة لتأكيد التوفر.",
    city_all: "كل المدن", pulse_suffix: "غرفة متاحة الآن",
    book_now: "اطلب الحجز", inquire: "استفسر عن التوفر", per_night: "/ الليلة",
    badge_full: "مكتمل الحجز", badge_low_suffix: "غرف متبقية", badge_available_suffix: "غرفة متاحة",
    no_hotels_city: "لا توجد فنادق مطروحة في هذه المدينة حتى الآن.",
    most_requested_title: "الأكثر طلبًا", most_requested_sub: "الفنادق اللي عليها إقبال أكبر من ضيوفنا",
    view_details: "عرض التفاصيل", back_to_list: "رجوع لكل الفنادق",
    detail_room_types: "أنواع الغرف المتاحة", detail_amenities: "وسائل الراحة", detail_about: "عن الفندق",
    detail_policies: "سياسة الدخول والخروج", detail_checkin: "الدخول", detail_checkout: "الخروج",
    detail_location: "الموقع", detail_open_maps: "فتح الموقع في خرائط جوجل",
    detail_no_location: "لم يتم إضافة رابط موقع لهذا الفندق بعد.", contact_whatsapp: "تواصل عبر واتساب",
    full_name: "الاسم الكامل", phone_whatsapp: "رقم الجوال (واتساب)", email_optional: "البريد الإلكتروني (اختياري)",
    checkin_date: "تاريخ الوصول", checkout_date: "تاريخ المغادرة", guests_count: "عدد الضيوف",
    room_type_label: "نوع الغرفة", room_type_any: "بدون تفضيل",
    submit_book: "إرسال طلب الحجز", submit_inquire: "إرسال استفسار عن التوفر",
    booking_note: "بإرسال الطلب سيتم إشعار صاحب الفندق فورًا، وسيتواصل معك لتأكيد توفر الغرفة.",
    error_required: "برجاء تعبئة الاسم ورقم الجوال وتاريخي الوصول والمغادرة.",
    error_dates: "تاريخ المغادرة لازم يكون بعد تاريخ الوصول.",
    no_rooms_hint: "لا توجد غرف متاحة معلنة حاليًا، لكن يمكنك إرسال استفسار وسيتواصل معك الفندق إذا توفرت غرفة.",
    identify_title: "تعريف المنشأة", identify_sub: "أدخل اسم منشأتك ورقم تواصلك لعرض فنادقك وحجوزاتك.",
    business_name_ph: "اسم المنشأة أو صاحب الفندق", contact_phone_ph: "رقم جوال التواصل (واتساب)",
    enter_dashboard: "دخول اللوحة", welcome: "أهلًا، ",
    tab_my_hotels: "فنادقي", tab_add_hotel: "إضافة فندق", tab_edit_hotel: "تعديل فندق", tab_bookings: "الحجوزات الواردة",
    my_hotels_empty: 'لم تضِف أي فندق بعد. ابدأ من تبويب "إضافة فندق".', edit: "تعديل", delete: "حذف",
    hotel_name_ph: "اسم الفندق", price_ph: "السعر لليلة (ريال)", rooms_ph: "إجمالي عدد الغرف",
    description_ph: "وصف مختصر للفندق", image_ph: "رابط صورة الفندق الرئيسية (اختياري)",
    gallery_ph: "روابط صور إضافية، افصل بينها بفاصلة (اختياري)",
    location_ph: "رابط موقع الفندق على خرائط جوجل (اختياري)",
    checkin_time_ph: "وقت الدخول (مثال: من 3 عصرًا)", checkout_time_ph: "وقت الخروج (مثال: حتى 12 ظهرًا)",
    room_types_label: "أنواع الغرف المتاحة (اختر أكثر من نوع)", amenities_label: "وسائل الراحة المتوفرة",
    featured_label: 'إضافة هذا الفندق ضمن "الأكثر طلبًا" في الصفحة الرئيسية',
    save_changes: "حفظ التعديلات", publish_hotel: "نشر الفندق على المنصة",
    hotel_error_required: "برجاء تعبئة اسم الفندق والسعر وعدد الغرف.",
    hotel_error_positive: "السعر وعدد الغرف لازم يكونوا أكبر من صفر.",
    bookings_empty: "لا توجد حجوزات واردة حتى الآن.", status_pending: "بانتظار الرد",
    status_confirmed: "تم التأكيد", status_declined: "تم الرفض",
    confirm_availability: "تأكيد التوفر", no_rooms: "لا توجد غرف",
    reset_demo_data: "إعادة تعيين بيانات العرض التجريبي",
    reset_confirm_text: "هل تريد مسح كل الفنادق والحجوزات التجريبية؟",
    reset_yes: "نعم، إعادة التعيين", reset_cancel: "إلغاء",
    footer_note: "هذا نموذج تفاعلي كامل الوظائف. رسائل البريد وواتساب المعروضة هي معاينة لما سيُرسل فعليًا — ربط إرسال حقيقي يتطلب حساب بريد وحساب WhatsApp Business API معتمد.",
    storage_error_banner: "تعذّر حفظ البيانات بشكل دائم الآن — التعديلات ظاهرة في هذه الجلسة فقط.",
    loading_text: "جارٍ تحميل المنصة...", notif_title_new: "تم إرسال طلبك — معاينة الإشعارات",
    notif_title_confirmed: "تم تأكيد التوفر — معاينة الإشعار للضيف",
    notif_title_declined: "تم رفض الطلب — معاينة الإشعار للضيف",
    notif_sub: "معاينة فقط — لم يتم إرسال رسالة حقيقية بعد (راجع الملاحظة أسفل الصفحة)",
    email_to_owner: "بريد إلكتروني لصاحب الفندق", whatsapp_to_owner: "واتساب لصاحب الفندق",
    email_to_guest: "بريد إلكتروني للضيف", whatsapp_to_guest: "واتساب للضيف",
    translating: "جارٍ الترجمة...", auto_translate_note: "سيتم ترجمة الاسم والوصف تلقائيًا للغات التانية.",
    source_lang_label: "بتكتب التفاصيل باللغة:",
  },
  en: {
    brand: "Muqam", nav_guest: "Book a Stay", nav_owner: "Hotel Owner Dashboard",
    hero_title: "Trusted hotels, with instant contact about room availability",
    hero_subtitle: "Pick your hotel and send a booking request — the hotel owner will reach out directly to confirm availability.",
    city_all: "All cities", pulse_suffix: "rooms available now",
    book_now: "Request booking", inquire: "Ask about availability", per_night: "/ night",
    badge_full: "Fully booked", badge_low_suffix: "rooms left", badge_available_suffix: "rooms available",
    no_hotels_city: "No hotels listed in this city yet.",
    most_requested_title: "Most requested", most_requested_sub: "The hotels our guests book the most",
    view_details: "View details", back_to_list: "Back to all hotels",
    detail_room_types: "Available room types", detail_amenities: "Amenities", detail_about: "About this hotel",
    detail_policies: "Check-in & check-out policy", detail_checkin: "Check-in", detail_checkout: "Check-out",
    detail_location: "Location", detail_open_maps: "Open location in Google Maps",
    detail_no_location: "No location link has been added for this hotel yet.", contact_whatsapp: "Contact on WhatsApp",
    full_name: "Full name", phone_whatsapp: "Phone number (WhatsApp)", email_optional: "Email (optional)",
    checkin_date: "Check-in date", checkout_date: "Check-out date", guests_count: "Number of guests",
    room_type_label: "Room type", room_type_any: "No preference",
    submit_book: "Send booking request", submit_inquire: "Send availability inquiry",
    booking_note: "The hotel owner will be notified immediately and will reach out to confirm room availability.",
    error_required: "Please fill in your name, phone number, and both dates.",
    error_dates: "The check-out date must be after the check-in date.",
    no_rooms_hint: "No rooms are currently listed as available, but you can still send an inquiry — the hotel will contact you if a room opens up.",
    identify_title: "Business details", identify_sub: "Enter your business name and contact number to see your hotels and bookings.",
    business_name_ph: "Business or hotel owner name", contact_phone_ph: "Contact phone number (WhatsApp)",
    enter_dashboard: "Enter dashboard", welcome: "Welcome, ",
    tab_my_hotels: "My hotels", tab_add_hotel: "Add hotel", tab_edit_hotel: "Edit hotel", tab_bookings: "Incoming bookings",
    my_hotels_empty: 'You haven\'t added any hotels yet. Start from the "Add hotel" tab.', edit: "Edit", delete: "Delete",
    hotel_name_ph: "Hotel name", price_ph: "Price per night (SAR)", rooms_ph: "Total number of rooms",
    description_ph: "Short hotel description", image_ph: "Main hotel image URL (optional)",
    gallery_ph: "Extra image URLs, comma-separated (optional)",
    location_ph: "Google Maps location link (optional)",
    checkin_time_ph: "Check-in time (e.g. from 3 PM)", checkout_time_ph: "Check-out time (e.g. until 12 PM)",
    room_types_label: "Available room types (select all that apply)", amenities_label: "Available amenities",
    featured_label: 'Feature this hotel in "Most requested" on the homepage',
    save_changes: "Save changes", publish_hotel: "Publish hotel on the platform",
    hotel_error_required: "Please fill in the hotel name, price, and number of rooms.",
    hotel_error_positive: "Price and number of rooms must be greater than zero.",
    bookings_empty: "No bookings received yet.", status_pending: "Awaiting response",
    status_confirmed: "Confirmed", status_declined: "Declined",
    confirm_availability: "Confirm availability", no_rooms: "No rooms available",
    reset_demo_data: "Reset demo data", reset_confirm_text: "Clear all demo hotels and bookings?",
    reset_yes: "Yes, reset", reset_cancel: "Cancel",
    footer_note: "This is a fully interactive prototype. The email and WhatsApp messages shown are previews of what would actually be sent — real delivery requires an email account and an approved WhatsApp Business API account.",
    storage_error_banner: "Could not save data permanently right now — changes are only visible in this session.",
    loading_text: "Loading platform...", notif_title_new: "Request sent — notification preview",
    notif_title_confirmed: "Availability confirmed — guest notification preview",
    notif_title_declined: "Request declined — guest notification preview",
    notif_sub: "Preview only — no real message has been sent yet (see the note at the bottom of the page)",
    email_to_owner: "Email to hotel owner", whatsapp_to_owner: "WhatsApp to hotel owner",
    email_to_guest: "Email to guest", whatsapp_to_guest: "WhatsApp to guest",
    translating: "Translating...", auto_translate_note: "The name and description will be automatically translated into the other languages.",
    source_lang_label: "You are writing the details in:",
  },
  tr: {
    brand: "Muqam", nav_guest: "Rezervasyon", nav_owner: "Otel Sahibi Paneli",
    hero_title: "Güvenilir oteller, müsaitlik hakkında anında iletişim",
    hero_subtitle: "Otelinizi seçin ve rezervasyon talebi gönderin — otel sahibi müsaitliği onaylamak için sizinle doğrudan iletişime geçecek.",
    city_all: "Tüm şehirler", pulse_suffix: "oda şu anda müsait",
    book_now: "Rezervasyon talep et", inquire: "Müsaitlik sor", per_night: "/ gece",
    badge_full: "Dolu", badge_low_suffix: "oda kaldı", badge_available_suffix: "oda müsait",
    no_hotels_city: "Bu şehirde henüz otel listelenmedi.",
    most_requested_title: "En çok talep edilen", most_requested_sub: "Misafirlerimizin en çok tercih ettiği oteller",
    view_details: "Detayları gör", back_to_list: "Tüm otellere dön",
    detail_room_types: "Mevcut oda tipleri", detail_amenities: "Olanaklar", detail_about: "Otel hakkında",
    detail_policies: "Giriş ve çıkış politikası", detail_checkin: "Giriş", detail_checkout: "Çıkış",
    detail_location: "Konum", detail_open_maps: "Google Haritalar'da aç",
    detail_no_location: "Bu otel için henüz bir konum bağlantısı eklenmedi.", contact_whatsapp: "WhatsApp'tan iletişime geç",
    full_name: "Ad soyad", phone_whatsapp: "Telefon numarası (WhatsApp)", email_optional: "E-posta (isteğe bağlı)",
    checkin_date: "Giriş tarihi", checkout_date: "Çıkış tarihi", guests_count: "Misafir sayısı",
    room_type_label: "Oda tipi", room_type_any: "Tercih yok",
    submit_book: "Rezervasyon talebi gönder", submit_inquire: "Müsaitlik talebi gönder",
    booking_note: "Otel sahibine anında bildirim gönderilecek ve müsaitliği onaylamak için sizinle iletişime geçecektir.",
    error_required: "Lütfen adınızı, telefon numaranızı ve her iki tarihi de girin.",
    error_dates: "Çıkış tarihi giriş tarihinden sonra olmalıdır.",
    no_rooms_hint: "Şu anda müsait oda görünmüyor, ancak yine de bir talep gönderebilirsiniz — oda açılırsa otel sizinle iletişime geçecektir.",
    identify_title: "İşletme bilgileri", identify_sub: "Otellerinizi ve rezervasyonlarınızı görmek için işletme adınızı ve iletişim numaranızı girin.",
    business_name_ph: "İşletme veya otel sahibinin adı", contact_phone_ph: "İletişim telefon numarası (WhatsApp)",
    enter_dashboard: "Panele git", welcome: "Hoş geldiniz, ",
    tab_my_hotels: "Otellerim", tab_add_hotel: "Otel ekle", tab_edit_hotel: "Oteli düzenle", tab_bookings: "Gelen rezervasyonlar",
    my_hotels_empty: 'Henüz otel eklemediniz. "Otel ekle" sekmesinden başlayın.', edit: "Düzenle", delete: "Sil",
    hotel_name_ph: "Otel adı", price_ph: "Gecelik fiyat (SAR)", rooms_ph: "Toplam oda sayısı",
    description_ph: "Kısa otel açıklaması", image_ph: "Ana otel görseli bağlantısı (isteğe bağlı)",
    gallery_ph: "Ek görsel bağlantıları, virgülle ayırın (isteğe bağlı)",
    location_ph: "Google Haritalar konum bağlantısı (isteğe bağlı)",
    checkin_time_ph: "Giriş saati (örn. 15:00'ten itibaren)", checkout_time_ph: "Çıkış saati (örn. 12:00'ye kadar)",
    room_types_label: "Mevcut oda tipleri (birden fazla seçebilirsiniz)", amenities_label: "Mevcut olanaklar",
    featured_label: 'Bu oteli ana sayfada "En çok talep edilen" bölümünde göster',
    save_changes: "Değişiklikleri kaydet", publish_hotel: "Oteli platformda yayınla",
    hotel_error_required: "Lütfen otel adını, fiyatı ve oda sayısını girin.",
    hotel_error_positive: "Fiyat ve oda sayısı sıfırdan büyük olmalıdır.",
    bookings_empty: "Henüz gelen rezervasyon yok.", status_pending: "Yanıt bekleniyor",
    status_confirmed: "Onaylandı", status_declined: "Reddedildi",
    confirm_availability: "Müsaitliği onayla", no_rooms: "Oda yok",
    reset_demo_data: "Demo verilerini sıfırla", reset_confirm_text: "Tüm demo otelleri ve rezervasyonları silmek istiyor musunuz?",
    reset_yes: "Evet, sıfırla", reset_cancel: "İptal",
    footer_note: "Bu tamamen etkileşimli bir prototiptir. Gösterilen e-posta ve WhatsApp mesajları gerçekte gönderilecek olanların önizlemesidir — gerçek gönderim için bir e-posta hesabı ve onaylı bir WhatsApp Business API hesabı gerekir.",
    storage_error_banner: "Veriler şu anda kalıcı olarak kaydedilemedi — değişiklikler yalnızca bu oturumda görünür.",
    loading_text: "Platform yükleniyor...", notif_title_new: "Talep gönderildi — bildirim önizlemesi",
    notif_title_confirmed: "Müsaitlik onaylandı — misafir bildirim önizlemesi",
    notif_title_declined: "Talep reddedildi — misafir bildirim önizlemesi",
    notif_sub: "Sadece önizleme — henüz gerçek bir mesaj gönderilmedi (sayfanın altındaki notu inceleyin)",
    email_to_owner: "Otel sahibine e-posta", whatsapp_to_owner: "Otel sahibine WhatsApp",
    email_to_guest: "Misafire e-posta", whatsapp_to_guest: "Misafire WhatsApp",
    translating: "Çevriliyor...", auto_translate_note: "Ad ve açıklama diğer dillere otomatik olarak çevrilecektir.",
    source_lang_label: "Detayları hangi dilde yazıyorsunuz:",
  },
  ur: {
    brand: "مقام", nav_guest: "بکنگ کریں", nav_owner: "ہوٹل مالک ڈیش بورڈ",
    hero_title: "قابل اعتماد ہوٹلز، کمرے کی دستیابی کے بارے میں فوری رابطہ",
    hero_subtitle: "اپنا ہوٹل منتخب کریں اور بکنگ کی درخواست بھیجیں — ہوٹل مالک دستیابی کی تصدیق کے لیے براہ راست آپ سے رابطہ کرے گا۔",
    city_all: "تمام شہر", pulse_suffix: "کمرے اس وقت دستیاب",
    book_now: "بکنگ کی درخواست دیں", inquire: "دستیابی کے بارے میں پوچھیں", per_night: "/ فی رات",
    badge_full: "مکمل بک", badge_low_suffix: "کمرے باقی", badge_available_suffix: "کمرے دستیاب",
    no_hotels_city: "اس شہر میں ابھی تک کوئی ہوٹل درج نہیں ہے۔",
    most_requested_title: "سب سے زیادہ مطلوب", most_requested_sub: "وہ ہوٹلز جو ہمارے مہمانوں کو سب سے زیادہ پسند ہیں",
    view_details: "تفصیلات دیکھیں", back_to_list: "تمام ہوٹلز پر واپس جائیں",
    detail_room_types: "دستیاب کمروں کی اقسام", detail_amenities: "سہولیات", detail_about: "ہوٹل کے بارے میں",
    detail_policies: "چیک ان اور چیک آؤٹ پالیسی", detail_checkin: "چیک ان", detail_checkout: "چیک آؤٹ",
    detail_location: "مقام", detail_open_maps: "گوگل میپس میں مقام کھولیں",
    detail_no_location: "اس ہوٹل کے لیے ابھی تک کوئی مقام کا لنک شامل نہیں کیا گیا۔", contact_whatsapp: "واٹس ایپ پر رابطہ کریں",
    full_name: "پورا نام", phone_whatsapp: "فون نمبر (واٹس ایپ)", email_optional: "ای میل (اختیاری)",
    checkin_date: "آمد کی تاریخ", checkout_date: "روانگی کی تاریخ", guests_count: "مہمانوں کی تعداد",
    room_type_label: "کمرے کی قسم", room_type_any: "کوئی ترجیح نہیں",
    submit_book: "بکنگ کی درخواست بھیجیں", submit_inquire: "دستیابی کی درخواست بھیجیں",
    booking_note: "ہوٹل مالک کو فوری طور پر مطلع کیا جائے گا اور وہ کمرے کی دستیابی کی تصدیق کے لیے آپ سے رابطہ کرے گا۔",
    error_required: "براہ کرم اپنا نام، فون نمبر، اور دونوں تاریخیں درج کریں۔",
    error_dates: "روانگی کی تاریخ آمد کی تاریخ کے بعد ہونی چاہیے۔",
    no_rooms_hint: "فی الحال کوئی کمرہ دستیاب نہیں ہے، لیکن آپ پھر بھی درخواست بھیج سکتے ہیں — اگر کمرہ دستیاب ہوا تو ہوٹل آپ سے رابطہ کرے گا۔",
    identify_title: "کاروباری تفصیلات", identify_sub: "اپنے ہوٹلز اور بکنگز دیکھنے کے لیے اپنے کاروبار کا نام اور رابطہ نمبر درج کریں۔",
    business_name_ph: "کاروبار یا ہوٹل مالک کا نام", contact_phone_ph: "رابطہ فون نمبر (واٹس ایپ)",
    enter_dashboard: "ڈیش بورڈ میں داخل ہوں", welcome: "خوش آمدید، ",
    tab_my_hotels: "میرے ہوٹلز", tab_add_hotel: "ہوٹل شامل کریں", tab_edit_hotel: "ہوٹل میں ترمیم کریں", tab_bookings: "موصولہ بکنگز",
    my_hotels_empty: 'آپ نے ابھی تک کوئی ہوٹل شامل نہیں کیا۔ "ہوٹل شامل کریں" ٹیب سے شروع کریں۔', edit: "ترمیم", delete: "حذف کریں",
    hotel_name_ph: "ہوٹل کا نام", price_ph: "فی رات قیمت (SAR)", rooms_ph: "کمروں کی کل تعداد",
    description_ph: "ہوٹل کی مختصر تفصیل", image_ph: "ہوٹل کی مرکزی تصویر کا لنک (اختیاری)",
    gallery_ph: "اضافی تصاویر کے لنکس، کاما سے الگ کریں (اختیاری)",
    location_ph: "گوگل میپس مقام کا لنک (اختیاری)",
    checkin_time_ph: "چیک ان کا وقت (مثلاً 3 بجے سے)", checkout_time_ph: "چیک آؤٹ کا وقت (مثلاً 12 بجے تک)",
    room_types_label: "دستیاب کمروں کی اقسام (ایک سے زیادہ منتخب کریں)", amenities_label: "دستیاب سہولیات",
    featured_label: 'اس ہوٹل کو ہوم پیج پر "سب سے زیادہ مطلوب" میں شامل کریں',
    save_changes: "تبدیلیاں محفوظ کریں", publish_hotel: "ہوٹل کو پلیٹ فارم پر شائع کریں",
    hotel_error_required: "براہ کرم ہوٹل کا نام، قیمت، اور کمروں کی تعداد درج کریں۔",
    hotel_error_positive: "قیمت اور کمروں کی تعداد صفر سے زیادہ ہونی چاہیے۔",
    bookings_empty: "ابھی تک کوئی بکنگ موصول نہیں ہوئی۔", status_pending: "جواب کا انتظار",
    status_confirmed: "تصدیق شدہ", status_declined: "مسترد",
    confirm_availability: "دستیابی کی تصدیق کریں", no_rooms: "کوئی کمرہ دستیاب نہیں",
    reset_demo_data: "ڈیمو ڈیٹا دوبارہ ترتیب دیں", reset_confirm_text: "کیا آپ تمام ڈیمو ہوٹلز اور بکنگز حذف کرنا چاہتے ہیں؟",
    reset_yes: "ہاں، دوبارہ ترتیب دیں", reset_cancel: "منسوخ کریں",
    footer_note: "یہ ایک مکمل طور پر انٹرایکٹو پروٹوٹائپ ہے۔ دکھائے گئے ای میل اور واٹس ایپ پیغامات اصل میں بھیجے جانے والے پیغامات کا پیش منظر ہیں — حقیقی ترسیل کے لیے ای میل اکاؤنٹ اور منظور شدہ WhatsApp Business API اکاؤنٹ درکار ہے۔",
    storage_error_banner: "ڈیٹا اس وقت مستقل طور پر محفوظ نہیں ہو سکا — تبدیلیاں صرف اس سیشن میں نظر آ رہی ہیں۔",
    loading_text: "پلیٹ فارم لوڈ ہو رہا ہے...", notif_title_new: "درخواست بھیج دی گئی — نوٹیفیکیشن پیش منظر",
    notif_title_confirmed: "دستیابی کی تصدیق ہو گئی — مہمان کے لیے نوٹیفیکیشن پیش منظر",
    notif_title_declined: "درخواست مسترد کر دی گئی — مہمان کے لیے نوٹیفیکیشن پیش منظر",
    notif_sub: "صرف پیش منظر — ابھی تک کوئی حقیقی پیغام نہیں بھیجا گیا (صفحے کے آخر میں نوٹ دیکھیں)",
    email_to_owner: "ہوٹل مالک کو ای میل", whatsapp_to_owner: "ہوٹل مالک کو واٹس ایپ",
    email_to_guest: "مہمان کو ای میل", whatsapp_to_guest: "مہمان کو واٹس ایپ",
    translating: "ترجمہ ہو رہا ہے...", auto_translate_note: "نام اور تفصیل خود بخود دوسری زبانوں میں ترجمہ ہو جائیں گے۔",
    source_lang_label: "آپ کس زبان میں تفصیلات لکھ رہے ہیں؟",
  },
};

function uid(prefix) {
  return prefix + "_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
}
function toWaLink(phone, text) {
  const digits = (phone || "").replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
function hotelLink(hotelId) {
  const base = (typeof window !== "undefined" && window.location ? window.location.href.split("?")[0].split("#")[0] : "https://your-domain.com/");
  return `${base}?hotel=${hotelId}`;
}
function waInquiryText(hotelId, displayName, lang, cityLabel) {
  const link = hotelLink(hotelId);
  if (lang === "en") return `Hi, I'm interested in booking "${displayName}" (${cityLabel}).\nHotel link: ${link}`;
  if (lang === "tr") return `Merhaba, "${displayName}" (${cityLabel}) için rezervasyon yaptırmak istiyorum.\nOtel bağlantısı: ${link}`;
  if (lang === "ur") return `السلام علیکم، مجھے "${displayName}" (${cityLabel}) میں بکنگ میں دلچسپی ہے۔\nہوٹل لنک: ${link}`;
  return `مرحبًا، أنا مهتم بالحجز في "${displayName}" (${cityLabel}).\nرابط الفندق: ${link}`;
}
function formatPrice(n, lang) {
  const num = Number(n) || 0;
  if (lang === "en") return num.toLocaleString("en-US") + " SAR";
  if (lang === "tr") return num.toLocaleString("tr-TR") + " SAR";
  if (lang === "ur") return num.toLocaleString("en-US") + " ریال";
  return num.toLocaleString("ar-SA") + " ريال";
}
function localized(field, lang) {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.ar || field.en || Object.values(field)[0] || "";
}
// Free, no-API-key translation lookup (MyMemory). Best-effort only: on any
// failure or rate limit, falls back to the original text for that language
// so the hotel listing never ends up blank.
async function translateText(text, sourceLang, targetLang) {
  if (!text || !text.trim()) return "";
  if (sourceLang === targetLang) return text;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    const res = await fetch(url);
    const data = await res.json();
    const translated = data && data.responseData && data.responseData.translatedText;
    if (translated && !/MYMEMORY WARNING/i.test(translated)) return translated;
    return text;
  } catch (e) {
    return text;
  }
}
async function translateAll(name, description, sourceLang) {
  const targets = ["ar", "en", "tr", "ur"].filter((l) => l !== sourceLang);
  const nameMap = { [sourceLang]: name };
  const descMap = { [sourceLang]: description };
  await Promise.all(targets.map(async (tl) => {
    const [tn, td] = await Promise.all([
      translateText(name, sourceLang, tl),
      translateText(description, sourceLang, tl),
    ]);
    nameMap[tl] = tn;
    descMap[tl] = td;
  }));
  return { nameMap, descMap };
}

const MSG = {
  ar: {
    new_request: (b, h) => ({
      ownerEmailSubject: `طلب حجز جديد — ${h.name}`,
      ownerEmailBody: `وصلك طلب حجز جديد من ${b.guestName} لفندق "${h.name}" من ${b.checkIn} إلى ${b.checkOut} (${b.guestsCount} ضيف). برجاء تأكيد إتاحة الغرفة من لوحة التحكم.`,
      ownerWhatsapp: `مرحبًا، وصلك طلب حجز جديد:\nالفندق: ${h.name}\nالضيف: ${b.guestName} — ${b.guestPhone}\nالتاريخ: ${b.checkIn} → ${b.checkOut}\nعدد الضيوف: ${b.guestsCount}\nبرجاء تأكيد التوفر من لوحة التحكم.`,
      guestEmailSubject: `تم استلام طلبك — ${h.name}`,
      guestEmailBody: `شكرًا لك ${b.guestName}. وصلنا طلبك لحجز "${h.name}" من ${b.checkIn} إلى ${b.checkOut}. سيتواصل معك الفندق بخصوص تأكيد التوفر قريبًا.`,
    }),
    confirmed: (b, h) => ({
      guestEmailSubject: `تم تأكيد التوفر — ${h.name}`,
      guestEmailBody: `أخبار سارة ${b.guestName}! تم تأكيد توفر غرفة في "${h.name}" من ${b.checkIn} إلى ${b.checkOut}. سعر الليلة: ${formatPrice(h.pricePerNight, "ar")}.`,
      guestWhatsapp: `مرحبًا ${b.guestName} 👋\nتم تأكيد إتاحة غرفة في "${h.name}" من ${b.checkIn} إلى ${b.checkOut}.\nللاستفسار: ${h.ownerPhone}`,
    }),
    declined: (b, h) => ({
      guestEmailSubject: `تحديث على طلبك — ${h.name}`,
      guestEmailBody: `نأسف، لا تتوفر غرف حاليًا في "${h.name}" لتواريخك (${b.checkIn} إلى ${b.checkOut}). يمكنك تصفح فنادق أخرى متاحة.`,
      guestWhatsapp: `مرحبًا ${b.guestName}، للأسف لا توجد غرف متاحة حاليًا في "${h.name}" لتواريخك. نرشح لك تصفح فنادق أخرى قريبة.`,
    }),
  },
  en: {
    new_request: (b, h) => ({
      ownerEmailSubject: `New booking request — ${h.name}`,
      ownerEmailBody: `You have a new booking request from ${b.guestName} for "${h.name}" from ${b.checkIn} to ${b.checkOut} (${b.guestsCount} guests). Please confirm room availability from your dashboard.`,
      ownerWhatsapp: `Hi, you have a new booking request:\nHotel: ${h.name}\nGuest: ${b.guestName} — ${b.guestPhone}\nDates: ${b.checkIn} → ${b.checkOut}\nGuests: ${b.guestsCount}\nPlease confirm availability from your dashboard.`,
      guestEmailSubject: `Your request was received — ${h.name}`,
      guestEmailBody: `Thank you ${b.guestName}. We received your request to book "${h.name}" from ${b.checkIn} to ${b.checkOut}. The hotel will contact you shortly to confirm availability.`,
    }),
    confirmed: (b, h) => ({
      guestEmailSubject: `Availability confirmed — ${h.name}`,
      guestEmailBody: `Good news ${b.guestName}! A room at "${h.name}" is confirmed for your stay from ${b.checkIn} to ${b.checkOut}. Rate: ${formatPrice(h.pricePerNight, "en")} per night.`,
      guestWhatsapp: `Hi ${b.guestName} 👋\nA room at "${h.name}" is confirmed for ${b.checkIn} to ${b.checkOut}.\nFor inquiries: ${h.ownerPhone}`,
    }),
    declined: (b, h) => ({
      guestEmailSubject: `Update on your request — ${h.name}`,
      guestEmailBody: `We're sorry, no rooms are currently available at "${h.name}" for your dates (${b.checkIn} to ${b.checkOut}). Feel free to browse other available hotels.`,
      guestWhatsapp: `Hi ${b.guestName}, unfortunately no rooms are available right now at "${h.name}" for your dates. We recommend browsing other nearby hotels.`,
    }),
  },
  tr: {
    new_request: (b, h) => ({
      ownerEmailSubject: `Yeni rezervasyon talebi — ${h.name}`,
      ownerEmailBody: `${b.guestName} adlı misafirden "${h.name}" için ${b.checkIn} - ${b.checkOut} tarihleri arasında (${b.guestsCount} misafir) yeni bir rezervasyon talebi aldınız. Lütfen panelinizden oda müsaitliğini onaylayın.`,
      ownerWhatsapp: `Merhaba, yeni bir rezervasyon talebiniz var:\nOtel: ${h.name}\nMisafir: ${b.guestName} — ${b.guestPhone}\nTarih: ${b.checkIn} → ${b.checkOut}\nMisafir sayısı: ${b.guestsCount}\nLütfen panelinizden müsaitliği onaylayın.`,
      guestEmailSubject: `Talebiniz alındı — ${h.name}`,
      guestEmailBody: `Teşekkürler ${b.guestName}. "${h.name}" için ${b.checkIn} - ${b.checkOut} tarihleri arasındaki rezervasyon talebinizi aldık. Otel, müsaitliği onaylamak için kısa süre içinde sizinle iletişime geçecek.`,
    }),
    confirmed: (b, h) => ({
      guestEmailSubject: `Müsaitlik onaylandı — ${h.name}`,
      guestEmailBody: `Güzel haber ${b.guestName}! "${h.name}" otelinde ${b.checkIn} - ${b.checkOut} tarihleri için oda onaylandı. Gecelik ücret: ${formatPrice(h.pricePerNight, "tr")}.`,
      guestWhatsapp: `Merhaba ${b.guestName} 👋\n"${h.name}" otelinde ${b.checkIn} - ${b.checkOut} için oda onaylandı.\nSorularınız için: ${h.ownerPhone}`,
    }),
    declined: (b, h) => ({
      guestEmailSubject: `Talebiniz hakkında güncelleme — ${h.name}`,
      guestEmailBody: `Üzgünüz, "${h.name}" otelinde belirttiğiniz tarihler (${b.checkIn} - ${b.checkOut}) için şu anda müsait oda bulunmuyor. Diğer otellere göz atabilirsiniz.`,
      guestWhatsapp: `Merhaba ${b.guestName}, maalesef şu anda "${h.name}" otelinde belirttiğiniz tarihler için müsait oda yok. Yakındaki diğer otellere göz atmanızı öneririz.`,
    }),
  },
  ur: {
    new_request: (b, h) => ({
      ownerEmailSubject: `نئی بکنگ کی درخواست — ${h.name}`,
      ownerEmailBody: `آپ کو ${b.guestName} کی جانب سے "${h.name}" کے لیے ${b.checkIn} سے ${b.checkOut} تک (${b.guestsCount} مہمان) ایک نئی بکنگ کی درخواست موصول ہوئی ہے۔ براہ کرم اپنے ڈیش بورڈ سے کمرے کی دستیابی کی تصدیق کریں۔`,
      ownerWhatsapp: `السلام علیکم، آپ کو ایک نئی بکنگ کی درخواست موصول ہوئی ہے:\nہوٹل: ${h.name}\nمہمان: ${b.guestName} — ${b.guestPhone}\nتاریخ: ${b.checkIn} → ${b.checkOut}\nمہمانوں کی تعداد: ${b.guestsCount}\nبراہ کرم ڈیش بورڈ سے دستیابی کی تصدیق کریں۔`,
      guestEmailSubject: `آپ کی درخواست موصول ہو گئی — ${h.name}`,
      guestEmailBody: `شکریہ ${b.guestName}۔ ہمیں "${h.name}" کے لیے ${b.checkIn} سے ${b.checkOut} تک آپ کی بکنگ کی درخواست موصول ہوئی۔ ہوٹل جلد ہی دستیابی کی تصدیق کے لیے آپ سے رابطہ کرے گا۔`,
    }),
    confirmed: (b, h) => ({
      guestEmailSubject: `دستیابی کی تصدیق ہو گئی — ${h.name}`,
      guestEmailBody: `خوشخبری ${b.guestName}! "${h.name}" میں آپ کے قیام کے لیے ${b.checkIn} سے ${b.checkOut} تک کمرہ کنفرم ہو گیا ہے۔ فی رات قیمت: ${formatPrice(h.pricePerNight, "ur")}۔`,
      guestWhatsapp: `السلام علیکم ${b.guestName} 👋\n"${h.name}" میں ${b.checkIn} سے ${b.checkOut} تک کمرہ کنفرم ہو گیا ہے۔\nمعلومات کے لیے: ${h.ownerPhone}`,
    }),
    declined: (b, h) => ({
      guestEmailSubject: `آپ کی درخواست پر اپ ڈیٹ — ${h.name}`,
      guestEmailBody: `معذرت، "${h.name}" میں آپ کی تاریخوں (${b.checkIn} سے ${b.checkOut}) کے لیے فی الحال کوئی کمرہ دستیاب نہیں ہے۔ آپ دیگر دستیاب ہوٹلز دیکھ سکتے ہیں۔`,
      guestWhatsapp: `السلام علیکم ${b.guestName}، معذرت کے ساتھ "${h.name}" میں آپ کی تاریخوں کے لیے فی الحال کوئی کمرہ دستیاب نہیں۔ ہم دیگر قریبی ہوٹلز دیکھنے کی تجویز دیتے ہیں۔`,
    }),
  },
};
function buildMessages(kind, booking, hotel, lang) {
  const l = MSG[lang] ? lang : "ar";
  return MSG[l][kind](booking, hotel);
}

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
    .bir-app {
      --bg: #FAF6EF; --surface: #FFFFFF; --ink: #1C2620; --ink-soft: #5B6560;
      --primary: #0E5C43; --primary-dark: #0A4633; --primary-tint: #E4EFE9;
      --gold: #B98D3E; --gold-tint: #F6ECD9; --line: #E7E1D3;
      --danger: #B54A3F; --danger-tint: #F7E9E6;
      font-family: 'IBM Plex Sans Arabic', sans-serif;
      background: var(--bg); color: var(--ink); min-height: 100vh;
    }
    .bir-app .bir-display { font-family: 'Cairo', sans-serif; }
    .bir-app *:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
    .bir-btn { font-family: 'IBM Plex Sans Arabic', sans-serif; font-weight: 600; border: none; cursor: pointer; transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease; }
    .bir-btn:active { transform: scale(0.97); }
    .bir-btn-primary { background: var(--primary); color: #fff; }
    .bir-btn-primary:hover { background: var(--primary-dark); }
    .bir-btn-primary:disabled { background: #B9C4BF; cursor: not-allowed; }
    .bir-btn-ghost { background: transparent; color: var(--primary); border: 1px solid var(--line); }
    .bir-btn-ghost:hover { background: var(--primary-tint); }
    .bir-btn-danger { background: var(--danger-tint); color: var(--danger); }
    .bir-btn-danger:hover { background: #F0D6D0; }
    .bir-card { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; }
    .bir-input { font-family: 'IBM Plex Sans Arabic', sans-serif; background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 10px 14px; color: var(--ink); width: 100%; }
    .bir-input:focus { border-color: var(--primary); }
    .bir-input::placeholder { color: #A6A198; }
    .bir-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
    .bir-badge-available { background: var(--primary-tint); color: var(--primary-dark); }
    .bir-badge-low { background: var(--gold-tint); color: #8A6A26; }
    .bir-badge-full { background: var(--danger-tint); color: var(--danger); }
    .bir-pulse-dot { width: 8px; height: 8px; border-radius: 999px; background: #E9573F; animation: bir-pulse 1.8s infinite; }
    @keyframes bir-pulse { 0% { box-shadow: 0 0 0 0 rgba(233,87,63,0.5); } 70% { box-shadow: 0 0 0 8px rgba(233,87,63,0); } 100% { box-shadow: 0 0 0 0 rgba(233,87,63,0); } }
    .bir-marquee-track { display: flex; gap: 12px; width: max-content; animation: bir-marquee 22s linear infinite; }
    @keyframes bir-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @media (prefers-reduced-motion: reduce) { .bir-marquee-track { animation: none; } .bir-pulse-dot { animation: none; } }
    .bir-slideover { animation: bir-slide-in 0.25s ease-out; }
    @keyframes bir-slide-in { from { transform: translateX(-24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .bir-toast { animation: bir-toast-in 0.2s ease-out; }
    @keyframes bir-toast-in { from { transform: translateY(-12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .bir-clickable { cursor: pointer; }
  `}</style>
);

function AvailabilityPulse({ hotels, lang, t }) {
  const byCity = CITY_KEYS.map((city) => {
    const inCity = hotels.filter((h) => h.city === city);
    const rooms = inCity.reduce((sum, h) => sum + (Number(h.availableRooms) || 0), 0);
    return { city, rooms, count: inCity.length };
  }).filter((c) => c.count > 0);
  if (byCity.length === 0) return null;
  const loop = [...byCity, ...byCity];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
      <div className="bir-marquee-track" style={{ padding: "10px 0" }}>
        {loop.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 18px", borderInlineEnd: "1px solid var(--line)", whiteSpace: "nowrap" }}>
            <span className="bir-pulse-dot" />
            <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{CITY_LABELS[c.city][lang]}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary-dark)" }}>{c.rooms} {t("pulse_suffix")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationPreview({ data, onClose, t }) {
  if (!data) return null;
  const { kind, messages } = data;
  const title = kind === "new_request" ? t("notif_title_new") : kind === "confirmed" ? t("notif_title_confirmed") : t("notif_title_declined");
  return (
    <div className="bir-toast bir-card" style={{ position: "fixed", top: 16, insetInlineStart: "50%", transform: "translateX(-50%)", zIndex: 60, width: "min(92vw, 480px)", padding: 16, boxShadow: "0 12px 32px rgba(28,38,32,0.18)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div className="bir-display" style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
          <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{t("notif_sub")}</div>
        </div>
        <button className="bir-btn" onClick={onClose} style={{ background: "transparent", padding: 4 }} aria-label="close"><X size={18} color="var(--ink-soft)" /></button>
      </div>
      {messages.ownerEmailBody && (
        <div style={{ background: "var(--bg)", borderRadius: 10, padding: 10, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", marginBottom: 4 }}><Mail size={14} /> {t("email_to_owner")}</div>
          <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 2 }}>{messages.ownerEmailSubject}</div>
          <div style={{ fontSize: 13 }}>{messages.ownerEmailBody}</div>
        </div>
      )}
      {messages.ownerWhatsapp && (
        <div style={{ background: "#E9F7EF", borderRadius: 10, padding: 10, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#1B8A50", marginBottom: 4 }}><MessageCircle size={14} /> {t("whatsapp_to_owner")}</div>
          <div style={{ fontSize: 13, whiteSpace: "pre-line" }}>{messages.ownerWhatsapp}</div>
        </div>
      )}
      {messages.guestEmailBody && (
        <div style={{ background: "var(--bg)", borderRadius: 10, padding: 10, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", marginBottom: 4 }}><Mail size={14} /> {t("email_to_guest")}</div>
          <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 2 }}>{messages.guestEmailSubject}</div>
          <div style={{ fontSize: 13 }}>{messages.guestEmailBody}</div>
        </div>
      )}
      {messages.guestWhatsapp && (
        <div style={{ background: "#E9F7EF", borderRadius: 10, padding: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#1B8A50", marginBottom: 4 }}><MessageCircle size={14} /> {t("whatsapp_to_guest")}</div>
          <div style={{ fontSize: 13, whiteSpace: "pre-line" }}>{messages.guestWhatsapp}</div>
        </div>
      )}
    </div>
  );
}

function HotelCard({ hotel, lang, t, onOpenDetail, onQuickBook }) {
  const ratio = hotel.totalRooms > 0 ? hotel.availableRooms / hotel.totalRooms : 0;
  const badge =
    hotel.availableRooms === 0 ? { cls: "bir-badge-full", label: t("badge_full") } :
    ratio < 0.25 ? { cls: "bir-badge-low", label: `${hotel.availableRooms} ${t("badge_low_suffix")}` } :
    { cls: "bir-badge-available", label: `${hotel.availableRooms} ${t("badge_available_suffix")}` };
  const cityLabel = CITY_LABELS[hotel.city] ? CITY_LABELS[hotel.city][lang] : hotel.city;
  const displayName = localized(hotel.name, lang);
  const displayDesc = localized(hotel.description, lang);
  const waHref = toWaLink(hotel.ownerPhone, waInquiryText(hotel.id, displayName, lang, cityLabel));

  return (
    <div className="bir-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="bir-clickable" onClick={() => onOpenDetail(hotel)} style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", background: "var(--bg)" }}>
        <img src={hotel.image || `https://picsum.photos/seed/${hotel.id}/480/300`} alt={displayName} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <span className={`bir-badge ${badge.cls}`} style={{ position: "absolute", top: 10, insetInlineStart: 10 }}>{badge.label}</span>
      </div>
      <div className="bir-clickable" onClick={() => onOpenDetail(hotel)} style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--gold)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13} /> {cityLabel}</div>
          <div className="bir-display" style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{displayName}</div>
        </div>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0, lineHeight: 1.6 }}>{displayDesc}</p>
        <div style={{ height: 6, background: "var(--bg)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.round(ratio * 100)}%`, background: hotel.availableRooms === 0 ? "var(--danger)" : "var(--primary)", borderRadius: 999 }} />
        </div>
        <div>
          <span className="bir-display" style={{ fontSize: 18, fontWeight: 800, color: "var(--primary-dark)" }}>{formatPrice(hotel.pricePerNight, lang)}</span>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}> {t("per_night")}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "0 16px 16px" }}>
        <button className="bir-btn bir-btn-primary" style={{ flex: 1, padding: "10px 14px", borderRadius: 10, fontSize: 13 }} onClick={() => onQuickBook(hotel)}>
          {hotel.availableRooms > 0 ? t("book_now") : t("inquire")}
        </button>
        <a href={waHref} target="_blank" rel="noopener noreferrer" aria-label="whatsapp" className="bir-btn" style={{ width: 42, borderRadius: 10, background: "#25D366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
          <MessageCircle size={18} />
        </a>
      </div>
    </div>
  );
}

function HotelDetailPage({ hotel, lang, t, dir, onBook, onBack }) {
  const cityLabel = CITY_LABELS[hotel.city] ? CITY_LABELS[hotel.city][lang] : hotel.city;
  const displayName = localized(hotel.name, lang);
  const displayDesc = localized(hotel.description, lang);
  const gallery = [hotel.image, ...(hotel.gallery || [])].filter(Boolean);
  const mainImg = gallery[0] || `https://picsum.photos/seed/${hotel.id}/480/300`;
  const waHref = toWaLink(hotel.ownerPhone, waInquiryText(hotel.id, displayName, lang, cityLabel));
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 60px" }}>
      <button className="bir-btn" onClick={onBack} style={{ background: "transparent", color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 16, padding: 0 }}>
        <BackIcon size={16} /> {t("back_to_list")}
      </button>

      <div style={{ display: "grid", gridTemplateColumns: gallery.length > 1 ? "2fr 1fr" : "1fr", gap: 8 }}>
        <img src={mainImg} alt={displayName} style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", borderRadius: 14 }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
        {gallery.length > 1 && (
          <div style={{ display: "grid", gridTemplateRows: gallery.length > 2 ? "1fr 1fr" : "1fr", gap: 8 }}>
            {gallery.slice(1, 3).map((src, i) => (
              <img key={i} src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--gold)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={14} /> {cityLabel}</div>
          <div className="bir-display" style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{displayName}</div>
        </div>
        <div>
          <span className="bir-display" style={{ fontSize: 22, fontWeight: 800, color: "var(--primary-dark)" }}>{formatPrice(hotel.pricePerNight, lang)}</span>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}> {t("per_night")}</span>
        </div>
      </div>

      <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.8, marginTop: 14 }}>{displayDesc}</p>

      {hotel.roomTypes && hotel.roomTypes.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <div className="bir-display" style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{t("detail_room_types")}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {hotel.roomTypes.map((k) => {
              const rt = ROOM_TYPES.find((r) => r.key === k);
              return <span key={k} className="bir-badge bir-badge-available">{rt ? rt[lang] : k}</span>;
            })}
          </div>
        </div>
      )}

      {hotel.amenities && hotel.amenities.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <div className="bir-display" style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{t("detail_amenities")}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {hotel.amenities.map((k) => {
              const a = AMENITIES.find((x) => x.key === k);
              return (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-soft)" }}>
                  <CheckCircle2 size={14} color="var(--primary)" /> {a ? a[lang] : k}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ marginTop: 22 }}>
        <div className="bir-display" style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{t("detail_policies")}</div>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{t("detail_checkin")}</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{hotel.checkInTime || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{t("detail_checkout")}</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{hotel.checkOutTime || "—"}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <div className="bir-display" style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{t("detail_location")}</div>
        {hotel.locationUrl ? (
          <a href={hotel.locationUrl} target="_blank" rel="noopener noreferrer" className="bir-btn bir-btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, textDecoration: "none", fontSize: 13 }}>
            <MapPin size={14} /> {t("detail_open_maps")}
          </a>
        ) : (
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{t("detail_no_location")}</div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
        <button className="bir-btn bir-btn-primary" style={{ flex: 1, padding: "13px 16px", borderRadius: 10 }} onClick={() => onBook(hotel)}>
          {hotel.availableRooms > 0 ? t("book_now") : t("inquire")}
        </button>
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="bir-btn" style={{ padding: "13px 20px", borderRadius: 10, background: "#25D366", color: "#fff", display: "flex", alignItems: "center", gap: 6, textDecoration: "none", fontSize: 13 }}>
          <MessageCircle size={16} /> {t("contact_whatsapp")}
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [platform, setPlatform] = useState({ hotels: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState(false);
  const [view, setView] = useState("guest");
  const [lang, setLang] = useState("ar");
  const dir = lang === "ar" || lang === "ur" ? "rtl" : "ltr";
  const t = (key) => (T[lang] && T[lang][key] !== undefined ? T[lang][key] : T.ar[key] || key);

  const [guestPage, setGuestPage] = useState("list");
  const [detailHotelId, setDetailHotelId] = useState(null);

  const [searchCity, setSearchCity] = useState("all");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingForm, setBookingForm] = useState({ guestName: "", guestPhone: "", guestEmail: "", checkIn: "", checkOut: "", guestsCount: 1, roomType: "" });
  const [bookingErr, setBookingErr] = useState("");

  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerIdentified, setOwnerIdentified] = useState(false);
  const [identityDraft, setIdentityDraft] = useState({ name: "", phone: "" });
  const [ownerTab, setOwnerTab] = useState("hotels");

  const emptyHotelForm = (srcLang) => ({ name: "", city: CITY_KEYS[0], pricePerNight: "", totalRooms: "", description: "", image: "", gallery: "", locationUrl: "", checkInTime: "", checkOutTime: "", roomTypes: [], amenities: [], featured: false, sourceLang: srcLang || "ar" });
  const [newHotel, setNewHotel] = useState(emptyHotelForm("ar"));
  const [editingId, setEditingId] = useState(null);
  const [hotelErr, setHotelErr] = useState("");
  const [translating, setTranslating] = useState(false);

  const [notif, setNotif] = useState(null);
  const [resetArm, setResetArm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, true);
        if (res && res.value) setPlatform(JSON.parse(res.value));
        else {
          const seed = { hotels: SEED_HOTELS, bookings: [] };
          try { await window.storage.set(STORAGE_KEY, JSON.stringify(seed), true); } catch (e) {}
          setPlatform(seed);
        }
      } catch (e) {
        const seed = { hotels: SEED_HOTELS, bookings: [] };
        try {
          await window.storage.set(STORAGE_KEY, JSON.stringify(seed), true);
          setPlatform(seed);
        } catch (e2) {
          setStorageError(true);
          setPlatform(seed);
        }
      }
      try {
        const idRes = await window.storage.get(IDENTITY_KEY, false);
        if (idRes && idRes.value) {
          const parsed = JSON.parse(idRes.value);
          setOwnerName(parsed.name || "");
          setOwnerPhone(parsed.phone || "");
          setIdentityDraft({ name: parsed.name || "", phone: parsed.phone || "" });
          if (parsed.name) setOwnerIdentified(true);
        }
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setPlatform(next);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(next), true);
      setStorageError(false);
    } catch (e) { setStorageError(true); }
  }, []);

  const saveIdentity = async (name, phone) => {
    setOwnerName(name); setOwnerPhone(phone); setOwnerIdentified(true);
    try { await window.storage.set(IDENTITY_KEY, JSON.stringify({ name, phone }), false); } catch (e) {}
  };

  const visibleHotels = platform.hotels.filter((h) => searchCity === "all" || h.city === searchCity);
  const featuredHotels = platform.hotels.filter((h) => h.featured);
  const myHotels = platform.hotels.filter((h) => h.ownerName === ownerName);
  const myBookings = platform.bookings.filter((b) => b.ownerName === ownerName).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const openBooking = (hotel) => {
    setSelectedHotel(hotel);
    setBookingForm({ guestName: "", guestPhone: "", guestEmail: "", checkIn: "", checkOut: "", guestsCount: 1, roomType: "" });
    setBookingErr("");
  };
  const openDetail = (hotel) => { setDetailHotelId(hotel.id); setGuestPage("detail"); };
  const backToList = () => { setGuestPage("list"); setDetailHotelId(null); };

  const submitBooking = () => {
    const { guestName, guestPhone, checkIn, checkOut } = bookingForm;
    if (!guestName.trim() || !guestPhone.trim() || !checkIn || !checkOut) { setBookingErr(t("error_required")); return; }
    if (checkOut <= checkIn) { setBookingErr(t("error_dates")); return; }
    const hotel = selectedHotel;
    const displayName = localized(hotel.name, lang);
    const booking = {
      id: uid("bk"), hotelId: hotel.id, hotelName: displayName, ownerName: hotel.ownerName, ownerPhone: hotel.ownerPhone,
      guestName: guestName.trim(), guestPhone: guestPhone.trim(), guestEmail: bookingForm.guestEmail.trim(),
      checkIn, checkOut, guestsCount: Number(bookingForm.guestsCount) || 1, roomType: bookingForm.roomType,
      status: "pending", createdAt: new Date().toISOString(),
    };
    persist({ ...platform, bookings: [...platform.bookings, booking] });
    setNotif({ kind: "new_request", messages: buildMessages("new_request", booking, { ...hotel, name: displayName }, lang) });
    setSelectedHotel(null);
  };

  const decide = (booking, decision) => {
    const hotel = platform.hotels.find((h) => h.id === booking.hotelId);
    let hotels = platform.hotels;
    if (decision === "confirmed" && hotel) {
      hotels = platform.hotels.map((h) => h.id === hotel.id ? { ...h, availableRooms: Math.max(0, h.availableRooms - 1) } : h);
    }
    const bookings = platform.bookings.map((b) => b.id === booking.id ? { ...b, status: decision } : b);
    persist({ hotels, bookings });
    const hotelForMsg = hotel ? { ...hotel, name: localized(hotel.name, lang) } : { name: booking.hotelName, ownerPhone: booking.ownerPhone, pricePerNight: 0 };
    setNotif({ kind: decision, messages: buildMessages(decision, booking, hotelForMsg, lang) });
  };

  const toggleRoomType = (key) => setNewHotel((p) => ({ ...p, roomTypes: p.roomTypes.includes(key) ? p.roomTypes.filter((k) => k !== key) : [...p.roomTypes, key] }));
  const toggleAmenity = (key) => setNewHotel((p) => ({ ...p, amenities: p.amenities.includes(key) ? p.amenities.filter((k) => k !== key) : [...p.amenities, key] }));

  const addOrUpdateHotel = async () => {
    const { name, city, pricePerNight, totalRooms, description, image, gallery, locationUrl, checkInTime, checkOutTime, roomTypes, amenities, featured, sourceLang } = newHotel;
    if (!name.trim() || !pricePerNight || !totalRooms) { setHotelErr(t("hotel_error_required")); return; }
    if (Number(pricePerNight) <= 0 || Number(totalRooms) <= 0) { setHotelErr(t("hotel_error_positive")); return; }
    setHotelErr("");
    setTranslating(true);
    let nameMap, descMap;
    try {
      const result = await translateAll(name.trim(), description.trim(), sourceLang || "ar");
      nameMap = result.nameMap;
      descMap = result.descMap;
    } catch (e) {
      nameMap = { [sourceLang || "ar"]: name.trim() };
      descMap = { [sourceLang || "ar"]: description.trim() };
    }
    setTranslating(false);
    const galleryArr = gallery.split(",").map((s) => s.trim()).filter(Boolean);
    if (editingId) {
      const hotels = platform.hotels.map((h) => {
        if (h.id !== editingId) return h;
        const diff = Number(totalRooms) - h.totalRooms;
        return { ...h, name: nameMap, description: descMap, city, pricePerNight: Number(pricePerNight), totalRooms: Number(totalRooms), availableRooms: Math.max(0, h.availableRooms + diff), image: image.trim() || h.image, gallery: galleryArr, locationUrl: locationUrl.trim(), checkInTime, checkOutTime, roomTypes, amenities, featured };
      });
      persist({ ...platform, hotels });
      setEditingId(null);
    } else {
      const id = uid("h");
      const hotel = {
        id, ownerName, ownerPhone, name: nameMap, description: descMap, city, pricePerNight: Number(pricePerNight), totalRooms: Number(totalRooms), availableRooms: Number(totalRooms),
        image: image.trim() || `https://picsum.photos/seed/${id}/480/300`, gallery: galleryArr,
        locationUrl: locationUrl.trim(), checkInTime, checkOutTime, roomTypes, amenities, featured,
      };
      persist({ ...platform, hotels: [...platform.hotels, hotel] });
    }
    setNewHotel(emptyHotelForm(lang));
    setOwnerTab("hotels");
  };

  const startEdit = (hotel) => {
    const srcLang = (hotel.name && typeof hotel.name === "object" && hotel.name[lang]) ? lang : (typeof hotel.name === "string" ? "ar" : Object.keys(hotel.name)[0]);
    setNewHotel({
      name: localized(hotel.name, srcLang), city: hotel.city, pricePerNight: String(hotel.pricePerNight), totalRooms: String(hotel.totalRooms),
      description: localized(hotel.description, srcLang), image: hotel.image || "", gallery: (hotel.gallery || []).join(", "),
      locationUrl: hotel.locationUrl || "", checkInTime: hotel.checkInTime || "", checkOutTime: hotel.checkOutTime || "",
      roomTypes: hotel.roomTypes || [], amenities: hotel.amenities || [], featured: !!hotel.featured, sourceLang: srcLang,
    });
    setEditingId(hotel.id);
    setOwnerTab("add");
  };

  const deleteHotel = (id) => persist({ ...platform, hotels: platform.hotels.filter((h) => h.id !== id) });
  const doReset = async () => { const seed = { hotels: SEED_HOTELS, bookings: [] }; await persist(seed); setResetArm(false); };

  if (loading) {
    return (
      <div className="bir-app" dir={dir} lang={lang} style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <GlobalStyle />
        <div style={{ color: "var(--ink-soft)", fontSize: 14 }}>{t("loading_text")}</div>
      </div>
    );
  }

  const activeHotel = detailHotelId ? platform.hotels.find((h) => h.id === detailHotelId) : null;

  return (
    <div className="bir-app" dir={dir} lang={lang}>
      <GlobalStyle />
      <NotificationPreview data={notif} onClose={() => setNotif(null)} t={t} />

      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}><BedDouble size={18} color="#fff" /></div>
            <span className="bir-display" style={{ fontSize: 18, fontWeight: 800 }}>{t("brand")}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", background: "var(--bg)", borderRadius: 999, padding: 4, gap: 4 }}>
              <button className="bir-btn" onClick={() => setView("guest")} style={{ padding: "8px 16px", borderRadius: 999, fontSize: 13, background: view === "guest" ? "var(--primary)" : "transparent", color: view === "guest" ? "#fff" : "var(--ink-soft)" }}>{t("nav_guest")}</button>
              <button className="bir-btn" onClick={() => setView("owner")} style={{ padding: "8px 16px", borderRadius: 999, fontSize: 13, background: view === "owner" ? "var(--primary)" : "transparent", color: view === "owner" ? "#fff" : "var(--ink-soft)" }}>{t("nav_owner")}</button>
            </div>
            <div style={{ display: "flex", background: "var(--bg)", borderRadius: 999, padding: 4, gap: 2 }}>
              {["ar", "en", "tr", "ur"].map((l) => (
                <button key={l} className="bir-btn" onClick={() => setLang(l)} style={{ padding: "6px 10px", borderRadius: 999, fontSize: 12, background: lang === l ? "var(--primary)" : "transparent", color: lang === l ? "#fff" : "var(--ink-soft)" }}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {storageError && (
        <div style={{ background: "var(--danger-tint)", color: "var(--danger)", textAlign: "center", fontSize: 13, padding: "6px 12px" }}>{t("storage_error_banner")}</div>
      )}

      {view === "guest" && guestPage === "detail" && activeHotel && (
        <HotelDetailPage hotel={activeHotel} lang={lang} t={t} dir={dir} onBook={openBooking} onBack={backToList} />
      )}

      {view === "guest" && (guestPage === "list" || !activeHotel) && (
        <>
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "36px 20px 10px" }}>
            <div className="bir-display" style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.3 }}>{t("hero_title")}</div>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 6, maxWidth: 560 }}>{t("hero_subtitle")}</p>
          </div>

          <AvailabilityPulse hotels={platform.hotels} lang={lang} t={t} />

          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 20px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="bir-btn bir-btn-ghost" onClick={() => setSearchCity("all")} style={{ padding: "8px 14px", borderRadius: 999, fontSize: 13, background: searchCity === "all" ? "var(--primary-tint)" : "transparent" }}>{t("city_all")}</button>
            {CITY_KEYS.map((c) => (
              <button key={c} className="bir-btn bir-btn-ghost" onClick={() => setSearchCity(c)} style={{ padding: "8px 14px", borderRadius: 999, fontSize: 13, background: searchCity === c ? "var(--primary-tint)" : "transparent" }}>{CITY_LABELS[c][lang]}</button>
            ))}
          </div>

          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 20px 10px" }}>
            {visibleHotels.length === 0 ? (
              <div className="bir-card" style={{ padding: 40, textAlign: "center", color: "var(--ink-soft)" }}>{t("no_hotels_city")}</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {visibleHotels.map((h) => <HotelCard key={h.id} hotel={h} lang={lang} t={t} onOpenDetail={openDetail} onQuickBook={openBooking} />)}
              </div>
            )}
          </div>

          {featuredHotels.length > 0 && (
            <div style={{ maxWidth: 1080, margin: "0 auto", padding: "30px 20px 60px", borderTop: "1px solid var(--line)" }}>
              <div className="bir-display" style={{ fontSize: 20, fontWeight: 800, marginTop: 24 }}>{t("most_requested_title")}</div>
              <p style={{ color: "var(--ink-soft)", fontSize: 13, marginTop: 4, marginBottom: 16 }}>{t("most_requested_sub")}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {featuredHotels.map((h) => <HotelCard key={h.id} hotel={h} lang={lang} t={t} onOpenDetail={openDetail} onQuickBook={openBooking} />)}
              </div>
            </div>
          )}

          {selectedHotel && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(28,38,32,0.4)", zIndex: 50, display: "flex", justifyContent: "flex-start" }} onClick={() => setSelectedHotel(null)}>
              <div className="bir-slideover bir-card" style={{ width: "min(92vw, 420px)", height: "100%", borderRadius: 0, overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
                <img src={selectedHotel.image || `https://picsum.photos/seed/${selectedHotel.id}/480/300`} alt={selectedHotel.name} style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", display: "block" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <div style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div className="bir-display" style={{ fontSize: 19, fontWeight: 800 }}>{selectedHotel.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}><MapPin size={12} /> {CITY_LABELS[selectedHotel.city] ? CITY_LABELS[selectedHotel.city][lang] : selectedHotel.city}</div>
                    </div>
                    <button className="bir-btn" onClick={() => setSelectedHotel(null)} style={{ background: "transparent" }} aria-label="close"><X size={20} /></button>
                  </div>

                  {selectedHotel.availableRooms === 0 && (
                    <div style={{ background: "var(--gold-tint)", color: "#8A6A26", fontSize: 12.5, padding: "8px 12px", borderRadius: 8, marginBottom: 14 }}>{t("no_rooms_hint")}</div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input className="bir-input" placeholder={t("full_name")} value={bookingForm.guestName} onChange={(e) => setBookingForm({ ...bookingForm, guestName: e.target.value })} />
                    <input className="bir-input" placeholder={t("phone_whatsapp")} value={bookingForm.guestPhone} onChange={(e) => setBookingForm({ ...bookingForm, guestPhone: e.target.value })} />
                    <input className="bir-input" placeholder={t("email_optional")} value={bookingForm.guestEmail} onChange={(e) => setBookingForm({ ...bookingForm, guestEmail: e.target.value })} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 11, color: "var(--ink-soft)" }}>{t("checkin_date")}</label>
                        <input type="date" className="bir-input" value={bookingForm.checkIn} onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 11, color: "var(--ink-soft)" }}>{t("checkout_date")}</label>
                        <input type="date" className="bir-input" value={bookingForm.checkOut} onChange={(e) => setBookingForm({ ...bookingForm, checkOut: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: "var(--ink-soft)" }}>{t("guests_count")}</label>
                      <input type="number" min="1" className="bir-input" value={bookingForm.guestsCount} onChange={(e) => setBookingForm({ ...bookingForm, guestsCount: e.target.value })} />
                    </div>
                    {selectedHotel.roomTypes && selectedHotel.roomTypes.length > 0 && (
                      <div>
                        <label style={{ fontSize: 11, color: "var(--ink-soft)" }}>{t("room_type_label")}</label>
                        <select className="bir-input" value={bookingForm.roomType} onChange={(e) => setBookingForm({ ...bookingForm, roomType: e.target.value })}>
                          <option value="">{t("room_type_any")}</option>
                          {selectedHotel.roomTypes.map((k) => { const rt = ROOM_TYPES.find((r) => r.key === k); return <option key={k} value={k}>{rt ? rt[lang] : k}</option>; })}
                        </select>
                      </div>
                    )}
                    {bookingErr && <div style={{ color: "var(--danger)", fontSize: 12.5 }}>{bookingErr}</div>}
                    <button className="bir-btn bir-btn-primary" style={{ padding: "12px 16px", borderRadius: 10, marginTop: 6 }} onClick={submitBooking}>
                      {selectedHotel.availableRooms > 0 ? t("submit_book") : t("submit_inquire")}
                    </button>
                    <p style={{ fontSize: 11.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{t("booking_note")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {view === "owner" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
          {!ownerIdentified ? (
            <div className="bir-card" style={{ padding: 28, maxWidth: 420, margin: "40px auto" }}>
              <div className="bir-display" style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{t("identify_title")}</div>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 16 }}>{t("identify_sub")}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input className="bir-input" placeholder={t("business_name_ph")} value={identityDraft.name} onChange={(e) => setIdentityDraft({ ...identityDraft, name: e.target.value })} />
                <input className="bir-input" placeholder={t("contact_phone_ph")} value={identityDraft.phone} onChange={(e) => setIdentityDraft({ ...identityDraft, phone: e.target.value })} />
                <button className="bir-btn bir-btn-primary" style={{ padding: "11px 16px", borderRadius: 10 }} disabled={!identityDraft.name.trim() || !identityDraft.phone.trim()} onClick={() => saveIdentity(identityDraft.name.trim(), identityDraft.phone.trim())}>{t("enter_dashboard")}</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div className="bir-display" style={{ fontSize: 20, fontWeight: 800 }}>{t("welcome")}{ownerName}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{ownerPhone}</div>
                </div>
                <div style={{ display: "flex", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 999, padding: 4, gap: 4, flexWrap: "wrap" }}>
                  {[
                    { key: "hotels", label: t("tab_my_hotels") },
                    { key: "add", label: editingId ? t("tab_edit_hotel") : t("tab_add_hotel") },
                    { key: "bookings", label: `${t("tab_bookings")} (${myBookings.filter((b) => b.status === "pending").length})` },
                  ].map((tb) => (
                    <button key={tb.key} className="bir-btn" onClick={() => { setOwnerTab(tb.key); if (tb.key !== "add") { setEditingId(null); setNewHotel(emptyHotelForm(lang)); } }} style={{ padding: "8px 14px", borderRadius: 999, fontSize: 12.5, background: ownerTab === tb.key ? "var(--primary)" : "transparent", color: ownerTab === tb.key ? "#fff" : "var(--ink-soft)" }}>{tb.label}</button>
                  ))}
                </div>
              </div>

              {ownerTab === "hotels" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {myHotels.length === 0 ? (
                    <div className="bir-card" style={{ padding: 36, textAlign: "center", color: "var(--ink-soft)" }}><Building2 size={22} style={{ margin: "0 auto 8px" }} />{t("my_hotels_empty")}</div>
                  ) : myHotels.map((h) => (
                    <div key={h.id} className="bir-card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src={h.image || `https://picsum.photos/seed/${h.id}/480/300`} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        <div>
                          <div className="bir-display" style={{ fontWeight: 700 }}>{localized(h.name, lang)}{h.featured && <span className="bir-badge bir-badge-low" style={{ marginInlineStart: 8 }}>{t("most_requested_title")}</span>}</div>
                          <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{CITY_LABELS[h.city] ? CITY_LABELS[h.city][lang] : h.city} · {formatPrice(h.pricePerNight, lang)} · {h.availableRooms}/{h.totalRooms}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="bir-btn bir-btn-ghost" style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }} onClick={() => startEdit(h)}><Pencil size={13} /> {t("edit")}</button>
                        <button className="bir-btn bir-btn-danger" style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }} onClick={() => deleteHotel(h.id)}><Trash2 size={13} /> {t("delete")}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {ownerTab === "add" && (
                <div className="bir-card" style={{ padding: 22, maxWidth: 520 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input className="bir-input" placeholder={t("hotel_name_ph")} value={newHotel.name} onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })} />
                    <div>
                      <label style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{t("source_lang_label")}</label>
                      <select className="bir-input" value={newHotel.sourceLang} onChange={(e) => setNewHotel({ ...newHotel, sourceLang: e.target.value })}>
                        <option value="ar">العربية / Arabic</option>
                        <option value="en">English</option>
                        <option value="tr">Türkçe / Turkish</option>
                        <option value="ur">اردو / Urdu</option>
                      </select>
                      <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4 }}>{t("auto_translate_note")}</p>
                    </div>
                    <select className="bir-input" value={newHotel.city} onChange={(e) => setNewHotel({ ...newHotel, city: e.target.value })}>
                      {CITY_KEYS.map((c) => <option key={c} value={c}>{CITY_LABELS[c][lang]}</option>)}
                    </select>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="number" className="bir-input" placeholder={t("price_ph")} value={newHotel.pricePerNight} onChange={(e) => setNewHotel({ ...newHotel, pricePerNight: e.target.value })} />
                      <input type="number" className="bir-input" placeholder={t("rooms_ph")} value={newHotel.totalRooms} onChange={(e) => setNewHotel({ ...newHotel, totalRooms: e.target.value })} />
                    </div>
                    <textarea className="bir-input" placeholder={t("description_ph")} rows={3} value={newHotel.description} onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })} />
                    <input className="bir-input" placeholder={t("image_ph")} value={newHotel.image} onChange={(e) => setNewHotel({ ...newHotel, image: e.target.value })} />
                    <input className="bir-input" placeholder={t("gallery_ph")} value={newHotel.gallery} onChange={(e) => setNewHotel({ ...newHotel, gallery: e.target.value })} />
                    <input className="bir-input" placeholder={t("location_ph")} value={newHotel.locationUrl} onChange={(e) => setNewHotel({ ...newHotel, locationUrl: e.target.value })} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <input className="bir-input" placeholder={t("checkin_time_ph")} value={newHotel.checkInTime} onChange={(e) => setNewHotel({ ...newHotel, checkInTime: e.target.value })} />
                      <input className="bir-input" placeholder={t("checkout_time_ph")} value={newHotel.checkOutTime} onChange={(e) => setNewHotel({ ...newHotel, checkOutTime: e.target.value })} />
                    </div>

                    <div>
                      <label style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{t("room_types_label")}</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                        {ROOM_TYPES.map((rt) => (
                          <button key={rt.key} type="button" className="bir-btn" onClick={() => toggleRoomType(rt.key)} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 12.5, border: "1px solid var(--line)", background: newHotel.roomTypes.includes(rt.key) ? "var(--primary)" : "transparent", color: newHotel.roomTypes.includes(rt.key) ? "#fff" : "var(--ink-soft)" }}>{rt[lang]}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{t("amenities_label")}</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                        {AMENITIES.map((a) => (
                          <button key={a.key} type="button" className="bir-btn" onClick={() => toggleAmenity(a.key)} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 12.5, border: "1px solid var(--line)", background: newHotel.amenities.includes(a.key) ? "var(--primary)" : "transparent", color: newHotel.amenities.includes(a.key) ? "#fff" : "var(--ink-soft)" }}>{a[lang]}</button>
                        ))}
                      </div>
                    </div>

                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", marginTop: 4 }}>
                      <input type="checkbox" checked={newHotel.featured} onChange={(e) => setNewHotel({ ...newHotel, featured: e.target.checked })} />
                      {t("featured_label")}
                    </label>

                    {hotelErr && <div style={{ color: "var(--danger)", fontSize: 12.5 }}>{hotelErr}</div>}
                    <button className="bir-btn bir-btn-primary" style={{ padding: "11px 16px", borderRadius: 10 }} disabled={translating} onClick={addOrUpdateHotel}>
                      {translating ? t("translating") : (editingId ? t("save_changes") : t("publish_hotel"))}
                    </button>
                  </div>
                </div>
              )}

              {ownerTab === "bookings" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {myBookings.length === 0 ? (
                    <div className="bir-card" style={{ padding: 36, textAlign: "center", color: "var(--ink-soft)" }}>{t("bookings_empty")}</div>
                  ) : myBookings.map((b) => (
                    <div key={b.id} className="bir-card" style={{ padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{b.guestName} — {b.hotelName}</div>
                          <div style={{ fontSize: 12.5, color: "var(--ink-soft)", display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} /> {b.checkIn} → {b.checkOut}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> {b.guestsCount}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Phone size={12} /> {b.guestPhone}</span>
                            {b.roomType && <span>{ROOM_TYPES.find((r) => r.key === b.roomType) ? ROOM_TYPES.find((r) => r.key === b.roomType)[lang] : b.roomType}</span>}
                          </div>
                        </div>
                        <span className="bir-badge" style={{ background: b.status === "pending" ? "var(--gold-tint)" : b.status === "confirmed" ? "var(--primary-tint)" : "var(--danger-tint)", color: b.status === "pending" ? "#8A6A26" : b.status === "confirmed" ? "var(--primary-dark)" : "var(--danger)", height: "fit-content" }}>
                          {b.status === "pending" ? t("status_pending") : b.status === "confirmed" ? t("status_confirmed") : t("status_declined")}
                        </span>
                      </div>
                      {b.status === "pending" && (
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <button className="bir-btn bir-btn-primary" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }} onClick={() => decide(b, "confirmed")}><CheckCircle2 size={14} /> {t("confirm_availability")}</button>
                          <button className="bir-btn bir-btn-danger" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }} onClick={() => decide(b, "declined")}><XCircle size={14} /> {t("no_rooms")}</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 30, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
                {!resetArm ? (
                  <button className="bir-btn" style={{ background: "transparent", color: "var(--ink-soft)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }} onClick={() => setResetArm(true)}><RefreshCw size={13} /> {t("reset_demo_data")}</button>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, flexWrap: "wrap" }}>
                    <span style={{ color: "var(--ink-soft)" }}>{t("reset_confirm_text")}</span>
                    <button className="bir-btn bir-btn-danger" style={{ padding: "6px 12px", borderRadius: 8 }} onClick={doReset}>{t("reset_yes")}</button>
                    <button className="bir-btn bir-btn-ghost" style={{ padding: "6px 12px", borderRadius: 8 }} onClick={() => setResetArm(false)}>{t("reset_cancel")}</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 30px" }}>
        <div style={{ fontSize: 11.5, color: "var(--ink-soft)", textAlign: "center", lineHeight: 1.7 }}>{t("footer_note")}</div>
      </div>
    </div>
  );
}
