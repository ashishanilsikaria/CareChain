import dotenv from "dotenv";

// Load environment variables in deterministic order:
// 1. Root atlas-credentials.env (if present)
// 2. Root .env (if present)
// 3. Backend .env (if present)
// 4. Default current working directory .env
try {
  dotenv.config({ path: new URL("../atlas-credentials.env", import.meta.url) });
} catch (_) {}

try {
  dotenv.config({ path: new URL("../.env", import.meta.url) });
} catch (_) {}

try {
  dotenv.config({ path: new URL("./.env", import.meta.url) });
} catch (_) {}

dotenv.config();

export default process.env;
