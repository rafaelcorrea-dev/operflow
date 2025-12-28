import { createRouter } from "next-connect";

import controller from "infra/controller.js";
import middleware from "middlewares/middleware.js";
import activation from "models/activation.js";

const router = createRouter();

router.use(middleware.authentication.injectAnonymousOrUser);
router.patch(
  middleware.authorization.canRequest("read:activation_token"),
  patchHandler,
);

export default router.handler(controller.errorHandlers);

async function patchHandler(request, response) {
  const activationTokenId = request.query.token_id;

  // Refatorar em uma única query pra deixar atômica e com transaction
  const validActivationToken =
    await activation.findOneValidById(activationTokenId);

  await activation.activateUserByUserId(validActivationToken.user_id);

  const usedActivationToken =
    await activation.markTokenAsUsed(activationTokenId);

  return response.status(200).json(usedActivationToken);
}
