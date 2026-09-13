<script setup>
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import {
  useRouter,
} from 'vue-router'

import {
  useGame,
} from '../composables/useGame'

const router = useRouter()

const senhaDigitada = ref('')

const {
  estadoJogador,

  tituloAto,
  textoCena,
  opcoesCena,

  nivelSeguranca,
  classeFeedback,

  carregandoJogo,
  erroCarregamento,

  obterRank,

  carregarJogo,

  executarEscolha,
  continuarTransicao,

  confirmarSenha,

  limparTemporizadores,
} = useGame()

async function escolher(opcao) {
  const destino =
    await executarEscolha(opcao)

  if (destino === 'relatorio') {
    router.push('/relatorio')
  }
}

async function enviarSenha() {
  const resultado =
    await confirmarSenha(
      senhaDigitada.value,
    )

  if (resultado?.ok) {
    senhaDigitada.value = ''
  }
}

onMounted(async () => {
  try {
    await carregarJogo()
  } catch (erro) {
    console.error(
      'Erro ao carregar jogo:',
      erro,
    )
  }
})

onBeforeUnmount(() => {
  limparTemporizadores()
})
</script>

<template>
  <main
    class="game-page"
    :class="{
      'caos-total':
        estadoJogador.caos,
    }"
  >
    <div class="background-grid"></div>

    <section class="game-shell">

      <!-- LOADING -->

      <div
        v-if="carregandoJogo"
        class="state-screen"
      >
        <div class="loader"></div>

        <p>
          Carregando simulação...
        </p>
      </div>

      <!-- ERRO -->

      <div
        v-else-if="erroCarregamento"
        class="state-screen"
      >
        <div class="error-icon">
          !
        </div>

        <h2>
          Não foi possível carregar o jogo
        </h2>

        <p>
          {{ erroCarregamento }}
        </p>

        <button
          class="button button-secondary"
          @click="router.push('/')"
        >
          Voltar para Home
        </button>
      </div>

      <!-- GAME -->

      <template v-else>

        <!-- HEADER -->

        <header class="game-header">
          <button
            class="brand"
            @click="router.push('/')"
          >
            <img
              src="/images/logo.png"
              alt=""
            />

            <div>
              <small>
                SEGURANÇA
              </small>

              <strong>
                DIGITAL
              </strong>
            </div>
          </button>

          <div class="header-info">
            <span class="ato-label">
              ATO
              {{ estadoJogador.atoAtual }}
            </span>

            <span class="ato-title">
              {{ tituloAto }}
            </span>
          </div>
        </header>

        <!-- STATUS -->

        <section class="status-card">
          <div class="status-top">
            <div>
              <span class="status-label">
                POSTURA DE SEGURANÇA
              </span>

              <strong class="rank">
                {{ obterRank() }}
              </strong>
            </div>

            <span class="security-number">
              {{ Math.round(nivelSeguranca) }}%
            </span>
          </div>

          <div class="barra-seguranca">
            <div
              class="nivel-seguranca"
              :style="{
                width:
                  `${nivelSeguranca}%`,
              }"
            ></div>
          </div>
        </section>

        <!-- CENA -->

        <section
          v-if="
            !estadoJogador.transicao
          "
          class="scene-card"
        >
          <div class="scene-top">
            <span class="scene-label">
              DECISÃO EM ANDAMENTO
            </span>

            <div
              v-if="
                estadoJogador.contador !== null
              "
              class="contador"
            >
              <span class="contador-dot"></span>

              {{
                estadoJogador.contador
              }}s
            </div>
          </div>

          <p
            class="texto"
            :class="{
              glitch:
                estadoJogador.glitch,
            }"
          >
            {{ textoCena }}
          </p>

          <!-- SENHA -->

          <form
            v-if="
              estadoJogador.modoSenha
            "
            class="senha-card"
            @submit.prevent="
              enviarSenha
            "
          >
            <div class="senha-header">
              <span class="senha-icon">
                🔐
              </span>

              <div>
                <strong>
                  Desafio de senha
                </strong>

                <small>
                  A senha não será armazenada.
                </small>
              </div>
            </div>

            <div class="senha-form">
              <input
                v-model="
                  senhaDigitada
                "
                type="password"
                placeholder="Digite uma senha"
                autocomplete="new-password"
                autofocus
              />

              <button
                class="button button-primary"
                type="submit"
              >
                Confirmar
              </button>
            </div>
          </form>

          <!-- ESCOLHAS -->

          <div
            v-else
            class="botoes"
          >
            <button
              v-for="
                (opcao, index)
                in opcoesCena
              "
              :key="
                opcao.texto
              "
              class="choice"
              :disabled="
                estadoJogador.bloqueado
              "
              @click="
                escolher(opcao)
              "
            >
              <span class="choice-index">
                {{
                  String(index + 1)
                    .padStart(2, '0')
                }}
              </span>

              <span class="choice-text">
                {{ opcao.texto }}
              </span>

              <span class="choice-arrow">
                →
              </span>
            </button>
          </div>

          <!-- FEEDBACK -->

          <div
            v-if="
              estadoJogador.feedback
            "
            class="feedback"
            :class="
              classeFeedback
            "
          >
            <span class="feedback-dot"></span>

            {{
              estadoJogador.feedback
            }}
          </div>
        </section>

        <!-- TRANSIÇÃO -->

        <section
          v-else
          class="transition-card"
        >
          <span class="transition-label">
            NOVO CAPÍTULO
          </span>

          <div class="transition-number">
            {{
              estadoJogador.proximoAto
            }}
          </div>

          <h2>
            ATO
            {{
              estadoJogador.proximoAto
            }}
            DESBLOQUEADO
          </h2>

          <p class="transition-rank">
            {{ obterRank() }}
          </p>

          <div class="transition-message">
            <span>⚠</span>

            <p>
              Ataques exploram decisões
              humanas, não apenas sistemas.
            </p>
          </div>

          <button
            class="button button-primary continue-button"
            @click="
              continuarTransicao
            "
          >
            Continuar

            <span>
              →
            </span>
          </button>
        </section>

        <footer class="game-footer">
          <span>
            JOGAR
          </span>

          <span>•</span>

          <span>
            APRENDER
          </span>

          <span>•</span>

          <span>
            PROTEGER
          </span>
        </footer>

      </template>
    </section>
  </main>
