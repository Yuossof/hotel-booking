"use client";

import { useRef, useEffect } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { T } from "@/types";

interface ImageUploaderProps {
  images: string[];
  mainImage: string;
  onImagesChange: (images: string[]) => void;
  onMainImageChange: (image: string) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  uploading: boolean;
  t: T;
}

export default function ImageUploader({
  images = [],
  mainImage = "",
  onImagesChange,
  onMainImageChange,
  files = [],
  onFilesChange,
  uploading = false,
  t,
}: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<Map<File, string>>(new Map());

  const getUrl = (file: File) => {
    let url = objectUrlsRef.current.get(file);
    if (!url) {
      url = URL.createObjectURL(file);
      objectUrlsRef.current.set(file, url);
    }
    return url;
  };

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    const fileList = Array.from(selected);
    onFilesChange([...files, ...fileList]);

    if (files.length === 0 && images.length === 0 && !mainImage) {
      onMainImageChange(fileList[0].name);
    }

    if (fileRef.current) fileRef.current.value = "";
  };

  const removeFile = (file: File) => {
    const url = objectUrlsRef.current.get(file);
    if (url) {
      URL.revokeObjectURL(url);
      objectUrlsRef.current.delete(file);
    }
    const updated = files.filter((f) => f !== file);
    onFilesChange(updated);
    if (mainImage === file.name) {
      const next = images[0] || (updated.length > 0 ? updated[0].name : "");
      onMainImageChange(next);
    }
  };

  const removeImage = (path: string) => {
    const updated = images.filter((img) => img !== path);
    onImagesChange(updated);
    if (mainImage === path) {
      const next = updated[0] || (files.length > 0 ? files[0].name : "");
      onMainImageChange(next);
    }
  };

  const hasAny = images.length > 0 || files.length > 0;

  return (
    <div>
      <label style={{ fontSize: 11.5, color: "var(--ink-soft)", display: "block", marginBottom: 6 }}>
        {t("images_label")}
      </label>

      {hasAny && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
            gap: 8,
            marginBottom: 10,
          }}
        >
          {images.map((path) => {
            const isMain = path === mainImage;
            return (
              <div
                key={path}
                style={{
                  position: "relative",
                  borderRadius: 8,
                  overflow: "hidden",
                  border: isMain ? "2px solid var(--primary)" : "2px solid var(--line)",
                  aspectRatio: "1",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={path}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <button
                    type="button"
                    className="bir-btn"
                    onClick={() => onMainImageChange(path)}
                    style={{
                      padding: 3,
                      borderRadius: 4,
                      background: isMain ? "var(--primary)" : "rgba(0,0,0,0.5)",
                      color: "#fff",
                      lineHeight: 1,
                      border: "none",
                      cursor: "pointer",
                    }}
                    title={isMain ? t("main_image") : t("set_main_image")}
                  >
                    <Star size={12} fill={isMain ? "currentColor" : "none"} />
                  </button>
                  <button
                    type="button"
                    className="bir-btn"
                    onClick={() => removeImage(path)}
                    style={{
                      padding: 3,
                      borderRadius: 4,
                      background: "rgba(200,0,0,0.7)",
                      color: "#fff",
                      lineHeight: 1,
                      border: "none",
                      cursor: "pointer",
                    }}
                    title={t("delete")}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                {isMain && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "var(--primary)",
                      color: "#fff",
                      fontSize: 9,
                      textAlign: "center",
                      padding: "2px 0",
                    }}
                  >
                    {t("main_image")}
                  </div>
                )}
              </div>
            );
          })}

          {files.map((file) => {
            const isMain = mainImage === file.name;
            return (
              <div
                key={file.name + file.size}
                style={{
                  position: "relative",
                  borderRadius: 8,
                  overflow: "hidden",
                  border: isMain ? "2px solid var(--primary)" : "2px solid var(--line)",
                  aspectRatio: "1",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getUrl(file)}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <button
                    type="button"
                    className="bir-btn"
                    onClick={() => onMainImageChange(file.name)}
                    style={{
                      padding: 3,
                      borderRadius: 4,
                      background: isMain ? "var(--primary)" : "rgba(0,0,0,0.5)",
                      color: "#fff",
                      lineHeight: 1,
                      border: "none",
                      cursor: "pointer",
                    }}
                    title={isMain ? t("main_image") : t("set_main_image")}
                  >
                    <Star size={12} fill={isMain ? "currentColor" : "none"} />
                  </button>
                  <button
                    type="button"
                    className="bir-btn"
                    onClick={() => removeFile(file)}
                    style={{
                      padding: 3,
                      borderRadius: 4,
                      background: "rgba(200,0,0,0.7)",
                      color: "#fff",
                      lineHeight: 1,
                      border: "none",
                      cursor: "pointer",
                    }}
                    title={t("delete")}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                {isMain && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "var(--primary)",
                      color: "#fff",
                      fontSize: 9,
                      textAlign: "center",
                      padding: "2px 0",
                    }}
                  >
                    {t("main_image")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        style={{ display: "none" }}
        onChange={handleFiles}
      />
      <button
        type="button"
        className="bir-btn"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        style={{
          padding: "8px 14px",
          borderRadius: 8,
          fontSize: 12.5,
          display: "flex",
          alignItems: "center",
          gap: 6,
          border: "1px dashed var(--line)",
          background: "transparent",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {uploading ? (
          <>{t("loading_text")}</>
        ) : (
          <>
            <ImagePlus size={15} /> {hasAny ? t("add_more_images") : t("upload_images")}
          </>
        )}
      </button>
    </div>
  );
}
