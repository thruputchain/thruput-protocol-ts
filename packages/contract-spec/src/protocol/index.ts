// Barrel — add new .x files here when they're added to generate.sh
//
// Unlike the rpc barrel, this does NOT `export *` from
// @groundhogchain/protocol: both packages define ContractType (and friends),
// so only the cross-package types the generated code references are
// re-exported here.
export { type Topic, topic } from "@groundhogchain/protocol";
export * from "./groundhog_contract_spec.js";

// Merged codec namespace
import { codec as _protocol_codec } from "@groundhogchain/protocol";
import { codec as groundhog_contract_spec_codec } from "./groundhog_contract_spec.js";

function _buildCodec() {
  return {
    Topic: _protocol_codec.Topic,
    ...groundhog_contract_spec_codec,
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
