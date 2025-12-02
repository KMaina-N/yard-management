import crypto from "crypto";

const SECRET = process.env.NEXT_PUBLIC_SECRET!;
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

const key = Buffer.from(SECRET, "hex"); // must be 32 bytes

export function encodeId(id: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(id, "utf-8"),
    cipher.final(),
  ]);

  // Convert both IV and encrypted data to hex
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decodeId(encoded: string): string {
  const [ivHex, encryptedHex] = encoded.split(":");
  if (!ivHex || !encryptedHex) throw new Error("Invalid encoded value");

  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString("utf-8");
}
