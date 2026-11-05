import { describe, expect, it } from "vitest";
import { serialize, deserialize, serializeCxs, deserializeCxs } from "@thruputchain/xdr";
import {
  codec, parallelSignedTransactionBatch, parallelSignedTransactionHashBatch,
  parallelNondeterministicProposalDataBatch,
} from "../src/index.js";

describe.each([
  ["XDR", serialize, deserialize],
  ["CXS", serializeCxs, deserializeCxs],
] as const)("%s generated aliases", (_name, encode, decode) => {
  it("shares array work across both ParallelBatch fields", () => {
    const value = { segment_tokens: [1n, 2n], segment_bytes: [3n, 4n], xdr: new Uint8Array() };
    const bytes = encode(value, codec.ParallelBatch);
    expect(() => decode(bytes, codec.ParallelBatch, { maxWork: 6 })).toThrow("work budget");
    expect(decode(bytes, codec.ParallelBatch, { maxWork: 7 })).toEqual(value);
  });

  it("uses the same limits for aliases and their underlying codec", () => {
    const value = { segment_tokens: [], segment_bytes: [], xdr: new Uint8Array() };
    const limits = { maxDepth: 2, maxWork: 3 };
    const bytes = encode(value, codec.ParallelBatch, limits);
    expect(decode(bytes, codec.ParallelBatch, limits)).toEqual(value);
    const aliases = [
      [codec.ParallelSignedTransactionBatch, parallelSignedTransactionBatch(value)],
      [codec.ParallelSignedTransactionHashBatch, parallelSignedTransactionHashBatch(value)],
      [codec.ParallelNondeterministicProposalDataBatch, parallelNondeterministicProposalDataBatch(value)],
    ] as const;
    for (const [alias, branded] of aliases) {
      expect(encode(branded, alias, limits)).toEqual(bytes);
      expect(decode<typeof branded>(bytes, alias, limits)).toEqual(value);
    }
  });
});
