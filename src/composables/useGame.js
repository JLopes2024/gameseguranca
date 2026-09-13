import {
  computed,
  reactive,
  ref,
} from 'vue'

import {
  buscarJogo,
} from '../services/gameApi'

const RELATORIO_STORAGE =
  'game-seguranca-relatorio'

const ATOS = reactive({})

const jogoCarregado = ref(false)
const carregandoJogo = ref(false)
const erroCarregamento = ref('')

let promessaCarregamento = null

function criarEstadoInicial() {
  return {
    seguranca: 0,

    atoAtual: 1,
    cenaAtual: 'inicio',

    feedback: '',
    impactoFeedback: 0,

    bloqueado: false,

    transicao: false,
    proximoAto: null,

    contador: null,

    log: [],
    errosCriticos: [],

    memorandoBaixado: false,

    colaboradorAtual: 1,

    senhasFracasCriadas: 0,
    senhasVazadas: [],

    clientesCadastrados: [],

    modoSenha: null,

    caos: false,
    glitch: false,

    efeitosExecutados: [],

    relatorio: null,
  }
}

const estadoJogador = reactive(
  criarEstadoInicial(),
)

let intervaloContador = null
let timeoutFeedback = null
let timeoutGlitch = null
let timeoutCaos = null

function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

// =======================
// CARREGAMENTO
// =======================

async function carregarJogo() {
  if (jogoCarregado.value) {
    return
  }

  if (promessaCarregamento) {
    return promessaCarregamento
  }

  carregandoJogo.value = true
  erroCarregamento.value = ''

  promessaCarregamento = buscarJogo()
    .then((dados) => {
      Object.keys(ATOS).forEach((chave) => {
        delete ATOS[chave]
      })

      Object.assign(
        ATOS,
        dados.atos,
      )

      jogoCarregado.value = true
    })
    .catch((erro) => {
      console.error(erro)

      erroCarregamento.value =
        'Não foi possível carregar os dados do jogo.'

      throw erro
    })
    .finally(() => {
      carregandoJogo.value = false
      promessaCarregamento = null
    })

  return promessaCarregamento
}

// =======================
// COMPUTEDS
// =======================

const atoAtual = computed(() => {
  return ATOS[
    estadoJogador.atoAtual
  ]
})

const cenaAtual = computed(() => {
  return atoAtual.value?.cenas?.[
    estadoJogador.cenaAtual
  ]
})

const tituloAto = computed(() => {
  return atoAtual.value?.titulo ?? ''
})

const nivelSeguranca = computed(() => {
  return Math.max(
    0,
    Math.min(
      100,
      50 +
        estadoJogador.seguranca * 10,
    ),
  )
})

const classeFeedback = computed(() => {
  if (
    estadoJogador.impactoFeedback > 0
  ) {
    return 'feedback-positivo'
  }

  if (
    estadoJogador.impactoFeedback < 0
  ) {
    return 'feedback-negativo'
  }

  return 'feedback-neutro'
})

// =======================
// RANK
// =======================

function obterRank() {
  const seguranca =
    estadoJogador.seguranca

  if (seguranca <= -6) {
    return '🟥 Zona de Risco Total'
  }

  if (seguranca <= -4) {
    return '🟥 Modo Noob Desprotegido'
  }

  if (seguranca === -3) {
    return '🟧 Usuário Distraído'
  }

  if (seguranca === -2) {
    return '🟨 Player Casual'
  }

  if (seguranca === -1) {
    return '🟨 Explorador Digital'
  }

  if (seguranca <= 1) {
    return '🟩 Aprendiz do Mundo Digital'
  }

  if (seguranca <= 3) {
    return '🟩 Guardião Digital'
  }

  if (seguranca <= 5) {
    return '🟦 Estrategista Cibernético'
  }

  return '🟦 Cyber Sentinela'
}

// =======================
// TEXTOS DINÂMICOS
// =======================

