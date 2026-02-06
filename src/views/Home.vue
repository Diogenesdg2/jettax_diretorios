<template>
  <main class="home">
    <!-- âncora do Home -->
    <div id="top"></div>

    <!-- HEADER (centralizado) -->
    <header class="header">
      <div class="container header__inner">
        <nav class="nav" aria-label="Navegação principal">
          <div class="nav__menu">
            <a class="nav__link nav__link--active" href="#top">Home</a>
            <a class="nav__link" href="#sobre">Empresa</a>
            <a class="nav__link" href="#servicos">Serviços</a>

            <!-- Currículos: como a seção foi removida, direciona para WhatsApp -->
            <a
              class="nav__link"
              :href="whatsLink('Olá! Quero enviar meu currículo para a Viman.')"
              target="_blank"
              rel="noreferrer"
            >
              Currículos
            </a>

            <a class="nav__link" href="#contato">Contato</a>
          </div>

          <a
            class="nav__cta"
            href="https://vip.acessorias.com/vimancontabilidade"
            target="_blank"
            rel="noreferrer"
          >
            ÁREA DO CLIENTE
          </a>
        </nav>
      </div>
    </header>

    <!-- HERO -->
    <section class="hero hero--brand" aria-label="Viman Contabilidade" :style="heroStyle">
      <div class="hero__tint"></div>

      <div class="hero__content">
        <div class="hero__brandStack">
          <div class="hero__emblem" :style="emblemStyle" aria-hidden="true"></div>

          <div class="hero__word">
            <div class="hero__name">VIMAN</div>
            <div class="hero__sub">CONTABILIDADE</div>
          </div>
        </div>
      </div>
    </section>

    <!-- BOAS-VINDAS -->
    <section class="welcome" id="sobre">
      <div class="container">
        <div class="welcome__card welcome__card--clean">
          <div class="welcome__left">
            <div class="kicker">BOAS‑VINDAS</div>

            <h2 class="welcome__title">
              Seu parceiro<br />
              de crescimento
            </h2>

            <p class="welcome__text">
              Nosso compromisso é ser o seu parceiro de crescimento, fornecendo soluções confiáveis
              e inovadoras para impulsionar o seu sucesso.
            </p>
          </div>

          <div class="welcome__right">
            <img src="@/assets/Selo-65.svg" alt="Selo 65 anos" class="sealImg" />
          </div>
        </div>
      </div>
    </section>

    <!-- SERVIÇOS -->
    <section class="section" id="servicos">
      <div class="container">
        <div class="section__head">
          <h2>Serviços</h2>
          <p>Principais frentes para manter sua empresa regular e bem assessorada.</p>
        </div>

        <div class="grid grid--3">
          <article v-for="s in services" :key="s.title" class="card">
            <div class="card__icon">{{ s.icon }}</div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
            <a
              class="link"
              :href="whatsLink(`Olá! Quero saber mais sobre: ${s.title}.`)"
              target="_blank"
              rel="noreferrer"
            >
              Solicitar atendimento →
            </a>
          </article>
        </div>
      </div>
    </section>

    <!-- FAIXA CONTATO -->
    <section class="contactbar">
      <div class="container contactbar__inner">
        <div class="contactbar__item">
          <span class="ci">📞</span>
          <div>
            <div class="label">Entre em contato</div>
            <a class="value" :href="`tel:${contacts.phoneRaw}`">{{ contacts.phone }}</a>
          </div>
        </div>

        <div class="contactbar__item">
          <span class="ci">✉️</span>
          <div>
            <div class="label">E-mail</div>
            <a class="value" :href="`mailto:${contacts.email}`">{{ contacts.email }}</a>
          </div>
        </div>

        <div class="contactbar__item contactbar__cta">
          <a
            class="btn btn--small"
            :href="whatsLink('Olá! Quero falar com a Viman Contabilidade.')"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <a class="btn btn--small btn--ghost" href="#contato">Ver mapa</a>
        </div>
      </div>
    </section>

    <!-- MAPA (full width) -->
    <section class="section section--alt" id="contato">
      <div class="container">
        <div class="map map--full">
          <iframe
            title="Mapa - Viman Contabilidade"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            :src="mapEmbedUrl"
            allowfullscreen
          />
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="container footer__inner">
        <div>
          <b>Viman Contabilidade</b>
          <div class="muted">
            Copyright {{ new Date().getFullYear() }}. Todos os direitos reservados.
          </div>
        </div>

        <div class="footer__links">
          <a href="#servicos">Serviços</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Localização</a>
          <a href="#">Aviso de Privacidade</a>
        </div>
      </div>
    </footer>

    <!-- WhatsApp flutuante -->
    <a
      class="wafloat"
      :href="whatsLink('Olá! Quero atendimento.')"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
    >
      WhatsApp
    </a>
  </main>
