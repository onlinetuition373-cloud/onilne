// Single helper for file uploads. For now this just reads basic metadata and resolves
// with a fake path. Later this will send the file to your backend storage.
export type UploadResult = { success: true; path: string; name: string } | { success: false; error: string };

export async function uploadFile(file: File, folder: string): Promise<UploadResult> {
  if (!file) return { success: false, error: "No file provided" };

  // TODO(backend): replace with a real upload to your storage provider.
  console.log(`[uploadFile] would upload "${file.name}" to folder "${folder}"`);
  await new Promise((r) => setTimeout(r, 300));

  return { success: true, path: `${folder}/${file.name}`, name: file.name };
}
