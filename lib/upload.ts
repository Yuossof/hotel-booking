import { writeFile, unlink, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { ValidationError } from "./errors";

const UPLOAD_DIR = join(process.cwd(), "uploads");
const MAX_FILE_SIZE = 40 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function generateFilename(originalName: string): string {
  const ext = extname(originalName).toLowerCase() || ".jpg";
  const random = crypto.randomUUID().slice(0, 8);
  return `${Date.now()}_${random}${ext}`;
}

async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export async function saveUploadedFile(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ValidationError(
      `Invalid file type "${file.type}". Allowed: ${ALLOWED_TYPES.join(", ")}`
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError(
      `File size ${(file.size / 1024 / 1024).toFixed(1)} MB exceeds the ${MAX_FILE_SIZE / 1024 / 1024} MB limit`
    );
  }

  await ensureUploadDir();

  const filename = generateFilename(file.name);
  const filepath = join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}

export async function deleteUploadedFile(path: string): Promise<void> {
  if (!path || !path.startsWith("/uploads/")) return;

  const filename = path.replace("/uploads/", "");
  const filepath = join(UPLOAD_DIR, filename);

  try {
    await unlink(filepath);
  } catch {
  }
}

export async function replaceUploadedFile(oldPath: string, newFile: File): Promise<string> {
  const newPath = await saveUploadedFile(newFile);
  await deleteUploadedFile(oldPath);
  return newPath;
}