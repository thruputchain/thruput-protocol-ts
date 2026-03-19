/**
 * Comprehensive union codec tests.
 *
 * Tests all union patterns in the core protocol types (pattern 1: no default arm).
 * Tests patterns 2 and 3 (default arms) use inline codecs matching the
 * codegen spec, since the generated RPC types need one more x23c fix.
 *
 * When the RPC package compiles clean, add tests against the real
 * generated types (ExpectedStorageCost, WalletTransactionAck, etc.)
 */
import { describe, it, expect } from "vitest";
import {
  serialize, deserialize, serializeCxs, deserializeCxs,
  XdrWriter,
} from "@groundhog/xdr";
import type { XdrCodec, IWriter, IReader } from "@groundhog/xdr";
import {
  contractAddress, ed25519PublicKey, ed25519Signature, ed25519SecretKey,
  storageKeyContractData, contractEntrypointID, returnBuffer,
  keyID, bitMap, weight,
  CryptographicScheme, StorageKeyType, InvocationFrameStatusCode,
  ContractType, HogexecPrecompiledNativeContracts, AuthClaimType,
  codec,
} from "../../src/index.js";
import type {
  Signature, PublicKey, SecretKey, ExtensionPoint, StorageKey,
  InvocationFrameOutput, Contract, AuthClaim,
} from "../../src/index.js";
import { toHex } from "../../src/utils/hex.js";

// ============================================================================
// Pattern 1: No default arm — real generated unions
// ============================================================================

