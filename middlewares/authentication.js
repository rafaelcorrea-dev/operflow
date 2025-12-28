import session from "models/session.js";
import user from "models/user.js";

async function injectAnonymousOrUser(request, response, next) {
  if (request.cookies?.session_id) {
    await injectAuthenticatedUser(request);

    return next();
  }

  injectAnonymousUser(request);
  return next();
}

async function injectAuthenticatedUser(request) {
  const sessionToken = request.cookies.session_id;

  const sessionObject = await session.findOneValidByToken(sessionToken);
  const userObject = await user.findOneById(sessionObject.user_id);

  request.context = {
    ...request.context,
    user: userObject,
  };
}

async function injectAnonymousUser(request) {
  const anonymousUser = user.createAnonymous();

  request.context = {
    ...request.context,
    user: anonymousUser,
  };
}

const authentication = {
  injectAnonymousOrUser,
};

export default authentication;
