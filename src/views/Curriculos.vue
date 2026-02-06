<template>
  <main class="home">
    <!-- âncora do topo -->
    <div id="top"></div>

    <!-- HEADER -->
    <header class="header">
      <div class="container header__inner">
        <nav class="nav" aria-label="Navegação principal">
          <div class="nav__menu">
            <a class="nav__link" href="/#top">Home</a>
            <a class="nav__link" href="/#sobre">Empresa</a>
            <a class="nav__link" href="/#servicos">Serviços</a>
            <a class="nav__link nav__link--active" href="#curriculos">Currículos</a>
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

    <!-- HERO (banner-curriculos) -->
    <section
      class="hero hero--brand"
      aria-label="Currículos - Viman Contabilidade"
      :style="heroStyle"
    >
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

    <!-- CARD (mesmo padrão da Home) -->
    <section class="welcome" id="curriculos">
      <div class="container">
        <div class="welcome__card welcome__card--clean">
          <div class="welcome__left">
            <div class="kicker">CURRÍCULOS</div>

            <h2 class="welcome__title">
              Trabalhe<br />
              Conosco
            </h2>

            <p class="welcome__text">
              Estamos sempre à procura de talentos para se juntarem à nossa equipe! Se você tem
              paixão por contabilidade e áreas afins e procura fazer parte de uma equipe dinâmica e
              colaborativa, cadastre seu currículo.
            </p>
          </div>

          <div class="welcome__right">
            <img src="@/assets/Selo-65.svg" alt="Selo 65 anos" class="sealImg" />
          </div>
        </div>
      </div>
    </section>

    <!-- FORMULÁRIO -->
    <section class="section">
      <div class="container">
        <form class="formCard" @submit.prevent="onSubmit">
          <div class="field">
            <input
              v-model.trim="form.name"
              class="input"
              type="text"
              name="name"
              required
              placeholder="* Digite seu nome"
              autocomplete="name"
            />
          </div>

          <div class="field">
            <input
              v-model.trim="form.email"
              class="input"
              type="email"
              name="email"
              required
              placeholder="* Digite seu E-mail"
              autocomplete="email"
            />
          </div>

          <div class="field">
            <input
              v-model.trim="form.phone"
              class="input"
              type="tel"
              name="phone"
              required
              placeholder="* Digite seu Celular com DDD"
              inputmode="tel"
              autocomplete="tel"
            />
            <div class="hint">
              Apenas números e caracteres de telefone (#, -, *, etc.) são aceitos.
            </div>
          </div>

          <div class="field">
            <label class="fileLabel">
              <span class="fileLabel__text">* Anexar seu Currículo em PDF ou DOC</span>

              <div class="fileRow">
                <input
                  class="fileInput"
                  type="file"
                  name="cv"
                  required
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  @change="onFileChange"
                />
                <span class="fileName">
                  {{ form.file?.name || 'Nenhum ficheiro selecionado' }}
                </span>
              </div>
            </label>
          </div>

          <div class="consent">
            <label class="consent__label">
              <input v-model="form.consent" type="checkbox" required />
              <span>
                Tenho ciência e concordo que meus dados aqui informados poderão ser utilizados pela
                Viman Contabilidade de acordo com os termos apresentados no
                <a class="privacyLink" :href="privacyUrl" target="_blank" rel="noreferrer">
                  AVISO DE PRIVACIDADE
                </a>
              </span>
            </label>
          </div>

          <button class="submit" type="submit" :disabled="submitting">
            {{ submitting ? 'ENVIANDO...' : 'ENVIAR' }}
          </button>

          <div v-if="status" class="status" :class="status.type">
            {{ status.message }}
          </div>
        </form>
      </div>
    </section>

    <!-- MAPA (full width) -->
    <section class="section section--alt section--map" id="contato">
      <div class="map map--full">
        <iframe
          title="Mapa - Viman Contabilidade"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          :src="mapEmbedUrl"
          allowfullscreen
        />
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
          <a href="/#servicos">Serviços</a>
          <a href="/#sobre">Sobre</a>
          <a href="#contato">Localização</a>
          <a :href="privacyUrl" target="_blank" rel="noreferrer">Aviso de Privacidade</a>
        </div>
      </div>
    </footer>

    <!-- WhatsApp flutuante -->
    <a
      class="wafloat"
      :href="whatsLink('Olá! Quero enviar meu currículo para a Viman.')"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
    >
      WhatsApp
    </a>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

import bannerCurriculosUrl from '@/assets/banner-curriculos.png' // ajuste a extensão se necessário
import logoWhiteUrl from '@/assets/logo-viman-horizontal-branco.svg'

const heroStyle = computed(() => ({
  backgroundImage: `url(${bannerCurriculosUrl})`,
}))

const emblemStyle = computed(() => ({
  backgroundImage: `url(${logoWhiteUrl})`,
}))

const contacts = reactive({
  whatsappE164: '551935713707',
})

const privacyUrl = '/privacidade' // ajuste para a rota/URL real do seu aviso de privacidade

const mapEmbedUrl = computed(() => {
  const q = encodeURIComponent('Viman Contabilidade, Leme - SP')
  return `https://www.google.com/maps?q=${q}&output=embed`
})

function whatsLink(text) {
  const msg = encodeURIComponent(text || 'Olá!')
  return `https://wa.me/${contacts.whatsappE164}?text=${msg}`
}

const form = reactive({
  name: '',
  email: '',
  phone: '',
  file: null,
  consent: false,
})

const submitting = ref(false)
const status = ref(null)

function onFileChange(e) {
  const file = e?.target?.files?.[0] || null
  form.file = file
}

async function onSubmit() {
  submitting.value = true
  status.value = null

  try {
    // Aqui você integra com seu backend (FormData + fetch/axios).
    // Exemplo (quando tiver endpoint):
    // const fd = new FormData()
    // fd.append('name', form.name)
    // fd.append('email', form.email)
    // fd.append('phone', form.phone)
    // fd.append('cv', form.file)
    // fd.append('consent', String(form.consent))
    // await fetch('/api/curriculos', { method: 'POST', body: fd })

    await new Promise((r) => setTimeout(r, 600))

    status.value = { type: 'ok', message: 'Currículo enviado com sucesso.' }

    form.name = ''
    form.email = ''
    form.phone = ''
    form.file = null
    form.consent = false
  } catch (e) {
    status.value = { type: 'err', message: 'Não foi possível enviar. Tente novamente.' }
  } finally {
    submitting.value = false
  }
}
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
  --green: #68b734;
}

