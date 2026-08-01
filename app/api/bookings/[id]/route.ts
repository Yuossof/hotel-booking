import { db } from "@/database";
import { bookingsTable } from "@/database/schemas/booking";
import { hotelsTable } from "@/database/schemas/hotel";
import { verifyAuth } from "@/lib/auth";
import { apiErrorResponse, NotFoundError } from "@/lib/errors";
import { bookingStatusSchema, validate } from "@/lib/validation";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAuth(request);
    const { id } = await params;
    const numericId = Number(id);

    const [existing] = await db
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
      .where(eq(bookingsTable.id, numericId))
      .limit(1);

    if (!existing) throw new NotFoundError("Booking");

    const body = await request.json();
    const data = validate(bookingStatusSchema, body);

    await db
      .update(bookingsTable)
      .set({ status: data.status, updatedAt: new Date() })
      .where(eq(bookingsTable.id, numericId));

    return Response.json({
      booking: {
        ...existing,
        hotelName: {
          ar: existing.hotelNameAr ?? "",
          en: existing.hotelNameEn ?? "",
          tr: existing.hotelNameTr ?? "",
          ur: existing.hotelNameUr ?? "",
        },
        status: data.status,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
