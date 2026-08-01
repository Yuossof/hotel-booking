import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const roomTypesTable = pgTable("room_types", {
  id: serial().primaryKey(),
  nameAr: varchar({ length: 255 }).notNull(),
  nameEn: varchar({ length: 255 }).notNull(),
  nameTr: varchar({ length: 255 }).notNull(),
  nameUr: varchar({ length: 255 }).notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
