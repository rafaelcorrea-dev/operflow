import orchestrator from "tests/orchestrator.js";
import email from "infra/email.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "OperFlow <contato@operflow.com.br>",
      to: "contato@curso.dev",
      subject: "Teste de assunto",
      text: "Teste de corpo.",
    });

    await email.send({
      from: "OperFlow <contato@operflow.com.br>",
      to: "contato@curso.dev",
      subject: "Assunto do último email enviado",
      text: "Corpo do último email enviado.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contato@operflow.com.br>");
    expect(lastEmail.recipients[0]).toBe("<contato@curso.dev>");
    expect(lastEmail.subject).toBe("Assunto do último email enviado");
    expect(lastEmail.text).toBe("Corpo do último email enviado.\r\n");
  });
});
