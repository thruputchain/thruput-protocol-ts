import {
  GenesisContractAddresses,
  contractAddress,
  type ContractAddress,
} from "./protocol/index.js";

const hogAddressBytes = new Uint8Array(32);

// Genesis addresses encode their enum value as a big-endian uint32
// in the final four bytes.
new DataView(hogAddressBytes.buffer).setUint32(
  hogAddressBytes.byteLength - 4,
  GenesisContractAddresses.kAddressNativeToken,
  false,
);

/**
 * Protocol-defined address of the precompiled native HOG token contract.
 *
 * This shared `Uint8Array` value must not be mutated.
 */
export const HOG_ADDRESS: ContractAddress = contractAddress(hogAddressBytes);
