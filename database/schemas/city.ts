import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const citiesTable = pgTable("cities", {
  id: serial().primaryKey(),
  nameAr: text().notNull(),
  nameEn: text().notNull(),
  nameTr: text().notNull(),
  nameUr: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
