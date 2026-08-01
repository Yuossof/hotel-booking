import { db } from "@/database";
import { amenitiesTable } from "@/database/schemas/amenity";
import { verifyAuth } from "@/lib/auth";
import { apiErrorResponse } from "@/lib/errors";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(amenitiesTable).orderBy(desc(amenitiesTable.createdAt));
    return Response.json({
      amenities: rows.map((r) => ({
        id: r.id,
        key: r.key,
        name: { ar: r.nameAr, en: r.nameEn, tr: r.nameTr, ur: r.nameUr },
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
    verifyAuth(request);
    const body = await request.json();
    const { key, nameAr, nameEn, nameTr, nameUr } = body;
    if (!key || !key.trim()) {
      return Response.json({ error: "Key is required" }, { status: 400 });
    }
    if (![nameAr, nameEn, nameTr, nameUr].every((v) => typeof v === "string" && v.trim().length > 0)) {
      return Response.json({ error: "All language names are required" }, { status: 400 });
    }
    const [row] = await db
      .insert(amenitiesTable)
      .values({
        key: key.trim().toLowerCase().replace(/\s+/g, "_"),
        nameAr: nameAr.trim(),
        nameEn: nameEn.trim(),
        nameTr: nameTr.trim(),
        nameUr: nameUr.trim(),
      })
      .returning();
    return Response.json(
      {
        amenity: {
          id: row.id,
          key: row.key,
          name: { ar: row.nameAr, en: row.nameEn, tr: row.nameTr, ur: row.nameUr },
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
