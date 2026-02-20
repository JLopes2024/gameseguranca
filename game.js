// =======================
// ELEMENTOS DO DOM
// =======================
const texto = document.getElementById("texto");
const botoes = document.getElementById("botoes");
const feedback = document.getElementById("feedback");
const barra = document.getElementById("nivel-seguranca");

// === ELEMENTOS EXTRAS (ATO 4 HQ) ===
const senhaBox = document.getElementById("senha-box");
const inputSenha = document.getElementById("input-senha");
const btnConfirmarSenha = document.getElementById("confirmar-senha");

// =======================
// ESTADO DO JOGADOR
// =======================
let estadoJogador = {
  seguranca: 0,
  atoAtual: 1,
  log: [],
  errosCriticos: []
};

// =======================
// SISTEMA DE SEGURANÇA
// =======================
function atualizarBarra() {
  const valor = Math.max(0, Math.min(100, 50 + estadoJogador.seguranca * 10));
  barra.style.width = valor + "%";
}

function normalizarSeguranca() {
  estadoJogador.seguranca = Math.max(-10, Math.min(10, estadoJogador.seguranca));
}

function obterRank(seguranca) {
  if (seguranca <= -6) return "🟥 Zona de Risco Total";
  if (seguranca <= -4) return "🟥 Modo Noob Desprotegido";
  if (seguranca === -3) return "🟧 Usuário Distraído";
  if (seguranca === -2) return "🟨 Player Casual";
  if (seguranca === -1) return "🟨 Explorador Digital";
  if (seguranca <= 1) return "🟩 Aprendiz do Mundo Digital";
  if (seguranca <= 3) return "🟩 Guardião Digital";
  if (seguranca <= 5) return "🟦 Estrategista Cibernético";
  return "🟦 Cyber Sentinela";
}

// =======================
// IMPACTO PROGRESSIVO
// =======================
function calcularImpacto(base) {
  if (base >= 0) return base;
  const mult =
    estadoJogador.atoAtual <= 2 ? 1 :
    estadoJogador.atoAtual <= 4 ? 1.4 :
    estadoJogador.atoAtual <= 6 ? 1.7 : 2.2;
  return Math.round(base * mult);
}

function aplicarImpacto(base = 0) {
  const impacto = calcularImpacto(base);
  estadoJogador.seguranca += impacto;
  normalizarSeguranca();
  atualizarBarra();
  return impacto;
}

// =======================
// FEEDBACK VISUAL
// =======================
function mostrarFeedback(msg, impacto) {
  feedback.textContent = msg || "";
  feedback.className =
    impacto < 0 ? "feedback-negativo" :
    impacto > 0 ? "feedback-positivo" :
    "feedback-neutro";
}

function aplicarGlitchSeErro(impacto) {
  if (impacto < 0) {
    texto.classList.add("glitch");
    setTimeout(() => texto.classList.remove("glitch"), 700);
  }
}

// =======================
// EXECUÇÃO DE ESCOLHAS
// =======================
function executarEscolha(opcao) {
  const impacto = aplicarImpacto(opcao.impacto);

  estadoJogador.log.push({
    ato: estadoJogador.atoAtual,
    escolha: opcao.texto,
    impacto,
    hora: new Date().toLocaleTimeString()
  });

  if (impacto <= -4) {
    estadoJogador.errosCriticos.push({
      ato: estadoJogador.atoAtual,
      erro: opcao.texto
    });
  }

  mostrarFeedback(opcao.feedback, impacto);
  aplicarGlitchSeErro(impacto);

  setTimeout(() => {
    typeof opcao.proxima === "function"
      ? opcao.proxima()
      : mostrarCena(opcao.proxima);
  }, 1400);
}

// =======================
// TRANSIÇÃO DE ATOS
// =======================
function mostrarTransicaoAto(numeroAto, proximoAto) {
  estadoJogador.atoAtual = numeroAto;

  texto.innerHTML =
    `<strong>ATO ${numeroAto} DESBLOQUEADO</strong><br><br>` +
    `${obterRank(estadoJogador.seguranca)}<br><br>` +
    `⚠️ Ataques exploram decisões humanas, não sistemas.`;

  botoes.innerHTML = "";
  feedback.textContent = "";
  senhaBox && senhaBox.classList.add("hidden");

  const btn = document.createElement("button");
  btn.textContent = "Continuar";
  btn.onclick = () => {
    cenasAtuais = proximoAto;
    mostrarCena("inicio");
  };
  botoes.appendChild(btn);
}

