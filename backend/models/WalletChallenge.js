import mongoose from "mongoose";
import { newAuthNonce } from "./User.js";

// Short-lived, single-use login/registration challenge for wallets that do not
// yet have a profile. Identity is proven by signing the returned message; this
// document only holds the expected nonce and self-expires via the TTL index.
const walletChallengeSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^0x[a-f0-9]{40}$/,
    },
    nonce: { type: String, required: true, default: newAuthNonce },
    // TTL: pending challenges expire automatically after 5 minutes.
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } },
  },
  { timestamps: false }
);

const WalletChallengeModel = mongoose.model("WalletChallenge", walletChallengeSchema);

import { memoryWalletChallengeStore } from "../utils/memoryStore.js";

const WalletChallenge = new Proxy(WalletChallengeModel, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return Reflect.get(target, prop);
    }
    if (prop in memoryWalletChallengeStore) {
      return memoryWalletChallengeStore[prop];
    }
    return Reflect.get(target, prop);
  },
});

export default WalletChallenge;