</template>

<script setup>
import { computed, reactive } from 'vue'

import bannerUrl from '@/assets/banner-principal.png'
import logoWhiteUrl from '@/assets/logo-viman-horizontal-branco.svg'

const heroStyle = computed(() => ({
  backgroundImage: `url(${bannerUrl})`,
}))

const emblemStyle = computed(() => ({
  backgroundImage: `url(${logoWhiteUrl})`,
}))

const contacts = reactive({
  phone: '(19) 3571-3707',
  phoneRaw: '1935713707',
  email: 'contato@viman.com.br',
  whatsappE164: '551935713707',
})

const mapEmbedUrl = computed(() => {
  const q = encodeURIComponent('Viman Contabilidade, Leme - SP')
  return `https://www.google.com/maps?q=${q}&output=embed`
})

function whatsLink(text) {
  const msg = encodeURIComponent(text || 'Olá!')
  return `https://wa.me/${contacts.whatsappE164}?text=${msg}`
}

const services = [
  {
    icon: '📒',
    title: 'Contabilidade Mensal',
    desc: 'Escrituração, demonstrações e acompanhamento mensal.',
  },
  {
    icon: '🧾',
    title: 'Fiscal e Tributário',
    desc: 'Apurações, SPED/obrigações e conformidade fiscal.',
  },
  {
    icon: '👥',
    title: 'Departamento Pessoal',
    desc: 'Folha, eSocial, admissões, rescisões e rotinas.',
  },
  {
    icon: '🏢',
    title: 'Abertura/Alterações',
    desc: 'Abertura, alterações contratuais e encerramento.',
  },
  { icon: '✅', title: 'Regularizações', desc: 'Pendências, certidões, parcelamentos e ajustes.' },
]
</script>

<style scoped>
:global(:root) {
  --bg: #f6f7fb;
  --text: var(--blue2);
  --muted: #64748b;
  --line: #e5e7eb;
  --card: #ffffff;
  --blue: #2f2b7c;
  --blue2: #1f1b57;
  --gold: #f3d36b;
}

:global(html) {
  scroll-behavior: smooth;
}

.home {
  background: var(--bg);
  color: var(--text);
}

.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 16px;
}

/* HEADER (centralizado, branco) */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid rgba(15, 23, 42, 0.12);
}

.header__inner {
  padding: 14px 0;
}

.nav {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 18px;
}

.nav__menu {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 56px;
  flex-wrap: wrap;
}

.nav__link {
  position: relative;
  text-decoration: none;
  color: var(--blue2);
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.02em;
  padding: 10px 2px 16px;
}

.nav__link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 2px;
  width: 100%;
  height: 3px;
  background: var(--blue2);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.16s ease;
}

.nav__link:hover::after {
  transform: scaleX(1);
}

.nav__link--active::after {
  transform: scaleX(1);
}

.nav__cta {
  padding: 12px 18px;
  border-radius: 0;
  background: var(--blue2);
  color: #fff;
  text-decoration: none;
  font-weight: 900;
  letter-spacing: 0.03em;
  border: 1px solid var(--blue2);
  white-space: nowrap;
}

.nav__cta:hover {
  filter: brightness(1.05);
}

@media (max-width: 900px) {
  .nav {
    flex-wrap: wrap;
    justify-content: center;
  }
  .nav__menu {
    gap: 22px;
  }
}

/* BUTTONS */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--blue2);
  background: var(--blue2);
  color: #fff;
  text-decoration: none;
  font-weight: 800;
}

.btn--ghost {
  background: transparent;
  color: var(--blue2);
}

.btn--small {
  padding: 8px 12px;
}

/* HERO */
.hero {
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}

.hero--brand {
  position: relative;
  min-height: clamp(620px, 100vh, 980px);
  display: grid;
  align-items: center;
  padding-bottom: 180px; /* espaço para o card sobrepor */
  z-index: 1;
}

.hero__tint {
  display: none;
}

.hero__content {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: clamp(24px, 7vw, 180px);
  padding-right: 16px;
}

.hero__brandStack {
  display: grid;
  gap: 14px;
  align-items: start;
  text-align: left;
}

