// Barrel — add new .x files here when they're added to generate.sh
export * from "@thruputchain/rpc";
export * from "./pagination.js";
export * from "./indexer.js";

// Merged codec namespace
import { codec as _protocol_codec } from "@thruputchain/rpc";
import { codec as pagination_codec } from "./pagination.js";
import { codec as indexer_codec } from "./indexer.js";

function _buildCodec() {
  return {
    ..._protocol_codec,
    ...pagination_codec,
    ...indexer_codec,
  } as const;
}

type _Codec = ReturnType<typeof _buildCodec>;
let _cached: _Codec | undefined;
function _resolve(): _Codec {
  return (_cached ??= _buildCodec());
}

export const codec: _Codec = new Proxy({} as _Codec, {
  get(_, prop) { return (_resolve() as any)[prop]; },
  has(_, prop) { return prop in _resolve(); },
  ownKeys() { return Reflect.ownKeys(_resolve()); },
  getOwnPropertyDescriptor(_, prop) {
    return Object.getOwnPropertyDescriptor(_resolve(), prop);
  },
});
