import { createRouter } from "next-connect";

import controller from "infra/controller.js";
import middleware from "middlewares/middleware.js";
import activation from "models/activation.js";
import user from "models/user.js";

const router = createRouter();

router.use(middleware.authentication.injectAnonymousOrUser);
router.post(middleware.authorization.canRequest("create:user"), postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);

  const activationToken = await activation.create(newUser.id);
  await activation.sendEmailToUser(newUser, activationToken);

  response.status(201).json(newUser);
}
