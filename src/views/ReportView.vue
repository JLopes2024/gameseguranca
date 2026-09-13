<script setup>
import {
  computed,
  ref,
} from 'vue'

import {
  useRouter,
} from 'vue-router'

import {
  useGame,
} from '../composables/useGame'

const router = useRouter()

const {
  obterRelatorio,
  reiniciarJogo,
} = useGame()

const relatorio = ref(
  obterRelatorio(),
)

const notaClass = computed(() => {
  const nota =
    relatorio.value?.nota ?? 0

  if (nota >= 85) {
    return 'nota-alta'
  }

  if (nota >= 60) {
    return 'nota-media'
  }

  return 'nota-baixa'
})

function jogarNovamente() {
  reiniciarJogo()

  router.push('/game')
}

function voltarHome() {
  router.push('/')
}
</script>

<template>
  <main class="report-page">
    <div class="background-grid"></div>

    <section class="report-shell">

      <!-- SEM RELATÓRIO -->

      <div
        v-if="!relatorio"
        class="empty-state"
      >
        <img
          src="/images/logo.png"
          alt="Segurança Digital"
        />

        <span class="eyebrow">
          RELATÓRIO FINAL
        </span>

        <h1>
          Nenhum resultado disponível
        </h1>

        <p>
          Termine uma simulação para
          gerar seu relatório de segurança.
        </p>

        <button
          class="button button-primary"
          @click="voltarHome"
        >
          Voltar para Home
        </button>
      </div>

      <!-- RELATÓRIO -->

      <template v-else>

        <!-- HEADER -->

        <header class="report-header">
          <button
            class="brand"
            @click="voltarHome"
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

          <span class="report-badge">
            SIMULAÇÃO CONCLUÍDA
          </span>
        </header>

        <!-- INTRO -->

        <section class="report-intro">
          <div>
            <span class="eyebrow">
              RELATÓRIO FINAL
            </span>

            <h1>
              Seu comportamento
              <span>digital.</span>
            </h1>

            <p>
              Veja como suas decisões
              impactaram sua postura de
              segurança durante a simulação.
            </p>
          </div>

          <div
            class="score-card"
            :class="notaClass"
          >
            <span class="score-label">
              NOTA FINAL
            </span>

            <div class="score-value">
              <strong>
                {{ relatorio.nota }}
              </strong>

              <span>
                /100
              </span>
            </div>

            <p>
              {{ relatorio.perfil }}
            </p>
          </div>
        </section>

        <!-- STATUS -->

        <section class="status-final">
          <div>
            <span class="status-label">
              STATUS FINAL
            </span>

            <strong>
              {{ relatorio.rank }}
            </strong>
          </div>

          <div class="status-line">
            <div
              class="status-progress"
              :style="{
                width:
                  `${relatorio.nota}%`,
              }"
            ></div>
          </div>
        </section>

        <!-- MÉTRICAS -->

        <section class="metricas">
          <article
            class="metric-card segura"
          >
            <span class="metric-icon">
              ✓
            </span>

            <div>
              <span>
                Decisões seguras
              </span>

              <strong>
                {{ relatorio.seguras }}
              </strong>
            </div>
          </article>

          <article
            class="metric-card neutra"
          >
            <span class="metric-icon">
              =
            </span>

            <div>
              <span>
                Decisões neutras
              </span>

              <strong>
                {{ relatorio.neutras }}
              </strong>
            </div>
          </article>

          <article
            class="metric-card arriscada"
          >
            <span class="metric-icon">
              !
            </span>

            <div>
              <span>
                Decisões arriscadas
              </span>

              <strong>
                {{ relatorio.arriscadas }}
              </strong>
            </div>
          </article>

          <article
            class="metric-card critica"
          >
            <span class="metric-icon">
              ×
            </span>

            <div>
              <span>
                Erros críticos
              </span>

              <strong>
                {{ relatorio.errosCriticos }}
              </strong>
            </div>
          </article>
        </section>

        <!-- ANÁLISE -->

        <section class="analysis-card">
          <div class="analysis-header">
            <span class="analysis-icon">
              ◉
            </span>

            <div>
              <span class="eyebrow">
                ANÁLISE COMPORTAMENTAL
              </span>

              <h2>
                O que suas decisões mostram
              </h2>
            </div>
          </div>

          <p>
            {{ relatorio.comentario }}
          </p>
        </section>

        <!-- VAZAMENTOS -->

        <section
          v-if="
            relatorio.senhasVazadas.length
          "
          class="incident-card"
        >
          <div class="incident-header">
            <span class="incident-icon">
              !
            </span>

            <div>
              <span class="eyebrow">
                INCIDENTE DETECTADO
              </span>

              <h2>
                Credenciais comprometidas
              </h2>
            </div>
          </div>

          <div class="incident-list">
            <article
              v-for="
                senha in
                relatorio.senhasVazadas
              "
              :key="
                `${senha.colaborador}-${senha.horario}`
              "
            >
              <div>
                <strong>
                  Colaborador
                  {{ senha.colaborador }}
                </strong>

                <span>
                  {{ senha.nivel }}
                </span>
              </div>

              <small>
                {{ senha.horario }}
              </small>
            </article>
          </div>
        </section>

        <!-- SEM VAZAMENTO -->

        <section
          v-else
          class="safe-card"
        >
          <span class="safe-icon">
            ✓
          </span>

          <div>
            <span class="eyebrow">
              CREDENCIAIS
            </span>

            <h2>
              Nenhuma credencial comprometida
            </h2>

            <p>
              As senhas criadas durante a
              simulação não geraram vazamentos.
            </p>
          </div>
        </section>

        <!-- AÇÕES -->

        <div class="report-actions">
          <button
            class="button button-primary"
            @click="jogarNovamente"
          >
            Jogar novamente

            <span>
              ↻
            </span>
          </button>

          <button
            class="button button-secondary"
            @click="voltarHome"
          >
            Voltar para Home
          </button>
        </div>

        <footer class="report-footer">
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
.report-page {
  position: relative;

  min-height: 100vh;

  padding:
    28px 24px 24px;

  background:
    radial-gradient(
      circle at 50% -10%,
      rgba(0, 217, 255, 0.12),
      transparent 38rem
    ),
    radial-gradient(
      circle at 100% 70%,
      rgba(50, 245, 204, 0.06),
      transparent 34rem
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

.report-shell {
  position: relative;
  z-index: 1;

  width:
    min(
      1000px,
      100%
    );

  margin: 0 auto;
}

/* HEADER */

.report-header {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 42px;
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

.report-badge {
  padding:
    8px 12px;

  border:
    1px solid
    rgba(50, 245, 204, 0.2);

  border-radius: 999px;

  background:
    rgba(50, 245, 204, 0.05);

  color: #65edd6;

  font-size: 0.65rem;
  font-weight: 800;

  letter-spacing: 0.14em;
}

/* INTRO */

.report-intro {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    260px;

  gap: 40px;

  align-items: center;

  margin-bottom: 24px;
}

.eyebrow {
  display: block;

  margin-bottom: 10px;

  color: #47e1ef;

  font-size: 0.65rem;
  font-weight: 800;

  letter-spacing: 0.17em;
}

.report-intro h1 {
  margin:
    0 0 18px;

  font-size:
    clamp(
      2.7rem,
      6vw,
      5rem
    );

  line-height: 0.98;

  letter-spacing: -0.045em;
}

.report-intro h1 span {
  display: block;

  margin-top: 6px;

  background:
    linear-gradient(
      90deg,
      #00d9ff,
      #32f5cc
    );

  -webkit-background-clip:
    text;

  background-clip: text;

  color: transparent;
}

.report-intro > div > p {
  max-width: 570px;

  margin: 0;

  color: #8ba7bd;

  line-height: 1.7;
}

/* SCORE */

.score-card {
  padding:
    24px;

  border:
    1px solid
    rgba(124, 202, 255, 0.14);

  border-radius: 22px;

  background:
    linear-gradient(
      145deg,
      rgba(10, 30, 49, 0.95),
      rgba(3, 13, 25, 0.96)
    );

  box-shadow:
    0 25px 60px
    rgba(0, 0, 0, 0.25);
}

.score-label {
  color: #68879e;

  font-size: 0.62rem;
  font-weight: 800;

  letter-spacing: 0.15em;
}

.score-value {
  display: flex;

  align-items: baseline;

  gap: 5px;

  margin:
    8px 0 4px;
}

.score-value strong {
  font-size: 4rem;

  line-height: 1;
}

.score-value span {
  color: #718ca1;

  font-size: 1rem;
}

.score-card p {
  margin: 0;

  color: #a8c1d4;

  font-size: 0.85rem;
}

.score-card.nota-alta
.score-value strong {
  color: #32f5cc;
}

.score-card.nota-media
.score-value strong {
  color: #ffd45c;
}

.score-card.nota-baixa
.score-value strong {
  color: #ff677c;
}

/* STATUS */

.status-final {
  margin-bottom: 18px;

  padding:
    18px 20px;

  border:
    1px solid
    rgba(124, 202, 255, 0.12);

  border-radius: 17px;

  background:
    rgba(7, 22, 38, 0.75);
}

.status-final > div:first-child {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 16px;

  margin-bottom: 13px;
}

.status-label {
  color: #66859d;

  font-size: 0.62rem;
  font-weight: 800;

  letter-spacing: 0.15em;
}

.status-final strong {
  color: #dcebf7;

  font-size: 0.88rem;
}

.status-line {
  height: 7px;

  overflow: hidden;

  border-radius: 999px;

  background:
    rgba(255, 255, 255, 0.07);
}

.status-progress {
  height: 100%;

  border-radius: inherit;

  background:
    linear-gradient(
      90deg,
      #ff586f,
      #ffd45c,
      #32f5cc
    );
}

/* MÉTRICAS */

.metricas {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 12px;

  margin-bottom: 18px;
}

.metric-card {
  display: flex;

  align-items: center;

  gap: 14px;

  padding: 18px;

  border:
    1px solid
    rgba(124, 202, 255, 0.11);

  border-radius: 16px;

  background:
    rgba(255, 255, 255, 0.025);
}

.metric-icon {
  display: grid;

  flex: 0 0 auto;

  width: 38px;
  height: 38px;

  place-items: center;

  border-radius: 10px;

  font-weight: 900;
}

.metric-card span:not(
  .metric-icon
) {
  display: block;

  color: #748fa4;

  font-size: 0.72rem;
}

.metric-card strong {
  display: block;

  margin-top: 4px;

  color: white;

  font-size: 1.5rem;
}

.segura .metric-icon {
  background:
    rgba(50, 245, 204, 0.08);

  color: #32f5cc;
}

.neutra .metric-icon {
  background:
    rgba(0, 217, 255, 0.08);

  color: #00d9ff;
}

.arriscada .metric-icon {
  background:
    rgba(255, 212, 92, 0.08);

  color: #ffd45c;
}

.critica .metric-icon {
  background:
    rgba(255, 88, 111, 0.08);

  color: #ff667a;
}

/* ANÁLISE */

.analysis-card,
.incident-card,
.safe-card {
  margin-bottom: 18px;

  padding:
    23px;

  border:
    1px solid
    rgba(124, 202, 255, 0.12);

  border-radius: 18px;

  background:
    linear-gradient(
      145deg,
      rgba(9, 27, 45, 0.9),
      rgba(4, 14, 26, 0.92)
    );
}

.analysis-header,
.incident-header {
  display: flex;

  align-items: center;

  gap: 14px;

  margin-bottom: 18px;
}

.analysis-icon,
.incident-icon,
.safe-icon {
  display: grid;

  flex: 0 0 auto;

  width: 44px;
  height: 44px;

  place-items: center;

  border-radius: 12px;
}

.analysis-icon {
  background:
    rgba(0, 217, 255, 0.07);

  color: #00d9ff;
}

.analysis-header h2,
.incident-header h2,
.safe-card h2 {
  margin: 0;

  color: #edf7ff;

  font-size: 1.15rem;
}

.analysis-card > p {
  margin: 0;

  color: #9eb5c7;

  line-height: 1.75;
}

/* INCIDENTE */

.incident-card {
  border-color:
    rgba(255, 88, 111, 0.16);

  background:
    linear-gradient(
      145deg,
      rgba(38, 17, 26, 0.65),
      rgba(12, 10, 18, 0.9)
    );
}

.incident-icon {
  background:
    rgba(255, 88, 111, 0.08);

  color: #ff667a;

  font-weight: 900;
}

.incident-list {
  display: grid;

  gap: 10px;
}

.incident-list article {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 18px;

  padding:
    13px 15px;

  border-left:
    3px solid
    #ff586f;

  border-radius:
    0 10px 10px 0;

  background:
    rgba(255, 88, 111, 0.04);
}

.incident-list strong,
.incident-list span {
  display: block;
}

.incident-list strong {
  color: #f5dce0;

  font-size: 0.86rem;
}

.incident-list span {
  margin-top: 3px;

  color: #b98c94;

  font-size: 0.75rem;
}

.incident-list small {
  color: #80626a;

  font-size: 0.7rem;
}

/* SAFE */

.safe-card {
  display: flex;

  align-items: center;

  gap: 17px;

  border-color:
    rgba(50, 245, 204, 0.14);

  background:
    rgba(50, 245, 204, 0.035);
}

.safe-icon {
  background:
    rgba(50, 245, 204, 0.08);

  color: #32f5cc;

  font-size: 1.2rem;
  font-weight: 900;
}

.safe-card p {
  margin:
    7px 0 0;

  color: #7897a9;

  font-size: 0.84rem;
}

/* AÇÕES */

.report-actions {
  display: flex;

  gap: 12px;

  margin-top: 26px;
}

.button {
  min-height: 52px;

  padding:
    0 22px;

  border-radius: 12px;

  cursor: pointer;

  font-weight: 800;

  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease;
}

.button-primary {
  display: inline-flex;

  align-items: center;
  justify-content: space-between;

  gap: 24px;

  min-width: 200px;

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
    rgba(124, 202, 255, 0.18);

  background:
    rgba(255, 255, 255, 0.035);

  color: #dcebf7;
}

/* EMPTY */

.empty-state {
  min-height:
    calc(100vh - 52px);

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;
}

.empty-state img {
  width: 150px;

  margin-bottom: 28px;

  border-radius: 22px;
}

.empty-state h1 {
  margin:
    0 0 12px;

  font-size:
    clamp(
      2rem,
      5vw,
      3.5rem
    );
}

.empty-state p {
  max-width: 440px;

  margin:
    0 0 26px;

  color: #819caf;

  line-height: 1.6;
}

/* FOOTER */

.report-footer {
  display: flex;

  justify-content: center;

  gap: 10px;

  margin-top: 24px;

  padding-bottom: 10px;

  color: #425f75;

  font-size: 0.62rem;

  letter-spacing: 0.14em;
}

/* RESPONSIVO */

@media (
  max-width: 820px
) {
  .report-intro {
    grid-template-columns: 1fr;
  }

  .score-card {
    max-width: 320px;
  }

  .metricas {
    grid-template-columns:
      repeat(2, 1fr);
  }
}

@media (
  max-width: 560px
) {
  .report-page {
    padding:
      18px 14px;
  }

  .report-header {
    align-items:
      flex-start;

    flex-direction: column;
  }

  .brand div {
    display: none;
  }

  .metricas {
    grid-template-columns: 1fr;
  }

  .status-final > div:first-child {
    align-items:
      flex-start;

    flex-direction: column;
  }

  .incident-list article {
    align-items:
      flex-start;

    flex-direction: column;
  }

  .safe-card {
    align-items:
      flex-start;
  }

  .report-actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }

  .report-footer {
    flex-wrap: wrap;
  }
}
</style>