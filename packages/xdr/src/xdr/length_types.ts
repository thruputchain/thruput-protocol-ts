// Type-level length annotations for XDR arrays, opaques, and strings.
//
// Fixed-size shapes narrow the real `length` property to a numeric literal, so
// the required element/byte count is visible in the type and enforced by the
// compiler; fixed arrays are readonly so that mutation cannot silently break
// the length the type promises. Variable-size shapes carry their bound as an
// optional phantom `max_length` property: it never exists at runtime (reading
// it yields `undefined`, which its optional type admits) and plain arrays,
// bytes, and strings remain assignable without a cast — it is documentation
// surfaced in hover and docs, while the actual bound check happens in the
// codecs. One consequence of the phantom: two different bounds are mutually
// unassignable (a `VarArray<T, 5>` is not a `VarArray<T, 10>`), since their
// `max_length` types conflict. That is a side effect of annotating the bound,
// not a designed subtyping relationship; the plain unbranded value is the
// interop path between them.

/**
 * A `Uint8Array` that must contain exactly `N` bytes.
 *
 * The wire format reads and writes exactly `N` bytes for values of this type;
 * the codec throws on any other length.
 *
 * `N` is a literal type, so a plain `Uint8Array` — whose `length` is `number`
 * — is *not* assignable here. Use {@link fixedBytes} to build one, or the
 * generated factory for a fixed opaque typedef (`sha256Hash(data)` and
 * friends), both of which check the length at runtime so no cast is needed.
 */
export type FixedBytes<N extends number> = Uint8Array & { readonly length: N };

/**
 * An array that must contain exactly `N` elements.
 *
 * The wire format reads and writes exactly `N` elements for values of this
 * type; the codec throws on any other length. The array is readonly because
 * the exact length is part of the type: `push`, `pop`, and `splice` would
 * leave the runtime length disagreeing with it.
 *
 * `N` is a literal type, so a dynamically built array is inferred as `T[]`
 * (length `number`) and is *not* assignable here. Use {@link fixedArray} to
 * build one — it checks the length at runtime, so no cast is needed. An
 * `as const` tuple of the right length is also assignable.
 */
export type FixedArray<T, N extends number> = ReadonlyArray<T> & {
  readonly length: N;
};

/**
 * A `Uint8Array` of at most `N` bytes.
 *
 * `max_length` is a phantom type-level annotation: it does not exist at
 * runtime, and any `Uint8Array` is assignable. The codec enforces the bound
 * when encoding and decoding.
 */
export type VarBytes<N extends number> = Uint8Array & {
  readonly max_length?: N;
};

/**
 * An array of at most `N` elements.
 *
 * `max_length` is a phantom type-level annotation: it does not exist at
 * runtime, and any `T[]` is assignable. The codec enforces the bound when
 * encoding and decoding.
 */
export type VarArray<T, N extends number> = T[] & { readonly max_length?: N };

/**
 * A string of at most `N` UTF-8 encoded bytes.
 *
 * `max_length` is a phantom type-level annotation: it does not exist at
 * runtime, and any `string` is assignable. Note the bound counts encoded
 * bytes, not code points. The codec enforces the bound when encoding and
 * decoding.
 */
export type VarString<N extends number> = string & { readonly max_length?: N };

/**
 * Check that `value` has exactly `length` elements and return it as a
 * {@link FixedArray}.
 *
 * A fixed length is a literal type, so an array built at runtime — `Array.from`,
 * `map`, an array literal — is inferred as `T[]` with length `number` and
 * cannot be assigned to `FixedArray<T, N>` directly. This is the checked
 * construction path: it validates the length and returns the narrowed type, so
 * callers get a compile-time guarantee without writing a cast.
 *
 * ```ts
 * const keys = fixedArray(
 *   Array.from({ length: 21 }, () => publicKeyConfigOpt(null)),
 *   21,
 * );
 * ```
 *
 * Returns a frozen copy rather than `value` itself. Returning the argument
 * would leave the caller's reference aliasing the result, so a later
 * `source.push(...)` would change the length of a value whose type promises
 * `N` — the readonly type only stops mutation through the `FixedArray`
 * reference, not through a retained alias. Freezing also holds the invariant
 * for callers who reach the value through a cast or from plain JavaScript,
 * where the type is not enforced at all. The copy is O(N), which is
 * immaterial for the small fixed arrays XDR declares.
 *
 * @throws if `value.length !== length`.
 */
export function fixedArray<T, N extends number>(
  value: readonly T[],
  length: N,
): FixedArray<T, N> {
  if (value.length !== length) {
    throw new Error(
      `FixedArray expected ${length} elements, got ${value.length}`,
    );
  }
  return Object.freeze(value.slice()) as FixedArray<T, N>;
}

/**
 * Check that `data` is exactly `length` bytes and return it as a
 * {@link FixedBytes}.
 *
 * The byte counterpart to {@link fixedArray}: a fixed length is a literal
 * type, so a plain `Uint8Array` (length `number`) cannot be assigned to
 * `FixedBytes<N>` directly. This is the checked construction path.
 *
 * ```ts
 * const salt = fixedBytes(crypto.getRandomValues(new Uint8Array(32)), 32);
 * ```
 *
 * Returns a copy, so later writes through the caller's reference cannot
 * change the bytes behind the result — the same caller-owned convention the
 * readers use for `readFixedOpaque`. Copying a view copies only that view's
 * range. Unlike `fixedArray` the result is not frozen: `Object.freeze` throws
 * on a non-empty typed array. Nothing is lost by that, since a `Uint8Array`'s
 * length cannot change through an alias at all — only its contents, which the
 * copy already isolates.
 *
 * @throws if `data.length !== length`.
 */
export function fixedBytes<N extends number>(
  data: Uint8Array,
  length: N,
): FixedBytes<N> {
  if (data.length !== length) {
    throw new Error(`FixedBytes expected ${length} bytes, got ${data.length}`);
  }
  // new Uint8Array(...) rather than .slice(): Buffer.prototype.slice
  // returns an aliasing view, and data may be a Buffer.
  return new Uint8Array(data) as FixedBytes<N>;
}
