import { createRouter } from "next-connect";

import controller from "infra/controller.js";
import middleware from "middlewares/middleware.js";
import authorization from "models/authorization.js";
import migrator from "models/migrator.js";

const router = createRouter();

router.use(middleware.authentication.injectAnonymousOrUser);
router.get(middleware.authorization.canRequest("read:migration"), getHandler);
router.post(
  middleware.authorization.canRequest("create:migration"),
  postHandler,
);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userTryingToGet = request.context.user;
  const pendingMigrations = await migrator.listPendingMigrations();

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:migration",
    pendingMigrations,
  );

  response.status(200).json(secureOutputValues);
}

async function postHandler(request, response) {
  const userTryingToPost = request.context.user;
  const migratedMigrations = await migrator.runPendingMigrations();

  const secureOutputValues = authorization.filterOutput(
    userTryingToPost,
    "read:migration",
    migratedMigrations,
  );

  if (migratedMigrations.length > 0) {
    response.status(201).json(secureOutputValues);
  }

  response.status(200).json(secureOutputValues);
}
