<!-- src/views/Home.vue -->
<template>
  <main class="home">
    <!-- HEADER -->
    <header class="header">
      <div class="container header__inner">
        <div class="brand">
          <div class="brand__mark">V</div>
          <div class="brand__text">
            <div class="brand__name">Viman</div>
            <div class="brand__tag">Contabilidade</div>
          </div>
        </div>

        <nav class="nav">
          <a href="#servicos">Serviços</a>
          <a href="#segmentos">Segmentos</a>
          <a href="#sobre">Sobre</a>
          <a href="#avaliacoes">Avaliações</a>
          <a href="#contato">Contato</a>
        </nav>
      </div>
    </header>

    <!-- HERO -->
    <section class="hero" aria-label="Viman Contabilidade">
      <div class="hero__overlay"></div>

      <div class="container hero__inner">
        <div class="hero__copy">
          <div class="hero__logo">
            <div class="hero__logo__mark">VIMAN</div>
            <div class="hero__logo__sub">CONTABILIDADE</div>
          </div>

          <h1>Contabilidade completa para sua empresa crescer com segurança</h1>
          <p>
            Rotina fiscal, contábil e departamento pessoal com atendimento consultivo. Tradição,
            qualidade e agilidade no dia a dia.
          </p>

          <div class="hero__actions">
            <a class="btn" href="#contato">Falar com um especialista</a>
            <a class="btn btn--ghost" href="#servicos">Conhecer serviços</a>
          </div>

          <div class="hero__trust">
            <div class="trust">
              <b>65 anos</b>
              <span>tradição e qualidade</span>
            </div>
            <div class="trust">
              <b>Atendimento</b>
              <span>Leme/SP e região</span>
            </div>
            <div class="trust">
              <b>Suporte</b>
              <span>rápido e próximo</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BOAS-VINDAS + SELO -->
    <section class="welcome" id="sobre">
      <div class="container">
        <div class="welcome__card">
          <div class="welcome__left">
            <div class="kicker">BOAS-VINDAS</div>
            <h2>Seu parceiro de crescimento</h2>
            <p>
              Nosso compromisso é ser o seu parceiro de crescimento, fornecendo soluções confiáveis
              e inovadoras para impulsionar o seu sucesso.
            </p>

            <ul class="bullets">
              <li>Obrigações em dia e conformidade fiscal</li>
              <li>Planejamento tributário para economizar com segurança</li>
              <li>Folha/DP com prazos e rotinas bem definidas</li>
            </ul>

            <div class="welcome__actions">
              <a
                class="btn btn--small"
                :href="whatsLink('Olá! Quero um diagnóstico contábil.')"
                target="_blank"
                rel="noreferrer"
              >
                Quero um diagnóstico
              </a>
              <a class="btn btn--small btn--ghost" href="#avaliacoes">Ver avaliações</a>
            </div>
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

    <!-- SEGMENTOS -->
    <section class="section section--alt" id="segmentos">
      <div class="container">
        <div class="section__head">
          <h2>Segmentos atendidos</h2>
          <p>Atendimento adaptado à realidade do seu negócio.</p>
        </div>

        <div class="grid grid--4">
          <div v-for="seg in segments" :key="seg" class="pill-card">{{ seg }}</div>
        </div>
      </div>
    </section>

    <!-- AVALIAÇÕES -->
    <section class="section" id="avaliacoes">
      <div class="container">
        <div class="section__head">
          <h2>Avaliações</h2>
          <p>Reputação construída com atendimento e consistência.</p>
        </div>

        <div class="rating">
          <div class="rating__score">
            <b>5,0</b>
            <span>★★★★★</span>
          </div>
          <div class="rating__meta">
            <div><b>Google</b></div>
            <div class="muted">Baseado em avaliações públicas (ex.: 4 avaliações).</div>
          </div>
          <a
            class="btn btn--small"
            :href="whatsLink('Olá! Vim pelas avaliações e quero atendimento.')"
            target="_blank"
            rel="noreferrer"
          >
            Falar agora
          </a>
        </div>

        <div class="grid grid--3" style="margin-top: 12px">
          <article v-for="t in testimonials" :key="t.name" class="quote">
            <p>“{{ t.text }}”</p>
            <div class="quote__by">
              <b>{{ t.name }}</b>
              <span class="muted">{{ t.role }}</span>
            </div>
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
          <a class="btn btn--small btn--ghost" href="#contato">Mensagem</a>
        </div>
      </div>
    </section>

    <!-- CONTATO + MAPA -->
    <section class="section section--alt" id="contato">
      <div class="container two">
        <div class="panel">
          <h2>Contato</h2>
          <p class="muted">Preencha e retornamos rapidamente.</p>

          <div class="info">
            <div>
              <b>Telefone:</b> <a :href="`tel:${contacts.phoneRaw}`">{{ contacts.phone }}</a>
            </div>
            <div>
              <b>E-mail:</b> <a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a>
            </div>
            <div><b>Endereço:</b> {{ contacts.address }}</div>
          </div>

          <form class="form" @submit.prevent="sendWhats">
            <label class="field">
              <span>Nome</span>
              <input v-model.trim="lead.name" required />
            </label>

            <label class="field">
              <span>Telefone</span>
              <input v-model.trim="lead.phone" required />
            </label>

            <label class="field">
              <span>Empresa (opcional)</span>
              <input v-model.trim="lead.company" />
            </label>

            <label class="field">
              <span>Mensagem</span>
              <textarea v-model.trim="lead.message" rows="4" required />
            </label>

            <button class="btn" type="submit">Enviar no WhatsApp</button>
          </form>
        </div>

        <div class="map">
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
          <a href="#segmentos">Segmentos</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
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

