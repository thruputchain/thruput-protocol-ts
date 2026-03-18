import type { XdrCodec } from "../../xdr/codec.js";
import { AuthClaimType, keyID, bitMap, weight } from "../auth_claim.js";
import type {
  AuthClaim as AuthClaimType_,
  AuthClaimData as AuthClaimDataType,
  PubkeyAccountPreimage as PubkeyAccountPreimageType,
} from "../auth_claim.js";
import { kMaxAuthClaims } from "../auth_claim.js";
import * as typesCodecs from "./types.js";

export const PubkeyAccountPreimage: XdrCodec<PubkeyAccountPreimageType> = {
  encode(w, val) {
    typesCodecs.PublicKey.encode(w, val.pubkey);
    w.writeUint64(val.nonce);
  },
  decode(r) {
    return { pubkey: typesCodecs.PublicKey.decode(r), nonce: r.readUint64() };
  },
};

export const AuthClaim: XdrCodec<AuthClaimType_> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.claim_type));
    switch (val.claim_type) {
      case AuthClaimType.kInvokedAddressSignature:
        w.writeUint32(val.invoked_address_signature_id);
        break;
      case AuthClaimType.kInvokedAddressSignedWeight:
        w.writeUint32(val.invoked_address_signed_weight.accepted_keys);
        w.writeUint32(val.invoked_address_signed_weight.required_weight);
        break;
      case AuthClaimType.kOtherAddressSignature:
        typesCodecs.ContractAddress.encode(w, val.other_address_signature_id.address);
        w.writeUint32(val.other_address_signature_id.key_id);
        break;
      case AuthClaimType.kOtherAddressSignedWeight:
        typesCodecs.ContractAddress.encode(w, val.other_address_signed_weight.address);
        w.writeUint32(val.other_address_signed_weight.accepted_keys);
        w.writeUint32(val.other_address_signed_weight.required_weight);
        break;
      case AuthClaimType.kPubkeySignature:
        PubkeyAccountPreimage.encode(w, val.pubkey_preimage);
        break;
    }
  },
  decode(r) {
    const claim_type = Number(r.readInt32());
    switch (claim_type) {
      case AuthClaimType.kInvokedAddressSignature:
        return { claim_type, invoked_address_signature_id: keyID(r.readUint32()) };
      case AuthClaimType.kInvokedAddressSignedWeight:
        return {
          claim_type,
          invoked_address_signed_weight: {
            accepted_keys: bitMap(r.readUint32()),
            required_weight: weight(r.readUint32()),
          },
        };
      case AuthClaimType.kOtherAddressSignature:
        return {
          claim_type,
          other_address_signature_id: {
            address: typesCodecs.ContractAddress.decode(r),
            key_id: keyID(r.readUint32()),
          },
        };
      case AuthClaimType.kOtherAddressSignedWeight:
        return {
          claim_type,
          other_address_signed_weight: {
            address: typesCodecs.ContractAddress.decode(r),
            accepted_keys: bitMap(r.readUint32()),
            required_weight: weight(r.readUint32()),
          },
        };
      case AuthClaimType.kPubkeySignature:
        return { claim_type, pubkey_preimage: PubkeyAccountPreimage.decode(r) };
      default:
        throw new Error(`Unknown AuthClaimType: ${claim_type}`);
    }
  },
};

export const AuthClaimData: XdrCodec<AuthClaimDataType> = {
  encode(w, val) {
    if (BigInt(val.length) > kMaxAuthClaims) throw new Error(`AuthClaimData length ${val.length} exceeds max ${kMaxAuthClaims}`);
    w.writeUint32(BigInt(val.length));
    for (const item of val) AuthClaim.encode(w, item);
  },
  decode(r) {
    const len = Number(r.readUint32());
    if (BigInt(len) > kMaxAuthClaims) throw new Error(`AuthClaimData length ${len} exceeds max ${kMaxAuthClaims}`);
    const result: AuthClaimDataType = [];
    for (let i = 0; i < len; i++) result.push(AuthClaim.decode(r));
    return result;
  },
};
