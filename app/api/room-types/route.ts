import { db } from "@/database";
import { roomTypesTable } from "@/database/schemas/roomType";
import { verifyAuth } from "@/lib/auth";
import { apiErrorResponse, apiErrorMessage } from "@/lib/errors";
import { desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const rows = await db.select().from(roomTypesTable).orderBy(desc(roomTypesTable.createdAt));
    return Response.json({
      roomTypes: rows.map((r) => ({
        id: r.id,
        name: { ar: r.nameAr, en: r.nameEn, tr: r.nameTr, ur: r.nameUr },
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    return apiErrorResponse(error, request);
  }
}

export async function POST(request: Request) {
  try {
    verifyAuth(request);
    const body = await request.json();
    const { nameAr, nameEn, nameTr, nameUr } = body;
    if (![nameAr, nameEn, nameTr, nameUr].every((v) => typeof v === "string" && v.trim().length > 0)) {
      return Response.json({ error: apiErrorMessage("All language names are required", request) }, { status: 400 });
    }
    const [row] = await db
      .insert(roomTypesTable)
      .values({
        nameAr: nameAr.trim(),
        nameEn: nameEn.trim(),
        nameTr: nameTr.trim(),
        nameUr: nameUr.trim(),
      })
      .returning();
    return Response.json(
      {
        roomType: {
          id: row.id,
          name: { ar: row.nameAr, en: row.nameEn, tr: row.nameTr, ur: row.nameUr },
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, request);
  }
}
