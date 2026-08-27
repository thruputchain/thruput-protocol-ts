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
  return value as FixedArray<T, N>;
}
