// Test-only RPC definition for round-trip testing.
// Not part of the protocol — used only by the test suite.

namespace hogd {

struct EchoRequest {
  unsigned int value;
  string message<256>;
};

struct EchoResponse {
  unsigned int value;
  string message<256>;
};

struct AddRequest {
  unsigned int a;
  unsigned int b;
};

struct AddResponse {
  unsigned int result;
};

program EchoService
{
  version EchoService1
  {
    void echo_null(void) = 0;
    EchoResponse echo_echo(EchoRequest) = 1;
    AddResponse echo_add(AddRequest) = 2;
  }
  = 1;
}
= 0xECEC0001;

} // namespace hogd