function resolverTextoCena(cena) {
  if (!cena) {
    return ''
  }

  if (!cena.tipo) {
    return cena.texto ?? ''
  }

  if (
    cena.tipo ===
    'senha-colaborador'
  ) {
    return (
      `Colaborador ${estadoJogador.colaboradorAtual}/4\n` +
      'Crie uma senha segura.'
    )
  }

  if (
    cena.tipo ===
    'resumo-senhas'
  ) {
    if (
      estadoJogador
        .senhasFracasCriadas === 0
    ) {
      return (
        'Senhas criadas com sucesso.\n\n' +
        'Nenhuma fragilidade detectada.\n' +
        'As contas estão protegidas.'
      )
    }

    return (
      'Senhas criadas.\n\n' +
      '⚠️ Algumas senhas apresentam fragilidade.\n' +
      'Isso poderá gerar consequências durante o expediente.'
    )
  }

  if (
    cena.tipo ===
    'vazamento-interno'
  ) {
    if (
      estadoJogador
        .senhasFracasCriadas === 0
    ) {
      return (
        '🛡️ MONITORAMENTO DE SEGURANÇA\n\n' +
        'Tentativas automatizadas de acesso foram detectadas.\n\n' +
        'Nenhuma credencial criada por você foi explorável.\n\n' +
        'Boas práticas evitaram o incidente.'
      )
    }

    const lista =
      estadoJogador.senhasVazadas
        .map(
          (senha) =>
            `• Colaborador ${senha.colaborador} — ${senha.nivel}`,
        )
        .join('\n')

    return (
      '🚨 INCIDENTE DE SEGURANÇA DETECTADO\n\n' +
      'Credenciais internas começaram a circular na rede corporativa.\n\n' +
      'Registros comprometidos:\n\n' +
      lista +
      '\n\nO ataque explorou decisões tomadas anteriormente.'
    )
  }

  if (
    cena.tipo ===
    'senha-cliente'
  ) {
    return (
      'Defina a senha do cliente.\n\n' +
      '🔐 Essa senha não é temporária.'
    )
  }

  if (
    cena.tipo ===
    'ataque-cliente'
  ) {
    const cliente =
      estadoJogador
        .clientesCadastrados
        .at(-1)

    if (!cliente) {
      return 'Nenhum cliente cadastrado.'
    }

    if (
      cliente.nivel === 'forte'
    ) {
      return (
        '🛡️ FIREWALL CORPORATIVO ATIVADO\n\n' +
        'Tentativas de acesso automatizadas foram bloqueadas.\n\n' +
        'A senha criada resistiu ao ataque.\n\n' +
        'O banco de dados não foi comprometido.'
      )
    }

    if (
      cliente.nivel ===
      'aceitavel'
    ) {
      return (
        '⚠️ INCIDENTE PARCIAL DETECTADO\n\n' +
        'A senha resistiu parcialmente, mas padrões previsíveis foram explorados.\n\n' +
        'Metadados do cliente vazaram.\n\n' +
        'Nome e CPF foram comprometidos.'
      )
    }

    return (
      '🚨 ROUBO DO BANCO DE DADOS\n\n' +
      'Atacantes exploraram a senha criada no cadastro.\n\n' +
      'Dados comprometidos:\n' +
      '• Nome\n' +
      '• CPF\n' +
      '• Senha\n\n' +
      'O ataque não quebrou sistemas.\n' +
      'Quebrou padrões humanos.'
    )
  }

  if (
    cena.tipo ===
    'resumo-vazamento'
  ) {
    if (
      estadoJogador
        .senhasFracasCriadas === 0
    ) {
      return (
        '🛡️ FIREWALL CORPORATIVO ATIVADO\n\n' +
        'Tentativas de invasão foram detectadas.\n\n' +
        'Todas as credenciais resistiram aos ataques.'
      )
    }

    const lista =
      estadoJogador.senhasVazadas
        .map(
          (senha) =>
            `• Colaborador ${senha.colaborador} — ${senha.nivel}`,
        )
        .join('\n')

    return (
      '🚨 ROUBO DE DADOS CONFIRMADO\n\n' +
      'Atacantes exploraram credenciais frágeis criadas anteriormente.\n\n' +
      'Credenciais exploradas:\n\n' +
      lista +
      '\n\nO ataque não quebrou sistemas.\n' +
      'Quebrou padrões.'
    )
  }

  if (
    cena.tipo ===
    'status-final'
  ) {
    const leitura =
      estadoJogador
        .senhasFracasCriadas === 0
        ? 'Você construiu defesas antes do ataque existir.'
        : 'As consequências surgiram horas depois das decisões.'

    return (
      'EXPEDIENTE ENCERRADO\n\n' +
      `Status Final:\n${obterRank()}\n\n` +
      leitura
    )
  }

  return ''
}

