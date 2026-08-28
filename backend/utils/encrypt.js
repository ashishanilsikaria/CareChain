import crypto from "crypto";

/**
 * AES-256-GCM encryption of a Buffer
 * Returns { encrypted, key, iv, tag } (hex for key/iv/tag)
 */
export function encryptBuffer(buffer) {
  const key = crypto.randomBytes(32); // 256-bit
  const iv = crypto.randomBytes(12);  // 96-bit for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    encrypted,
    key: key.toString("hex"),
    iv: iv.toString("hex"),
    tag: tag.toString("hex")
  };
}
