import { createRouter } from "next-connect";

import controller from "infra/controller.js";
import { ForbiddenError } from "infra/errors.js";
import middleware from "middlewares/middleware.js";
import authorization from "models/authorization.js";
import user from "models/user.js";

const router = createRouter();

router.use(middleware.authentication.injectAnonymousOrUser);
router.get(getHandler);
router.patch(middleware.authorization.canRequest("update:user"), patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userTryingToGet = request.context.user;
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username);

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:user",
    userFound,
  );

  response.status(200).json(secureOutputValues);
}

async function patchHandler(request, response) {
  const username = request.query.username;
  const userInputValues = request.body;

  const userTryingToPath = request.context.user;
  const targetUser = await user.findOneByUsername(username);

  if (!authorization.can(userTryingToPath, "update:user", targetUser)) {
    throw new ForbiddenError({
      message: "Você não possui permissão para atualizar outro usuário.",
      action:
        "Verifique se você possui a feature necessária para atualizar outro usuário.",
    });
  }

  const updatedUser = await user.update(username, userInputValues);

  response.status(200).json(updatedUser);
}