const textoCena = computed(() => {
  return resolverTextoCena(
    cenaAtual.value,
  )
})

// =======================
// CONDIÇÕES
// =======================

function validarCondicao(condicao) {
  if (!condicao) {
    return true
  }

  if (
    condicao ===
    'memorandoBaixado'
  ) {
    return estadoJogador
      .memorandoBaixado
  }

  if (
    condicao ===
    'memorandoNaoBaixado'
  ) {
    return !estadoJogador
      .memorandoBaixado
  }

  if (
    condicao ===
    'semSenhasFracas'
  ) {
    return (
      estadoJogador
        .senhasFracasCriadas === 0
    )
  }

  if (
    condicao ===
    'comSenhasFracas'
  ) {
    return (
      estadoJogador
        .senhasFracasCriadas > 0
    )
  }

  return true
}

const opcoesCena = computed(() => {
  const opcoes =
    cenaAtual.value?.opcoes ?? []

  return opcoes.filter(
    (opcao) =>
      validarCondicao(
        opcao.condicao,
      ),
  )
})

// =======================
// SEGURANÇA
// =======================

function calcularImpacto(base) {
  if (base >= 0) {
    return base
  }

  const ato =
    Number(
      estadoJogador.atoAtual,
    )

  const multiplicador =
    ato <= 2
      ? 1
      : ato <= 4
        ? 1.4
        : ato <= 6
          ? 1.7
          : 2.2

  return Math.round(
    base * multiplicador,
  )
}

function aplicarImpacto(
  base = 0,
  progressivo = true,
) {
  const impacto =
    progressivo
      ? calcularImpacto(base)
      : base

  estadoJogador.seguranca +=
    impacto

  estadoJogador.seguranca =
    Math.max(
      -10,
      Math.min(
        10,
        estadoJogador.seguranca,
      ),
    )

  return impacto
}

// =======================
// LOG
// =======================

function registrarLog(
  escolha,
  impacto,
  origem = 'escolha',
) {
  estadoJogador.log.push({
    ato:
      estadoJogador.atoAtual,

    escolha,
    impacto,
    origem,

    hora:
      new Date()
        .toLocaleTimeString(),
  })

  if (impacto <= -4) {
    estadoJogador
      .errosCriticos
      .push({
        ato:
          estadoJogador.atoAtual,

        erro: escolha,
      })
  }
}

// =======================
// FEEDBACK
// =======================

function mostrarFeedback(
  mensagem,
  impacto,
) {
  if (timeoutFeedback) {
    clearTimeout(
      timeoutFeedback,
    )
  }

  estadoJogador.feedback =
    mensagem ?? ''

  estadoJogador
    .impactoFeedback =
    impacto

  timeoutFeedback =
    setTimeout(() => {
      estadoJogador.feedback = ''
      estadoJogador
        .impactoFeedback = 0
    }, 3200)
}

function ativarGlitch(
  tempo = 700,
) {
  estadoJogador.glitch = true

  if (timeoutGlitch) {
    clearTimeout(
      timeoutGlitch,
    )
  }

  timeoutGlitch =
    setTimeout(() => {
      estadoJogador.glitch =
        false
    }, tempo)
}

function ativarCaos(
  tempo = 3000,
) {
  estadoJogador.caos = true

  if (timeoutCaos) {
    clearTimeout(
      timeoutCaos,
    )
  }

  timeoutCaos =
    setTimeout(() => {
      estadoJogador.caos =
        false
    }, tempo)
}

// =======================
// CONTADOR
// =======================

function pararContador() {
  if (intervaloContador) {
    clearInterval(
      intervaloContador,
    )

    intervaloContador = null
  }

  estadoJogador.contador = null
}