</template>

<style scoped>
.game-page {
  position: relative;

  min-height: 100vh;

  padding:
    28px 24px 20px;

  overflow-x: hidden;

  background:
    radial-gradient(
      circle at 50% -10%,
      rgba(0, 217, 255, 0.12),
      transparent 36rem
    ),
    radial-gradient(
      circle at 0% 60%,
      rgba(50, 245, 204, 0.06),
      transparent 30rem
    ),
    linear-gradient(
      180deg,
      #061426 0%,
      #020812 100%
    );

  color: white;
}

.background-grid {
  position: fixed;

  inset: 0;

  pointer-events: none;

  opacity: 0.12;

  background-image:
    linear-gradient(
      rgba(0, 217, 255, 0.1) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(0, 217, 255, 0.1) 1px,
      transparent 1px
    );

  background-size:
    52px 52px;

  mask-image:
    linear-gradient(
      to bottom,
      black,
      transparent 90%
    );
}

.game-shell {
  position: relative;
  z-index: 1;

  width:
    min(
      860px,
      100%
    );

  margin: 0 auto;
}

/* HEADER */

.game-header {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 24px;

  margin-bottom: 22px;
}

.brand {
  display: flex;

  align-items: center;

  gap: 12px;

  padding: 0;

  border: 0;

  background: transparent;

  color: white;

  cursor: pointer;

  text-align: left;
}

.brand img {
  width: 52px;
  height: 52px;

  object-fit: cover;

  border-radius: 13px;

  box-shadow:
    0 0 25px
    rgba(0, 217, 255, 0.18);
}

.brand small,
.brand strong {
  display: block;
}

.brand small {
  color: #d9f7ff;

  font-size: 0.68rem;

  letter-spacing: 0.16em;
}

.brand strong {
  margin-top: 1px;

  color: #25e8db;

  font-size: 0.9rem;

  letter-spacing: 0.12em;
}

.header-info {
  display: flex;

  align-items: center;

  gap: 10px;
}

