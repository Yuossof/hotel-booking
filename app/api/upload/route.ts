import { verifyAuth } from "@/lib/auth";
import { apiErrorResponse, ValidationError } from "@/lib/errors";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    verifyAuth(request);

    const formData = await request.formData();
    const singleFile = formData.get("file");
    const multipleFiles = formData.getAll("files");

    if (singleFile instanceof File) {
      const path = await saveUploadedFile(singleFile);
      return Response.json({ path }, { status: 201 });
    }

    if (multipleFiles.length > 0) {
      const files = multipleFiles.filter((f): f is File => f instanceof File);
      if (files.length === 0) {
        throw new ValidationError("No valid files provided");
      }
      const paths = await Promise.all(files.map(saveUploadedFile));
      return Response.json({ paths }, { status: 201 });
    }

    throw new ValidationError("No file provided. Use 'file' (single) or 'files' (multiple) field.");
  } catch (error) {
    return apiErrorResponse(error);
  }
}
