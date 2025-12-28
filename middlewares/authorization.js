import { ForbiddenError } from "infra/errors.js";
import authorizationModel from "models/authorization.js";

function canRequest(feature) {
  return function (request, response, next) {
    const userTryingToRequest = request.context.user;

    if (authorizationModel.can(userTryingToRequest, feature)) {
      return next();
    }

    throw new ForbiddenError({
      message: `Usuário não pode executar esta operação.`,
      action: `Verifique se este usuário possui a feature "${feature}".`,
    });
  };
}

const authorization = Object.freeze({
  canRequest,
});

export default authorization;
