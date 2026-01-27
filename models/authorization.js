import { ValidationError } from "infra/errors.js";
import availableFeatures from "models/user-features.js";

function can(user, feature, resource) {
  let authorized = false;

  validateUser(user);
  validateFeature(feature);

  if (user.features.includes(feature)) {
    authorized = true;
  }

  if (feature === "update:user" && resource) {
    authorized = false;

    if (user.id === resource.id || can(user, "update:user:others")) {
      authorized = true;
    }
  }

  return authorized;
}

function validateUser(user) {
  if (!user) {
    throw new ValidationError({
      message: `Nenhum "user" foi especificado para a ação de autorização.`,
      action: `Contate o suporte informado o campo "errorId".`,
    });
  }

  if (!user.features || !Array.isArray(user.features)) {
    throw new ValidationError({
      message: `"user" não possui "features" ou não é um array.`,
      action: `Contate o suporte informado o campo "errorId".`,
    });
  }
}

function validateFeature(feature) {
  if (!feature) {
    throw new ValidationError({
      message: `Nenhuma "feature" foi especificada para a ação de autorização.`,
      action: `Contate o suporte informado o campo "errorId".`,
    });
  }

  if (!availableFeatures.has(feature)) {
    throw new ValidationError({
      message: `A feature utilizada não está disponível na lista de features existentes.`,
      action: `Contate o suporte informado o campo "errorId".`,
      context: {
        feature: feature,
      },
    });
  }
}

function filterOutput(user, feature, insecureValues) {
  if (feature === "read:user") {
    return {
      id: insecureValues.id,
      username: insecureValues.username,
      features: insecureValues.features,
      created_at: insecureValues.created_at,
      updated_at: insecureValues.updated_at,
    };
  }
}

const authorization = Object.freeze({
  can,
  filterOutput,
});

export default authorization;
