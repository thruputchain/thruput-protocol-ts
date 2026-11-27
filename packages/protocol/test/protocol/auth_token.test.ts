import { expect, it } from "vitest";
import {
  authTokenPayload, codec, contractAddress, deserialize, serialize, type AuthTokenNode,
} from "../../src/index.js";

const leaf: AuthTokenNode = {
  consumer_address: contractAddress(new Uint8Array(32).fill(1)),
  payload: authTokenPayload(Uint8Array.of(0xab)),
  child_nodes: [],
};

it("decodes standard XDR and preserves grant trees deeper than the network default", () => {
  const bytes = Uint8Array.of(...leaf.consumer_address, 0, 0, 0, 1, 0xab, 0, 0, 0, 0, 0, 0, 0);
  expect(deserialize(bytes, codec.AuthTokenNode)).toEqual(leaf);
  let tree = leaf;
  for (let level = 1; level < 5; level++) tree = { ...leaf, child_nodes: [tree] };
  expect(deserialize(serialize(tree, codec.AuthTokenNode), codec.AuthTokenNode)).toEqual(tree);
});

it("rejects child counts and payload lengths above their XDR bounds", () => {
  const bytes = serialize(leaf, codec.AuthTokenNode);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  view.setUint32(bytes.length - 4, 5);
  expect(() => deserialize(bytes, codec.AuthTokenNode)).toThrow(/5 exceeds max 4/);
  view.setUint32(32, 257);
  expect(() => deserialize(bytes, codec.AuthTokenNode)).toThrow(/257 exceeds max 256/);
});
