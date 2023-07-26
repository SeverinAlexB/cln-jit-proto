This function does the magic from the LSP point of view. Re-encoding the payload is in encodePayloadForNextHop

https://github.com/breez/lspd/blob/master/cln/cln_interceptor.go#L190-L216

Here's a simplified example of the client point of view, for accepting the htlc for the lspd integration tests.
https://github.com/breez/lspd/blob/master/itest/cln_breez_client.go#L129-L203

And here's the actual client implementation in greenlight.
https://github.com/Blockstream/greenlight/blob/main/libs/gl-plugin/src/lsp.rs#L54-L123

---

Source: https://t.me/LSPstandards/2517