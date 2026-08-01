import { db } from "@/database";
import { bookingsTable } from "@/database/schemas/booking";
import { hotelsTable } from "@/database/schemas/hotel";
import { verifyAuth } from "@/lib/auth";
import { sendBookingNotification } from "@/lib/email";
import { apiErrorResponse } from "@/lib/errors";
import { bookingSchema, validate } from "@/lib/validation";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    verifyAuth(request);
    const rows = await db
      .select({
        id: bookingsTable.id,
        hotelId: bookingsTable.hotelId,
        hotelNameAr: hotelsTable.nameAr,
        hotelNameEn: hotelsTable.nameEn,
        hotelNameTr: hotelsTable.nameTr,
        hotelNameUr: hotelsTable.nameUr,
        guestName: bookingsTable.guestName,
        guestPhone: bookingsTable.guestPhone,
        guestEmail: bookingsTable.guestEmail,
        checkIn: bookingsTable.checkIn,
        checkOut: bookingsTable.checkOut,
        guestsCount: bookingsTable.guestsCount,
        roomType: bookingsTable.roomType,
        status: bookingsTable.status,
        createdAt: bookingsTable.createdAt,
        updatedAt: bookingsTable.updatedAt,
      })
      .from(bookingsTable)
      .leftJoin(hotelsTable, eq(bookingsTable.hotelId, hotelsTable.id))
      .orderBy(desc(bookingsTable.createdAt));

    return Response.json({
      bookings: rows.map((r) => ({
        ...r,
        hotelName: {
          ar: r.hotelNameAr ?? "",
          en: r.hotelNameEn ?? "",
          tr: r.hotelNameTr ?? "",
          ur: r.hotelNameUr ?? "",
        },
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = validate(bookingSchema, body);

    const [hotel] = await db.select().from(hotelsTable).where(eq(hotelsTable.id, data.hotelId)).limit(1);
    if (!hotel) {
      return Response.json({ error: "Hotel not found" }, { status: 404 });
    }

    const [row] = await db
      .insert(bookingsTable)
      .values({
        hotelId: data.hotelId,
        guestName: data.guestName,
        guestPhone: data.guestPhone,
        guestEmail: data.guestEmail ?? "",
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guestsCount: data.guestsCount,
        roomType: data.roomType ?? "",
        status: "pending",
      })
      .returning();

    sendBookingNotification(process.env.EMAIL as string, {
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      guestEmail: data.guestEmail ?? "",
      hotelName: hotel.nameEn || hotel.nameAr || hotel.nameTr || hotel.nameUr,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guestsCount: data.guestsCount,
    });

    return Response.json(
      {
        booking: {
          ...row,
          hotelName: {
            ar: hotel.nameAr,
            en: hotel.nameEn,
            tr: hotel.nameTr,
            ur: hotel.nameUr,
          },
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