describe("union codecs — no default arm", () => {
  describe("Signature (single-variant enum union)", () => {
    it("round-trips Ed25519 variant", () => {
      const sig: Signature = {
        scheme: CryptographicScheme.Ed25519,
        ed25519: ed25519Signature(new Uint8Array(64).fill(0xAA)),
      };
      expect(deserialize(serialize(sig, codec.Signature), codec.Signature)).toEqual(sig);
    });

    it("throws on unknown discriminant", () => {
      const w = new XdrWriter();
      w.writeInt32(99n);
      w.writeFixedOpaque(new Uint8Array(64), 64);
      expect(() => deserialize(w.finish(), codec.Signature)).toThrow(/Unknown/);
    });

    it("round-trips via CXS", () => {
      const sig: Signature = {
        scheme: CryptographicScheme.Ed25519,
        ed25519: ed25519Signature(new Uint8Array(64).fill(0xBB)),
      };
      expect(deserializeCxs(serializeCxs(sig, codec.Signature), codec.Signature)).toEqual(sig);
    });
  });

  describe("PublicKey", () => {
    it("round-trips Ed25519", () => {
      const pk: PublicKey = {
        scheme: CryptographicScheme.Ed25519,
        ed25519: ed25519PublicKey(new Uint8Array(32).fill(0x42)),
      };
      expect(deserialize(serialize(pk, codec.PublicKey), codec.PublicKey)).toEqual(pk);
    });
  });

  describe("SecretKey", () => {
    it("round-trips Ed25519", () => {
      const sk: SecretKey = {
        scheme: CryptographicScheme.Ed25519,
        ed25519: ed25519SecretKey(new Uint8Array(64).fill(0x11)),
      };
      expect(deserialize(serialize(sk, codec.SecretKey), codec.SecretKey)).toEqual(sk);
    });
  });

  describe("ExtensionPoint (int-discriminated, void arm)", () => {
    it("round-trips variant 0", () => {
      const ep: ExtensionPoint = { v: 0 };
      expect(serialize(ep, codec.ExtensionPoint)).toEqual(new Uint8Array([0, 0, 0, 0]));
      expect(deserialize(serialize(ep, codec.ExtensionPoint), codec.ExtensionPoint)).toEqual(ep);
    });

    it("throws on unknown variant", () => {
      const w = new XdrWriter();
      w.writeInt32(1n);
      expect(() => deserialize(w.finish(), codec.ExtensionPoint)).toThrow(/Unknown/);
    });
  });

  describe("StorageKey (multi-variant, data + void arms)", () => {
    const allVariants: StorageKey[] = [
      { key_type: StorageKeyType.ContractData, contract_data_key: storageKeyContractData(new Uint8Array(32).fill(0xFF)) },
      { key_type: StorageKeyType.FreeNativeTokenBalance },
      { key_type: StorageKeyType.AuthData },
      { key_type: StorageKeyType.Metadata },
      { key_type: StorageKeyType.ReplayCache },
    ];

    for (const sk of allVariants) {
      it(`round-trips ${StorageKeyType[sk.key_type]}`, () => {
        expect(deserialize(serialize(sk, codec.StorageKey), codec.StorageKey)).toEqual(sk);
      });
    }

    it("throws on unknown discriminant", () => {
      const w = new XdrWriter();
      w.writeInt32(99n);
      expect(() => deserialize(w.finish(), codec.StorageKey)).toThrow(/Unknown/);
    });

    it("each variant produces different bytes", () => {
      const hexes = allVariants.map(sk => toHex(serialize(sk, codec.StorageKey)));
      expect(new Set(hexes).size).toBe(hexes.length);
    });

    it("round-trips all variants via CXS", () => {
      for (const sk of allVariants) {
        expect(deserializeCxs(serializeCxs(sk, codec.StorageKey), codec.StorageKey)).toEqual(sk);
      }
    });
  });

  describe("InvocationFrameOutput (data + void arms)", () => {
    it("round-trips Return (data arm)", () => {
      const out: InvocationFrameOutput = {
        status_code: InvocationFrameStatusCode.Return,
        return_buffer: returnBuffer(new Uint8Array([1, 2, 3])),
      };
      expect(deserialize(serialize(out, codec.InvocationFrameOutput), codec.InvocationFrameOutput)).toEqual(out);
    });

    it("round-trips Abort (data arm)", () => {
      const out: InvocationFrameOutput = {
        status_code: InvocationFrameStatusCode.Abort,
        abort_buffer: returnBuffer(new Uint8Array([0xDE, 0xAD])),
      };
      expect(deserialize(serialize(out, codec.InvocationFrameOutput), codec.InvocationFrameOutput)).toEqual(out);
    });

    it("round-trips Fault (void arm)", () => {
      const out: InvocationFrameOutput = { status_code: InvocationFrameStatusCode.Fault };
      expect(deserialize(serialize(out, codec.InvocationFrameOutput), codec.InvocationFrameOutput)).toEqual(out);
    });

    it("round-trips Return with empty buffer", () => {
      const out: InvocationFrameOutput = {
        status_code: InvocationFrameStatusCode.Return,
        return_buffer: returnBuffer(new Uint8Array(0)),
      };
      expect(deserialize(serialize(out, codec.InvocationFrameOutput), codec.InvocationFrameOutput)).toEqual(out);
    });
  });

  describe("Contract (different data types per arm)", () => {
    it("round-trips kWasmi", () => {
      const c: Contract = {
        contract_type: ContractType.kWasmi,
        wasmi_contract: { wasm: new Uint8Array([0, 97, 115, 109]) },
      };
      expect(deserialize(serialize(c, codec.Contract), codec.Contract)).toEqual(c);
    });

    it("round-trips kNative", () => {
      const c: Contract = {
        contract_type: ContractType.kNative,
        native_contract_id: HogexecPrecompiledNativeContracts.kNativeContractHogToken,
      };
      expect(deserialize(serialize(c, codec.Contract), codec.Contract)).toEqual(c);
    });

    it("round-trips kMockTest", () => {
      const c: Contract = { contract_type: ContractType.kMockTest, mock_contract_id: 42n };
      expect(deserialize(serialize(c, codec.Contract), codec.Contract)).toEqual(c);
    });
  });

  describe("AuthClaim (5-variant, anonymous struct arms)", () => {
    const allVariants: AuthClaim[] = [
      { claim_type: AuthClaimType.kInvokedAddressSignature, invoked_address_signature_id: keyID(3n) },
      { claim_type: AuthClaimType.kInvokedAddressSignedWeight, invoked_address_signed_weight: { accepted_keys: bitMap(0b111n), required_weight: weight(2n) } },
      { claim_type: AuthClaimType.kOtherAddressSignature, other_address_signature_id: { address: contractAddress(new Uint8Array(32).fill(0xBB)), key_id: keyID(1n) } },
      { claim_type: AuthClaimType.kOtherAddressSignedWeight, other_address_signed_weight: { address: contractAddress(new Uint8Array(32).fill(0xCC)), accepted_keys: bitMap(0b1111n), required_weight: weight(3n) } },
      { claim_type: AuthClaimType.kPubkeySignature, pubkey_preimage: { pubkey: { scheme: CryptographicScheme.Ed25519, ed25519: ed25519PublicKey(new Uint8Array(32).fill(0xDD)) }, nonce: 12345n } },
    ];

    for (const claim of allVariants) {
      it(`round-trips ${AuthClaimType[claim.claim_type]}`, () => {
        expect(deserialize(serialize(claim, codec.AuthClaim), codec.AuthClaim)).toEqual(claim);
      });
    }

    it("round-trips all variants via CXS", () => {
      for (const claim of allVariants) {
        expect(deserializeCxs(serializeCxs(claim, codec.AuthClaim), codec.AuthClaim)).toEqual(claim);
      }
    });
  });
});

