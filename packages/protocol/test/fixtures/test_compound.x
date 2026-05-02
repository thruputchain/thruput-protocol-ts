// Compound test types — reference base types via proto barrel.
// Not part of the protocol — used only by the test suite.

namespace hogd {

// -- Struct with cross-type refs --

struct TestPerson {
  string name<256>;
  TestHash id;
  TestPoint location;
};

// -- Enum-discriminated union (refs TestColor) --

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

// -- Enum-discriminated union with default void arm (refs TestStatusCode) --

union TestResult switch (TestStatusCode status) {
  case OK:
    unsigned int value;
  default:
    void;
};

} // namespace hogd
