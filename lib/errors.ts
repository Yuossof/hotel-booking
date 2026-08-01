import { langFromRequest, localizeError } from "./serverErrors";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
    this.name = "ValidationError";
  }
}

export function apiErrorResponse(error: unknown, request?: Request | null) {
  const lang = langFromRequest(request);

  if (error instanceof AppError) {
    return Response.json(
      {
        error: localizeError(error.message, lang),
        ...(error.details !== undefined ? { details: error.details } : {}),
      },
      { status: error.statusCode },
    );
  }

  console.error("Unhandled error:", error);
  return Response.json({ error: localizeError("Internal server error", lang) }, { status: 500 });
}

export function apiErrorMessage(message: string, request?: Request | null) {
  return localizeError(message, langFromRequest(request));
}
