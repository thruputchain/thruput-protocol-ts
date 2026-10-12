/**
 * ONC-RPC message encoding/decoding per RFC 5531.
 *
 * Builds call messages and parses reply messages using standard XDR encoding.
 */

import { XdrWriter, XdrReader } from "@thruputchain/xdr";

// ONC-RPC constants (RFC 5531)
const RPC_VERSION = 2;
const MSG_CALL = 0;
const MSG_REPLY = 1;
const MSG_ACCEPTED = 0;
const ACCEPT_SUCCESS = 0;
const AUTH_NONE = 0;

let nextXid = 1;

/**
 * Build an ONC-RPC call message.
 *
 * Layout (all XDR-encoded):
 *   xid: uint32
 *   msg_type: CALL (0)
 *   rpc_version: 2
 *   program: uint32
 *   version: uint32
 *   procedure: uint32
 *   auth_cred: AUTH_NONE (flavor=0, length=0)
 *   auth_verf: AUTH_NONE (flavor=0, length=0)
 *   body: opaque bytes (the serialized request)
 *
 * @param programId ONC-RPC program identifier.
 * @param version ONC-RPC program version.
 * @param procedure Procedure number within the program.
 * @param body Serialized request body.
 */
export function buildCallMessage(
  programId: number,
  version: number,
  procedure: number,
  body: Uint8Array,
): Uint8Array {
  const w = new XdrWriter();
  const xid = nextXid++;
  w.writeUint32(BigInt(xid));         // xid
  w.writeInt32(BigInt(MSG_CALL));      // msg_type = CALL
  w.writeUint32(BigInt(RPC_VERSION));  // rpc_version = 2
  w.writeUint32(BigInt(programId));    // program
  w.writeUint32(BigInt(version));      // version
  w.writeUint32(BigInt(procedure));    // procedure
  // auth_cred: AUTH_NONE
  w.writeInt32(BigInt(AUTH_NONE));     // flavor
  w.writeUint32(0n);                   // body length = 0
  // auth_verf: AUTH_NONE
  w.writeInt32(BigInt(AUTH_NONE));     // flavor
  w.writeUint32(0n);                   // body length = 0
  // Request body (raw, not length-prefixed — it's the rest of the message)
  w.writeFixedOpaque(body, body.length);
  return w.finish();
}

/**
 * Parse an ONC-RPC reply message, returning the body bytes.
 *
 * Throws on RPC-level errors (rejected, program mismatch, etc.)
 *
 * @param data Encoded ONC-RPC reply message.
 */
export function parseReplyMessage(data: Uint8Array): { xid: number; body: Uint8Array } {
  const r = new XdrReader(data);
  const xid = Number(r.readUint32());
  const msgType = Number(r.readInt32());

  if (msgType !== MSG_REPLY) {
    throw new Error(`Expected ONC-RPC reply (1), got msg_type=${msgType}`);
  }

  const replyStatus = Number(r.readInt32());
  if (replyStatus !== MSG_ACCEPTED) {
    throw new Error(`ONC-RPC call rejected: reply_stat=${replyStatus}`);
  }

  // Skip auth_verf
  r.readInt32();  // flavor
  const verfLen = Number(r.readUint32());
  if (verfLen > 0) r.readFixedOpaque(verfLen);

  const acceptStatus = Number(r.readInt32());
  if (acceptStatus !== ACCEPT_SUCCESS) {
    const statusNames: Record<number, string> = {
      1: "PROG_UNAVAIL",
      2: "PROG_MISMATCH",
      3: "PROC_UNAVAIL",
      4: "GARBAGE_ARGS",
      5: "SYSTEM_ERR",
    };
    throw new Error(`ONC-RPC error: ${statusNames[acceptStatus] ?? `accept_stat=${acceptStatus}`}`);
  }

  // Remaining bytes are the reply body
  const body = data.subarray(r.position);
  return { xid, body };
}
