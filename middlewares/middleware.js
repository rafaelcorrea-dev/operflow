import authentication from "middlewares/authentication.js";
import authorization from "middlewares/authorization.js";

// import cacheControl from "middlewares/cache-control.js";
// import requestMetadata from "middlewares/request-metadata.js";

const middleware = Object.freeze({
  authentication,
  authorization,
  // cacheControl,
  // injectRequestMetadata: requestMetadata.inject,
});

export default middleware;
