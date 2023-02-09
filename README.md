# Cross-Origin Resource Sharing (CORS)

Provides an easier way to handle [CORS][cors].

#### This library allows you to:

- Set the [CORS][cors] headers of an HTTP response.
- Use the `cors` middleware in [ExpressJS][expressjs].

> **Note**
> This is a lightweight alternative library to [cors][expressjs-cors] with no dependencies.

---

#### Brief introduction to CORS:

The [Same-Origin Policy][sop] (SOP) is a browser security mechanism that restricts some HTTP requests made between different origins.
It helps isolate potentially malicious documents and reducing possible attack vectors.
Two URLs are part of the same origin if they have the same scheme, host, and port.

The following interactions are not affected by [SOP][sop]: links, redirects, form submissions and HTML embedding.

The [Cross-Origin Resource Sharing][cors] (CORS) consists of a set of HTTP headers that indicates whether a request can be shared **cross-origin**.

- A [CORS][cors] request includes the [`Origin`][origin-header] header, which indicates the [URI][uri] that caused the request.
- The [Origin][origin-header] header is also included for all requests whose method is neither [`GET`][get] nor [`HEAD`][head].
- The server must properly set the [`Access-Control-Allow-Origin`][acc-ctrl-a-origin] header.
- A response to a [CORS][cors] request can use any [status][status] code.

A [preflight request][prefreq] is a "light" HTTP request using the [`OPTIONS`][options] method that checks to see if the [CORS protocol][cors-protocol] is understood in order to determine if the actual request is safe to send, this also helps to prevent the server from unnecessarily performing actions from untrusted origins.

- A [preflight request][prefreq] also includes the [`Access-Control-Request-Method`][acc-ctrl-r-method] header, which indicates the HTTP method that will be used when the actual request is made.
- The server must properly set the [`Access-Control-Allow-Methods`][acc-ctrl-a-methods] and [`Access-Control-Allow-Headers`][acc-ctrl-a-headers] headers, and optionally the [`Access-Control-Max-Age`][acc-ctrl-max-age] header.
- A response to a [preflight request][prefreq] request is restricted to an [ok status][ok-status] (typically 200).
- For a [preflight request][prefreq], [credentials mode][fetch-params] is always **same-origin** (it excludes credentials), but for any subsequent [CORS][cors] requests it might not be. Support therefore needs to be indicated as part of the HTTP response to the [preflight request][prefreq] as well.

Requests that meet all of the following conditions do not trigger a [preflight request][prefreq]:

- One of the allowed methods: [`GET`][get], [`HEAD`][head] or [`POST`][post].
- The request contains headers automatically set by the [user agent][user-agent], [forbidden headers][forbidden-headers] and [CORS-safelisted headers][safe-headers].
- The [Content-Type][content-type] header can contain one of the following values: `text/plain`, `application/x-www-form-urlencoded` or `multipart/form-data`.
- No event listeners are registered on any [`XMLHttpRequestUpload`][xmlhttpreq] object.
- No [ReadableStream][r-stream] object is used in the request.

> **Note**
> If the [user agent][user-agent] does not trigger a [preflight request][prefreq] (i.e. the request meets the criteria for a simple request), the server will not have the possibility to block the actual request beforehand, which will cause the request to be processed normally, although the response will be blocked by the browser if it does not satisfy the [CORS][cors].

The [`Access-Control-Expose-Headers`][acc-ctrl-e-headers] and [`Access-Control-Allow-Credentials`][acc-ctrl-a-credentials] headers can also be included in both types of requests.

The [`Access-Control-Allow-Credentials`][acc-ctrl-a-credentials] header works in conjunction with the [credentials mode][fetch-params] of the [Fetch API][fetch-api].

```js
// Using Fetch with credentials.
await fetch('http://example.com/', {
    credentials: 'include'
});
```

> **Warning**
> Sharing responses and allowing requests with credentials is rather unsafe, and extreme care has to be taken to avoid the [confused deputy problem][confused-deputy]. See [CORS protocol and credentials][cors-prot-cred].