.hero__emblem {
  width: clamp(160px, 18vw, 260px);
  height: clamp(80px, 10vw, 140px);
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 240% 100%;
}

.hero__word {
  display: inline-grid;
  justify-items: start;
  text-align: left;
}

.hero__name {
  color: #fff;
  font-family:
    'Montserrat',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-weight: 900;
  letter-spacing: 0.02em;
  line-height: 0.95;
  font-size: clamp(56px, 7vw, 104px);
  text-transform: uppercase;
}

.hero__sub {
  color: #fff;
  font-family:
    'Montserrat',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1.1;
  font-size: clamp(18px, 2.2vw, 34px);
  text-transform: uppercase;
  transform: translateX(0px);
}

@media (max-width: 700px) {
  .hero__content {
    justify-content: center;
    padding-left: 16px;
    padding-right: 16px;
  }
  .hero__brandStack {
    text-align: center;
    justify-items: center;
  }
  .hero__word {
    justify-items: center;
    text-align: center;
  }
}

/* WELCOME */
.welcome {
  position: relative;
  z-index: 5;
  margin-top: -160px;
}

.kicker {
  font-size: 18px;
  letter-spacing: 0.18em;
  color: var(--muted);
  font-weight: 900;
  text-transform: uppercase;
}

.welcome__card--clean {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 10px;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.18);

  display: grid;
  grid-template-columns: 1fr 420px;
  align-items: center;

  padding: 28px 34px;
  gap: 18px;
}

.welcome__title {
  margin: 8px 0 10px;
  font-size: 56px;
  line-height: 1.02;
  font-weight: 900;
  color: var(--blue);
}

.welcome__text {
  margin: 0;
  color: #64748b;
  max-width: 520px;
  font-size: 16px;
  line-height: 1.45;
}

.welcome__right {
  display: grid;
  place-items: center;
}

.sealImg {
  width: 240px;
  max-width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 900px) {
  .hero--brand {
    padding-bottom: 120px;
  }
  .welcome {
    margin-top: -90px;
  }

  .welcome__card--clean {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .welcome__right {
    margin-top: 10px;
  }

  .welcome__title {
    font-size: 36px;
  }

  .kicker {
    font-size: 14px;
  }

  .welcome__text {
    font-size: 14px;
  }
}

/* SECTIONS */
.section {
  padding: 42px 0;
}

.section--alt {
  background: #fff;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.section__head {
  margin-bottom: 14px;
}

.section__head h2 {
  margin: 0 0 6px;
  font-size: 26px;
}

.section__head p {
  margin: 0;
  color: var(--muted);
}

.grid {
  display: grid;
  gap: 12px;
}

.grid--3 {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 900px) {
  .grid--3 {
    grid-template-columns: 1fr;
  }
}

.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px;
}

.card__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(47, 43, 124, 0.08);
  border: 1px solid rgba(47, 43, 124, 0.16);
  margin-bottom: 10px;
}

.card h3 {
  margin: 0 0 6px;
  color: var(--blue2);
}

.card p {
  margin: 0 0 10px;
  color: var(--muted);
}

.link {
  text-decoration: none;
  font-weight: 900;
  color: var(--blue2);
}

.muted {
  color: var(--muted);
}

/* CONTACT BAR */
.contactbar {
  background: var(--gold);
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.contactbar__inner {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 16px 0;
  flex-wrap: wrap;
}

.contactbar__item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ci {
  font-size: 18px;
}

.label {
  font-size: 12px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.75);
  letter-spacing: 0.04em;
}

.value {
  font-weight: 900;
  color: #0f172a;
  text-decoration: none;
}

/* MAP */
.map {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  min-height: 420px;
}

.map iframe {
  width: 100%;
  height: 100%;
  border: 0;
  min-height: 420px;
}

.map--full {
  width: 100%;
  min-height: 520px;
}

.map--full iframe {
  min-height: 520px;
}

/* FOOTER */
.footer {
  background: var(--blue);
  color: #e2e8f0;
  padding: 18px 0;
}

.footer__inner {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.footer__links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.footer a {
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 700;
}

.footer .muted {
  color: rgba(226, 232, 240, 0.85);
}

/* WhatsApp float */
.wafloat {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 60;
  background: #0ea5e9;
  color: #fff;
  border-radius: 999px;
  padding: 10px 14px;
  text-decoration: none;
  font-weight: 900;
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 10px 26px rgba(2, 132, 199, 0.35);
}
</style>
