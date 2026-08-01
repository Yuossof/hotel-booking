import { pgTable, serial, varchar, text, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { citiesTable } from "./city";

export const hotelsTable = pgTable("hotels", {
  id: serial().primaryKey(),
  cityId: integer()
    .notNull()
    .references(() => citiesTable.id, { onDelete: "restrict" }),
  nameAr: text().notNull(),
  nameEn: text().notNull(),
  nameTr: text().notNull(),
  nameUr: text().notNull(),
  price: integer().notNull().default(0),
  totalRooms: integer().notNull(),
  availableRooms: integer().notNull().default(0),
  descriptionAr: text().notNull(),
  descriptionEn: text().notNull(),
  descriptionTr: text().notNull(),
  descriptionUr: text().notNull(),
  image: varchar({ length: 500 }).notNull().default(""),
  gallery: jsonb().notNull().default([]),
  roomTypes: jsonb().notNull().default([]),
  amenities: jsonb().notNull().default([]),
  locationUrl: varchar({ length: 1000 }).notNull().default(""),
  checkInTime: varchar({ length: 255 }).notNull().default(""),
  checkOutTime: varchar({ length: 255 }).notNull().default(""),
  featured: boolean().notNull().default(false),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
