import { createRouter } from "next-connect";

import controller from "infra/controller.js";
import middleware from "middlewares/middleware.js";
import authorization from "models/authorization.js";
import migrator from "models/migrator.js";

export default createRouter()
  .use(middleware.authentication.injectAnonymousOrUser)
  .get(middleware.authorization.canRequest("read:migration"), getHandler)
  .post(middleware.authorization.canRequest("create:migration"), postHandler)
  .handler(controller.errorHandlers);

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
