import { writeFile, unlink } from "node:fs/promises";
import { join, extname } from "node:path";
import { ValidationError } from "./errors";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 40 * 1024 * 1024; // 40 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function generateFilename(originalName: string): string {
  const ext = extname(originalName).toLowerCase() || ".jpg";
  const random = crypto.randomUUID().slice(0, 8);
  return `${Date.now()}_${random}${ext}`;
}

export async function saveUploadedFile(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ValidationError(
      `Invalid file type "${file.type}". Allowed: ${ALLOWED_TYPES.join(", ")}`,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError(
      `File size ${(file.size / 1024 / 1024).toFixed(1)} MB exceeds the ${MAX_FILE_SIZE / 1024 / 1024} MB limit`,
    );
  }

  const filename = generateFilename(file.name);
  const buffer = Buffer.from(await file.arrayBuffer());
  const filepath = join(UPLOAD_DIR, filename);

  try {
    await writeFile(filepath, buffer);
  } catch {
    // Ensure uploads directory exists, then retry
    const { mkdir } = await import("node:fs/promises");
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(filepath, buffer);
  }

  return `/uploads/${filename}`;
}

export async function deleteUploadedFile(path: string): Promise<void> {
  if (!path || !path.startsWith("/uploads/")) return;
  const filepath = join(process.cwd(), "public", path);
  try {
    await unlink(filepath);
  } catch {
    // File may not exist — ignore
  }
}

export async function replaceUploadedFile(oldPath: string, newFile: File): Promise<string> {
  const newPath = await saveUploadedFile(newFile);
  await deleteUploadedFile(oldPath);
  return newPath;
}