// =======================
// ATO 1 – MANHÃ
// =======================
const ATO_1 = {
  inicio: {
    texto: "O despertador toca.\nHora de levantar.",
    opcoes: [
      { texto: "Soneca várias vezes", impacto: -2, feedback: "Começo apressado.", proxima: "cama" },
      { texto: "Acordar logo", impacto: 0, feedback: "Rotina estável.", proxima: "cama" },
      { texto: "Levantar disciplinado", impacto: +2, feedback: "Disciplina ajuda decisões.", proxima: "cama" }
    ]
  },
  cama: {
    texto: "Hora do café da manhã.",
    opcoes: [
      { texto: "Abrir redes sociais", impacto: -3, feedback: "Decisão automática.", proxima: "fim" },
      { texto: "Evitar o celular", impacto: +1, feedback: "Autocontrole.", proxima: "fim" }
    ]
  },
  fim: {
    texto: "Hora de sair.",
    opcoes: [
      { texto: "Sair no horário", impacto: 0, feedback: "", proxima: () => mostrarTransicaoAto(2, ATO_2) },
      { texto: "Atrasar por redes sociais", impacto: -1, feedback: "Atraso detectado.", proxima: () => mostrarTransicaoAto(2, ATO_2) }
    ]
  }
};

// =======================
// ATO 2 – CAMINHO
// =======================
const ATO_2 = {
  inicio: {
    texto: "Você anda e o celular vibra.",
    opcoes: [
      { texto: "Olhar andando", impacto: -1, feedback: "Distração.", proxima: "mensagem" },
      { texto: "Parar para olhar", impacto: +1, feedback: "Boa decisão.", proxima: "mensagem" },
      { texto: "Ignorar no bolso", impacto: +2, feedback: "Autocontrole.", proxima: "mensagem" }
    ]
  },
  mensagem: {
    texto: "Mensagem urgente pede ação imediata.",
    opcoes: [
      { texto: "Clicar no link", impacto: -2, feedback: "Urgência é armadilha.", proxima: "fim" },
      { texto: "Ignorar", impacto: +1, feedback: "Boa leitura.", proxima: "fim" },
      { texto: "Fechar a mensagem", impacto: +2, feedback: "Excelente.", proxima: "fim" }
    ]
  },
  fim: {
    texto: "Você chega ao trabalho.",
    opcoes: [
      { texto: "Entrar", impacto: 0, feedback: "", proxima: () => mostrarTransicaoAto(3, ATO_3) }
    ]
  }
};

// =======================
// ATO 3 – MEMORANDO
// =======================
const ATO_3 = {
  inicio: {
    texto: "Chega um e-mail do DP marcado como URGENTE.",
    opcoes: [
      { texto: "Abrir imediatamente", impacto: -1, feedback: "Urgência pressiona.", proxima: "conteudo" },
      { texto: "Ler com calma", impacto: +1, feedback: "Boa postura.", proxima: "conteudo" }
    ]
  },
  conteudo: {
    texto: "Todos devem baixar o memorando antes das 9h.",
    opcoes: [
      { texto: "Confiar por ser interno", impacto: -1, feedback: "Confiança cega.", proxima: "arquivo" },
      { texto: "Estranhar o tom", impacto: +1, feedback: "Bom sinal.", proxima: "arquivo" }
    ]
  },
  arquivo: {
    texto: "Anexo: memorando.pdf.exe",
    opcoes: [
      { texto: "Baixar o arquivo", impacto: -3, feedback: "Extensão dupla é golpe.", proxima: "fim" },
      { texto: "Não baixar", impacto: +2, feedback: "Você evitou o ataque.", proxima: "fim" }
    ]
  },
  fim: {
    texto: "A TI confirma: tentativa de phishing.",
    opcoes: [
      { texto: "Não avisar a TI", impacto: -5, feedback: "Péssimo.", proxima: () => mostrarTransicaoAto(4, ATO_4) },
      { texto: "Avisar a TI que baixou", impacto: 0, feedback: "Correto.", proxima: () => mostrarTransicaoAto(4, ATO_4) },
      { texto: "Avisar a TI que NÃO baixou", impacto: +3, feedback: "Muito bem.", proxima: () => mostrarTransicaoAto(4, ATO_4) }
    ]
  }
};

// =======================
// ATO 4 – SENHAS (CORRIGIDO)
// =======================
let colaboradorAtual = 1;

