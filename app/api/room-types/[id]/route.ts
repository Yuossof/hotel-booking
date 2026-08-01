import { db } from "@/database";
import { roomTypesTable } from "@/database/schemas/roomType";
import { verifyAuth } from "@/lib/auth";
import { apiErrorResponse, apiErrorMessage, NotFoundError } from "@/lib/errors";
import { eq } from "drizzle-orm";

function rowToRoomType(row: typeof roomTypesTable.$inferSelect) {
  return {
    id: row.id,
    name: { ar: row.nameAr, en: row.nameEn, tr: row.nameTr, ur: row.nameUr },
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [row] = await db.select().from(roomTypesTable).where(eq(roomTypesTable.id, Number(id))).limit(1);
    if (!row) throw new NotFoundError("Room type");
    return Response.json({ roomType: rowToRoomType(row) });
  } catch (error) {
    return apiErrorResponse(error, _request);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAuth(request);
    const { id } = await params;
    const numericId = Number(id);

    const [existing] = await db.select().from(roomTypesTable).where(eq(roomTypesTable.id, numericId)).limit(1);
    if (!existing) throw new NotFoundError("Room type");

    const body = await request.json();
    const { nameAr, nameEn, nameTr, nameUr } = body;
    if (![nameAr, nameEn, nameTr, nameUr].every((v) => typeof v === "string" && v.trim().length > 0)) {
      return Response.json({ error: apiErrorMessage("All language names are required", request) }, { status: 400 });
    }

    const [row] = await db
      .update(roomTypesTable)
      .set({
        nameAr: nameAr.trim(),
        nameEn: nameEn.trim(),
        nameTr: nameTr.trim(),
        nameUr: nameUr.trim(),
        updatedAt: new Date(),
      })
      .where(eq(roomTypesTable.id, numericId))
      .returning();

    return Response.json({ roomType: rowToRoomType(row) });
  } catch (error) {
    return apiErrorResponse(error, request);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAuth(request);
    const { id } = await params;
    const numericId = Number(id);

    const [existing] = await db.select().from(roomTypesTable).where(eq(roomTypesTable.id, numericId)).limit(1);
    if (!existing) throw new NotFoundError("Room type");

    await db.delete(roomTypesTable).where(eq(roomTypesTable.id, numericId));

    return Response.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error, request);
  }
}
