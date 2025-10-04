import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow (all successfull)", () => {
  test("Create user account", async () => {
    const createUserResponse = await fetch(
      "http://localhost:3000/api/v1/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "RegistrationFlow",
          email: "registration.flow@curso.dev",
          password: "RegistrationFlowPassword",
        }),
      },
    );

    expect(createUserResponse.status).toBe(201);

    const createUserResonseBody = await createUserResponse.json();

    expect(createUserResonseBody).toEqual({
      id: createUserResonseBody.id,
      username: "RegistrationFlow",
      email: "registration.flow@curso.dev",
      features: ["read:activation_token"],
      password: createUserResonseBody.password,
      created_at: createUserResonseBody.created_at,
      updated_at: createUserResonseBody.updated_at,
    });
  });
});
