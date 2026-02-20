// =======================
// ELEMENTOS DO DOM
// =======================
const texto = document.getElementById("texto");
const botoes = document.getElementById("botoes");
const feedback = document.getElementById("feedback");
const barra = document.getElementById("nivel-seguranca");

// =======================
// ESTADO DO JOGADOR
// =======================
let estadoJogador = {
  seguranca: 0,
  atoAtual: 1
};

// =======================
// FUNÇÕES DE SISTEMA
// =======================
function atualizarBarra() {
  const valor = Math.max(0, Math.min(100, 50 + estadoJogador.seguranca * 10));
  barra.style.width = valor + "%";
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

// Penalidade progressiva por ato
function calcularImpacto(base) {
  if (base >= 0) return base;
  const mult =
    estadoJogador.atoAtual <= 2 ? 1 :
    estadoJogador.atoAtual <= 4 ? 1.4 :
    estadoJogador.atoAtual <= 6 ? 1.7 :
    2.2;
  return Math.round(base * mult);
}

function aplicarImpacto(base) {
  estadoJogador.seguranca += calcularImpacto(base);
  atualizarBarra();
}

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

function executarEscolha(opcao) {
  aplicarImpacto(opcao.impacto);
  mostrarFeedback(opcao.feedback, opcao.impacto);
  aplicarGlitchSeErro(opcao.impacto);

  setTimeout(() => {
    typeof opcao.proxima === "function"
      ? opcao.proxima()
      : mostrarCena(opcao.proxima);
  }, 1500);
}

// =======================
// TRANSIÇÃO ENTRE ATOS
// =======================
function mostrarTransicaoAto(numeroAto, proximoAto) {
  estadoJogador.atoAtual = numeroAto;

  texto.innerHTML =
    `<strong>ATO ${numeroAto} DESBLOQUEADO</strong><br><br>` +
    `${obterRank(estadoJogador.seguranca)}<br><br>` +
    `⚠️ Ataques agora exploram comportamento humano.`;

  botoes.innerHTML = "";
  feedback.textContent = "";

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
    texto: "O despertador toca, é hora de levantar",
    opcoes: [
      { texto: "Soneca várias vezes", feedback: "Começo apressado.", impacto: -2, proxima: "cama" },
      { texto: "Acordo logo", feedback: "Bom começo.", proxima: "cama" },
      { texto: "Desligo o despertador e levanto", feedback: "Boa, disciplina é tudo!", impacto: +2, proxima: "cama" },
    ]
  },
  cama: {
    texto: "Hora do café da manhã",
    opcoes: [
      { texto: "Abrir redes sociais", feedback: "Decisão automática.", impacto: -3, proxima: "fim" },
      { texto: "Evitar o celular", feedback: "Mais controle.", impacto: +1, proxima: "fim" }
    ]
  },
  fim: {
    texto: "Hora de sair.",
    opcoes: [
      { texto: "Saio no horário", impacto: 0, feedback: "", proxima: () => mostrarTransicaoAto(2, ATO_2) },
       { texto: "Me atraso mexendo em rede social", impacto: -1, feedback: "Atraso detectado.", proxima: () => mostrarTransicaoAto(2, ATO_2) }
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
      { texto: "Olhar andando", feedback: "Distração.", impacto: -1, proxima: "mensagem" },
      { texto: "Esperar parar", feedback: "Boa decisão.", impacto: +1, proxima: "mensagem" },
      { texto: "Zero ele no bolso", feedback: "Perpicaz, eu diria.", impacto: +2, proxima: "mensagem" }
    ]
  },
  mensagem: {
    texto: "Mensagem urgente pede ação imediata.",
    opcoes: [
      { texto: "Clicar no link", feedback: "Urgência é armadilha.", impacto: -2, proxima: "fim" },
      { texto: "Ignorar", feedback: "Boa leitura.", impacto: +1, proxima: "fim" },
      { texto: "Recusar/fechar", feedback: "Maravilha.", impacto: +2, proxima: "fim" }
    ]
  },
  fim: {
    texto: "Você chega ao trabalho",
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
    texto: "Chega um e-mail do DP da empresa marcado como URGENTE.",
    opcoes: [
      { texto: "Abrir imediatamente", feedback: "Urgência pressiona.", impacto: -1, proxima: "conteudo" },
      { texto: "Ler com calma", feedback: "Boa postura.", impacto: +1, proxima: "conteudo" }
    ]
  },
  conteudo: {
    texto: "“Todos devem baixar o memorando antes das 9h.”",
    opcoes: [
      { texto: "Confiar por ser interno", feedback: "Confiança cega.", impacto: -1, proxima: "arquivo" },
      { texto: "Estranhar o tom", feedback: "Bom sinal.", impacto: +1, proxima: "arquivo" }
    ]
  },
  arquivo: {
    texto: "Anexo: memorando.pdf.exe",
    opcoes: [
      { texto: "Baixar", feedback: "Extensão dupla é golpe.", impacto: -3, proxima: "fim" },
      { texto: "Não baixar", feedback: "Você evitou o ataque.", impacto: +2, proxima: "fim" }
    ]
  },
  fim: {
    texto: "A TI confirma: tentativa de phishing.",
    opcoes: [
      { texto: "Não sinalizar o TI que você baixou o arquivo", impacto: -5, feedback: "Péssimo.", proxima: () => mostrarTransicaoAto(4, ATO_4) },
      { texto: "Sinalizar o TI que você baixou o arquivo", impacto: 0, feedback: "", proxima: () => mostrarTransicaoAto(4, ATO_4) },
      { texto: "Sinalizar o TI que não você baixou o arquivo", impacto: +3, feedback: "Muito bem.", proxima: () => mostrarTransicaoAto(4, ATO_4) }      
    ]
  }
};

