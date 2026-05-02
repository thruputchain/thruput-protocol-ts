// Base test types — no cross-type references.
// Not part of the protocol — used only by the test suite.

namespace hogd {

// -- Constants --

const kTestMaxLen = 1024;
const kTestVersion = 42;

// -- Enums --

enum TestColor {
  Red = 0,
  Green = 1,
  Blue = 2
};

enum TestStatusCode {
  OK = 0,
  NotFound = 1,
  Internal = 2
};

// -- Branded opaques --

typedef opaque TestHash[32];
typedef opaque TestEntrypointId[8];
typedef opaque TestPayload<1024>;
typedef opaque TestBlob<>;

// -- Simple structs --

struct TestPoint {
  unsigned int x;
  unsigned int y;
};

// -- Int-discriminated unions (no cross-type refs) --

union TestMessage switch (int tag) {
  case 0:
    unsigned hyper count;
  case 1:
    void;
  default:
    opaque raw_payload<>;
};

union TestExtPoint switch (int v) {
  case 0:
    void;
};

// -- Arrays --

struct TestMatrix {
  unsigned int row[3];
};

struct TestScores {
  unsigned int values<10>;
};

// -- Option --

struct TestOptional {
  unsigned int *maybe_value;
};

} // namespace hogd
