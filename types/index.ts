export type Lang = "ar" | "en" | "tr" | "ur";
export type Dir = "rtl" | "ltr";

export interface LocalizedText {
  ar: string;
  en: string;
  tr: string;
  ur: string;
}

export interface CityInfo extends LocalizedText {}

export interface RoomTypeOption extends LocalizedText {
  key: string;
}

export interface AmenityOption extends LocalizedText {
  key: string;
}

export interface City {
  id: number;
  name: LocalizedText;
  createdAt: string;
  updatedAt: string;
}

export interface Hotel {
  id: number;
  name: LocalizedText;
  city: City;
  price: number;
  totalRooms: number;
  availableRooms: number;
  description: LocalizedText;
  image: string;
  gallery: string[];
  roomTypes: string[];
  amenities: string[];
  locationUrl: string;
  checkInTime: string;
  checkOutTime: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = "pending" | "confirmed" | "declined";

export interface Booking {
  id: number;
  hotelId: number;
  hotelName: LocalizedText;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  roomType: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormValues {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number | string;
  roomType: string;
}

export interface HotelFormValues {
  nameAr: string;
  nameEn: string;
  nameTr: string;
  nameUr: string;
  cityId: number;
  price: string;
  totalRooms: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  descriptionUr: string;
  image: string;
  gallery: string[];
  imageFiles: File[];
  locationUrl: string;
  checkInTime: string;
  checkOutTime: string;
  roomTypes: string[];
  amenities: string[];
  featured: boolean;
}

export interface CityFormValues {
  nameAr: string;
  nameEn: string;
  nameTr: string;
  nameUr: string;
}

export type T = (key: string) => string;
