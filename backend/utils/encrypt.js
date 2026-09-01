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
    tag: tag.toString("hex"),
  };
}

/**
 * AES-256-GCM decryption of a Buffer payload (which contains ciphertext + 16-byte auth tag)
 */
export function decryptBuffer(payload, keyHex, ivHex, tagHex) {
  const key = Buffer.from(keyHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  
  // If tag is not passed or payload contains appended 16-byte tag
  let tag = tagHex ? Buffer.from(tagHex, "hex") : null;
  let ciphertext = payload;

  if (payload.length > 16 && (!tag || tag.length === 0)) {
    tag = payload.subarray(payload.length - 16);
    ciphertext = payload.subarray(0, payload.length - 16);
  } else if (payload.length > 16 && tag) {
    // If payload has tag appended at end
    const potentialTag = payload.subarray(payload.length - 16);
    if (potentialTag.toString("hex") === tagHex) {
      ciphertext = payload.subarray(0, payload.length - 16);
    }
  }

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  if (tag) {
    decipher.setAuthTag(tag);
  }
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted;
}
