import { File } from "expo-file-system";

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "huellitas_unsigned";

if (!CLOUD_NAME) {
  console.warn("[Cloudinary] EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME no está configurado en .env");
}

const API_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export interface UploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}
export async function uploadImage(
  fileUri: string,
  folder: string,
  options: {
    transformation?: string;
    maxWidth?: number;
    maxHeight?: number;
  } = {},
): Promise<UploadResult> {
  if (!CLOUD_NAME) {
    throw new Error(
      "Cloudinary no configurado: falta EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME en .env",
    );
  }

  const file = new File(fileUri);

  const formData = new FormData();
  formData.append("file", file, "photo.jpg");
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Error subiendo imagen a Cloudinary");
  }

  return response.json();
}

export async function deleteImage(publicId: string): Promise<void> {
  // Requiere firma — por ahora solo loguear
  console.warn("Para eliminar, usa el dashboard de Cloudinary:", publicId);
}

/** URL con transformaciones on-the-fly. */
export function getOptimizedUrl(
  photoUrl: string,
  options: { width?: number; height?: number; quality?: number } = {},
): string {
  const { width = 400, height = 400, quality = 80 } = options;
  return photoUrl.replace(
    "/upload/",
    `/upload/w_${width},h_${height},q_${quality},c_limit,f_auto/`,
  );
}
