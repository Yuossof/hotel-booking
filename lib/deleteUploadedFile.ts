import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.resolve(process.cwd(), "public", "uploads");

export function extractFilenameFromUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  let pathname: string;
  try {
    pathname = new URL(url).pathname;
  } catch {
    pathname = url;
  }

  const uploadsIdx = pathname.indexOf("/uploads/");
  if (uploadsIdx === -1) return null;

  const afterUploads = pathname.slice(uploadsIdx + "/uploads/".length);
  const filename = afterUploads.split("/")[0]?.split("?")[0];

  if (!filename || filename.includes("..")) return null;
  return filename;
}

export function deleteUploadedFile(url: string): void {
  const filename = extractFilenameFromUrl(url);
  if (!filename) return;

  const filePath = path.join(UPLOADS_DIR, filename);

  fs.unlink(filePath, (err) => {
    if (!err) return;
    if (err.code === "ENOENT") return;
  });
}

export function deleteUploadedFileByName(filename: string): void {
  if (!filename || typeof filename !== "string") return;
  if (filename.includes("..") || filename.includes("/")) return;

  const filePath = path.join(UPLOADS_DIR, filename);

  fs.unlink(filePath, (err) => {
    if (!err) return;
    if (err.code === "ENOENT") return;
  });
}

export function deleteUploadedFiles(urls: string[]): void {
  for (const url of urls) {
    if (url) deleteUploadedFile(url);
  }
}
