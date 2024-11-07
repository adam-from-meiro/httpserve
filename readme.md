You need Deno, Node and Rust.

Node: 
```node server.js
deno run --allow-net test.ts
```

Deno:
```deno run -A server.ts
deno run --allow-net test.ts
```

Rust 
```cd rustsrv
cargo run
cd ..
deno run --allow-net test.ts
```
