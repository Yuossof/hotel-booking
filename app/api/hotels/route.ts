import { db } from "@/database";
import { hotelsTable } from "@/database/schemas/hotel";
import { citiesTable } from "@/database/schemas/city";
import { verifyAuth } from "@/lib/auth";
import { apiErrorResponse, apiErrorMessage } from "@/lib/errors";
import { hotelSchema, validate } from "@/lib/validation";
import { saveUploadedFile } from "@/lib/upload";
import { desc, eq } from "drizzle-orm";

type HotelRow = typeof hotelsTable.$inferSelect;
type CityRow = typeof citiesTable.$inferSelect;

interface HotelJoined extends HotelRow {
  cityNameAr: string;
  cityNameEn: string;
  cityNameTr: string;
  cityNameUr: string;
}

function rowToHotel(row: HotelJoined) {
  return {
    id: row.id,
    name: { ar: row.nameAr, en: row.nameEn, tr: row.nameTr, ur: row.nameUr },
    city: {
      id: row.cityId,
      name: { ar: row.cityNameAr, en: row.cityNameEn, tr: row.cityNameTr, ur: row.cityNameUr },
    },
    price: row.price,
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

async function parseHotelForm(request: Request) {
  const ct = request.headers.get("content-type") || "";

  if (ct.includes("multipart/form-data")) {
    const fd = await request.formData();

    const getStr = (key: string) => (fd.get(key) as string) || "";
    const getNum = (key: string) => Number(getStr(key));
    const getArr = (key: string) => {
      try { return JSON.parse(getStr(key)); } catch { return []; }
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

    const existingGallery = getArr("gallery");
    const gallery = [...existingGallery, ...uploadedPaths];

    const featured = getStr("featured") === "true";

    return {
      cityId: getNum("cityId"),
      nameAr: getStr("nameAr"),
      nameEn: getStr("nameEn"),
      nameTr: getStr("nameTr"),
      nameUr: getStr("nameUr"),
      price: getNum("price"),
      totalRooms: getNum("totalRooms"),
      availableRooms: getNum("availableRooms") || undefined,
      descriptionAr: getStr("descriptionAr"),
      descriptionEn: getStr("descriptionEn"),
      descriptionTr: getStr("descriptionTr"),
      descriptionUr: getStr("descriptionUr"),
      image: mainImage,
      gallery,
      roomTypes: getArr("roomTypes"),
      amenities: getArr("amenities"),
      locationUrl: getStr("locationUrl"),
      checkInTime: getStr("checkInTime"),
      checkOutTime: getStr("checkOutTime"),
      featured,
    };
  }

  const body = await request.json();
  return validate(hotelSchema, body);
}

export async function GET(request: Request) {
  try {
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
      .orderBy(desc(hotelsTable.createdAt));

    return Response.json({ hotels: rows.map(rowToHotel) });
  } catch (error) {
    return apiErrorResponse(error, request);
  }
}

export async function POST(request: Request) {
  try {
    verifyAuth(request);
    const data = await parseHotelForm(request);

    const [city] = await db.select().from(citiesTable).where(eq(citiesTable.id, data.cityId)).limit(1);
    if (!city) {
      return Response.json({ error: apiErrorMessage("City not found", request) }, { status: 404 });
    }

    const [row] = await db
      .insert(hotelsTable)
      .values({
        cityId: data.cityId,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        nameTr: data.nameTr,
        nameUr: data.nameUr,
        price: data.price,
        totalRooms: data.totalRooms,
        availableRooms: data.availableRooms ?? data.totalRooms,
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        descriptionTr: data.descriptionTr,
        descriptionUr: data.descriptionUr,
        image: data.image ?? "",
        gallery: data.gallery ?? [],
        roomTypes: data.roomTypes ?? [],
        amenities: data.amenities ?? [],
        locationUrl: data.locationUrl ?? "",
        checkInTime: data.checkInTime ?? "",
        checkOutTime: data.checkOutTime ?? "",
        featured: data.featured ?? false,
      })
      .returning();

    const joined: HotelJoined = {
      ...row,
      cityNameAr: city.nameAr,
      cityNameEn: city.nameEn,
      cityNameTr: city.nameTr,
      cityNameUr: city.nameUr,
    };

    return Response.json({ hotel: rowToHotel(joined) }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, request);
  }
}