// =======================
// ATO 4 – SENHAS
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
        const senha = prompt("Digite a senha:");
        const r = analisarSenha(senha);
        aplicarImpacto(r.impacto);
        mostrarFeedback(r.msg, r.impacto);
        colaboradorAtual++;
        setTimeout(() => colaboradorAtual <= 4 ? mostrarCena("senha") : mostrarCena("fim"), 1500);
      }
    }]
  },
  fim: {
    texto: "Senhas criadas. Os usuários irão alterá-las.",
    opcoes: [{ texto: "Continuar", impacto: 0, feedback: "", proxima: () => mostrarTransicaoAto(5, ATO_5) }]
  }
};

// =======================
// ATO 5 – PRÉ-ALMOÇO
// =======================
const ATO_5 = {
  inicio: {
    texto: "O expediente segue.\nHora do almoço.",
    opcoes: [
        { texto: "Ir almoçar no restaurante ou comer marmita", impacto: +2, feedback: "Você tenta espairecer.", proxima: () => mostrarTransicaoAto(6, ATO_6) },
        { texto: "Comer algo rápido na rua", impacto: 0, feedback: "Sem muito tempo para pensar.", proxima: () => mostrarTransicaoAto(6, ATO_6) },
        { texto: "Pular o almoço e continuar trabalhando", impacto: -5, feedback: "O cansaço começa a pesar.", proxima: () => mostrarTransicaoAto(6, ATO_6) }
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
      { texto: "Virar o celular", feedback: "Menos exposição.", impacto: +1, proxima: "anuncios" },
      { texto: "Deixar desbloqueado", feedback: "Exposição desnecessária.", impacto: -2, proxima: "anuncios" }
    ]
  },
  anuncios: {
    texto: "Após falar de macarrão, surgem anúncios de comida italiana.",
    opcoes: [
      { texto: "Ignorar", feedback: "Boa leitura.", impacto: +1, proxima: "oferta" },
      { texto: "Clicar por curiosidade", feedback: "Curiosidade explorada.", impacto: -1, proxima: "oferta" }
    ]
  },
  oferta: {
    texto: "Promoção relâmpago de restaurante italiano.",
    opcoes: [
      { texto: "Clicar rápido", feedback: "Urgência é armadilha.", impacto: -2, proxima: "reserva" },
      { texto: "Pesquisar fora do anúncio", feedback: "Boa prática.", impacto: +2, proxima: "fimSeguro" }
    ]
  },
  reserva: {
    texto: "O site pede login para confirmar a reserva.",
    opcoes: [
      { texto: "Inserir credenciais", feedback: "Credenciais roubadas.", impacto: -5, proxima: "fim" },
      { texto: "Sair do site", feedback: "Boa decisão.", impacto: +2, proxima: "fimSeguro" }
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
      { texto: "Enviar acesso", feedback: "Confiança explorada.", impacto: -4, proxima: "fim" },
      { texto: "Confirmar por ligação", feedback: "Verificação salvou você.", impacto: +3, proxima: "fim" }
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
      { texto: "Escanear", feedback: "QRs podem esconder golpes.", impacto: -2, proxima: "fim" },
      { texto: "Ignorar", feedback: "Boa prática.", impacto: +2, proxima: "fim" }
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
      { texto: "Conectar no PC para ver o que tem nele", feedback: "Curiosidade explorada.", impacto: -5, proxima: "fim" },
      { texto: "Entregar à TI", feedback: "Procedimento correto.", impacto: +3, proxima: "fim" }
    ]
  },
  fim: {
    texto: "Encerrando expediente...",
    opcoes: [{ texto: "Sair", impacto: 0, feedback: "", proxima: () => mostrarTransicaoAto(10, ATO_10) }]
  }
};

// =======================
// ATO 10 – COLAPSO IMEDIATO
// =======================
function iniciarCaosImediato() {
  document.body.classList.add("caos-total");

  let impacto;
  if (estadoJogador.seguranca <= -4) impacto = -7;
  else if (estadoJogador.seguranca <= -2) impacto = -4;
  else if (estadoJogador.seguranca <= 1) impacto = -2;
  else impacto = 0;

  aplicarImpacto(impacto);

  setTimeout(() => {
    document.body.classList.remove("caos-total");
  }, 3000);
}

const ATO_10 = {
  inicio: {
    texto: () => {
      iniciarCaosImediato();

      if (estadoJogador.seguranca <= -4)
        return "⚠️ ALERTA CRÍTICO\n\nAcessos não autorizados.\nSistemas instáveis.";
      if (estadoJogador.seguranca <= -2)
        return "⚠️ ALERTA\n\nAtividades suspeitas detectadas.";
      if (estadoJogador.seguranca <= 1)
        return "⚠️ AVISO\n\nComportamentos inseguros registrados.";
      return "Expediente encerrado.\nNenhum incidente crítico.";
    },
    opcoes: [
      { texto: "Ver status final", impacto: 0, feedback: "", proxima: "fim" }
    ]
  },
  fim: {
    texto: () =>
      "EXPEDIENTE ENCERRADO\n\n" +
      "Status final:\n" +
      obterRank(estadoJogador.seguranca) +
      "\n\n" +
      "Ataques não exploram sistemas.\nEles exploram as suas decisões.",
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

  texto.textContent = typeof cena.texto === "function" ? cena.texto() : cena.texto;
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
// INÍCIO
// =======================
atualizarBarra();
mostrarCena("inicio");
