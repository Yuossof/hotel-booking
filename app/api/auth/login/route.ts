import { db } from "@/database";
import { usersTable } from "@/database/schemas/user";
import { apiErrorResponse, ValidationError } from "@/lib/errors";
import { loginSchema, validate } from "@/lib/validation";
import { count, eq } from "drizzle-orm";
import { hashPassword, verifyPassword, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = validate(loginSchema, body);

    // أول مرة فقط
    const [{ count: usersCount }] = await db
      .select({ count: count() })
      .from(usersTable);

    if (usersCount === 0) {
      await db.insert(usersTable).values({
        name: "Admin",
        email: data.email,
        password: await hashPassword(data.password),
        isAdmin: true,
      });
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email))
      .limit(1);

    if (!user) {
      throw new ValidationError("Invalid email or password");
    }

    const valid = await verifyPassword(data.password, user.password);

    if (!valid) {
      throw new ValidationError("Invalid email or password");
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return Response.json({
      token,
      user: {                                                                                                                                                
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return apiErrorResponse(error, request);
  }
}