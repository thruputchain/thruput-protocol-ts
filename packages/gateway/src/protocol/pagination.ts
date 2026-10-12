// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 4eba524354bda9d7db1efa2845da43ce40dd1ab9

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@thruputchain/xdr";
import * as proto from "./index.js";



export enum IterationOrder {
  IterationOrderAscending = 0,
  IterationOrderDescending = 1,
}

export enum BlockAnchorKind {
  AnchorAtBeginning = 0,
  AnchorAtEnd = 1,
  AnchorAtHeight = 2,
}

export type BlockAnchor =
  | { kind: proto.BlockAnchorKind.AnchorAtBeginning }
  | { kind: proto.BlockAnchorKind.AnchorAtEnd }
  | { kind: proto.BlockAnchorKind.AnchorAtHeight; height: proto.BlockHeight }
;

/** XDR: `typedef opaque PaginationCursor<>`. */
export type PaginationCursor = Uint8Array & { readonly __brand: { readonly PaginationCursor: true } };
export function paginationCursor(data: Uint8Array): PaginationCursor {
  return data as PaginationCursor;
}


//
// XDR Codecs below this point
//

const _IterationOrder: XdrCodec<IterationOrder> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as IterationOrder; },
};

const _BlockAnchorKind: XdrCodec<BlockAnchorKind> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as BlockAnchorKind; },
};

const _BlockAnchor: XdrCodec<BlockAnchor> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.kind));
    switch (val.kind) {
      case proto.BlockAnchorKind.AnchorAtBeginning:
      case proto.BlockAnchorKind.AnchorAtEnd:
        break;
      case proto.BlockAnchorKind.AnchorAtHeight:
        proto.codec.BlockHeight.encode(w, val.height);
        break;
    }
  },
  decode(r) {
    const kind = Number(r.readInt32());
    switch (kind) {
      case proto.BlockAnchorKind.AnchorAtBeginning:
      case proto.BlockAnchorKind.AnchorAtEnd:
        return { kind } as BlockAnchor;
      case proto.BlockAnchorKind.AnchorAtHeight:
        const height = proto.codec.BlockHeight.decode(r);
        return { kind, height };
      default:
        throw new Error(`Unknown BlockAnchor discriminant: ${kind}`);
    }
  },
};

const _PaginationCursor: XdrCodec<PaginationCursor> = {
  encode(w, val) { w.writeVarOpaque(val, Number(0xFFFFFFFF)); },
  decode(r) { return paginationCursor(r.readVarOpaque(Number(0xFFFFFFFF))); },
};

export const codec = {
  IterationOrder: _IterationOrder,
  BlockAnchorKind: _BlockAnchorKind,
  BlockAnchor: _BlockAnchor,
  PaginationCursor: _PaginationCursor,
} as const;