const contacts = reactive({
  phone: '(19) 3571-3707',
  phoneRaw: '1935713707',
  email: 'contato@viman.com.br',
  address: 'R. Maj. Arthur Franco Mourão, 453 - Centro, Leme - SP, 13611-490',
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

const segments = [
  'Comércio',
  'Prestadores de Serviços',
  'Indústria',
  'MEI/ME',
  'Profissionais liberais',
  'Terceiro setor (se aplicável)',
  'Holding/Patrimonial',
  'Produtor rural (se aplicável)',
]

const testimonials = [
  {
    text: 'Atendimento muito claro e rápido, sempre orientando o melhor caminho.',
    name: 'Cliente',
    role: 'Avaliação pública',
  },
  {
    text: 'Organização e cumprimento de prazos. Passa muita segurança.',
    name: 'Cliente',
    role: 'Avaliação pública',
  },
  { text: 'Equipe atenciosa e técnica. Recomendo.', name: 'Cliente', role: 'Avaliação pública' },
]

const lead = reactive({ name: '', phone: '', company: '', message: '' })

function sendWhats() {
  const lines = [
    `Olá! Meu nome é ${lead.name}.`,
    `Telefone: ${lead.phone}.`,
    lead.company ? `Empresa: ${lead.company}.` : null,
    `Mensagem: ${lead.message}`,
  ].filter(Boolean)

  window.open(whatsLink(lines.join('\n')), '_blank', 'noreferrer')
}
</script>

<style scoped>
:root {
  --bg: #f6f7fb;
  --text: #0f172a;
  --muted: #64748b;
  --line: #e5e7eb;
  --card: #ffffff;
  --blue: #2f2b7c;
  --blue2: #1f1b57;
  --gold: #f3d36b;

  /* NOVO: azul bem claro para o fundo do card Boas-vindas */
  --welcomeCardBg: #eef6ff;
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

.topbar {
  background: var(--blue2);
  color: #e2e8f0;
  font-size: 13px;
}
.topbar__inner {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  flex-wrap: wrap;
}
.topbar a {
  color: #e2e8f0;
  text-decoration: none;
}
.sep {
  opacity: 0.7;
  margin: 0 8px;
}

.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(246, 247, 251, 0.88);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 0;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand__mark {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--blue), var(--blue2));
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 900;
}
.brand__name {
  font-weight: 900;
  line-height: 1.1;
  text-transform: uppercase;
}
.brand__tag {
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.nav {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.nav a {
  text-decoration: none;
  color: var(--text);
  font-weight: 700;
  font-size: 14px;
  opacity: 0.92;
}
.nav a:hover {
  opacity: 1;
}

.header__cta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

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

/* Se você NÃO tiver a imagem do hero, troque o background abaixo por uma cor/gradiente */
.hero {
  position: relative;
  min-height: 420px;
  display: grid;
  align-items: center;

  background: linear-gradient(135deg, var(--blue2) 0%, var(--blue) 45%, #0b1220 100%);
}
.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(10, 12, 25, 0.72) 0%,
    rgba(10, 12, 25, 0.4) 55%,
    rgba(10, 12, 25, 0.15) 100%
  );
}
.hero__inner {
  position: relative;
  padding: 52px 0;
}
.hero__copy {
  max-width: 680px;
  color: #fff;
}
.hero__logo {
  margin-bottom: 12px;
}
.hero__logo__mark {
  font-weight: 900;
  letter-spacing: 0.06em;
  font-size: 44px;
  line-height: 1;
}
.hero__logo__sub {
  opacity: 0.9;
  letter-spacing: 0.18em;
  font-weight: 800;
}

.hero h1 {
  margin: 0 0 10px;
  font-size: 38px;
  line-height: 1.05;
  letter-spacing: -0.02em;
}
.hero p {
  margin: 0 0 16px;
  color: rgba(226, 232, 240, 0.92);
  max-width: 62ch;
}

.hero__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.hero__actions .btn {
  border-color: rgba(255, 255, 255, 0.35);
}
.hero__actions .btn--ghost {
  color: #fff;
}

.hero__trust {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
}
.trust {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  padding: 10px 12px;
  display: grid;
  gap: 2px;
  min-width: 170px;
}
.trust span {
  color: rgba(226, 232, 240, 0.9);
  font-size: 12px;
}

.welcome {
  margin-top: -44px;
}
.welcome__card {
  /* ALTERADO: fundo azul bem claro */
  background: var(--welcomeCardBg);
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 14px;
  padding: 18px;
}
@media (max-width: 900px) {
  .welcome__card {
    grid-template-columns: 1fr;
  }
  .welcome {
    margin-top: -22px;
  }
}

.kicker {
  font-size: 12px;
  letter-spacing: 0.18em;
  color: var(--muted);
  font-weight: 900;
}
.welcome h2 {
  margin: 4px 0 8px;
  font-size: 30px;
  color: var(--blue2);
}
.welcome p {
  margin: 0 0 10px;
  color: var(--muted);
}

.bullets {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
  color: #334155;
}
.bullets li {
  padding-left: 22px;
  position: relative;
}
.bullets li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--blue2);
  font-weight: 900;
}

