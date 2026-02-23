// =======================
// RELATÓRIO FINAL AVANÇADO
// =======================
function gerarRelatorio(estado) {
  const total = estado.log.length;

  const seguras = estado.log.filter(e => e.impacto > 0).length;
  const neutras = estado.log.filter(e => e.impacto === 0).length;
  const arriscadas = estado.log.filter(e => e.impacto < 0).length;

  const nota = Math.max(0, Math.min(100, 50 + estado.seguranca * 5));

  let perfil = "Usuário Desatento";
  if (nota >= 70) perfil = "Usuário Consciente";
  if (nota >= 85) perfil = "Guardião Digital";
  if (nota >= 95) perfil = "Cyber Sentinela";

  return {
    nota,
    perfil,
    total,
    seguras,
    neutras,
    arriscadas,
    errosCriticos: estado.errosCriticos.length,
    houveVazamento: typeof senhasFracasCriadas !== "undefined" && senhasFracasCriadas > 0,
    senhasVazadas: typeof senhasVazadas !== "undefined" ? senhasVazadas : []
  };
}

function comentarioFinal(r) {
  if (r.houveVazamento)
    return "O impacto real não veio de um ataque direto, mas de credenciais fracas criadas anteriormente.";

  if (r.errosCriticos >= 3)
    return "Você não foi atacado por sistemas. Foi atacado por hábitos repetidos.";

  if (r.arriscadas > r.seguras)
    return "Pressa, curiosidade e confiança excessiva foram exploradas diversas vezes.";

  if (r.nota >= 90)
    return "Você antecipou armadilhas antes que elas surgissem.";

  return "A segurança depende da próxima decisão.";
}

function mostrarRelatorioFinal() {
  const r = gerarRelatorio(estadoJogador);
  const el = document.getElementById("relatorio-final");

  // 💥 CAOS VISUAL SE HOUVE VAZAMENTO
  if (r.houveVazamento) {
    document.body.classList.add("caos-total");
    setTimeout(() => {
      document.body.classList.remove("caos-total");
    }, 3000);
  }

  const listaVazamentos = r.senhasVazadas.length
    ? `
      <h3>🚨 Credenciais Comprometidas</h3>
      <ul class="lista-vazamento">
        ${r.senhasVazadas.map(v =>
          `<li>Colaborador ${v.colaborador} — ${v.nivel} <span>(${v.horario})</span></li>`
        ).join("")}
      </ul>
    `
    : `<p class="seguro">✅ Nenhuma senha criada por você foi explorável.</p>`;

  el.innerHTML = `
    <h2>📊 Relatório Final de Segurança</h2>

    <p><strong>Perfil Comportamental:</strong> ${r.perfil}</p>
    <p><strong>Nota Final:</strong> ${r.nota}/100</p>

    <ul class="resumo-metricas">
      <li>✅ Decisões seguras: ${r.seguras}</li>
      <li>⚖️ Decisões neutras: ${r.neutras}</li>
      <li>⚠️ Decisões arriscadas: ${r.arriscadas}</li>
      <li>🚨 Erros críticos: ${r.errosCriticos}</li>
    </ul>

    ${listaVazamentos}

    <p class="comentario-final">${comentarioFinal(r)}</p>
  `;

  el.classList.remove("hidden");
}
