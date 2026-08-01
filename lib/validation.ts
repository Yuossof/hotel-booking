import { z } from "zod";
import { ValidationError } from "./errors";

const trimmed = z.string().trim();
const requiredLocalized = trimmed.min(1).max(1000);
const requiredDescription = trimmed.min(1).max(5000);
const optionalUrl = trimmed.max(1000).refine((value) => value === "" || /^https?:\/\//i.test(value), {
  message: "Must be a valid http/https URL",
});

export const registerSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  password: z.string().min(6).max(255),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const citySchema = z.object({
  nameAr: requiredLocalized,
  nameEn: requiredLocalized,
  nameTr: requiredLocalized,
  nameUr: requiredLocalized,
});

export const cityUpdateSchema = citySchema;

export const hotelSchema = z.object({
  cityId: z.number().int().positive(),
  nameAr: requiredLocalized,
  nameEn: requiredLocalized,
  nameTr: requiredLocalized,
  nameUr: requiredLocalized,
  price: z.number().int().positive(),
  totalRooms: z.number().int().positive(),
  availableRooms: z.number().int().min(0).optional(),
  descriptionAr: requiredDescription,
  descriptionEn: requiredDescription,
  descriptionTr: requiredDescription,
  descriptionUr: requiredDescription,
  image: trimmed.max(500).optional().default(""),
  gallery: z.array(trimmed.max(500)).max(20).optional().default([]),
  roomTypes: z.array(trimmed.min(1).max(50)).max(20).optional().default([]),
  amenities: z.array(trimmed.min(1).max(50)).max(30).optional().default([]),
  locationUrl: optionalUrl.optional().default(""),
  checkInTimeAr: trimmed.max(255).optional().default(""),
  checkInTimeEn: trimmed.max(255).optional().default(""),
  checkInTimeTr: trimmed.max(255).optional().default(""),
  checkInTimeUr: trimmed.max(255).optional().default(""),
  checkOutTimeAr: trimmed.max(255).optional().default(""),
  checkOutTimeEn: trimmed.max(255).optional().default(""),
  checkOutTimeTr: trimmed.max(255).optional().default(""),
  checkOutTimeUr: trimmed.max(255).optional().default(""),
  featured: z.boolean().optional().default(false),
}).refine((data) => data.availableRooms === undefined || data.availableRooms <= data.totalRooms, {
  message: "Available rooms cannot exceed total rooms",
  path: ["availableRooms"],
});

export const hotelUpdateSchema = hotelSchema;

export const bookingSchema = z.object({
  hotelId: z.number().int().positive(),
  guestName: trimmed.min(1).max(255),
  guestPhone: trimmed.min(1).max(50),
  guestEmail: z.string().trim().email().max(255).or(z.literal("")).optional().default(""),
  checkIn: trimmed.min(1).max(20),
  checkOut: trimmed.min(1).max(20),
  guestsCount: z.number().int().positive(),
  roomType: trimmed.max(50).optional().default(""),
});

export const bookingStatusSchema = z.object({
  status: z.enum(["confirmed", "declined"]),
});

export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError("Validation failed", result.error.flatten().fieldErrors);
  }
  return result.data;
}