// ============================================================================
// Pattern 2: Default arm with void body
//
// Inline codec matching the codegen spec (Extract<> for narrowing in encode,
// { disc: number } catch-all in type). Once the RPC package compiles, these
// should be replaced with tests against ExpectedStorageCost, WalletTransactionAck, etc.
// ============================================================================

enum MockError { None = 0, NotFound = 1, Internal = 2 }

type MockResult =
  | { error: MockError.None; value: bigint }
  | { error: number }
;

const MockResultCodec: XdrCodec<MockResult> = {
  encode(w: IWriter, val: MockResult) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case MockError.None: {
        const v = val as { error: MockError.None; value: bigint };
        w.writeUint32(v.value);
        break;
      }
    }
  },
  decode(r: IReader) {
    const error = Number(r.readInt32());
    switch (error) {
      case MockError.None:
        return { error, value: r.readUint32() };
      default:
        return { error };
    }
  },
};

describe("union codecs — default void arm (pattern 2)", () => {
  it("round-trips success variant", () => {
    const val: MockResult = { error: MockError.None, value: 42n };
    expect(deserialize(serialize(val, MockResultCodec), MockResultCodec)).toEqual(val);
  });

  it("round-trips known error via default arm", () => {
    const val: MockResult = { error: MockError.NotFound };
    const decoded = deserialize(serialize(val, MockResultCodec), MockResultCodec);
    expect(decoded.error).toBe(MockError.NotFound);
    expect("value" in decoded).toBe(false);
  });

  it("round-trips unknown discriminant via default arm", () => {
    const val: MockResult = { error: 99 };
    const decoded = deserialize(serialize(val, MockResultCodec), MockResultCodec);
    expect(decoded.error).toBe(99);
    expect("value" in decoded).toBe(false);
  });

  it("default arm (void) encodes only the discriminant", () => {
    const success = serialize({ error: MockError.None, value: 42n } as MockResult, MockResultCodec);
    const error = serialize({ error: MockError.NotFound } as MockResult, MockResultCodec);
    expect(success.length).toBe(8); // int32 + uint32
    expect(error.length).toBe(4);   // int32 only
  });

  it("round-trips via CXS", () => {
    expect(deserializeCxs(serializeCxs({ error: MockError.None, value: 100n } as MockResult, MockResultCodec), MockResultCodec)).toEqual({ error: MockError.None, value: 100n });
    expect(deserializeCxs(serializeCxs({ error: MockError.Internal } as MockResult, MockResultCodec), MockResultCodec)).toEqual({ error: MockError.Internal });
  });
});

