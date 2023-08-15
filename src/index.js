/*
    Cross-origin Resource Sharing (CORS).
    https://github.com/flipeador/node-http-cors
*/

function getValueStr(value, defval)
{
    return (
        typeof(value) === Array
        ? value.join(',')
        : value ? `${value}`
        : typeof(defval) === 'function'
        ? defval() : defval
    );
}

function checkOrigins(reqOrigin, origins)
{
    if (origins instanceof Array) {
        for (const origin of origins)
            if (checkOrigins(reqOrigin, origin))
                return true;
        return false;
    }
    if (origins instanceof RegExp)
        return origins.test(reqOrigin);
    if (typeof(origins) === 'function')
        return origins(reqOrigin);
    return `${origins}` === reqOrigin;
}

function getOrigin(reqOrigin, origins)
{
    // Any origin.
    if (origins === undefined || origins === '*')
        return '*';

    // Fixed origin.
    if (typeof(origins) === 'string')
        return origins;

    // Various origins.
    if (checkOrigins(reqOrigin, origins))
        return reqOrigin;
}

/**
 * Indicate whether the response can be shared with requesting code from the given origin.
 * @reference https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
 */
function setOrigin(req, res, options)
{
    const origin = getOrigin(req.headers.origin, options.origin);
    res.setHeader('Access-Control-Allow-Origin', origin || 'false');
    if (origin !== '*') res.vary('Origin');
    return origin;
}

/**
 * Tell browsers whether to expose the response when the request's credentials mode is `include`.
 * @reference https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
 */
function setCredentials(res, options)
{
    if (options.credentials)
        res.setHeader('Access-Control-Allow-Credentials', 'true');
}

/**
 * Indicate which response headers should be made available in response to a cross-origin request.
 * @reference https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
 */
function setExposedHeaders(res, options)
{
    const headers = getValueStr(options.exposedHeaders);
    if (headers)
        res.setHeader('Access-Control-Expose-Headers', headers);
}

/**
 * Indicate which headers are allowed when accessing a resource in response to a preflight request.
 * @reference https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
 */
function setAllowedHeaders(req, res, options)
{
    const headers = getValueStr(options.allowedHeaders||options.headers, () => {
        res.vary('Access-Control-Request-Headers');
        // Allow any HTTP header.
        return req.headers['access-control-request-headers'];
    });
    if (headers && typeof(headers) === 'string')
        res.setHeader('Access-Control-Allow-Headers', headers);
}

/**
 * Indicate which methods are allowed when accessing a resource in response to a preflight request.
 * @reference https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Methods
 */
function setAllowedMethods(req, res, options)
{
    const methods = getValueStr(options.allowedMethods||options.methods, () => {
        res.vary('Access-Control-Request-Method');
        // Allow any HTTP method.
        return req.headers['access-control-request-method'];
    });
    if (methods && typeof(methods) === 'string')
        res.setHeader('Access-Control-Allow-Methods', methods);
}

/**
 * Indicate how long the results of a preflight request (allowed methods/headers) can be cached.
 * @reference https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Max-Age
 */
function setMaxAge(res, options)
{
    if (options.maxAge)
        res.setHeader('Access-Control-Max-Age', `${options.maxAge}`);
}

/**
 * Set the CORS headers.
 */
export function setCors(req, res, options)
{
    // A CORS request includes the Origin header.
    if (setOrigin(req, res, options))
    {
        setCredentials(res, options);
        setExposedHeaders(res, options);

        // CORS preflight request.
        const methods = req.headers['access-control-request-method'];
        if (req.method === 'OPTIONS' && methods && typeof(methods) === 'string')
        {
            setAllowedMethods(req, res, options);
            setAllowedHeaders(req, res, options);
            setMaxAge(res, options);

            res.status(200).end();
            return res.statusCode;
        }

        return 0;
    }
}

/**
 * Create CORS middleware.
 */
export function cors(options)
{
    return (req, res, next) => {
        if (!setCors(req, res, options))
            next();
    };
}

export default cors;