.ato-label {
  padding: 7px 10px;

  border:
    1px solid
    rgba(0, 217, 255, 0.2);

  border-radius: 8px;

  background:
    rgba(0, 217, 255, 0.06);

  color: #54efff;

  font-size: 0.7rem;
  font-weight: 800;

  letter-spacing: 0.12em;
}

.ato-title {
  color: #8ba7bd;

  font-size: 0.85rem;
}

/* STATUS */

.status-card {
  margin-bottom: 16px;

  padding: 17px 19px;

  border:
    1px solid
    rgba(124, 202, 255, 0.12);

  border-radius: 17px;

  background:
    rgba(7, 22, 38, 0.75);

  backdrop-filter:
    blur(14px);
}

.status-top {
  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 13px;
}

.status-label {
  display: block;

  margin-bottom: 4px;

  color: #62849d;

  font-size: 0.62rem;
  font-weight: 800;

  letter-spacing: 0.15em;
}

.rank {
  color: #ddecf8;

  font-size: 0.86rem;
}

.security-number {
  color: #42e8db;

  font-size: 0.85rem;
  font-weight: 800;
}

.barra-seguranca {
  width: 100%;
  height: 7px;

  overflow: hidden;

  border-radius: 999px;

  background:
    rgba(255, 255, 255, 0.07);
}

.nivel-seguranca {
  height: 100%;

  border-radius: inherit;

  background:
    linear-gradient(
      90deg,
      #ff586f 0%,
      #ffd45c 48%,
      #28e8b7 100%
    );

  box-shadow:
    0 0 15px
    rgba(40, 232, 183, 0.3);

  transition:
    width 0.45s ease;
}

/* CENA */

.scene-card,
.transition-card {
  position: relative;

  min-height: 430px;

  padding:
    clamp(
      28px,
      5vw,
      46px
    );

  overflow: hidden;

  border:
    1px solid
    rgba(124, 202, 255, 0.14);

  border-radius: 24px;

  background:
    linear-gradient(
      145deg,
      rgba(10, 30, 49, 0.94),
      rgba(3, 13, 25, 0.96)
    );

  box-shadow:
    0 30px 80px
    rgba(0, 0, 0, 0.32);

  backdrop-filter:
    blur(18px);
}

.scene-card::before,
.transition-card::before {
  content: '';

  position: absolute;

  top: 0;
  left: 0;

  width: 160px;
  height: 2px;

  background:
    linear-gradient(
      90deg,
      #00d9ff,
      transparent
    );
}

.scene-top {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 20px;
}

.scene-label,
.transition-label {
  color: #48dfee;

  font-size: 0.66rem;
  font-weight: 800;

  letter-spacing: 0.18em;
}

.contador {
  display: flex;

  align-items: center;

  gap: 7px;

  padding: 7px 11px;

  border:
    1px solid
    rgba(255, 86, 111, 0.3);

  border-radius: 999px;

  background:
    rgba(255, 86, 111, 0.07);

  color: #ff8999;

  font-size: 0.78rem;
  font-weight: 800;
}

.contador-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #ff586f;

  box-shadow:
    0 0 10px
    #ff586f;

  animation:
    pulse 0.8s infinite alternate;
}

.texto {
  max-width: 690px;

  min-height: 120px;

  margin:
    34px 0 34px;

  white-space: pre-line;

  color: #eff8ff;

  font-size:
    clamp(
      1.3rem,
      2.3vw,
      1.7rem
    );

  line-height: 1.55;
}

/* BOTÕES */

.botoes {
  display: grid;

  gap: 11px;
}

.choice {
  display: grid;

  grid-template-columns:
    42px 1fr 30px;

  align-items: center;

  gap: 10px;

  width: 100%;

  min-height: 62px;

  padding:
    11px 15px;

  border:
    1px solid
    rgba(124, 202, 255, 0.12);

  border-radius: 14px;

  background:
    rgba(255, 255, 255, 0.025);

  color: white;

  cursor: pointer;

  text-align: left;

  transition:
    transform 0.16s ease,
    border-color 0.16s ease,
    background 0.16s ease;
}

