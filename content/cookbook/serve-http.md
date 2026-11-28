---
title = "Serve HTTP with Whiplash"
shelf = "web"
level = "Intermediate"
order = 1
uses = ["whiplash", "pooka/http", "pooka/otp"]
card = "Route a request, return a response, and test the server over a real socket."
summary = "Start a local HTTP server, greet a visitor by name, and check what happens when a route is missing."
ingredients = ["`whiplash` to start the listener", "`pooka/http` for request and response types", "`pooka/otp` to keep the entry point alive", "`pooka/httpc` to send real requests from a test"]
sample_name = "serve-http"
files = ["src/main.pooka", "test/server.spec.pooka"]
layout = "recipe"
permalink = "/cookbook/serve-http/"
---

## Set up the project

```sh
pooka new hello_server
cd hello_server
pooka add whiplash
pooka add pooka_http
pooka add pooka_otp
pooka add pooka_httpc --dev
```

Replace `src/main.pooka` with the program above and add the test as
`test/server.spec.pooka`.

## Run it

Start the server with `pooka run`. In another terminal, send two requests:

```text
$ curl -w '\n%{http_code}\n' http://127.0.0.1:8080/hello/Ada
Hello, Ada!
200
$ curl -w '\n%{http_code}\n' http://127.0.0.1:8080/missing
Not found
404
```

Whiplash binds to the loopback address by default. Press Ctrl-C in the server
terminal when you're done.

## Test the listener

Run `pooka test`. The test asks the OS for a free port by passing `0` to
`whiplash.options`, reads the assigned port from `server.port`, and sends two
requests through the HTTP client. It stops the listener before checking the
results.

The handler matches the method and path segments together. Only a GET with
exactly two segments, starting with `hello`, takes the greeting branch. The
fallback covers the other paths and methods.

See the [Whiplash guides](https://whiplash.hexdocs.pm/) for TLS, streaming,
and WebSockets.
