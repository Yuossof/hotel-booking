import { db } from "@/database";
import { usersTable } from "@/database/schemas/user";
import { hashPassword } from "@/lib/auth";
import { apiErrorResponse } from "@/lib/errors";
import { registerSchema, validate } from "@/lib/validation";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = validate(registerSchema, body);

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, data.email)).limit(1);
    if (existing.length > 0) {
      return Response.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(data.password);
    const [user] = await db
      .insert(usersTable)
      .values({ name: data.name, email: data.email, password: hashedPassword })
      .returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email });

    return Response.json({ user }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
