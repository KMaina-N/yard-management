import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

const AZURE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const CONTAINER_NAME = "yard-system";

export const uploadToAzure = async (
  file: File,
  containerName: string,
  fileName?: string
) => {
  const blobService = BlobServiceClient.fromConnectionString(
    AZURE_CONNECTION_STRING
  );
  const containerClient = blobService.getContainerClient(containerName);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const blobName = fileName ?? `${Date.now()}-${file.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: file.type },
  });

  return { url: blockBlobClient.url };
};


export const deleteFromAzure = async (
  blobUrl: string,
  containerName: string,
  blobName: string
) => {
  const blobService = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING);
  const containerClient = blobService.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
  return { message: "Blob deleted successfully" };
}