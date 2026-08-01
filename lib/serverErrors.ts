import { Lang } from "@/types";

type ErrorDict = Record<Lang, string>;

const ERRORS: Record<string, ErrorDict> = {
  Unauthorized: {
    ar: "غير مصرح به",
    en: "Unauthorized",
    tr: "Yetkisiz",
    ur: "غیر مجاز",
  },
  "Invalid or expired token": {
    ar: "الرمز غير صالح أو منتهي الصلاحية",
    en: "Invalid or expired token",
    tr: "Geçersiz veya süresi dolmuş belirteç",
    ur: "غلط یا میعاد ختم شدہ ٹوکن",
  },
  "Missing or invalid authorization header": {
    ar: "رأس التفويض مفقود أو غير صالح",
    en: "Missing or invalid authorization header",
    tr: "Yetkilendirme başlığı eksik veya geçersiz",
    ur: "اجازت نامہ ہیڈر غائب یا غلط ہے",
  },
  "Internal server error": {
    ar: "حدث خطأ داخلي في الخادم",
    en: "Internal server error",
    tr: "Sunucuda dahili bir hata oluştu",
    ur: "سرور میں اندرونی خرابی پیش آئی",
  },
  "Validation failed": {
    ar: "فشل التحقق من البيانات",
    en: "Validation failed",
    tr: "Doğrulama başarısız",
    ur: "تصدیق ناکام ہوئی",
  },
  "Invalid email or password": {
    ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    en: "Invalid email or password",
    tr: "Geçersiz e-posta veya şifre",
    ur: "غلط ای میل یا پاس ورڈ",
  },
  "Email already registered": {
    ar: "البريد الإلكتروني مسجل بالفعل",
    en: "Email already registered",
    tr: "E-posta zaten kayıtlı",
    ur: "ای میل پہلے سے رجسٹرڈ ہے",
  },
  "City not found": {
    ar: "المدينة غير موجودة",
    en: "City not found",
    tr: "Şehir bulunamadı",
    ur: "شہر نہیں ملا",
  },
  "Hotel not found": {
    ar: "الفندق غير موجود",
    en: "Hotel not found",
    tr: "Otel bulunamadı",
    ur: "ہوٹل نہیں ملا",
  },
  "Room type not found": {
    ar: "نوع الغرفة غير موجود",
    en: "Room type not found",
    tr: "Oda tipi bulunamadı",
    ur: "کمرے کی قسم نہیں ملی",
  },
  "Amenity not found": {
    ar: "وسيلة الراحة غير موجودة",
    en: "Amenity not found",
    tr: "Olanak bulunamadı",
    ur: "سہولت نہیں ملی",
  },
  "Booking not found": {
    ar: "الحجز غير موجود",
    en: "Booking not found",
    tr: "Rezervasyon bulunamadı",
    ur: "بکنگ نہیں ملی",
  },
  "User not found": {
    ar: "المستخدم غير موجود",
    en: "User not found",
    tr: "Kullanıcı bulunamadı",
    ur: "صارف نہیں ملا",
  },
  "All language names are required": {
    ar: "يرجى إدخال جميع الأسماء باللغات الأربع",
    en: "All language names are required",
    tr: "Dört dilde de ad girmeniz gerekmektedir",
    ur: "چاروں زبانوں میں نام درکار ہیں",
  },
  "No valid files provided": {
    ar: "لم يتم توفير ملفات صالحة",
    en: "No valid files provided",
    tr: "Geçerli dosya sağlanmadı",
    ur: "کوئی درست فائل فراہم نہیں کی گئی",
  },
};

const FILE_TOO_LARGE: ErrorDict = {
  ar: "حجم الملف يتجاوز الحد الأقصى المسموح به",
  en: "File size exceeds the maximum allowed limit",
  tr: "Dosya boyutu izin verilen en üst sınırdan büyük",
  ur: "فائل کا حجم مجاز حد سے بڑا ہے",
};

const INVALID_FILE_TYPE: ErrorDict = {
  ar: "نوع الملف غير مدعوم",
  en: "Invalid file type",
  tr: "Geçersiz dosya türü",
  ur: "غلط فائل کی قسم",
};

export function localizeError(message: string, lang: Lang): string {
  const dict = ERRORS[message];
  if (dict) return dict[lang];

  if (message.startsWith("File size")) return FILE_TOO_LARGE[lang];
  if (message.startsWith("Invalid file type")) return INVALID_FILE_TYPE[lang];
  if (message.startsWith("No file provided")) {
    return {
      ar: "لم يتم توفير ملف",
      en: "No file provided",
      tr: "Dosya sağlanmadı",
      ur: "کوئی فائل فراہم نہیں کی گئی",
    }[lang];
  }

  return message;
}

export function langFromRequest(request?: Request | null): Lang {
  const header = request?.headers.get("x-lang") || request?.headers.get("accept-language") || "";
  const code = header.split(",")[0]?.split(";")[0]?.trim().toLowerCase();
  if (code === "ar" || code === "en" || code === "tr" || code === "ur") return code;
  return "en";
}
