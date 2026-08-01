import { db } from "@/database";
import { hotelsTable } from "@/database/schemas/hotel";
import { citiesTable } from "@/database/schemas/city";
import { verifyAuth } from "@/lib/auth";
import { apiErrorResponse, NotFoundError } from "@/lib/errors";
import { deleteUploadedFiles } from "@/lib/deleteUploadedFile";
import { saveUploadedFile } from "@/lib/upload";
import { hotelUpdateSchema, validate } from "@/lib/validation";
import { eq } from "drizzle-orm";

type HotelJoined = typeof hotelsTable.$inferSelect & {
  cityNameAr: string;
  cityNameEn: string;
  cityNameTr: string;
  cityNameUr: string;
};

function rowToHotel(row: HotelJoined) {
  return {
    id: row.id,
    name: { ar: row.nameAr, en: row.nameEn, tr: row.nameTr, ur: row.nameUr },
    city: {
      id: row.cityId,
      name: { ar: row.cityNameAr, en: row.cityNameEn, tr: row.cityNameTr, ur: row.cityNameUr },
    },
    price: Number(row.price),
    totalRooms: row.totalRooms,
    availableRooms: row.availableRooms,
    description: { ar: row.descriptionAr, en: row.descriptionEn, tr: row.descriptionTr, ur: row.descriptionUr },
    image: row.image,
    gallery: row.gallery as string[],
    roomTypes: row.roomTypes as string[],
    amenities: row.amenities as string[],
    locationUrl: row.locationUrl,
    checkInTime: row.checkInTime,
    checkOutTime: row.checkOutTime,
    featured: row.featured,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function getHotelJoined(id: number): Promise<HotelJoined | null> {
  const rows = await db
    .select({
      id: hotelsTable.id,
      cityId: hotelsTable.cityId,
      nameAr: hotelsTable.nameAr,
      nameEn: hotelsTable.nameEn,
      nameTr: hotelsTable.nameTr,
      nameUr: hotelsTable.nameUr,
      price: hotelsTable.price,
      totalRooms: hotelsTable.totalRooms,
      availableRooms: hotelsTable.availableRooms,
      descriptionAr: hotelsTable.descriptionAr,
      descriptionEn: hotelsTable.descriptionEn,
      descriptionTr: hotelsTable.descriptionTr,
      descriptionUr: hotelsTable.descriptionUr,
      image: hotelsTable.image,
      gallery: hotelsTable.gallery,
      roomTypes: hotelsTable.roomTypes,
      amenities: hotelsTable.amenities,
      locationUrl: hotelsTable.locationUrl,
      checkInTime: hotelsTable.checkInTime,
      checkOutTime: hotelsTable.checkOutTime,
      featured: hotelsTable.featured,
      createdAt: hotelsTable.createdAt,
      updatedAt: hotelsTable.updatedAt,
      cityNameAr: citiesTable.nameAr,
      cityNameEn: citiesTable.nameEn,
      cityNameTr: citiesTable.nameTr,
      cityNameUr: citiesTable.nameUr,
    })
    .from(hotelsTable)
    .innerJoin(citiesTable, eq(hotelsTable.cityId, citiesTable.id))
    .where(eq(hotelsTable.id, id))
    .limit(1);

  return (rows[0] as HotelJoined | undefined) ?? null;
}

async function parseHotelForm(request: Request) {
  const ct = request.headers.get("content-type") || "";

  if (ct.includes("multipart/form-data")) {
    const fd = await request.formData();

    const getStr = (key: string) => (fd.get(key) as string) || "";
    const getNum = (key: string) => fd.has(key) ? Number(getStr(key)) : undefined;
    const getArr = (key: string) => {
      try { return JSON.parse(getStr(key)); } catch { return undefined; }
    };

    const imageFiles = fd.getAll("imageFiles").filter((f): f is File => f instanceof File);

    const uploadedPaths = imageFiles.length > 0
      ? await Promise.all(imageFiles.map(saveUploadedFile))
      : [];

    const fileNames = imageFiles.map((f) => f.name);
    let mainImage = getStr("image");
    const mainFileIndex = fileNames.indexOf(mainImage);
    if (mainFileIndex !== -1 && mainFileIndex < uploadedPaths.length) {
      mainImage = uploadedPaths[mainFileIndex];
    } else if (mainImage && !mainImage.startsWith("/uploads/")) {
      mainImage = "";
    }

    const existingGallery = getArr("gallery") || [];
    const gallery = [...existingGallery, ...uploadedPaths];

    const featured = fd.has("featured") ? getStr("featured") === "true" : undefined;

    const result: Record<string, unknown> = {
      ...(fd.has("cityId") && { cityId: getNum("cityId") }),
      ...(fd.has("nameAr") && { nameAr: getStr("nameAr") }),
      ...(fd.has("nameEn") && { nameEn: getStr("nameEn") }),
      ...(fd.has("nameTr") && { nameTr: getStr("nameTr") }),
      ...(fd.has("nameUr") && { nameUr: getStr("nameUr") }),
      ...(fd.has("price") && { price: getNum("price") }),
      ...(fd.has("totalRooms") && { totalRooms: getNum("totalRooms") }),
      ...(fd.has("availableRooms") && { availableRooms: getNum("availableRooms") }),
      ...(fd.has("descriptionAr") && { descriptionAr: getStr("descriptionAr") }),
      ...(fd.has("descriptionEn") && { descriptionEn: getStr("descriptionEn") }),
      ...(fd.has("descriptionTr") && { descriptionTr: getStr("descriptionTr") }),
      ...(fd.has("descriptionUr") && { descriptionUr: getStr("descriptionUr") }),
      ...(fd.has("locationUrl") && { locationUrl: getStr("locationUrl") }),
      ...(fd.has("checkInTime") && { checkInTime: getStr("checkInTime") }),
      ...(fd.has("checkOutTime") && { checkOutTime: getStr("checkOutTime") }),
      ...(featured !== undefined && { featured }),
      ...(fd.has("roomTypes") && { roomTypes: getArr("roomTypes") }),
      ...(fd.has("amenities") && { amenities: getArr("amenities") }),
      image: mainImage,
      gallery,
    };

    return result;
  }

  const body = await request.json();
  return validate(hotelUpdateSchema, body);
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const row = await getHotelJoined(Number(id));
    if (!row) throw new NotFoundError("Hotel");
    return Response.json({ hotel: rowToHotel(row) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAuth(request);
    const { id } = await params;
    const numericId = Number(id);

    const existing = await getHotelJoined(numericId);
    if (!existing) throw new NotFoundError("Hotel");

    const data = await parseHotelForm(request);

    if (data.cityId !== undefined) {
      const [city] = await db.select().from(citiesTable).where(eq(citiesTable.id, data.cityId as number)).limit(1);
      if (!city) {
        return Response.json({ error: "City not found" }, { status: 404 });
      }
    }

    const oldGallery = existing.gallery as string[];
    const newImage = data.image !== undefined ? (data.image as string) : existing.image;
    const newGallery = data.gallery !== undefined ? (data.gallery as string[]) : oldGallery;

    const keep = new Set<string>([newImage, ...newGallery]);
    const removed: string[] = [];

    if (existing.image && !keep.has(existing.image)) removed.push(existing.image);
    for (const img of oldGallery) {
      if (!keep.has(img)) removed.push(img);
    }

    await db
      .update(hotelsTable)
      .set({
        ...(data.cityId !== undefined && { cityId: data.cityId as number }),
        ...(data.nameAr !== undefined && { nameAr: data.nameAr as string }),
        ...(data.nameEn !== undefined && { nameEn: data.nameEn as string }),
        ...(data.nameTr !== undefined && { nameTr: data.nameTr as string }),
        ...(data.nameUr !== undefined && { nameUr: data.nameUr as string }),
        ...(data.price !== undefined && { price: data.price as number }),
        ...(data.totalRooms !== undefined && { totalRooms: data.totalRooms as number }),
        ...(data.availableRooms !== undefined && { availableRooms: data.availableRooms as number }),
        ...(data.descriptionAr !== undefined && { descriptionAr: data.descriptionAr as string }),
        ...(data.descriptionEn !== undefined && { descriptionEn: data.descriptionEn as string }),
        ...(data.descriptionTr !== undefined && { descriptionTr: data.descriptionTr as string }),
        ...(data.descriptionUr !== undefined && { descriptionUr: data.descriptionUr as string }),
        ...(data.image !== undefined && { image: data.image as string }),
        ...(data.gallery !== undefined && { gallery: data.gallery as string[] }),
        ...(data.roomTypes !== undefined && { roomTypes: data.roomTypes as string[] }),
        ...(data.amenities !== undefined && { amenities: data.amenities as string[] }),
        ...(data.locationUrl !== undefined && { locationUrl: data.locationUrl as string }),
        ...(data.checkInTime !== undefined && { checkInTime: data.checkInTime as string }),
        ...(data.checkOutTime !== undefined && { checkOutTime: data.checkOutTime as string }),
        ...(data.featured !== undefined && { featured: data.featured as boolean }),
        updatedAt: new Date(),
      })
      .where(eq(hotelsTable.id, numericId));

    const updated = await getHotelJoined(numericId);
    if (!updated) throw new NotFoundError("Hotel");

    if (removed.length > 0) {
      deleteUploadedFiles(removed);
    }

    return Response.json({ hotel: rowToHotel(updated) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAuth(request);
    const { id } = await params;
    const numericId = Number(id);

    const existing = await getHotelJoined(numericId);
    if (!existing) throw new NotFoundError("Hotel");

    await db.delete(hotelsTable).where(eq(hotelsTable.id, numericId));

    const images = [existing.image, ...(existing.gallery as string[])].filter(Boolean) as string[];
    deleteUploadedFiles(images);

    return Response.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
