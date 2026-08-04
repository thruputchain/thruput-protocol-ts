// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 2bb863900e285102907f789666495140afed7392

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";


export type DogwoodTreeHash = proto.SHA256Hash & { readonly __brand: "DogwoodTreeHash" };
export function dogwoodTreeHash(val: proto.SHA256Hash): DogwoodTreeHash {
  return val as DogwoodTreeHash;
}

export interface DogwoodTreeNode {
  node: proto.ValidatorID;
  children: proto.DogwoodTreeHash[];
}

export type DogwoodTreeNodes = proto.DogwoodTreeNode[] & { readonly __brand: "DogwoodTreeNodes" };
export function dogwoodTreeNodes(val: proto.DogwoodTreeNode[]): DogwoodTreeNodes {
  return val as DogwoodTreeNodes;
}

export type DogwoodStreamID = proto.DogwoodInt64 & { readonly __brand: "DogwoodStreamID" };
export function dogwoodStreamID(val: proto.DogwoodInt64): DogwoodStreamID {
  return val as DogwoodStreamID;
}

export type DogwoodTransmissionID = proto.DogwoodInt64 & { readonly __brand: "DogwoodTransmissionID" };
export function dogwoodTransmissionID(val: proto.DogwoodInt64): DogwoodTransmissionID {
  return val as DogwoodTransmissionID;
}

export interface DogwoodStream {
  source_id: proto.ValidatorID;
  stream_id: proto.DogwoodStreamID;
}

export interface DogwoodRoute {
  route_hash: proto.DogwoodTreeHash | null;
  route_nodes: proto.DogwoodTreeNodes | null;
}

export enum DogwoodTransmissionType {
  DogwoodTransmissionPayload = 0,
  DogwoodTransmissionRoute = 1,
}

export interface DogwoodTransmission {
  transmission_id: proto.DogwoodTransmissionID;
  type: proto.DogwoodTransmissionType;
  num_payload_bytes: proto.DogwoodInt64;
  num_payload_sheaves: proto.DogwoodInt32;
  num_parity_sheaves: proto.DogwoodInt32;
  max_bytes_per_chunk: proto.DogwoodInt32;
  shuffle_seed: proto.DogwoodInt32;
}

export interface DogwoodChunk {
  sheaf_index: proto.DogwoodInt32;
  chunk_index: proto.DogwoodInt32;
  chunk: Uint8Array;
}

export interface DogwoodPackage {
  transmission: proto.DogwoodTransmission;
  chunk: proto.DogwoodChunk;
}

export interface DogwoodDelivery {
  stream: proto.DogwoodStream;
  route: proto.DogwoodRoute;
  pkg: proto.DogwoodPackage;
}

export interface DogwoodRouting {
  routes: proto.DogwoodTreeNodes[];
}

export interface DogwoodDeliveryEnvelope {
  signature: proto.Signature;
  delivery: proto.DogwoodDelivery;
}



//
// XDR Codecs below this point
//

const _DogwoodTreeHash: XdrCodec<DogwoodTreeHash> = {
  encode(w, val) { proto.codec.SHA256Hash.encode(w, val); },
  decode(r) { return dogwoodTreeHash(proto.codec.SHA256Hash.decode(r)); },
};

const _DogwoodTreeNode: XdrCodec<DogwoodTreeNode> = {
  encode(w, val) {
    proto.codec.ValidatorID.encode(w, val.node);
    VarArrayCodec(proto.codec.DogwoodTreeHash, Number(0xFFFFFFFF)).encode(w, val.children);
  },
  decode(r) {
    const node = proto.codec.ValidatorID.decode(r);
    const children = VarArrayCodec(proto.codec.DogwoodTreeHash, Number(0xFFFFFFFF)).decode(r);
    return { node, children };
  },
};

const _DogwoodTreeNodes = VarArrayCodec(() => proto.codec.DogwoodTreeNode, Number(0xFFFFFFFF)) as XdrCodec<DogwoodTreeNodes>;

const _DogwoodStreamID: XdrCodec<DogwoodStreamID> = {
  encode(w, val) { proto.codec.DogwoodInt64.encode(w, val); },
  decode(r) { return dogwoodStreamID(proto.codec.DogwoodInt64.decode(r)); },
};

const _DogwoodTransmissionID: XdrCodec<DogwoodTransmissionID> = {
  encode(w, val) { proto.codec.DogwoodInt64.encode(w, val); },
  decode(r) { return dogwoodTransmissionID(proto.codec.DogwoodInt64.decode(r)); },
};

const _DogwoodStream: XdrCodec<DogwoodStream> = {
  encode(w, val) {
    proto.codec.ValidatorID.encode(w, val.source_id);
    proto.codec.DogwoodStreamID.encode(w, val.stream_id);
  },
  decode(r) {
    const source_id = proto.codec.ValidatorID.decode(r);
    const stream_id = proto.codec.DogwoodStreamID.decode(r);
    return { source_id, stream_id };
  },
};

const _DogwoodRoute: XdrCodec<DogwoodRoute> = {
  encode(w, val) {
    OptionCodec(_DogwoodTreeHash).encode(w, val.route_hash);
    OptionCodec(_DogwoodTreeNodes).encode(w, val.route_nodes);
  },
  decode(r) {
    const route_hash = OptionCodec(_DogwoodTreeHash).decode(r);
    const route_nodes = OptionCodec(_DogwoodTreeNodes).decode(r);
    return { route_hash, route_nodes };
  },
};