// ============================================================================
// Pattern 3: Default arm with data body
// ============================================================================

type MockMessage =
  | { tag: 0; count: bigint }
  | { tag: 1 }
  | { tag: number; raw_payload: Uint8Array }
;

const MockMessageCodec: XdrCodec<MockMessage> = {
  encode(w: IWriter, val: MockMessage) {
    w.writeInt32(BigInt(val.tag));
    switch (val.tag) {
      case 0: {
        const v = val as { tag: 0; count: bigint };
        w.writeUint64(v.count);
        break;
      }
      case 1:
        break;
      default:
        w.writeVarOpaque((val as { raw_payload: Uint8Array }).raw_payload, 0xFFFFFFFF);
        break;
    }
  },
  decode(r: IReader) {
    const tag = Number(r.readInt32());
    switch (tag) {
      case 0:
        return { tag, count: r.readUint64() };
      case 1:
        return { tag };
      default:
        return { tag, raw_payload: r.readVarOpaque(0xFFFFFFFF) };
    }
  },
};

describe("union codecs — default data arm (pattern 3)", () => {
  it("round-trips known data variant", () => {
    const val: MockMessage = { tag: 0, count: 999n };
    expect(deserialize(serialize(val, MockMessageCodec), MockMessageCodec)).toEqual(val);
  });

  it("round-trips known void variant", () => {
    const decoded = deserialize(serialize({ tag: 1 } as MockMessage, MockMessageCodec), MockMessageCodec);
    expect(decoded.tag).toBe(1);
  });

  it("round-trips unknown tag via default arm with data", () => {
    const val: MockMessage = { tag: 42, raw_payload: new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]) };
    const decoded = deserialize(serialize(val, MockMessageCodec), MockMessageCodec);
    expect(decoded.tag).toBe(42);
    expect((decoded as { raw_payload: Uint8Array }).raw_payload).toEqual(new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]));
  });

  it("round-trips default arm with empty payload", () => {
    const val: MockMessage = { tag: 77, raw_payload: new Uint8Array(0) };
    const decoded = deserialize(serialize(val, MockMessageCodec), MockMessageCodec);
    expect(decoded.tag).toBe(77);
    expect((decoded as { raw_payload: Uint8Array }).raw_payload).toEqual(new Uint8Array(0));
  });

  it("round-trips all variants via CXS", () => {
    const variants: MockMessage[] = [
      { tag: 0, count: 0n },
      { tag: 1 },
      { tag: 255, raw_payload: new Uint8Array([1, 2, 3]) },
    ];
    for (const val of variants) {
      expect(deserializeCxs(serializeCxs(val, MockMessageCodec), MockMessageCodec)).toEqual(val);
    }
  });
});

// ============================================================================
// TXS vs CXS comparison
// ============================================================================

describe("union codecs — TXS vs CXS", () => {
  it("CXS is smaller for small discriminants", () => {
    const sk: StorageKey = { key_type: StorageKeyType.FreeNativeTokenBalance };
    expect(serialize(sk, codec.StorageKey).length).toBe(4);
    expect(serializeCxs(sk, codec.StorageKey).length).toBe(1);
  });

  it("both formats decode to the same value", () => {
    const claim: AuthClaim = {
      claim_type: AuthClaimType.kInvokedAddressSignedWeight,
      invoked_address_signed_weight: { accepted_keys: bitMap(0b111n), required_weight: weight(2n) },
    };
    expect(deserialize(serialize(claim, codec.AuthClaim), codec.AuthClaim))
      .toEqual(deserializeCxs(serializeCxs(claim, codec.AuthClaim), codec.AuthClaim));
  });
});