function iniciarContador(
  segundos,
  opcaoTimeout,
) {
  pararContador()

  estadoJogador.contador =
    segundos

  intervaloContador =
    setInterval(() => {
      estadoJogador.contador--

      if (
        estadoJogador.contador <= 0
      ) {
        pararContador()

        void executarEscolha(
          opcaoTimeout,
        )
      }
    }, 1000)
}

// =======================
// EFEITOS
// =======================

function processarAtaqueCliente() {
  const cliente =
    estadoJogador
      .clientesCadastrados
      .at(-1)

  if (!cliente) {
    return
  }

  let impacto = 0

  if (
    cliente.nivel === 'forte'
  ) {
    impacto = 2
  } else if (
    cliente.nivel ===
    'aceitavel'
  ) {
    impacto = -3
  } else {
    impacto = -6
  }

  const aplicado =
    aplicarImpacto(
      impacto,
      false,
    )

  registrarLog(
    'Consequência da senha do cliente',
    aplicado,
    'consequencia',
  )

  if (aplicado < 0) {
    ativarCaos()
    ativarGlitch(1200)
  }
}

function processarImpactoFinal() {
  const quantidade =
    estadoJogador
      .senhasFracasCriadas

  if (quantidade === 0) {
    return
  }

  const impacto =
    Math.max(
      -8,
      quantidade * -4,
    )

  const aplicado =
    aplicarImpacto(
      impacto,
      false,
    )

  registrarLog(
    'Impacto final das credenciais frágeis',
    aplicado,
    'consequencia',
  )

  ativarCaos(3500)
}

function processarEfeitoEntrada(
  cena,
) {
  if (!cena?.efeitoEntrada) {
    return
  }

  const chave =
    `${estadoJogador.atoAtual}:` +
    `${estadoJogador.cenaAtual}:` +
    `${estadoJogador.clientesCadastrados.length}:` +
    `${estadoJogador.senhasVazadas.length}`

  if (
    estadoJogador
      .efeitosExecutados
      .includes(chave)
  ) {
    return
  }

  estadoJogador
    .efeitosExecutados
    .push(chave)

  if (
    cena.efeitoEntrada ===
    'ataque-cliente'
  ) {
    processarAtaqueCliente()
  }

  if (
    cena.efeitoEntrada ===
    'impacto-final'
  ) {
    processarImpactoFinal()
  }

  if (
    cena.efeitoEntrada ===
      'vazamento-interno' &&
    estadoJogador
      .senhasFracasCriadas > 0
  ) {
    ativarCaos(2500)
    ativarGlitch(1000)
  }
}

// =======================
// CENAS
// =======================

function mostrarCena(nomeCena) {
  pararContador()

  estadoJogador.modoSenha =
    null

  estadoJogador.cenaAtual =
    nomeCena

  const cena =
    ATOS[
      estadoJogador.atoAtual
    ]?.cenas?.[nomeCena]

  if (!cena) {
    console.error(
      'Cena não encontrada:',
      estadoJogador.atoAtual,
      nomeCena,
    )

    return
  }

  processarEfeitoEntrada(
    cena,
  )

  if (
    cena.contador &&
    cena.timeout
  ) {
    iniciarContador(
      cena.contador,
      cena.timeout,
    )
  }
}

// =======================
// TRANSIÇÃO
// =======================

function mostrarTransicao(
  numeroAto,
) {
  pararContador()

  estadoJogador.transicao =
    true

  estadoJogador.proximoAto =
    numeroAto
}

function continuarTransicao() {
  const numeroAto =
    estadoJogador.proximoAto

  if (!ATOS[numeroAto]) {
    console.error(
      'Ato não encontrado:',
      numeroAto,
    )

    return
  }

  estadoJogador.atoAtual =
    numeroAto

  estadoJogador.transicao =
    false

  estadoJogador.proximoAto =
    null

  mostrarCena('inicio')
}

// =======================
// ESCOLHAS
// =======================

