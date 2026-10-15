/**
 * Serialize/deserialize roundtrip tests over representative generated
 * gateway codecs: indexer records (TxInfo, IdentifiedEvent), query and
 * filter types (EventFilter, EventQuery), and pagination types.
 */
import { describe, it, expect } from "vitest";
import {
  serialize, deserialize, serializeCxs, deserializeCxs,
  codec,
  // protocol constructors
  sha256Hash, transactionHash, blockHeight, contractAddress,
  contractEntrypointID, gasAmount, calldata, ed25519Signature,
  bitMap, weight, topic, returnBuffer,
  AuthClaimType, CryptographicScheme, ExecResult, InvocationFrameStatusCode,
  // gateway constructors
  identifiedEventBatch, contractAddressList, eventFilterList,
  transactionRefBatch, txInfoBatch, paginationCursor,
  IterationOrder, BlockAnchorKind,
} from "../../src/index.js";
import type {
  IdentifiedEvent, TxInfo, EventFilter, EventQuery, EventPage,
  TransactionRefPage, BlockAnchor, TxEmittedEvent,
} from "../../src/index.js";

function makeEmittedEvent(): TxEmittedEvent {
  return {
    contract_address: contractAddress(new Uint8Array(32).fill(0x11)),
    num_topics: 2n,
    serialized_event: new Uint8Array([0xca, 0xfe, 0xba, 0xbe]),
  };
}

function makeIdentifiedEvent(): IdentifiedEvent {
  return {
    tx_hash: transactionHash(sha256Hash(new Uint8Array(32).fill(0x22))),
    block_height: blockHeight(77n),
    sequence_number: 5n,
    emitted_event: makeEmittedEvent(),
  };
}

function makeTxInfo(): TxInfo {
  return {
    height: blockHeight(42n),
    tx: {
      signed_tx: {
        tx: {
          invocation: {
            invoked_address: contractAddress(new Uint8Array(32).fill(0x01)),
            entrypoint: contractEntrypointID(new Uint8Array(8).fill(0xab)),
            gas_limit: gasAmount(1_000_000n),
            calldata: calldata(new Uint8Array([0xde, 0xad])),
          },
          uniquifier: {
            block_expiry_height: blockHeight(100n),
            nonce: 12345n,
          },
          contracts_to_deploy: [],
          auth_claim: {
            claim_type: AuthClaimType.kSourceAddressAuthData,
            source_address_claim: {
              allowed_keys: bitMap(1n),
              required_weight: weight(1n),
            },
          },
        },
        signatures: [
          {
            public_key_id: 0n,
            signature: {
              scheme: CryptographicScheme.Ed25519,
              ed25519: ed25519Signature(new Uint8Array(64).fill(0x55)),
            },
          },
        ],
        pubkey_claim_key: null,
      },
      nondeterministic_proposal_data: {
        nondeterministic_bits: new Uint8Array([0b1010]),
        nondeterministic_bit_count: 4n,
        observed_queue_entry_sequence: [],
      },
    },
    events: {
      tx_hash: transactionHash(sha256Hash(new Uint8Array(32).fill(0x33))),
      exec_result: ExecResult.ExecResultOK,
      root_output: {
        status_code: InvocationFrameStatusCode.Return,
        return_buffer: returnBuffer(new Uint8Array([1, 2, 3])),
      },
      gas_consumed: gasAmount(1234n),
      events: [makeEmittedEvent()],
    },
  };
}

function makeEventFilter(): EventFilter {
  return {
    contract_addresses: contractAddressList([
      contractAddress(new Uint8Array(32).fill(0x44)),
      contractAddress(new Uint8Array(32).fill(0x45)),
    ]),
    topics: {
      topic0: [topic(new Uint8Array(32).fill(0x66))],
      topic1: [],
      topic2: [topic(new Uint8Array(32).fill(0x67)), topic(new Uint8Array(32).fill(0x68))],
    },
  };
}

