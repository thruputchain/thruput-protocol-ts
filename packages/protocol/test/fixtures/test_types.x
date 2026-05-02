// Kitchen-sink XDR fixture for codegen testing.
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

// -- Structs --

struct TestPoint {
  unsigned int x;
  unsigned int y;
};

struct TestPerson {
  string name<256>;
  TestHash id;
  TestPoint location;
};

// -- Union pattern 1: no default arm (enum-discriminated, data + void) --

union TestShape switch (TestColor color) {
  case Red:
    unsigned int radius;
  case Green:
    struct {
      unsigned int width;
      unsigned int height;
    } rectangle;
  case Blue:
    void;
};

// -- Union pattern 2: default void arm --

union TestResult switch (TestStatusCode status) {
  case OK:
    unsigned int value;
  default:
    void;
};

// -- Union pattern 3: default data arm --

union TestMessage switch (int tag) {
  case 0:
    unsigned hyper count;
  case 1:
    void;
  default:
    opaque raw_payload<>;
};

// -- Union: int-discriminated, void-only (like ExtensionPoint) --

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
