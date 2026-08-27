import { uploadImage, deleteImage, getOptimizedUrl } from "./cloudinary";

const FOLDER = "huellitas/pets";

/** Sube una foto de mascota a Cloudinary. */
export async function uploadPetPhoto(
  ownerUid: string,
  petId: string,
  fileUri: string,
): Promise<string> {
  const result = await uploadImage(
    fileUri,
    `${FOLDER}/${ownerUid}/${petId}`,
    { maxWidth: 800, maxHeight: 800 },
  );
  return result.secure_url;
}


export async function uploadPetAvatar(
  ownerUid: string,
  petId: string,
  fileUri: string,
): Promise<string> {
  const result = await uploadImage(
    fileUri,
    `${FOLDER}/${ownerUid}/${petId}`,
    { maxWidth: 400, maxHeight: 400 },
  );
  return result.secure_url;
}


export async function deletePetPhoto(photoUrl: string): Promise<void> {
  // Extraer public_id de la URL
  const parts = photoUrl.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) return;

  const pathWithVersion = parts.slice(uploadIndex + 1).join("/");
  const publicId = pathWithVersion.replace(/^v\d+\//, "").replace(/\.\w+$/, "");

  await deleteImage(publicId);
}

/** Sube la foto de perfil del usuario. */
export async function uploadUserAvatar(
  uid: string,
  fileUri: string,
): Promise<string> {
  const result = await uploadImage(
    fileUri,
    `huellitas/users/${uid}`,
    { maxWidth: 400, maxHeight: 400 },
  );
  return result.secure_url;
}


export { getOptimizedUrl };