:global(html) {
  scroll-behavior: smooth;
}

:global(body) {
  margin: 0;
  overflow-x: clip;
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

/* HEADER */
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
  padding-bottom: 180px;
  z-index: 1;
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

/* CARD (welcome) */
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
  max-width: 620px;
  font-size: 16px;
  line-height: 1.5;
}

.welcome__right {
  display: grid;
  place-items: center;
}

.sealImg {
  width: 260px;
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

/* SECTION */
.section {
  padding: 42px 0;
}

.section--alt {
  background: #fff;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

/* FORM */
.formCard {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
}

.field {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
}

.input {
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border: 1px solid #94a3b8;
  padding: 0 14px;
  font-size: 15px;
  outline: none;
  background: #fff;
  box-sizing: border-box;
}

.input:focus {
  border-color: var(--blue2);
  box-shadow: 0 0 0 3px rgba(31, 27, 87, 0.12);
}

.hint {
  font-size: 12px;
  color: #111827;
  opacity: 0.85;
}

.fileLabel {
  display: grid;
  gap: 8px;
}

.fileLabel__text {
  font-size: 13px;
  color: #16a34a;
  font-weight: 800;
}

.fileRow {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.fileInput {
  max-width: 240px;
}

.fileName {
  font-size: 13px;
  color: #334155;
}

.consent {
  background: rgba(243, 211, 107, 0.65);
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 10px;
  padding: 14px;
  margin: 12px 0 14px;
}

.consent__label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #0f172a;
  line-height: 1.35;
  font-weight: 600;
}

.privacyLink {
  color: #f97316;
  font-weight: 900;
  text-decoration: none;
  margin-left: 4px;
}

.privacyLink:hover {
  text-decoration: underline;
}

.submit {
  width: 100%;
  height: 52px;
  border: 0;
  border-radius: 4px;
  background: var(--green);
  color: #fff;
  font-weight: 900;
  letter-spacing: 0.03em;
  cursor: pointer;
}

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.status {
  margin-top: 12px;
  font-weight: 800;
  font-size: 13px;
}

.status.ok {
  color: #15803d;
}

.status.err {
  color: #b91c1c;
}

/* MAP (full width) */
.section--map {
  padding: 0;
}

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
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);

  min-height: 520px;

  border-radius: 0;
  border-left: 0;
  border-right: 0;
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

.muted {
  color: var(--muted);
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
