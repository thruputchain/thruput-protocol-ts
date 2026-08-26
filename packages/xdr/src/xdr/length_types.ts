// Type-level length annotations for XDR arrays, opaques, and strings.
//
// Fixed-size shapes narrow the real `length` property to a numeric literal, so
// the required element/byte count is visible in the type and enforced by the
// compiler. Variable-size shapes carry their bound as an optional phantom
// `max_length` property: it never exists at runtime (reading it yields
// `undefined`, which its optional type admits) and plain arrays remain
// assignable without a cast — it is documentation surfaced in hover and docs,
// while the actual bound check happens in the codecs.

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
 * type; the codec throws on any other length.
 */
export type FixedArray<T, N extends number> = T[] & { readonly length: N };

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
