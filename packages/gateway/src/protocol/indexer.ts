// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5351fdbd5f24dc09297b1857e6e8605cbf0ee655

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface TxInfo {
  height: proto.BlockHeight;
  events: proto.TxEventLog;
}

export enum TxInfoOutcome {
  TxInfoFound = 0,
  TxInfoNotFound = 1,
}

export type TxInfoResult =
  | { outcome: proto.TxInfoOutcome.TxInfoFound; info: proto.TxInfo }
  | { outcome: number }
;

export type IdentifiedEventBatch = proto.IdentifiedEvent[] & { readonly __brand: "IdentifiedEventBatch" };
export function identifiedEventBatch(val: proto.IdentifiedEvent[]): IdentifiedEventBatch {
  return val as IdentifiedEventBatch;
}

export const kMaxContractAddressesPerEventFilter = 5n;

export const kMaxEventFiltersPerQuery = 5n;

export type ContractAddressList = proto.ContractAddress[] & { readonly __brand: "ContractAddressList" };
export function contractAddressList(val: proto.ContractAddress[]): ContractAddressList {
  return val as ContractAddressList;
}

export interface EventTopicFilter {
  topic0: proto.Topic[];
  topic1: proto.Topic[];
  topic2: proto.Topic[];
}

export interface EventFilter {
  contract_addresses: proto.ContractAddressList;
  topics: proto.EventTopicFilter;
}

export type EventFilterList = proto.EventFilter[] & { readonly __brand: "EventFilterList" };
export function eventFilterList(val: proto.EventFilter[]): EventFilterList {
  return val as EventFilterList;
}

export interface EventQuery {
  filters: proto.EventFilterList;
  order: proto.IterationOrder;
  anchor: proto.BlockAnchor;
  cursor: proto.PaginationCursor;
  limit: bigint;
}

export interface EventPage {
  events: proto.IdentifiedEventBatch;
  cursor: proto.PaginationCursor;
  latest_block: proto.BlockHeight;
  oldest_block: proto.BlockHeight;
}

export enum IndexerBlockExplorerIntroOutcome {
  IntroSuccess = 0,
  IntroMismatchedProtocol = 1,
}


export type TxEventLogBatch = proto.TxEventLog[] & { readonly __brand: "TxEventLogBatch" };
export function txEventLogBatch(val: proto.TxEventLog[]): TxEventLogBatch {
  return val as TxEventLogBatch;
}


export interface indexer_event_process_events_args {
  arg0: proto.BlockHeight;
  arg1: proto.TxEventLogBatch;
}

export interface IndexerCard {
  protocol: proto.Protocol;
  address_for_event: proto.ServerAddress;
}



//
// XDR Codecs below this point
//

const _TxInfo: XdrCodec<TxInfo> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.height);
    proto.codec.TxEventLog.encode(w, val.events);
  },
  decode(r) {
    const height = proto.codec.BlockHeight.decode(r);
    const events = proto.codec.TxEventLog.decode(r);
    return { height, events };
  },
};

const _TxInfoOutcome: XdrCodec<TxInfoOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as TxInfoOutcome; },
};

const _TxInfoResult: XdrCodec<TxInfoResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.TxInfoOutcome.TxInfoFound:
      {
        const v = val as { outcome: number; info: proto.TxInfo };
        if (v.info === undefined) {
          throw new Error("TxInfoResult encode: info is undefined");
        }
        proto.codec.TxInfo.encode(w, v.info);
        break;
      }
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.TxInfoOutcome.TxInfoFound:
        const info = proto.codec.TxInfo.decode(r);
        return { outcome, info };
      default:
        return { outcome };
    }
  },
};

const _IdentifiedEventBatch = VarArrayCodec(() => proto.codec.IdentifiedEvent, Number(0xFFFFFFFF)) as XdrCodec<IdentifiedEventBatch>;

const _ContractAddressList = VarArrayCodec(() => proto.codec.ContractAddress, Number(proto.kMaxContractAddressesPerEventFilter)) as XdrCodec<ContractAddressList>;

const _EventTopicFilter: XdrCodec<EventTopicFilter> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.Topic, Number(0xFFFFFFFF)).encode(w, val.topic0);
    VarArrayCodec(proto.codec.Topic, Number(0xFFFFFFFF)).encode(w, val.topic1);
    VarArrayCodec(proto.codec.Topic, Number(0xFFFFFFFF)).encode(w, val.topic2);
  },
  decode(r) {
    const topic0 = VarArrayCodec(proto.codec.Topic, Number(0xFFFFFFFF)).decode(r);
    const topic1 = VarArrayCodec(proto.codec.Topic, Number(0xFFFFFFFF)).decode(r);
    const topic2 = VarArrayCodec(proto.codec.Topic, Number(0xFFFFFFFF)).decode(r);
    return { topic0, topic1, topic2 };
  },
};

