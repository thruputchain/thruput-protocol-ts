import {
  GenesisContractAddresses,
  contractAddress,
  type ContractAddress,
} from "./protocol/index.js";

const hogAddressBytes = new Uint8Array(32);
new DataView(hogAddressBytes.buffer).setUint32(
  hogAddressBytes.byteLength - 4,
  GenesisContractAddresses.kAddressPrecompiledHogToken,
  false,
);

/**
 * Protocol-defined address of the precompiled native HOG token contract.
 *
 * This shared `Uint8Array` value must not be mutated.
 */
export const HOG_ADDRESS: ContractAddress = contractAddress(hogAddressBytes);