describe("gateway indexer codecs: roundtrip", () => {
  it("round-trips IdentifiedEvent", () => {
    const val = makeIdentifiedEvent();
    expect(deserialize(serialize(val, codec.IdentifiedEvent), codec.IdentifiedEvent)).toEqual(val);
  });

  it("round-trips IdentifiedEventBatch", () => {
    const val = identifiedEventBatch([makeIdentifiedEvent(), makeIdentifiedEvent()]);
    expect(
      deserialize(serialize(val, codec.IdentifiedEventBatch), codec.IdentifiedEventBatch)
    ).toEqual(val);
  });

  it("round-trips TxInfo", () => {
    const val = makeTxInfo();
    expect(deserialize(serialize(val, codec.TxInfo), codec.TxInfo)).toEqual(val);
  });

  it("round-trips TxInfo through CXS", () => {
    const val = makeTxInfo();
    expect(deserializeCxs(serializeCxs(val, codec.TxInfo), codec.TxInfo)).toEqual(val);
  });

  it("round-trips TxInfoBatch", () => {
    const val = txInfoBatch([makeTxInfo()]);
    expect(deserialize(serialize(val, codec.TxInfoBatch), codec.TxInfoBatch)).toEqual(val);
  });

  it("round-trips EventFilter", () => {
    const val = makeEventFilter();
    expect(deserialize(serialize(val, codec.EventFilter), codec.EventFilter)).toEqual(val);
  });

  it("round-trips EventQuery", () => {
    const val: EventQuery = {
      filters: eventFilterList([makeEventFilter()]),
      order: IterationOrder.IterationOrderDescending,
      anchor: { kind: BlockAnchorKind.AnchorAtHeight, height: blockHeight(9000n) },
      cursor: paginationCursor(new Uint8Array([9, 8, 7])),
      limit: 50n,
    };
    expect(deserialize(serialize(val, codec.EventQuery), codec.EventQuery)).toEqual(val);
  });

  it("round-trips EventPage", () => {
    const val: EventPage = {
      events: identifiedEventBatch([makeIdentifiedEvent()]),
      cursor: paginationCursor(new Uint8Array([1, 2])),
      latest_block: blockHeight(200n),
      oldest_block: blockHeight(1n),
    };
    expect(deserialize(serialize(val, codec.EventPage), codec.EventPage)).toEqual(val);
  });

  it("round-trips TransactionRefPage", () => {
    const val: TransactionRefPage = {
      refs: transactionRefBatch([
        {
          tx_hash: transactionHash(sha256Hash(new Uint8Array(32).fill(0x77))),
          height: blockHeight(3n),
        },
      ]),
      cursor: paginationCursor(new Uint8Array(0)),
      latest_block: blockHeight(10n),
      oldest_block: blockHeight(2n),
    };
    expect(
      deserialize(serialize(val, codec.TransactionRefPage), codec.TransactionRefPage)
    ).toEqual(val);
  });
});

describe("gateway pagination codecs: roundtrip", () => {
  it("round-trips every BlockAnchor variant", () => {
    const variants: BlockAnchor[] = [
      { kind: BlockAnchorKind.AnchorAtBeginning },
      { kind: BlockAnchorKind.AnchorAtEnd },
      { kind: BlockAnchorKind.AnchorAtHeight, height: blockHeight(123456789n) },
    ];
    for (const val of variants) {
      expect(deserialize(serialize(val, codec.BlockAnchor), codec.BlockAnchor)).toEqual(val);
    }
  });

  it("round-trips PaginationCursor, including empty", () => {
    for (const bytes of [new Uint8Array(0), new Uint8Array([0xaa, 0xbb, 0xcc])]) {
      const val = paginationCursor(bytes);
      expect(
        deserialize(serialize(val, codec.PaginationCursor), codec.PaginationCursor)
      ).toEqual(val);
    }
  });

  it("round-trips IterationOrder values", () => {
    for (const val of [IterationOrder.IterationOrderAscending, IterationOrder.IterationOrderDescending]) {
      expect(
        deserialize(serialize(val, codec.IterationOrder), codec.IterationOrder)
      ).toBe(val);
    }
  });
});