## Installation

```
npm install https://github.com/flipeador/node-http-cors
```

## Examples

<details>
<summary><h4>ExpressJS</h4></summary>

```js
import express from 'express';
import cors from '@flipeador/node-http-cors';

const server = express();

server.use(cors({
    // Indicates the allowed website origins.
    // The wildcard (*) cannot be used with credentials.
    origin: [
        /^https?:\/\/localhost:\d+/u,
        /^https?:\/\/192.168.\d+.\d+:\d+/u,
        'https://www.example.com'
    ],
    // Allows all cookies to be attached to the outgoing website request.
    // await fetch(..., { credentials: 'include' })
    credentials: true
}));
server.use(express.json());

server.listen(8080, () => {
    console.log('Server is running!');
});
```

</details>

## License

This project is licensed under the **GNU General Public License v3.0**. See the [license file](LICENSE) for details.

<!-- REFERENCE LINKS -->
[expressjs]: https://github.com/expressjs/express "@expressjs/express"
[expressjs-cors]: https://github.com/expressjs/cors "@expressjs/cors"

[sop]: https://developer.mozilla.org/docs/Web/Security/Same-origin_policy "Same-Origin Policy"
[cors]: https://developer.mozilla.org/docs/Web/HTTP/CORS "Cross-Origin Resource Sharing"

[cors-prot-cred]: https://fetch.spec.whatwg.org/#cors-protocol-and-credentials "Fetch spec CORS protocol and credentials"
[cors-protocol]: https://fetch.spec.whatwg.org/#cors-protocol "CORS Protocol"
[forbidden-headers]: https://fetch.spec.whatwg.org/#forbidden-header-name "Fetch spec Forbidden header name"
[safe-headers]: https://fetch.spec.whatwg.org/#cors-safelisted-request-header "Fetch spec CORS-safelisted request-header"
[prefreq]: https://developer.mozilla.org/docs/Glossary/Preflight_request "Preflight Request"
[origin-header]: https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin "HTTP Origin Header"

[acc-ctrl-a-origin]: https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
[acc-ctrl-e-headers]: https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
[acc-ctrl-a-credentials]: https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
[acc-ctrl-a-methods]: https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Methods
[acc-ctrl-a-headers]: https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
[acc-ctrl-r-method]: https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Request-Method
[acc-ctrl-max-age]: https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Max-Age
[status]: https://developer.mozilla.org/docs/Web/HTTP/Status "HTTP Status Codes"
[ok-status]: https://developer.mozilla.org/docs/Web/HTTP/Status#successful_responses "HTTP Status Codes (successful responses)"
[fetch-api]: https://developer.mozilla.org/es/docs/Web/API/Fetch_API "Fetch Api"
[fetch-params]: https://developer.mozilla.org/docs/Web/API/fetch#parameters "fetch() parameters"
[uri]: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier "Uniform Resource Identifier"
[options]: https://developer.mozilla.org/docs/Web/HTTP/Methods/OPTIONS "HTTP OPTIONS Method"
[head]: https://developer.mozilla.org/docs/Web/HTTP/Methods/HEAD "HTTP HEAD Method"
[get]: https://developer.mozilla.org/docs/Web/HTTP/Methods/GET "HTTP GET Method"
[post]: https://developer.mozilla.org/docs/Web/HTTP/Methods/POST "HTTP POST Method"
[r-stream]: https://developer.mozilla.org/docs/Web/API/ReadableStream
[flipeador-cookies]: https://github.com/flipeador/node-http-cookies "@flipeador/node-http-cookies"
[confused-deputy]: https://en.wikipedia.org/wiki/Confused_deputy_problem "Confused Deputy Problem"
[user-agent]: https://developer.mozilla.org/docs/Glossary/User_agent
[content-type]: https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Type "HTTP Content-Type Header"
[xmlhttpreq]: https://developer.mozilla.org/docs/Web/API/XMLHttpRequest
