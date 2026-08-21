import { Banner } from "@primer/react";

import DefaultLayout from "interface/DefaultLayout/index.js";

export default function ConfirmRegisterPage() {
  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: "Confirme seu e-mail",
      }}
    >
      <Banner
        variant="warning"
        title="Falta só uma etapa!"
        description="Abra o e-mail enviado pelo Operflow e clique no link de confirmação."
      />
    </DefaultLayout>
  );
}