const _DogwoodTransmissionType: XdrCodec<DogwoodTransmissionType> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as DogwoodTransmissionType; },
};

const _DogwoodTransmission: XdrCodec<DogwoodTransmission> = {
  encode(w, val) {
    proto.codec.DogwoodTransmissionID.encode(w, val.transmission_id);
    proto.codec.DogwoodTransmissionType.encode(w, val.type);
    proto.codec.DogwoodInt64.encode(w, val.num_payload_bytes);
    proto.codec.DogwoodInt32.encode(w, val.num_payload_sheaves);
    proto.codec.DogwoodInt32.encode(w, val.num_parity_sheaves);
    proto.codec.DogwoodInt32.encode(w, val.max_bytes_per_chunk);
    proto.codec.DogwoodInt32.encode(w, val.shuffle_seed);
  },
  decode(r) {
    const transmission_id = proto.codec.DogwoodTransmissionID.decode(r);
    const type = proto.codec.DogwoodTransmissionType.decode(r);
    const num_payload_bytes = proto.codec.DogwoodInt64.decode(r);
    const num_payload_sheaves = proto.codec.DogwoodInt32.decode(r);
    const num_parity_sheaves = proto.codec.DogwoodInt32.decode(r);
    const max_bytes_per_chunk = proto.codec.DogwoodInt32.decode(r);
    const shuffle_seed = proto.codec.DogwoodInt32.decode(r);
    return { transmission_id, type, num_payload_bytes, num_payload_sheaves, num_parity_sheaves, max_bytes_per_chunk, shuffle_seed };
  },
};

const _DogwoodChunk: XdrCodec<DogwoodChunk> = {
  encode(w, val) {
    proto.codec.DogwoodInt32.encode(w, val.sheaf_index);
    proto.codec.DogwoodInt32.encode(w, val.chunk_index);
    w.writeVarOpaque(val.chunk, Number(0xFFFFFFFF));
  },
  decode(r) {
    const sheaf_index = proto.codec.DogwoodInt32.decode(r);
    const chunk_index = proto.codec.DogwoodInt32.decode(r);
    const chunk = r.readVarOpaque(Number(0xFFFFFFFF));
    return { sheaf_index, chunk_index, chunk };
  },
};

const _DogwoodPackage: XdrCodec<DogwoodPackage> = {
  encode(w, val) {
    proto.codec.DogwoodTransmission.encode(w, val.transmission);
    proto.codec.DogwoodChunk.encode(w, val.chunk);
  },
  decode(r) {
    const transmission = proto.codec.DogwoodTransmission.decode(r);
    const chunk = proto.codec.DogwoodChunk.decode(r);
    return { transmission, chunk };
  },
};

const _DogwoodDelivery: XdrCodec<DogwoodDelivery> = {
  encode(w, val) {
    proto.codec.DogwoodStream.encode(w, val.stream);
    proto.codec.DogwoodRoute.encode(w, val.route);
    proto.codec.DogwoodPackage.encode(w, val.pkg);
  },
  decode(r) {
    const stream = proto.codec.DogwoodStream.decode(r);
    const route = proto.codec.DogwoodRoute.decode(r);
    const pkg = proto.codec.DogwoodPackage.decode(r);
    return { stream, route, pkg };
  },
};

const _DogwoodRouting: XdrCodec<DogwoodRouting> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.DogwoodTreeNodes, Number(0xFFFFFFFF)).encode(w, val.routes);
  },
  decode(r) {
    const routes = VarArrayCodec(proto.codec.DogwoodTreeNodes, Number(0xFFFFFFFF)).decode(r);
    return { routes };
  },
};

const _DogwoodDeliveryEnvelope: XdrCodec<DogwoodDeliveryEnvelope> = {
  encode(w, val) {
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.DogwoodDelivery.encode(w, val.delivery);
  },
  decode(r) {
    const signature = proto.codec.Signature.decode(r);
    const delivery = proto.codec.DogwoodDelivery.decode(r);
    return { signature, delivery };
  },
};

export const codec = {
  DogwoodTreeHash: _DogwoodTreeHash,
  DogwoodTreeNode: _DogwoodTreeNode,
  DogwoodTreeNodes: _DogwoodTreeNodes,
  DogwoodStreamID: _DogwoodStreamID,
  DogwoodTransmissionID: _DogwoodTransmissionID,
  DogwoodStream: _DogwoodStream,
  DogwoodRoute: _DogwoodRoute,
  DogwoodTransmissionType: _DogwoodTransmissionType,
  DogwoodTransmission: _DogwoodTransmission,
  DogwoodChunk: _DogwoodChunk,
  DogwoodPackage: _DogwoodPackage,
  DogwoodDelivery: _DogwoodDelivery,
  DogwoodRouting: _DogwoodRouting,
  DogwoodDeliveryEnvelope: _DogwoodDeliveryEnvelope,
} as const;

export const DogwoodProgram: RpcProgramMeta = {
  programId: 0x8ee82002,
  version: 1,
  methods: {
    dogwood_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    dogwood_deliver: { proc: 10, request: () => _DogwoodDeliveryEnvelope, response: () => VoidCodec },
  },
};

