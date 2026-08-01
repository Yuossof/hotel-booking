import { db } from "@/database";
import { citiesTable } from "@/database/schemas/city";
import { verifyAuth } from "@/lib/auth";
import { apiErrorResponse, NotFoundError } from "@/lib/errors";
import { cityUpdateSchema, validate } from "@/lib/validation";
import { eq } from "drizzle-orm";

function rowToCity(row: typeof citiesTable.$inferSelect) {
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
    const [row] = await db.select().from(citiesTable).where(eq(citiesTable.id, Number(id))).limit(1);
    if (!row) throw new NotFoundError("City");
    return Response.json({ city: rowToCity(row) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAuth(request);
    const { id } = await params;
    const numericId = Number(id);

    const [existing] = await db.select().from(citiesTable).where(eq(citiesTable.id, numericId)).limit(1);
    if (!existing) throw new NotFoundError("City");

    const body = await request.json();
    const data = validate(cityUpdateSchema, body);

    const [row] = await db
      .update(citiesTable)
      .set({
        ...(data.nameAr !== undefined && { nameAr: data.nameAr }),
        ...(data.nameEn !== undefined && { nameEn: data.nameEn }),
        ...(data.nameTr !== undefined && { nameTr: data.nameTr }),
        ...(data.nameUr !== undefined && { nameUr: data.nameUr }),
        updatedAt: new Date(),
      })
      .where(eq(citiesTable.id, numericId))
      .returning();

    return Response.json({ city: rowToCity(row) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAuth(request);
    const { id } = await params;

    const [existing] = await db.select().from(citiesTable).where(eq(citiesTable.id, Number(id))).limit(1);
    if (!existing) throw new NotFoundError("City");

    await db.delete(citiesTable).where(eq(citiesTable.id, Number(id)));

    return Response.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