const _EventFilter: XdrCodec<EventFilter> = {
  encode(w, val) {
    proto.codec.ContractAddressList.encode(w, val.contract_addresses);
    proto.codec.EventTopicFilter.encode(w, val.topics);
  },
  decode(r) {
    const contract_addresses = proto.codec.ContractAddressList.decode(r);
    const topics = proto.codec.EventTopicFilter.decode(r);
    return { contract_addresses, topics };
  },
};

const _EventFilterList = VarArrayCodec(() => proto.codec.EventFilter, Number(proto.kMaxEventFiltersPerQuery)) as XdrCodec<EventFilterList>;

const _EventQuery: XdrCodec<EventQuery> = {
  encode(w, val) {
    proto.codec.EventFilterList.encode(w, val.filters);
    proto.codec.IterationOrder.encode(w, val.order);
    proto.codec.BlockAnchor.encode(w, val.anchor);
    proto.codec.PaginationCursor.encode(w, val.cursor);
    w.writeUint32(val.limit);
  },
  decode(r) {
    const filters = proto.codec.EventFilterList.decode(r);
    const order = proto.codec.IterationOrder.decode(r);
    const anchor = proto.codec.BlockAnchor.decode(r);
    const cursor = proto.codec.PaginationCursor.decode(r);
    const limit = r.readUint32();
    return { filters, order, anchor, cursor, limit };
  },
};

const _EventPage: XdrCodec<EventPage> = {
  encode(w, val) {
    proto.codec.IdentifiedEventBatch.encode(w, val.events);
    proto.codec.PaginationCursor.encode(w, val.cursor);
    proto.codec.BlockHeight.encode(w, val.latest_block);
    proto.codec.BlockHeight.encode(w, val.oldest_block);
  },
  decode(r) {
    const events = proto.codec.IdentifiedEventBatch.decode(r);
    const cursor = proto.codec.PaginationCursor.decode(r);
    const latest_block = proto.codec.BlockHeight.decode(r);
    const oldest_block = proto.codec.BlockHeight.decode(r);
    return { events, cursor, latest_block, oldest_block };
  },
};

const _IndexerBlockExplorerIntroOutcome: XdrCodec<IndexerBlockExplorerIntroOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as IndexerBlockExplorerIntroOutcome; },
};

const _TxEventLogBatch = VarArrayCodec(() => proto.codec.TxEventLog, Number(0xFFFFFFFF)) as XdrCodec<TxEventLogBatch>;

const _indexer_event_process_events_args: XdrCodec<indexer_event_process_events_args> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.arg0);
    proto.codec.TxEventLogBatch.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockHeight.decode(r);
    const arg1 = proto.codec.TxEventLogBatch.decode(r);
    return { arg0, arg1 };
  },
};

const _IndexerCard: XdrCodec<IndexerCard> = {
  encode(w, val) {
    proto.codec.Protocol.encode(w, val.protocol);
    proto.codec.ServerAddress.encode(w, val.address_for_event);
  },
  decode(r) {
    const protocol = proto.codec.Protocol.decode(r);
    const address_for_event = proto.codec.ServerAddress.decode(r);
    return { protocol, address_for_event };
  },
};

export const codec = {
  TxInfo: _TxInfo,
  TxInfoOutcome: _TxInfoOutcome,
  TxInfoResult: _TxInfoResult,
  IdentifiedEventBatch: _IdentifiedEventBatch,
  ContractAddressList: _ContractAddressList,
  EventTopicFilter: _EventTopicFilter,
  EventFilter: _EventFilter,
  EventFilterList: _EventFilterList,
  EventQuery: _EventQuery,
  EventPage: _EventPage,
  IndexerBlockExplorerIntroOutcome: _IndexerBlockExplorerIntroOutcome,
  TxEventLogBatch: _TxEventLogBatch,
  IndexerCard: _IndexerCard,
} as const;

export const IndexerBlockExplorerProgram: RpcProgramMeta = {
  programId: 0x4321aaaa,
  version: 1,
  methods: {
    indexer_block_explorer_intro: { proc: 0, request: () => proto.codec.Protocol as XdrCodec<proto.Protocol>, response: () => _IndexerBlockExplorerIntroOutcome },
    get_transaction_info: { proc: 1, request: () => proto.codec.SignedTransactionHash as XdrCodec<proto.SignedTransactionHash>, response: () => _TxInfoResult },
    get_events: { proc: 3, request: () => _EventQuery, response: () => _EventPage },
  },
};

export const IndexerEventProgram: RpcProgramMeta = {
  programId: 0x4321aaab,
  version: 1,
  methods: {
    indexer_event_process_events: { proc: 0, request: () => _indexer_event_process_events_args, response: () => VoidCodec },
  },
};

export const EventIndexerProgram: RpcProgramMeta = {
  programId: 0x4321aaac,
  version: 1,
  methods: {
    event_indexer_intro: { proc: 0, request: () => _IndexerCard, response: () => VoidCodec },
  },
};