async function executarEscolha(
  opcao,
) {
  if (
    estadoJogador.bloqueado
  ) {
    return null
  }

  pararContador()

  estadoJogador.bloqueado =
    true

  const impacto =
    aplicarImpacto(
      opcao.impacto ?? 0,
    )

  registrarLog(
    opcao.texto,
    impacto,
  )

  mostrarFeedback(
    opcao.feedback,
    impacto,
  )

  if (impacto < 0) {
    ativarGlitch()
  }

  if (
    opcao.acao ===
    'baixarMemorando'
  ) {
    estadoJogador
      .memorandoBaixado = true
  }

  if (
    opcao.acao ===
    'abrirSenhaColaborador'
  ) {
    estadoJogador.modoSenha =
      'colaborador'

    estadoJogador.bloqueado =
      false

    return null
  }

  if (
    opcao.acao ===
    'abrirSenhaCliente'
  ) {
    estadoJogador.modoSenha =
      'cliente'

    estadoJogador.bloqueado =
      false

    return null
  }

  if (
    opcao.acao ===
    'abrirRelatorio'
  ) {
    gerarRelatorio()

    estadoJogador.bloqueado =
      false

    return 'relatorio'
  }

  await esperar(1400)

  if (opcao.proxima) {
    mostrarCena(
      opcao.proxima,
    )
  }

  if (opcao.proximoAto) {
    mostrarTransicao(
      opcao.proximoAto,
    )
  }

  estadoJogador.bloqueado =
    false

  return null
}

// =======================
// SENHAS
// =======================

function analisarSenha(senha) {
  if (!senha) {
    return {
      valido: false,
      mensagem:
        'Digite uma senha.',
    }
  }

  if (senha.length < 6) {
    return {
      valido: true,
      impacto: -4,
      nivel: 'fraca',
      mensagem:
        'Senha muito curta.',
    }
  }

  let pontos = 0

  if (senha.length >= 8) {
    pontos++
  }

  if (senha.length >= 12) {
    pontos++
  }

  if (/[a-z]/.test(senha)) {
    pontos++
  }

  if (/[A-Z]/.test(senha)) {
    pontos++
  }

  if (/[0-9]/.test(senha)) {
    pontos++
  }

  if (
    /[^a-zA-Z0-9]/.test(senha)
  ) {
    pontos++
  }

  const previsivel =
    /(1234|qwerty|senha|password|admin)/i
      .test(senha)

  if (previsivel) {
    return {
      valido: true,
      impacto: -2,
      nivel: 'fraca',
      mensagem:
        'Senha fraca.',
    }
  }

  if (pontos >= 5) {
    return {
      valido: true,
      impacto: 3,
      nivel: 'forte',
      mensagem:
        'Senha forte.',
    }
  }

  if (pontos >= 3) {
    return {
      valido: true,
      impacto: 0,
      nivel: 'aceitavel',
      mensagem:
        'Senha aceitável.',
    }
  }

  return {
    valido: true,
    impacto: -2,
    nivel: 'fraca',
    mensagem:
      'Senha fraca.',
  }
}

async function confirmarSenha(
  senha,
) {
  const resultado =
    analisarSenha(senha)

  if (!resultado.valido) {
    mostrarFeedback(
      resultado.mensagem,
      -1,
    )

    return {
      ok: false,
      mensagem:
        resultado.mensagem,
    }
  }

  const impacto =
    aplicarImpacto(
      resultado.impacto,
    )

  mostrarFeedback(
    resultado.mensagem,
    impacto,
  )

  if (impacto < 0) {
    ativarGlitch()
  }

  if (
    estadoJogador.modoSenha ===
    'colaborador'
  ) {
    const colaborador =
      estadoJogador
        .colaboradorAtual

    registrarLog(
      `Senha do colaborador ${colaborador}: ${resultado.mensagem}`,
      impacto,
      'senha',
    )

    if (
      resultado.nivel ===
      'fraca'
    ) {
      estadoJogador
        .senhasFracasCriadas++

      estadoJogador
        .senhasVazadas
        .push({
          colaborador,
          nivel:
            resultado.mensagem,

          horario:
            new Date()
              .toLocaleTimeString(),
        })
    }

    estadoJogador
      .colaboradorAtual++

    estadoJogador.modoSenha =
      null

    await esperar(900)

    if (
      estadoJogador
        .colaboradorAtual <= 4
    ) {
      mostrarCena('senha')
    } else {
      mostrarCena('fim')
    }

    return {
      ok: true,
    }
  }

  if (
    estadoJogador.modoSenha ===
    'cliente'
  ) {
    registrarLog(
      `Senha do cliente: ${resultado.mensagem}`,
      impacto,
      'senha',
    )

    estadoJogador
      .clientesCadastrados
      .push({
        nivel:
          resultado.nivel,

        avaliacao:
          resultado.mensagem,

        horario:
          new Date()
            .toLocaleTimeString(),
      })

    estadoJogador.modoSenha =
      null

    await esperar(900)

    mostrarCena('ataque')

    return {
      ok: true,
    }
  }

  return {
    ok: false,
  }
}