.choice:hover:not(:disabled) {
  transform:
    translateX(4px);

  border-color:
    rgba(0, 229, 255, 0.35);

  background:
    rgba(0, 217, 255, 0.055);
}

.choice:disabled {
  cursor: not-allowed;

  opacity: 0.45;
}

.choice-index {
  display: grid;

  width: 34px;
  height: 34px;

  place-items: center;

  border:
    1px solid
    rgba(0, 217, 255, 0.14);

  border-radius: 9px;

  color: #43dfea;

  font-size: 0.68rem;
  font-weight: 800;
}

.choice-text {
  color: #dcebf7;

  font-size: 0.95rem;
}

.choice-arrow {
  color: #35ead5;

  font-size: 1.15rem;

  text-align: right;
}

/* FEEDBACK */

.feedback {
  display: flex;

  align-items: center;

  gap: 9px;

  margin-top: 18px;

  padding: 11px 13px;

  border-radius: 11px;

  font-size: 0.82rem;
}

.feedback-dot {
  flex: 0 0 auto;

  width: 7px;
  height: 7px;

  border-radius: 50%;
}

.feedback-positivo {
  border:
    1px solid
    rgba(50, 245, 204, 0.18);

  background:
    rgba(50, 245, 204, 0.06);

  color: #8ef8df;
}

.feedback-positivo
.feedback-dot {
  background: #32f5cc;
}

.feedback-negativo {
  border:
    1px solid
    rgba(255, 88, 111, 0.2);

  background:
    rgba(255, 88, 111, 0.06);

  color: #ffabb6;
}

.feedback-negativo
.feedback-dot {
  background: #ff586f;
}

.feedback-neutro {
  border:
    1px solid
    rgba(0, 217, 255, 0.18);

  background:
    rgba(0, 217, 255, 0.05);

  color: #84effa;
}

.feedback-neutro
.feedback-dot {
  background: #00d9ff;
}

/* SENHA */

.senha-card {
  display: grid;

  gap: 18px;

  padding: 20px;

  border:
    1px solid
    rgba(50, 245, 204, 0.16);

  border-radius: 16px;

  background:
    rgba(50, 245, 204, 0.035);
}

.senha-header {
  display: flex;

  align-items: center;

  gap: 12px;
}

.senha-icon {
  display: grid;

  width: 42px;
  height: 42px;

  place-items: center;

  border:
    1px solid
    rgba(50, 245, 204, 0.16);

  border-radius: 11px;

  background:
    rgba(50, 245, 204, 0.06);
}

.senha-header strong,
.senha-header small {
  display: block;
}

.senha-header strong {
  color: #e8f7ff;

  font-size: 0.9rem;
}

.senha-header small {
  margin-top: 3px;

  color: #718ca1;

  font-size: 0.72rem;
}

.senha-form {
  display: flex;

  gap: 10px;
}

.senha-form input {
  flex: 1;

  min-width: 0;
  min-height: 50px;

  padding:
    0 15px;

  border:
    1px solid
    rgba(124, 202, 255, 0.18);

  border-radius: 12px;

  outline: none;

  background:
    rgba(2, 9, 18, 0.75);

  color: white;
}

.senha-form input:focus {
  border-color:
    rgba(0, 217, 255, 0.55);

  box-shadow:
    0 0 0 3px
    rgba(0, 217, 255, 0.07);
}

/* BUTTONS */

.button {
  min-height: 50px;

  padding:
    0 21px;

  border-radius: 12px;

  font-weight: 800;

  cursor: pointer;

  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease;
}

.button-primary {
  border: none;

  background:
    linear-gradient(
      135deg,
      #00d9ff,
      #32f5cc
    );

  color: #03131b;

  box-shadow:
    0 10px 25px
    rgba(0, 217, 255, 0.16);
}

.button-primary:hover {
  transform:
    translateY(-2px);

  box-shadow:
    0 15px 30px
    rgba(0, 217, 255, 0.26);
}

.button-secondary {
  border:
    1px solid
    rgba(124, 202, 255, 0.2);

  background:
    rgba(255, 255, 255, 0.04);

  color: white;
}

/* TRANSIÇÃO */

.transition-card {
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;
}

