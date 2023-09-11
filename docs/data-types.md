## Introduction

To allow efficient use of blockchain resources, AtomicAssets gives publishers the ability to pick precisely the data types they need for whatever metadata attributes need to be stored. Storage space requirements are generally measured and priced in terms of _bytes_.

Especially for launching large collections, it becomes important to be aware of how you are storing data to ensure it's not wasteful. The main principle to remember is to pick the smallest data types that work for your needs.

## Numerical Types

### Integer Types (whole numbers, including negatives)

_Integers_ are whole numbers and can include negative values. Also referred to as _Signed Integers_, meaning they can include numbers with a "negative sign".

- `int8` (1 byte): whole numbers `-128` to `127`
- `int16` (2 bytes): whole numbers `-32,768` to `32,767`
- `int32` (4 bytes): whole numbers `-2,147,483,648` to `2,147,483,647`
- `int64` (8 bytes): whole numbers `-9,223,372,036,854,775,808` to `9,223,372,036,854,775,807`

_Technical note: Integers are stored as [zig-zag encoded](https://gist.github.com/mfuerstenau/ba870a29e16536fdbaba#file-zigzag-encoding-readme) varints._

### Unsigned Integer Types (whole numbers, no negative values)

_Unsigned Integers_ are whole numbers greater or equal to zero (no negative numbers).

- `uint8` (1 byte): whole numbers `0` to `255`
- `uint16` (2 bytes): whole numbers `0` to `65,535`
- `uint32` (4 bytes): whole numbers `0` to `4,294,967,295`
- `uint64` (8 bytes): whole numbers `0` to `18,446,744,073,709,551,615`

_Technical note: Unsigned Integers are stored as varints._

### Fixed Types

For advanced users only. The `fixed` type is an alias for `uint`, but not stored as `varints` and instead as a _fixed size in little endian order_ ([source](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization)).

- `fixed8` (1 byte): `0` to `255`
- `fixed16` (2 bytes): `0` to `65,535`
- `fixed32` (4 bytes): `0` to `4,294,967,295`
- `fixed64` (8 bytes): `0` to `18,446,744,073,709,551,615`
- `byte` (1 byte): an alias for `fixed8`: `0` to `255`

### Float/Double

_Floats_ and _Doubles_ are generally used whenever you need numbers with a decimal component or in cases where the values are very large. While they are imprecise (for instance, setting a float value of `0.3` might internally be represented as `0.299999999`), they allow you to store very large numbers such as `1e28` or very small numbers such as `1e-30`.

- `float` (4 bytes): numbers as high as `3.4e38` or as small as `1.7e-38`, with about 7 digits of precision
- `double` (8 bytes): numbers as high as `1.7e308` or as small as `1.7e-308`, with about 15 digits of precision

## Other Data Types

- `string` (~1 byte per character): Stores any length of text.
- `ipfs` (~32 bytes): stores a Base58 IPFS address.
- `bool` (1 byte): _boolean_ has two possible values: `1` (`true`) and `0` (`false`). (e.g. `is_burnable`)

## Vectors

While the `collection-manager` app does not currently allow it, the AtomicAssets contract allows any type to be turned into a _vector_ by appending `[]` to the type name (e.g. `int32[]`). Nested vectors (e.g. `int32[][]`) are not allowed.

For example, a user-defined schema field like `tags` can contain multiple values if the data type is `string[]`.

## Common Uses and Examples

1. To store any legth of text, use the `string` type.
2. To store a number that can range from `0..100`, use a `uint8` or `int8`. If you might ever need a negative number for this field, use `int8`.
3. To store a number that can range from `0..50000`, use a `uint16`.
4. To store an IPFS hash, use `ipfs` type.
5. To store a number which is very large, very small, or has many decimal points, use a `float` or `double`. `float` provides about 7 digits of precision, while `double` about 15.
6. To store a number with many decimal places _precisely_, use one of the `uint` or `int` types and multiply/divide by some factor of 10 when writing or reading the value. The only way to get precise decimal places is to use an _Integer_ type (which only allows whole numbers) and shift the decimal place as needed.

## References

For more information, visit the AtomicAssets [Serialization Documentation](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) and related wiki pages.
