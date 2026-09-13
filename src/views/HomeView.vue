<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGame } from '../composables/useGame'

const router = useRouter()

const {
  reiniciarJogo,
  carregarJogo,
  carregandoJogo,
  erroCarregamento,
} = useGame()

onMounted(async () => {
  try {
    await carregarJogo()
  } catch {
    // erro exibido na tela
  }
})

async function iniciarJogo() {
  try {
    await carregarJogo()
    reiniciarJogo()
    router.push('/game')
  } catch {
    // erro exibido na tela
  }
}
</script>

<template>
  <main class="home-page">
    <div class="background-grid"></div>

    <section class="hero">
      <div class="hero-logo">
        <img
          src="/images/logo.png"
          alt="Segurança Digital"
        />
      </div>

      <div class="hero-content">
        <span class="tag">
          SIMULAÇÃO INTERATIVA
        </span>

        <h1>
          Segurança começa
          <span>nas suas decisões.</span>
        </h1>

        <p class="descricao">
          Você consegue reconhecer um golpe antes que seja tarde?
        </p>

        <p class="descricao-secundaria">
          Enfrente situações inspiradas no dia a dia corporativo, tome decisões
          e descubra como pequenos hábitos podem proteger — ou comprometer —
          informações.
        </p>

        <div class="acoes">
          <button
            class="btn-iniciar"
            :disabled="carregandoJogo"
            @click="iniciarJogo"
          >
            <span>
              {{ carregandoJogo ? 'Carregando...' : 'Iniciar simulação' }}
            </span>

            <span
              v-if="!carregandoJogo"
              class="seta"
            >
              →
            </span>
          </button>
        </div>

        <p
          v-if="erroCarregamento"
          class="erro"
        >
          {{ erroCarregamento }}
        </p>

        <div class="destaques">
          <div class="destaque">
            <strong>10+</strong>
            <span>situações</span>
          </div>

          <div class="separador"></div>

          <div class="destaque">
            <strong>Decisões</strong>
            <span>com consequências</span>
          </div>

          <div class="separador"></div>

          <div class="destaque">
            <strong>Relatório</strong>
            <span>personalizado</span>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer-home">
      <span>SEGURANÇA DIGITAL</span>
      <span class="footer-dot">•</span>
      <span>JOGAR</span>
      <span class="footer-dot">•</span>
      <span>APRENDER</span>
      <span class="footer-dot">•</span>
      <span>PROTEGER</span>
    </footer>
  </main>
</template>

<style scoped>
.home-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 50% 0%, rgba(0, 229, 255, 0.12), transparent 40%),
    radial-gradient(circle at 10% 50%, rgba(0, 128, 255, 0.08), transparent 35%),
    linear-gradient(180deg, #061426 0%, #020812 100%);
  color: white;
}

.background-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.15;
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.08) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: linear-gradient(to bottom, black, transparent 80%);
}

.hero {
  position: relative;
  z-index: 1;
  width: min(1200px, calc(100% - 64px));
  margin: auto;
  padding: 64px 0 40px;
  display: grid;
  grid-template-columns: minmax(320px, 460px) minmax(420px, 1fr);
  gap: 56px;
  align-items: center;
}

.hero-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-logo::before {
  content: '';
  position: absolute;
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 229, 255, 0.18), transparent 65%);
  filter: blur(30px);
}

.hero-logo img {
  position: relative;
  width: min(100%, 420px);
  height: auto;
  border-radius: 28px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
}

.hero-content {
  max-width: 620px;
}

.tag {
  display: inline-flex;
  margin-bottom: 22px;
  padding: 8px 14px;
  border: 1px solid rgba(0, 229, 255, 0.25);
  border-radius: 999px;
  background: rgba(0, 229, 255, 0.06);
  color: #54f1ff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

h1 {
  margin: 0 0 24px;
  font-size: clamp(3rem, 5vw, 5.2rem);
  line-height: 0.98;
  letter-spacing: -0.045em;
}

h1 span {
  display: block;
  margin-top: 8px;
  background: linear-gradient(90deg, #00d9ff, #32f5cc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.descricao {
  margin: 0 0 14px;
  color: #dceeff;
  font-size: clamp(1.2rem, 1.8vw, 1.55rem);
  line-height: 1.5;
}

.descricao-secundaria {
  max-width: 560px;
  margin: 0 0 34px;
  color: #8ba7bd;
  font-size: 1rem;
  line-height: 1.75;
}

.acoes {
  margin-bottom: 38px;
}

.btn-iniciar {
  min-width: 250px;
  padding: 16px 22px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #00d8ff, #2bf3c5);
  color: #02121b;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 14px 35px rgba(0, 217, 255, 0.25);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.btn-iniciar:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px rgba(0, 217, 255, 0.35);
}

.btn-iniciar:disabled {
  opacity: 0.55;
  cursor: wait;
}

.seta {
  font-size: 1.3rem;
}

.erro {
  margin: -15px 0 25px;
  color: #ff7b88;
}

.destaques {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}

.destaque {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.destaque strong {
  color: #e9f8ff;
  font-size: 0.95rem;
}

.destaque span {
  color: #66859d;
  font-size: 0.78rem;
}

.separador {
  width: 1px;
  height: 34px;
  background: rgba(255, 255, 255, 0.1);
}

.footer-home {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 22px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  color: #4f7189;
  font-size: 0.68rem;
  letter-spacing: 0.15em;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-dot {
  color: #00d9ff;
}

@media (max-width: 980px) {
  .hero {
    width: min(100%, calc(100% - 40px));
    grid-template-columns: 1fr;
    gap: 26px;
    padding-top: 32px;
    text-align: center;
  }

  .hero-logo img {
    width: min(360px, 80vw);
  }

  .hero-content {
    margin: 0 auto;
  }

  .descricao-secundaria {
    margin-left: auto;
    margin-right: auto;
  }

  .acoes {
    display: flex;
    justify-content: center;
  }

  .destaques {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .hero {
    width: calc(100% - 28px);
    padding-top: 24px;
  }

  .hero-logo img {
    width: 280px;
    border-radius: 20px;
  }

  h1 {
    font-size: clamp(2.2rem, 12vw, 3.5rem);
  }

  .descricao {
    font-size: 1.08rem;
  }

  .separador {
    display: none;
  }

  .btn-iniciar {
    width: 100%;
    min-width: 0;
  }
}
</style>