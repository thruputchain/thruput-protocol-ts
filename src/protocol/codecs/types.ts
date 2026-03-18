import type { XdrCodec } from "../../xdr/codec.js";
import {
  sha256Hash, dbHash, blockHash, contractAddress,
  ed25519Signature, ed25519PublicKey, ed25519SecretKey,
  storageKeyContractData,
  CryptographicScheme, StorageKeyType,
} from "../types.js";
import type {
  SHA256Hash as SHA256HashType,
  DbHash as DbHashType,
  BlockHash as BlockHashType,
  ContractAddress as ContractAddressType,
  Ed25519Signature as Ed25519SignatureType,
  Ed25519PublicKey as Ed25519PublicKeyType,
  Ed25519SecretKey as Ed25519SecretKeyType,
  StorageKeyContractData as StorageKeyContractDataType,
  PublicKey as PublicKeyType,
  SecretKey as SecretKeyType,
  Signature as SignatureType,
  StorageKey as StorageKeyType_,
  ExtensionPoint as ExtensionPointType,
  AddressAndKey as AddressAndKeyType,
} from "../types.js";

// Fixed-size opaque branded types
export const SHA256Hash: XdrCodec<SHA256HashType> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return sha256Hash(r.readFixedOpaque(32)); },
};

export const DbHash: XdrCodec<DbHashType> = {
  encode(w, val) { w.writeFixedOpaque(val, 2048); },
  decode(r) { return dbHash(r.readFixedOpaque(2048)); },
};

export const BlockHash: XdrCodec<BlockHashType> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return blockHash(r.readFixedOpaque(32)); },
};

export const ContractAddress: XdrCodec<ContractAddressType> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return contractAddress(r.readFixedOpaque(32)); },
};

export const Ed25519Signature: XdrCodec<Ed25519SignatureType> = {
  encode(w, val) { w.writeFixedOpaque(val, 64); },
  decode(r) { return ed25519Signature(r.readFixedOpaque(64)); },
};

export const Ed25519PublicKey: XdrCodec<Ed25519PublicKeyType> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return ed25519PublicKey(r.readFixedOpaque(32)); },
};

export const Ed25519SecretKey: XdrCodec<Ed25519SecretKeyType> = {
  encode(w, val) { w.writeFixedOpaque(val, 64); },
  decode(r) { return ed25519SecretKey(r.readFixedOpaque(64)); },
};

export const StorageKeyContractData: XdrCodec<StorageKeyContractDataType> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return storageKeyContractData(r.readFixedOpaque(32)); },
};

// Unions
export const PublicKey: XdrCodec<PublicKeyType> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case CryptographicScheme.Ed25519:
        Ed25519PublicKey.encode(w, val.ed25519);
        break;
    }
  },
  decode(r) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case CryptographicScheme.Ed25519:
        return { scheme, ed25519: Ed25519PublicKey.decode(r) };
      default:
        throw new Error(`Unknown CryptographicScheme: ${scheme}`);
    }
  },
};

export const Signature: XdrCodec<SignatureType> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case CryptographicScheme.Ed25519:
        Ed25519Signature.encode(w, val.ed25519);
        break;
    }
  },
  decode(r) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case CryptographicScheme.Ed25519:
        return { scheme, ed25519: Ed25519Signature.decode(r) };
      default:
        throw new Error(`Unknown CryptographicScheme: ${scheme}`);
    }
  },
};

export const SecretKey: XdrCodec<SecretKeyType> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case CryptographicScheme.Ed25519:
        Ed25519SecretKey.encode(w, val.ed25519);
        break;
    }
  },
  decode(r) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case CryptographicScheme.Ed25519:
        return { scheme, ed25519: Ed25519SecretKey.decode(r) };
      default:
        throw new Error(`Unknown CryptographicScheme: ${scheme}`);
    }
  },
};

export const ExtensionPoint: XdrCodec<ExtensionPointType> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.v));
  },
  decode(r) {
    const v = Number(r.readInt32());
    if (v !== 0) throw new Error(`Unknown ExtensionPoint variant: ${v}`);
    return { v: 0 as const };
  },
};

export const StorageKey: XdrCodec<StorageKeyType_> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.key_type));
    if (val.key_type === StorageKeyType.kStorageKeyTypeContractData) {
      StorageKeyContractData.encode(w, val.contract_data_key);
    }
    // void arms: nothing to write
  },
  decode(r) {
    const key_type = Number(r.readInt32());
    switch (key_type) {
      case StorageKeyType.kStorageKeyTypeContractData:
        return { key_type, contract_data_key: StorageKeyContractData.decode(r) };
      case StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance:
      case StorageKeyType.kStorageKeyTypeAddressAuthData:
      case StorageKeyType.kStorageKeyTypeAddressMetadata:
      case StorageKeyType.kStorageKeyTypeReplayCache:
        return { key_type } as StorageKeyType_;
      default:
        throw new Error(`Unknown StorageKeyType: ${key_type}`);
    }
  },
};

// Structs
export const AddressAndKey: XdrCodec<AddressAndKeyType> = {
  encode(w, val) {
    ContractAddress.encode(w, val.address);
    StorageKey.encode(w, val.key);
  },
  decode(r) {
    return {
      address: ContractAddress.decode(r),
      key: StorageKey.decode(r),
    };
  },
};
