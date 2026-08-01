import { db } from "@/database";
import { amenitiesTable } from "@/database/schemas/amenity";
import { verifyAuth } from "@/lib/auth";
import { apiErrorResponse, apiErrorMessage, NotFoundError } from "@/lib/errors";
import { eq } from "drizzle-orm";

function rowToAmenity(row: typeof amenitiesTable.$inferSelect) {
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
    const [row] = await db.select().from(amenitiesTable).where(eq(amenitiesTable.id, Number(id))).limit(1);
    if (!row) throw new NotFoundError("Amenity");
    return Response.json({ amenity: rowToAmenity(row) });
  } catch (error) {
    return apiErrorResponse(error, _request);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAuth(request);
    const { id } = await params;
    const numericId = Number(id);

    const [existing] = await db.select().from(amenitiesTable).where(eq(amenitiesTable.id, numericId)).limit(1);
    if (!existing) throw new NotFoundError("Amenity");

    const body = await request.json();
    const { nameAr, nameEn, nameTr, nameUr } = body;
    if (![nameAr, nameEn, nameTr, nameUr].every((v) => typeof v === "string" && v.trim().length > 0)) {
      return Response.json({ error: apiErrorMessage("All language names are required", request) }, { status: 400 });
    }

    const [row] = await db
      .update(amenitiesTable)
      .set({
        nameAr: nameAr.trim(),
        nameEn: nameEn.trim(),
        nameTr: nameTr.trim(),
        nameUr: nameUr.trim(),
        updatedAt: new Date(),
      })
      .where(eq(amenitiesTable.id, numericId))
      .returning();

    return Response.json({ amenity: rowToAmenity(row) });
  } catch (error) {
    return apiErrorResponse(error, request);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAuth(request);
    const { id } = await params;
    const numericId = Number(id);

    const [existing] = await db.select().from(amenitiesTable).where(eq(amenitiesTable.id, numericId)).limit(1);
    if (!existing) throw new NotFoundError("Amenity");

    await db.delete(amenitiesTable).where(eq(amenitiesTable.id, numericId));

    return Response.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error, request);
  }
}
