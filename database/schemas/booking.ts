import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { hotelsTable } from "./hotel";

export const bookingsTable = pgTable("bookings", {
  id: serial().primaryKey(),
  hotelId: integer()
    .notNull()
    .references(() => hotelsTable.id, { onDelete: "cascade" }),
  guestName: varchar({ length: 255 }).notNull(),
  guestPhone: varchar({ length: 50 }).notNull(),
  guestEmail: varchar({ length: 255 }).notNull().default(""),
  checkIn: varchar({ length: 20 }).notNull(),
  checkOut: varchar({ length: 20 }).notNull(),
  guestsCount: integer().notNull(),
  roomType: varchar({ length: 50 }).notNull().default(""),
  status: varchar({ length: 20 }).notNull().default("pending"),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
