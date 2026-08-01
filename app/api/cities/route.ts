import { db } from "@/database";
import { citiesTable } from "@/database/schemas/city";
import { SEED_CITIES } from "@/lib/constants";
import { verifyAuth } from "@/lib/auth";
import { apiErrorResponse } from "@/lib/errors";
import { citySchema, validate } from "@/lib/validation";
import { desc } from "drizzle-orm";

function rowToCity(row: typeof citiesTable.$inferSelect) {
  return {
    id: row.id,
    name: { ar: row.nameAr, en: row.nameEn, tr: row.nameTr, ur: row.nameUr },
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function GET() {
  try {
    const rows = await db.select().from(citiesTable).orderBy(desc(citiesTable.createdAt));
    return Response.json({ cities: rows.map(rowToCity) });
  } catch {
    return Response.json({ cities: SEED_CITIES });
  }
}

export async function POST(request: Request) {
  try {
    verifyAuth(request);
    const body = await request.json();
    const data = validate(citySchema, body);

    const [row] = await db
      .insert(citiesTable)
      .values({
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        nameTr: data.nameTr,
        nameUr: data.nameUr,
      })
      .returning();

    return Response.json({ city: rowToCity(row) }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, request);
  }
}
