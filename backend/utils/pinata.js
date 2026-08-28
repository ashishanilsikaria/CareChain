import axios from "axios";
import FormData from "form-data";

/**
 * Pins a Buffer to IPFS using Pinata's pinFileToIPFS
 * filename is used for UI clarity (we append .enc)
 */
export async function pinToIPFS(buffer, filename, pinataJWT) {
  if (!pinataJWT) throw new Error("PINATA_JWT is not set");

  const form = new FormData();
  form.append("file", buffer, { filename });

  // Optional metadata
  form.append("pinataMetadata", JSON.stringify({ name: filename }));
  form.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    form,
    {
      maxBodyLength: Infinity,
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${pinataJWT}`
      }
    }
  );

  // Pinata responses may use schema: IpfsHash, PinSize, Timestamp
  return {
    cid: res.data?.IpfsHash,
    raw: res.data
  };
}
