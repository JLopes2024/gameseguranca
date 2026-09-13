<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useGame } from '../composables/useGame'

const router = useRouter()

const {
  obterRelatorio,
  reiniciarJogo,
} = useGame()

const relatorio = ref(
  obterRelatorio(),
)

function jogarNovamente() {
  reiniciarJogo()

  router.push('/game')
}

function voltarHome() {
  router.push('/')
}
</script>

<template>
  <main class="relatorio">
    <template v-if="relatorio">
      <header>
        <small>
          RESULTADO
        </small>

        <h1>
          Relatório Final
        </h1>

        <p class="perfil">
          {{ relatorio.perfil }}
        </p>
      </header>

      <section class="nota">
        <strong>
          {{ relatorio.nota }}
        </strong>

        <span>
          /100
        </span>
      </section>

      <p class="rank">
        {{ relatorio.rank }}
      </p>

      <section class="metricas">
        <article>
          <span>
            Decisões seguras
          </span>

          <strong>
            {{ relatorio.seguras }}
          </strong>
        </article>

        <article>
          <span>
            Decisões neutras
          </span>

          <strong>
            {{ relatorio.neutras }}
          </strong>
        </article>

        <article>
          <span>
            Decisões arriscadas
          </span>

          <strong>
            {{ relatorio.arriscadas }}
          </strong>
        </article>

        <article>
          <span>
            Erros críticos
          </span>

          <strong>
            {{ relatorio.errosCriticos }}
          </strong>
        </article>
      </section>

      <section
        v-if="
          relatorio.senhasVazadas.length
        "
        class="vazamentos"
      >
        <h2>
          Credenciais comprometidas
        </h2>

        <ul>
          <li
            v-for="senha in relatorio.senhasVazadas"
            :key="
              `${senha.colaborador}-${senha.horario}`
            "
          >
            Colaborador
            {{ senha.colaborador }}

            —

            {{ senha.nivel }}
          </li>
        </ul>
      </section>

      <section class="comentario">
        <h2>
          Análise
        </h2>

        <p>
          {{ relatorio.comentario }}
        </p>
      </section>

      <div class="acoes">
        <button
          @click="jogarNovamente"
        >
          Jogar novamente
        </button>

        <button
          @click="voltarHome"
        >
          Voltar para Home
        </button>
      </div>
    </template>

    <template v-else>
      <h1>
        Nenhum relatório disponível
      </h1>

      <p>
        Termine uma partida para
        gerar os resultados.
      </p>

      <button
        @click="voltarHome"
      >
        Voltar
      </button>
    </template>
  </main>
</template>

<style scoped>
.relatorio {
  width: min(
    760px,
    calc(100% - 32px)
  );

  margin: 60px auto;
}

header {
  margin-bottom: 30px;
}

header small {
  color: #888;
}

header h1 {
  margin-bottom: 8px;

  font-size: 2.5rem;
}

.perfil {
  color: #aaa;
}

.nota {
  display: flex;

  align-items: baseline;

  gap: 5px;

  margin-bottom: 10px;
}

.nota strong {
  font-size: 4rem;
}

.nota span {
  color: #888;
}

.rank {
  margin-bottom: 30px;
}

.metricas {
  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 12px;

  margin-bottom: 30px;
}

.metricas article {
  padding: 20px;

  border: 1px solid #444;
  border-radius: 12px;

  background: #1a1a1a;
}

.metricas span {
  display: block;

  margin-bottom: 10px;

  color: #aaa;
}

.metricas strong {
  font-size: 2rem;
}

.vazamentos,
.comentario {
  margin-bottom: 30px;

  padding: 20px;

  border: 1px solid #444;
  border-radius: 12px;
}

.vazamentos li {
  margin-bottom: 8px;
}

.acoes {
  display: flex;

  gap: 12px;
}

button {
  padding: 14px 20px;

  cursor: pointer;

  border: 1px solid #777;
  border-radius: 10px;

  background: #222;
  color: white;
}

@media (
  max-width: 520px
) {
  .metricas {
    grid-template-columns: 1fr;
  }

  .acoes {
    flex-direction: column;
  }
}
</style>