.welcome__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.welcome__right {
  display: grid;
  place-items: center;
  gap: 8px;
}

.sealImg {
  width: 200px;
  max-width: 100%;
  height: auto;
  display: block;
}
.sealCaption {
  font-weight: 900;
  letter-spacing: 0.08em;
  color: var(--blue2);
  font-size: 12px;
  text-align: center;
}

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
.grid--4 {
  grid-template-columns: repeat(4, 1fr);
}
@media (max-width: 900px) {
  .grid--3,
  .grid--4 {
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

.pill-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 10px 12px;
  text-align: center;
  font-weight: 800;
  color: #334155;
}

.step {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px;
}
.step__n {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(47, 43, 124, 0.1);
  border: 1px solid rgba(47, 43, 124, 0.18);
  display: grid;
  place-items: center;
  font-weight: 900;
  color: var(--blue2);
  margin-bottom: 10px;
}
.step h3 {
  margin: 0 0 6px;
}
.step p {
  margin: 0;
  color: var(--muted);
}

.rating {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.rating__score {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.rating__score b {
  font-size: 34px;
  color: var(--blue2);
}
.rating__score span {
  color: #f59e0b;
  font-size: 18px;
  letter-spacing: 0.06em;
}
.rating__meta .muted {
  margin-top: 2px;
}

.quote {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px;
}
.quote p {
  margin: 0 0 10px;
  color: #0f172a;
}
.quote__by {
  display: grid;
  gap: 2px;
}
.muted {
  color: var(--muted);
}

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
.contactbar__cta {
  gap: 10px;
}

.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: start;
}
@media (max-width: 900px) {
  .two {
    grid-template-columns: 1fr;
  }
}

.panel {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px;
}
.panel h2 {
  margin: 0 0 6px;
}
.info {
  display: grid;
  gap: 8px;
  margin: 10px 0 14px;
  color: #334155;
}
.info a {
  color: var(--blue2);
  text-decoration: none;
  font-weight: 900;
}

.form {
  display: grid;
  gap: 10px;
}
.field {
  display: grid;
  gap: 6px;
}
.field span {
  font-weight: 900;
  font-size: 13px;
  color: #334155;
}
input,
textarea {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
  font: inherit;
}
input:focus,
textarea:focus {
  border-color: var(--blue2);
  box-shadow: 0 0 0 3px rgba(47, 43, 124, 0.12);
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