// =======================
// RELATÓRIO
// =======================

function gerarRelatorio() {
  const total =
    estadoJogador.log.length

  const seguras =
    estadoJogador.log.filter(
      (item) =>
        item.impacto > 0,
    ).length

  const neutras =
    estadoJogador.log.filter(
      (item) =>
        item.impacto === 0,
    ).length

  const arriscadas =
    estadoJogador.log.filter(
      (item) =>
        item.impacto < 0,
    ).length

  const nota =
    Math.max(
      0,
      Math.min(
        100,
        50 +
          estadoJogador.seguranca *
            5,
      ),
    )

  let perfil =
    'Usuário Desatento'

  if (nota >= 70) {
    perfil =
      'Usuário Consciente'
  }

  if (nota >= 85) {
    perfil =
      'Guardião Digital'
  }

  if (nota >= 95) {
    perfil =
      'Cyber Sentinela'
  }

  let comentario =
    'A segurança depende da próxima decisão.'

  if (
    estadoJogador
      .senhasFracasCriadas > 0
  ) {
    comentario =
      'O impacto real veio de credenciais frágeis criadas anteriormente.'
  } else if (
    estadoJogador
      .errosCriticos.length >= 3
  ) {
    comentario =
      'Você não foi atacado por sistemas. Foi atacado por hábitos repetidos.'
  } else if (
    arriscadas > seguras
  ) {
    comentario =
      'Pressa, curiosidade e confiança excessiva foram exploradas diversas vezes.'
  } else if (
    nota >= 90
  ) {
    comentario =
      'Você antecipou armadilhas antes que elas surgissem.'
  }

  const relatorio = {
    nota,
    perfil,

    rank: obterRank(),

    total,
    seguras,
    neutras,
    arriscadas,

    errosCriticos:
      estadoJogador
        .errosCriticos
        .length,

    senhasVazadas: [
      ...estadoJogador
        .senhasVazadas,
    ],

    comentario,
  }

  estadoJogador.relatorio =
    relatorio

  sessionStorage.setItem(
    RELATORIO_STORAGE,
    JSON.stringify(relatorio),
  )

  return relatorio
}

function obterRelatorio() {
  if (
    estadoJogador.relatorio
  ) {
    return estadoJogador
      .relatorio
  }

  const salvo =
    sessionStorage.getItem(
      RELATORIO_STORAGE,
    )

  if (!salvo) {
    return null
  }

  try {
    return JSON.parse(salvo)
  } catch {
    return null
  }
}

// =======================
// RESET
// =======================

function limparTemporizadores() {
  pararContador()

  if (timeoutFeedback) {
    clearTimeout(
      timeoutFeedback,
    )
  }

  if (timeoutGlitch) {
    clearTimeout(
      timeoutGlitch,
    )
  }

  if (timeoutCaos) {
    clearTimeout(
      timeoutCaos,
    )
  }
}

function reiniciarJogo() {
  limparTemporizadores()

  sessionStorage.removeItem(
    RELATORIO_STORAGE,
  )

  Object.assign(
    estadoJogador,
    criarEstadoInicial(),
  )
}

// =======================
// EXPORT
// =======================

export function useGame() {
  return {
    estadoJogador,

    jogoCarregado,
    carregandoJogo,
    erroCarregamento,

    atoAtual,
    cenaAtual,

    tituloAto,
    textoCena,
    opcoesCena,

    nivelSeguranca,
    classeFeedback,

    obterRank,

    carregarJogo,

    executarEscolha,
    continuarTransicao,

    confirmarSenha,

    gerarRelatorio,
    obterRelatorio,

    reiniciarJogo,
    limparTemporizadores,
  }
}