.transition-number {
  margin:
    18px 0 0;

  background:
    linear-gradient(
      135deg,
      #00d9ff,
      #32f5cc
    );

  background-clip: text;

  -webkit-background-clip:
    text;

  color: transparent;

  font-size:
    clamp(
      5rem,
      13vw,
      8rem
    );

  font-weight: 900;

  line-height: 1;
}

.transition-card h2 {
  margin:
    10px 0 12px;

  color: white;

  font-size:
    clamp(
      1.6rem,
      3vw,
      2.4rem
    );
}

.transition-rank {
  margin:
    0 0 24px;

  color: #8ba7bd;
}

.transition-message {
  display: flex;

  align-items: center;

  gap: 11px;

  max-width: 460px;

  margin-bottom: 27px;

  padding:
    12px 15px;

  border:
    1px solid
    rgba(255, 211, 92, 0.16);

  border-radius: 12px;

  background:
    rgba(255, 211, 92, 0.04);

  color: #d9c987;

  text-align: left;
}

.transition-message p {
  margin: 0;

  font-size: 0.82rem;

  line-height: 1.5;
}

.continue-button {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 40px;

  min-width: 210px;
}

/* FOOTER */

.game-footer {
  display: flex;

  justify-content: center;

  gap: 10px;

  margin-top: 18px;

  color: #425f75;

  font-size: 0.62rem;

  letter-spacing: 0.14em;
}

/* ESTADOS */

.state-screen {
  min-height: 500px;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 16px;

  padding: 30px;

  text-align: center;
}

.state-screen p {
  color: #7892a6;
}

.loader {
  width: 34px;
  height: 34px;

  border:
    3px solid
    rgba(0, 217, 255, 0.12);

  border-top-color:
    #00d9ff;

  border-radius: 50%;

  animation:
    spin 0.7s linear infinite;
}

.error-icon {
  display: grid;

  width: 52px;
  height: 52px;

  place-items: center;

  border:
    1px solid
    rgba(255, 88, 111, 0.2);

  border-radius: 50%;

  background:
    rgba(255, 88, 111, 0.07);

  color: #ff7184;

  font-size: 1.5rem;
  font-weight: 900;
}

/* EFEITOS */

.glitch {
  animation:
    glitch 0.18s linear 4;
}

.caos-total {
  animation:
    caos 0.12s linear 12;
}

@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}

@keyframes pulse {
  from {
    opacity: 0.45;
  }

  to {
    opacity: 1;
  }
}

@keyframes glitch {
  0% {
    transform:
      translate(0);
  }

  25% {
    transform:
      translate(-3px, 1px);
  }

  50% {
    transform:
      translate(3px, -1px);
  }

  75% {
    transform:
      translate(-2px, 2px);
  }

  100% {
    transform:
      translate(0);
  }
}

@keyframes caos {
  0% {
    transform:
      translate(0);
  }

  50% {
    transform:
      translate(3px, -3px);
  }

  100% {
    transform:
      translate(0);
  }
}

/* RESPONSIVO */

@media (
  max-width: 700px
) {
  .game-page {
    padding:
      18px 14px;
  }

  .game-header {
    align-items:
      flex-start;

    flex-direction: column;

    gap: 15px;
  }

  .header-info {
    width: 100%;

    justify-content:
      space-between;
  }

  .scene-card,
  .transition-card {
    min-height: 440px;

    padding: 25px 20px;
  }

  .texto {
    margin:
      28px 0;

    font-size: 1.2rem;
  }

  .senha-form {
    flex-direction: column;
  }

  .senha-form .button {
    width: 100%;
  }
}

@media (
  max-width: 450px
) {
  .brand img {
    width: 44px;
    height: 44px;
  }

  .brand div {
    display: none;
  }

  .status-top {
    flex-direction: column;

    gap: 8px;
  }

  .choice {
    grid-template-columns:
      36px 1fr 20px;

    padding:
      10px 12px;
  }

  .scene-top {
    align-items:
      flex-start;

    flex-direction: column;
  }
}

@media (
  prefers-reduced-motion:
    reduce
) {
  *,
  *::before,
  *::after {
    animation-duration:
      0.01ms !important;

    animation-iteration-count:
      1 !important;

    transition-duration:
      0.01ms !important;
  }
}
</style>