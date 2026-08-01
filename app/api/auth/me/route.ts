import { db } from "@/database";
import { usersTable } from "@/database/schemas/user";
import { verifyAuth } from "@/lib/auth";
import { apiErrorResponse, NotFoundError } from "@/lib/errors";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const payload = verifyAuth(request);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId)).limit(1);
    if (!user) {
      throw new NotFoundError("User");
    }

    return Response.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return apiErrorResponse(error, request);
  }
}
