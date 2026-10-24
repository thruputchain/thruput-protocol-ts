import {
  GenesisContractAddresses,
  contractAddress,
  type ContractAddress,
} from "./protocol/index.js";

const nativeTokenAddressBytes = new Uint8Array(32);

// Genesis addresses encode their enum value as a big-endian uint32
// in the final four bytes.
new DataView(nativeTokenAddressBytes.buffer).setUint32(
  nativeTokenAddressBytes.byteLength - 4,
  GenesisContractAddresses.kAddressNativeToken,
  false,
);

/**
 * Protocol-defined address of the precompiled native-token contract.
 *
 * This shared `Uint8Array` value must not be mutated.
 */
export const NATIVE_TOKEN_ADDRESS: ContractAddress = contractAddress(
  nativeTokenAddressBytes,
);
