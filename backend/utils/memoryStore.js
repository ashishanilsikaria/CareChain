// backend/utils/memoryStore.js
import mongoose from "mongoose";
import { newAuthNonce } from "../models/User.js";

// Global in-memory storage maps
export const memoryData = {
  users: new Map(),
  records: new Map(),
  challenges: new Map(),
};

function initDemoUsers() {
  const defaults = [
    {
      _id: "660000000000000000000001",
      walletAddress: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", // Hardhat Account 0 (Patient)
      name: "Demo Patient",
      email: "patient@demo.com",
      role: "patient",
      isVerified: true,
      nonce: newAuthNonce(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "660000000000000000000002",
      walletAddress: "0x1090495c9bc80106a8e42d89e10fd58adbda409b", // Alt Hardhat Account 0
      name: "Demo Patient",
      email: "patient2@demo.com",
      role: "patient",
      isVerified: true,
      nonce: newAuthNonce(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "660000000000000000000003",
      walletAddress: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", // Hardhat Account 1 (Doctor)
      name: "Demo Doctor",
      email: "doctor@demo.com",
      role: "doctor",
      specialization: "General Medicine",
      hospitalName: "CareChain Demo Hospital",
      doctorId: "DOC-DEMO-001",
      isVerified: true,
      nonce: newAuthNonce(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "660000000000000000000004",
      walletAddress: "0x1a24e5c53b1438f15b25c819fee1f894e6d131f2", // Alt Hardhat Account 1
      name: "Demo Doctor",
      email: "doctor2@demo.com",
      role: "doctor",
      specialization: "General Medicine",
      hospitalName: "CareChain Demo Hospital",
      doctorId: "DOC-DEMO-001",
      isVerified: true,
      nonce: newAuthNonce(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "660000000000000000000005",
      walletAddress: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", // Hardhat Account 2 (Admin)
      name: "Demo Admin",
      email: "admin@demo.com",
      role: "admin",
      isVerified: true,
      nonce: newAuthNonce(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const u of defaults) {
    memoryData.users.set(u.walletAddress.toLowerCase(), { ...u, save: async function() { return this; } });
  }
}

initDemoUsers();

function makeQueryChain(result) {
  const promise = Promise.resolve(result);
  promise.select = () => makeQueryChain(result);
  promise.sort = () => makeQueryChain(result);
  promise.populate = () => makeQueryChain(result);
  promise.lean = () => Promise.resolve(result);
  return promise;
}

export const memoryUserStore = {
  async findOne(query) {
    if (!query) return null;
    let match = null;
    if (query.walletAddress) {
      match = memoryData.users.get(query.walletAddress.toLowerCase());
    } else if (query.email) {
      for (const u of memoryData.users.values()) {
        if (u.email && u.email.toLowerCase() === query.email.toLowerCase()) {
          match = u;
          break;
        }
      }
    }
    if (!match) return null;
    return {
      ...match,
      save: async function () {
        match.nonce = this.nonce;
        match.lastLoginAt = this.lastLoginAt;
        return this;
      },
    };
  },

  findById(id) {
    const sId = id?.toString();
    for (const u of memoryData.users.values()) {
      if (u._id?.toString() === sId) {
        const copy = { ...u };
        return makeQueryChain(copy);
      }
    }
    return makeQueryChain(null);
  },

  find(query = {}) {
    let list = Array.from(memoryData.users.values());
    if (query.role) {
      list = list.filter((u) => u.role === query.role);
    }
    return makeQueryChain(list.map((u) => ({ ...u })));
  },

  async create(doc) {
    const _id = new mongoose.Types.ObjectId().toString();
    const user = {
      _id,
      ...doc,
      walletAddress: doc.walletAddress?.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () {
        return this;
      },
    };
    memoryData.users.set(user.walletAddress, user);
    return user;
  },

  findByIdAndUpdate(id, update, _opts) {
    const sId = id?.toString();
    for (const u of memoryData.users.values()) {
      if (u._id?.toString() === sId) {
        if (update.isVerified !== undefined) u.isVerified = update.isVerified;
        return makeQueryChain({ ...u });
      }
    }
    return makeQueryChain(null);
  },

  async countDocuments(query = {}) {
    let list = Array.from(memoryData.users.values());
    if (query.role) list = list.filter((u) => u.role === query.role);
    if (query.isVerified !== undefined) list = list.filter((u) => u.isVerified === query.isVerified);
    return list.length;
  },
};

export const memoryWalletChallengeStore = {
  async findOneAndUpdate(filter, update, _opts) {
    const addr = filter.walletAddress?.toLowerCase();
    const nonce = update.$set?.nonce || newAuthNonce();
    const challenge = {
      _id: new mongoose.Types.ObjectId().toString(),
      walletAddress: addr,
      nonce,
      createdAt: new Date(),
    };
    memoryData.challenges.set(addr, challenge);
    return challenge;
  },

  async findOne(filter) {
    const addr = filter.walletAddress?.toLowerCase();
    return memoryData.challenges.get(addr) || null;
  },

  async deleteOne(filter) {
    if (filter._id) {
      for (const [k, v] of memoryData.challenges.entries()) {
        if (v._id?.toString() === filter._id.toString()) {
          memoryData.challenges.delete(k);
          return { deletedCount: 1 };
        }
      }
    }
    return { deletedCount: 0 };
  },
};

export const memoryRecordStore = {
  async create(doc) {
    const _id = new mongoose.Types.ObjectId().toString();
    const record = {
      _id,
      sharedWith: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...doc,
    };
    memoryData.records.set(_id, record);
    return record;
  },

  find(query = {}) {
    let list = Array.from(memoryData.records.values());
    if (query.userId) {
      list = list.filter((r) => r.userId?.toString() === query.userId?.toString());
    }
    if (query.$or) {
      list = list.filter((r) => {
        return query.$or.some((clause) => {
          if (clause.uploadedBy) return r.uploadedBy?.toString() === clause.uploadedBy?.toString();
          if (clause["sharedWith.doctor"]) {
            return (r.sharedWith || []).some(
              (s) => s.doctor?.toString() === clause["sharedWith.doctor"]?.toString()
            );
          }
          return false;
        });
      });
    }

    // Populate user info
    const populated = list.map((r) => {
      const copy = { ...r };
      // populate userId
      for (const u of memoryData.users.values()) {
        if (u._id?.toString() === copy.userId?.toString()) {
          copy.userId = { _id: u._id, name: u.name, email: u.email, walletAddress: u.walletAddress };
          break;
        }
      }
      return copy;
    });

    return makeQueryChain(populated);
  },

  async findById(id) {
    const sId = id?.toString();
    return memoryData.records.get(sId) || null;
  },

  async findOneAndUpdate(filter, update, _opts) {
    const sId = filter._id?.toString();
    const record = memoryData.records.get(sId);
    if (!record) return null;

    if (update.$set) Object.assign(record, update.$set);
    if (update.$addToSet?.sharedWith) {
      record.sharedWith = record.sharedWith || [];
      const item = update.$addToSet.sharedWith;
      const exists = record.sharedWith.some(
        (s) => s.doctor?.toString() === item.doctor?.toString() || s.doctorAddress === item.doctorAddress
      );
      if (!exists) record.sharedWith.push(item);
    }
    if (update.$pull?.sharedWith?.$or) {
      record.sharedWith = (record.sharedWith || []).filter((s) => {
        return !update.$pull.sharedWith.$or.some((m) => {
          if (m.doctor && s.doctor?.toString() === m.doctor?.toString()) return true;
          if (m.doctorAddress && s.doctorAddress?.toLowerCase() === m.doctorAddress?.toLowerCase()) return true;
          return false;
        });
      });
    }
    return record;
  },

  async updateMany(filter, update) {
    let count = 0;
    for (const record of memoryData.records.values()) {
      if (filter.userId && record.userId?.toString() === filter.userId?.toString()) {
        if (update.$addToSet?.sharedWith) {
          record.sharedWith = record.sharedWith || [];
          record.sharedWith.push(update.$addToSet.sharedWith);
          count++;
        }
        if (update.$pull?.sharedWith?.$or) {
          record.sharedWith = (record.sharedWith || []).filter((s) => {
            return !update.$pull.sharedWith.$or.some((m) => {
              if (m.doctor && s.doctor?.toString() === m.doctor?.toString()) return true;
              if (m.doctorAddress && s.doctorAddress?.toLowerCase() === m.doctorAddress?.toLowerCase()) return true;
              return false;
            });
          });
          count++;
        }
      }
    }
    return { modifiedCount: count };
  },

  async findOneAndDelete(filter) {
    const sId = filter._id?.toString();
    const record = memoryData.records.get(sId);
    if (record && (!filter.userId || record.userId?.toString() === filter.userId?.toString())) {
      memoryData.records.delete(sId);
      return record;
    }
    return null;
  },

  async countDocuments() {
    return memoryData.records.size;
  },
};
