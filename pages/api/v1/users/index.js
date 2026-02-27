import { createRouter } from "next-connect";

import controller from "infra/controller.js";
import middleware from "middlewares/middleware.js";
import activation from "models/activation.js";
import authorization from "models/authorization.js";
import user from "models/user.js";

const router = createRouter();

router.use(middleware.authentication.injectAnonymousOrUser);
router.post(middleware.authorization.canRequest("create:user"), postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userTryingToPost = request.context.user;
  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);

  const activationToken = await activation.create(newUser.id);
  await activation.sendEmailToUser(newUser, activationToken);

  const secureOutputValues = authorization.filterOutput(
    userTryingToPost,
    "read:user",
    newUser,
  );

  response.status(201).json(secureOutputValues);
}