function analisarSenha(senha) {
  let pontos = 0;
  if (!senha || senha.length < 6) return { impacto: -4, msg: "Senha muito curta." };
  if (senha.length >= 8 && senha.length <= 12) pontos += 2;
  if (senha.length > 12) pontos -= 1;
  if (/[a-z]/.test(senha)) pontos++;
  if (/[A-Z]/.test(senha)) pontos++;
  if (/[0-9]/.test(senha)) pontos++;
  if (/[^a-zA-Z0-9]/.test(senha)) pontos++;
  if (pontos >= 5) return { impacto: +3, msg: "Senha forte." };
  if (pontos >= 3) return { impacto: 0, msg: "Senha aceitável." };
  return { impacto: -2, msg: "Senha fraca." };
}

const ATO_4 = {
  inicio: {
    texto: "Chegaram novos colaboradores.\nCrie senhas temporárias.",
    opcoes: [{ texto: "Iniciar", impacto: 0, feedback: "", proxima: "senha" }]
  },
  senha: {
    texto: () => `Colaborador ${colaboradorAtual}/4\nCrie uma senha segura.`,
    opcoes: [{
      texto: "Criar senha",
      impacto: 0,
      feedback: "",
      proxima: () => {
        senhaBox.classList.remove("hidden");
        btnConfirmarSenha.onclick = () => {
          const r = analisarSenha(inputSenha.value);
          aplicarImpacto(r.impacto);
          mostrarFeedback(r.msg, r.impacto);
          inputSenha.value = "";
          senhaBox.classList.add("hidden");
          colaboradorAtual++;
          setTimeout(() => {
            colaboradorAtual <= 4 ? mostrarCena("senha") : mostrarCena("fim");
          }, 1400);
        };
      }
    }]
  },
  fim: {
    texto: "Senhas criadas.\nOs usuários irão alterá-las.",
    opcoes: [{
      texto: "Continuar",
      impacto: 0,
      feedback: "",
      proxima: () => {
        colaboradorAtual = 1;
        senhaBox.classList.add("hidden");
        inputSenha.value = "";
        mostrarTransicaoAto(5, ATO_5);
      }
    }]
  }
};

// =======================
// ATO 5 – PRÉ-ALMOÇO
// =======================
const ATO_5 = {
  inicio: {
    texto: "O expediente segue.\nHora do almoço.",
    opcoes: [
      { texto: "Almoçar com calma", impacto: +2, feedback: "Você espairece.", proxima: () => mostrarTransicaoAto(6, ATO_6) },
      { texto: "Comer algo rápido", impacto: 0, feedback: "Sem pausa mental.", proxima: () => mostrarTransicaoAto(6, ATO_6) },
      { texto: "Pular o almoço", impacto: -5, feedback: "Cansaço afeta decisões.", proxima: () => mostrarTransicaoAto(6, ATO_6) }
    ]
  }
};

// =======================
// ATO 6 – ALMOÇO CONECTADO
// =======================
const ATO_6 = {
  inicio: {
    texto: "Durante o almoço, o celular fica sobre a mesa.",
    opcoes: [
      { texto: "Virar o celular", impacto: +1, feedback: "Menos exposição.", proxima: "anuncios" },
      { texto: "Deixar desbloqueado", impacto: -4, feedback: "Exposição desnecessária.", proxima: "anuncios" }
    ]
  },
  anuncios: {
    texto: "Após falar de macarrão, surgem anúncios de comida italiana.",
    opcoes: [
      { texto: "Ignorar", impacto: +1, feedback: "Boa leitura.", proxima: "oferta" },
      { texto: "Clicar por curiosidade", impacto: -1, feedback: "Curiosidade explorada.", proxima: "oferta" }
    ]
  },
  oferta: {
    texto: "Promoção relâmpago de restaurante italiano.",
    opcoes: [
      { texto: "Clicar rápido", impacto: -2, feedback: "Urgência é armadilha.", proxima: "reserva" },
      { texto: "Pesquisar fora do anúncio", impacto: +2, feedback: "Boa prática.", proxima: "fimSeguro" }
    ]
  },
  reserva: {
    texto: "O site pede login para confirmar a reserva.",
    opcoes: [
      { texto: "Inserir credenciais", impacto: -5, feedback: "Credenciais roubadas.", proxima: "fim" },
      { texto: "Sair do site", impacto: +2, feedback: "Boa decisão.", proxima: "fimSeguro" }
    ]
  },
  fimSeguro: {
    texto: "O almoço termina sem incidentes.",
    opcoes: [{ texto: "Continuar", impacto: 0, feedback: "", proxima: "fim" }]
  },
  fim: {
    texto: "O expediente continua.",
    opcoes: [{ texto: "Seguir", impacto: 0, feedback: "", proxima: () => mostrarTransicaoAto(7, ATO_7) }]
  }
};

