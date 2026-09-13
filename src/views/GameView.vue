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
    await executarEscolha(
      opcao,
    )

  if (
    destino === 'relatorio'
  ) {
    router.push(
      '/relatorio',
    )
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
    <section class="game">

      <div
        v-if="carregandoJogo"
        class="estado-carregamento"
      >
        Carregando jogo...
      </div>

      <div
        v-else-if="erroCarregamento"
        class="estado-erro"
      >
        <p>
          {{ erroCarregamento }}
        </p>

        <button
          @click="router.push('/')"
        >
          Voltar
        </button>
      </div>

      <template v-else>

        <header
          class="cabecalho-game"
        >
          <div>
            <small>
              ATO
              {{
                estadoJogador
                  .atoAtual
              }}
            </small>

            <h1>
              {{ tituloAto }}
            </h1>
          </div>

          <span class="rank">
            {{ obterRank() }}
          </span>
        </header>

        <div
          class="barra-seguranca"
        >
          <div
            class="nivel-seguranca"
            :style="{
              width:
                `${nivelSeguranca}%`,
            }"
          ></div>
        </div>

        <template
          v-if="
            !estadoJogador
              .transicao
          "
        >
          <div
            v-if="
              estadoJogador
                .contador !== null
            "
            class="contador"
          >
            ⏱️
            {{
              estadoJogador
                .contador
            }}s
          </div>

          <p
            class="texto"
            :class="{
              glitch:
                estadoJogador
                  .glitch,
            }"
          >
            {{ textoCena }}
          </p>

          <form
            v-if="
              estadoJogador
                .modoSenha
            "
            class="senha-box"
            @submit.prevent="
              enviarSenha
            "
          >
            <input
              v-model="
                senhaDigitada
              "
              type="password"
              placeholder="Digite a senha"
              autocomplete="new-password"
              autofocus
            />

            <button
              type="submit"
            >
              Confirmar
            </button>
          </form>

          <div
            v-else
            class="botoes"
          >
            <button
              v-for="
                opcao in
                opcoesCena
              "
              :key="
                opcao.texto
              "
              :disabled="
                estadoJogador
                  .bloqueado
              "
              @click="
                escolher(opcao)
              "
            >
              {{ opcao.texto }}
            </button>
          </div>

          <p
            class="feedback"
            :class="
              classeFeedback
            "
          >
            {{
              estadoJogador
                .feedback
            }}
          </p>
        </template>

        <template v-else>
          <section
            class="transicao"
          >
            <small>
              NOVO CAPÍTULO
            </small>

            <h2>
              ATO
              {{
                estadoJogador
                  .proximoAto
              }}
            </h2>

            <p>
              {{ obterRank() }}
            </p>

            <p>
              ⚠️ Ataques exploram
              decisões humanas, não
              apenas sistemas.
            </p>

            <button
              @click="
                continuarTransicao
              "
            >
              Continuar
            </button>
          </section>
        </template>

      </template>
    </section>
  </main>
</template>

<style scoped>
.game-page {
  min-height: 100vh;

  padding: 40px 16px;
}

.game {
  width: min(
    560px,
    100%
  );

  margin: 0 auto;
}

.estado-carregamento,
.estado-erro {
  padding: 60px 20px;

  text-align: center;
}

.estado-carregamento {
  color: #aaa;
}

.estado-erro {
  color: #ef4444;
}

.cabecalho-game {
  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 24px;
}

.cabecalho-game small {
  color: #888;
}

.cabecalho-game h1 {
  margin: 4px 0 0;
}

.rank {
  max-width: 200px;

  text-align: right;

  font-size: 0.85rem;
}

.barra-seguranca {
  width: 100%;
  height: 10px;

  margin-bottom: 30px;

  overflow: hidden;

  border-radius: 10px;

  background: #2c2c2c;
}

.nivel-seguranca {
  height: 100%;

  background: linear-gradient(
    90deg,
    #ef4444,
    #facc15,
    #22c55e
  );

  transition:
    width 0.4s ease;
}

.contador {
  width: fit-content;

  margin: 0 auto 20px;

  padding: 8px 14px;

  border:
    1px solid #ef4444;

  border-radius: 999px;

  color: #ef4444;

  font-weight: bold;
}

.texto {
  min-height: 120px;

  text-align: center;

  white-space: pre-line;

  font-size: 1.1rem;
  line-height: 1.65;
}

.botoes {
  display: flex;
  flex-direction: column;

  gap: 12px;

  margin-top: 24px;
}

button {
  width: 100%;

  padding: 14px 18px;

  cursor: pointer;

  border: 1px solid #777;
  border-radius: 10px;

  background: #222;
  color: white;

  transition: 0.15s;
}

button:hover:not(:disabled) {
  background: #333;

  transform:
    translateY(-1px);
}

button:disabled {
  cursor: not-allowed;

  opacity: 0.45;
}

.feedback {
  min-height: 24px;

  margin-top: 20px;

  text-align: center;
}

.feedback-positivo {
  color: #22c55e;
}

.feedback-negativo {
  color: #ef4444;
}

.feedback-neutro {
  color: #facc15;
}

.senha-box {
  display: flex;

  gap: 10px;

  margin-top: 24px;
}

.senha-box input {
  flex: 1;

  min-width: 0;

  padding: 14px;

  border: 1px solid #777;
  border-radius: 10px;

  background: #151515;
  color: white;
}

.senha-box button {
  width: auto;
}

.transicao {
  padding: 40px 20px;

  text-align: center;
}

.transicao small {
  color: #888;
}

.transicao h2 {
  margin: 12px 0;

  font-size: 2.5rem;
}

.glitch {
  animation:
    glitch 0.18s linear 4;
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

.caos-total {
  animation:
    caos 0.12s linear 12;
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

@media (
  max-width: 520px
) {
  .cabecalho-game {
    flex-direction: column;
  }

  .rank {
    text-align: left;
  }

  .senha-box {
    flex-direction: column;
  }

  .senha-box button {
    width: 100%;
  }
}
</style>