// =======================
// ATO 7 – WHATSAPP
// =======================
const ATO_7 = {
  inicio: {
    texto: "Mensagem no WhatsApp corporativo pede acesso urgente.",
    opcoes: [
      { texto: "Enviar acesso", impacto: -4, feedback: "Confiança explorada.", proxima: "fim" },
      { texto: "Confirmar por ligação", impacto: +3, feedback: "Verificação salvou você.", proxima: "fim" }
    ]
  },
  fim: {
    texto: "Engenharia social é o ataque mais comum.",
    opcoes: [{ texto: "Avançar", impacto: 0, feedback: "", proxima: () => mostrarTransicaoAto(8, ATO_8) }]
  }
};

// =======================
// ATO 8 – QR CODE
// =======================
const ATO_8 = {
  inicio: {
    texto: "QR Code no prédio oferece Wi-Fi.",
    opcoes: [
      { texto: "Escanear", impacto: -2, feedback: "QRs escondem golpes.", proxima: "fim" },
      { texto: "Ignorar", impacto: +2, feedback: "Boa prática.", proxima: "fim" }
    ]
  },
  fim: {
    texto: "QR Codes também atacam.",
    opcoes: [{ texto: "Avançar", impacto: 0, feedback: "", proxima: () => mostrarTransicaoAto(9, ATO_9) }]
  }
};

// =======================
// ATO 9 – PENDRIVE
// =======================
const ATO_9 = {
  inicio: {
    texto: "Você encontra um pendrive no estacionamento.",
    opcoes: [
      { texto: "Conectar no PC", impacto: -5, feedback: "Curiosidade explorada.", proxima: "fim" },
      { texto: "Entregar à TI", impacto: +3, feedback: "Procedimento correto.", proxima: "fim" }
    ]
  },
  fim: {
    texto: "Encerrando expediente...",
    opcoes: [{ texto: "Sair", impacto: 0, feedback: "", proxima: () => mostrarTransicaoAto(10, ATO_10) }]
  }
};

// =======================
// ATO 10 – COLAPSO FINAL
// =======================
function iniciarCaosImediato() {
  document.body.classList.add("caos-total");

  let impacto =
    estadoJogador.seguranca <= -4 ? -7 :
    estadoJogador.seguranca <= -2 ? -4 :
    estadoJogador.seguranca <= 1 ? -2 : 0;

  aplicarImpacto(impacto);

  setTimeout(() => {
    document.body.classList.remove("caos-total");
  }, 3000);
}

function gerarResumoFinal() {
  if (estadoJogador.errosCriticos.length >= 3)
    return "Você não foi atacado por sistemas.<br>Foi atacado por padrões repetidos.";

  if (estadoJogador.seguranca >= 5)
    return "Você reconhece armadilhas antes que elas apareçam.";

  return "A segurança depende da próxima decisão.";
}

const ATO_10 = {
  inicio: {
    texto: () => {
      iniciarCaosImediato();
      if (estadoJogador.seguranca <= -4) return "⚠️ ALERTA CRÍTICO\nSistemas comprometidos.";
      if (estadoJogador.seguranca <= -2) return "⚠️ ALERTA\nAtividades suspeitas.";
      if (estadoJogador.seguranca <= 1) return "⚠️ AVISO\nComportamentos inseguros.";
      return "Expediente encerrado.\nNenhum incidente crítico.";
    },
    opcoes: [{ texto: "Ver status final", impacto: 0, feedback: "", proxima: "fim" }]
  },
  fim: {
    texto: () =>
      "EXPEDIENTE ENCERRADO\n\n" +
      "Status final:\n" +
      obterRank(estadoJogador.seguranca) +
      "\n\n" +
      gerarResumoFinal(),
    opcoes: []
  }
};

// =======================
// CONTROLE DE CENAS
// =======================
let cenasAtuais = ATO_1;

function mostrarCena(nomeCena) {
  const cena = cenasAtuais[nomeCena];
  if (!cena) return;

  senhaBox && senhaBox.classList.add("hidden");

  const conteudo = typeof cena.texto === "function" ? cena.texto() : cena.texto;
  texto.innerHTML = conteudo.replace(/\n/g, "<br>");

  botoes.innerHTML = "";
  feedback.textContent = "";

  (cena.opcoes || []).forEach(opcao => {
    const btn = document.createElement("button");
    btn.textContent = opcao.texto;
    btn.onclick = () => executarEscolha(opcao);
    botoes.appendChild(btn);
  });
}

// =======================
// INÍCIO DO JOGO
// =======================
atualizarBarra();
mostrarCena("inicio");
