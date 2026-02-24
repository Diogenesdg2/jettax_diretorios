<template>
  <main style="padding: 16px; max-width: 820px">
    <h1>Imposto de Renda</h1>

    <form @submit.prevent="gerarPdf" style="display: grid; gap: 12px; margin-top: 16px">
      <label>
        CNPJ
        <input
          :value="form.cnpj"
          @input="form.cnpj = maskCnpj($event.target.value)"
          inputmode="numeric"
          autocomplete="off"
          placeholder="00.000.000/0000-00"
        />
      </label>

      <label>
        Nome empresarial
        <input
          :value="form.nomeEmpresarial"
          @input="form.nomeEmpresarial = toUpper($event.target.value)"
          placeholder="Razão Social"
        />
      </label>

      <label>
        CPF
        <input
          :value="form.cpf"
          @input="form.cpf = maskCpf($event.target.value)"
          inputmode="numeric"
          autocomplete="off"
          placeholder="000.000.000-00"
        />
      </label>

      <label>
        Nome completo
        <input
          :value="form.nomeCompleto"
          @input="form.nomeCompleto = toUpper($event.target.value)"
          placeholder="Nome do declarante"
        />
      </label>

      <label>
        Total dos rendimentos (inclusive férias)
        <input
          :value="form.totalRendimentos"
          @input="form.totalRendimentos = maskMoneyBR($event.target.value)"
          inputmode="numeric"
          autocomplete="off"
          placeholder="24.000,00"
        />
      </label>

      <label>
        5. Imposto sobre a renda retido na fonte (IRRF)
        <input
          :value="form.irrf"
          @input="form.irrf = maskMoneyBR($event.target.value)"
          inputmode="numeric"
          autocomplete="off"
          placeholder="0,00"
        />
      </label>

      <!-- REMOVIDO: 4.4 Moléstia grave -->

      <label>
        4.5 Lucros e dividendos (isentos)
        <input
          :value="form.isentoLucrosDividendos"
          @input="form.isentoLucrosDividendos = maskMoneyBR($event.target.value)"
          inputmode="numeric"
          autocomplete="off"
          placeholder="0,00"
        />
      </label>

      <label>
        4.6 Valores pagos ao titular/sócio de ME/EPP (exceto pro labore, aluguéis ou serviços)
        <input
          :value="form.isentoValoresPagosME"
          @input="form.isentoValoresPagosME = maskMoneyBR($event.target.value)"
          inputmode="numeric"
          autocomplete="off"
          placeholder="0,00"
        />
      </label>

      <label>
        5.3 Outros (tributação exclusiva)
        <input
          :value="form.exclusivaOutros"
          @input="form.exclusivaOutros = maskMoneyBR($event.target.value)"
          inputmode="numeric"
          autocomplete="off"
          placeholder="0,00"
        />
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Gerando...' : 'Gerar PDF' }}
      </button>

      <small v-if="error" style="color: #b91c1c">{{ error }}</small>
    </form>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const loading = ref(false)
const error = ref('')

const form = reactive({
  cnpj: '',
  nomeEmpresarial: '',
  cpf: '',
  nomeCompleto: '',
  totalRendimentos: '',
  irrf: '',

  // 4. Rendimentos Isentos e Não Tributáveis
  isentoLucrosDividendos: '', // item 5
  isentoValoresPagosME: '', // item 6

  // 5. Rendimentos Sujeitos à Tributação Exclusiva
  exclusivaOutros: '', // item 3
})

// ====== Máscaras / normalizações ======
function onlyDigits(v) {
  return String(v ?? '').replace(/\D/g, '')
}

function maskCnpj(v) {
  const d = onlyDigits(v).slice(0, 14)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5')
}

function maskCpf(v) {
  const d = onlyDigits(v).slice(0, 11)
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
}

function toUpper(v) {
  return String(v ?? '').toUpperCase()
}

// sempre 2 casas decimais (pt-BR): 2400000 -> 24.000,00
function maskMoneyBR(v) {
  const d = onlyDigits(v)
  if (!d) return ''

  const cents = d.padStart(3, '0')
  const intPart = cents.slice(0, -2).replace(/^0+(?=\d)/, '') || '0'
  const decPart = cents.slice(-2)

  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${intFormatted},${decPart}`
}

// ====== PDF helpers ======
function clearInside(page, { x, y, w, h, insetL = 4, insetR = 4, insetT = 2.4, insetB = 2.4 }) {
  const rx = x + insetL
  const ry = y + insetB
  const rw = Math.max(0, w - insetL - insetR)
  const rh = Math.max(0, h - insetT - insetB)

  page.drawRectangle({ x: rx, y: ry, width: rw, height: rh, color: rgb(1, 1, 1) })
  return { rx, ry, rw, rh }
}

function fitTextToWidth(font, text, size, maxWidth, minSize = 7) {
  let s = size
  const t = String(text ?? '')

  while (s > minSize && font.widthOfTextAtSize(t, s) > maxWidth) s -= 0.2
  if (font.widthOfTextAtSize(t, s) <= maxWidth) return { text: t, size: s }

  const ell = '…'
  let cut = t
  while (cut.length > 0 && font.widthOfTextAtSize(cut + ell, minSize) > maxWidth)
    cut = cut.slice(0, -1)
  return { text: cut.length ? cut + ell : '', size: minSize }
}

function writeTextLeft(
  page,
  { x, y, w, h, text, font, size = 9, padX = 4, dyText = 2.0, minSize = 7, clear = {} },
) {
  const inner = clearInside(page, { x, y, w, h, ...clear })
  const maxWidth = Math.max(0, inner.rw - padX * 2)
  const fitted = fitTextToWidth(font, text, size, maxWidth, minSize)

  page.drawText(fitted.text, {
    x: inner.rx + padX,
    y: y + dyText,
    size: fitted.size,
    font,
    color: rgb(0, 0, 0),
  })
}

function writeTextRight(
  page,
  { xRight, y, w, h, text, font, size = 9, padRight = 4, dyText = 2.0, minSize = 7, clear = {} },
) {
  const x = xRight - w
  const inner = clearInside(page, { x, y, w, h, ...clear })
  const maxWidth = Math.max(0, inner.rw - padRight * 2)

  const fitted = fitTextToWidth(font, text, size, maxWidth, minSize)
  const textWidth = font.widthOfTextAtSize(fitted.text, fitted.size)

  page.drawText(fitted.text, {
    x: inner.rx + inner.rw - padRight - textWidth,
    y: y + dyText,
    size: fitted.size,
    font,
    color: rgb(0, 0, 0),
  })
}

// ====== Gerar PDF ======
async function gerarPdf() {
  loading.value = true
  error.value = ''

  try {
    const url = '/modelos/ARLETE_-_ALUGUEL.pdf'
    const bytes = await fetch(url).then((r) => {
      if (!r.ok) throw new Error('Não foi possível carregar o PDF modelo.')
      return r.arrayBuffer()
    })

    const pdfDoc = await PDFDocument.load(bytes)
    const page = pdfDoc.getPages()[0]
    const H = page.getHeight()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // ===== Fixos =====
    page.drawRectangle({ x: 156.48, y: H - 85.28, width: 130, height: 14, color: rgb(1, 1, 1) })
    page.drawText('Exercício de 2026', {
      x: 156.48,
      y: H - 85.28 + 2,
      size: 10.5,
      font,
      color: rgb(0, 0, 0),
    })

    page.drawRectangle({ x: 392.22, y: H - 85.28, width: 180, height: 14, color: rgb(1, 1, 1) })
    page.drawText('Ano-calendário de 2025', {
      x: 392.22,
      y: H - 85.28 + 2,
      size: 10.5,
      font,
      color: rgb(0, 0, 0),
    })

    // ===== Campos =====

    // CNPJ
    writeTextLeft(page, {
      x: 23,
      y: 682,
      w: 148 - 23,
      h: 12,
      text: form.cnpj,
      font,
      size: 9,
      padX: 6,
      clear: { insetL: 4, insetR: 6, insetT: 3, insetB: 2.2 },
    })

    // Nome empresarial
    writeTextLeft(page, {
      x: 145,
      y: 682,
      w: 575 - 145,
      h: 12,
      text: form.nomeEmpresarial,
      font,
      size: 9,
      padX: 6,
      clear: { insetL: 6, insetR: 4, insetT: 3, insetB: 2.2 },
    })

    const yCpf = H - 198 + 6 - 5

    // CPF
    writeTextLeft(page, {
      x: 23,
      y: yCpf - 1.2,
      w: 148 - 23,
      h: 12,
      text: form.cpf,
      font,
      size: 9,
      padX: 6,
      clear: { insetL: 4, insetR: 6, insetT: 3, insetB: 2.2 },
    })

    // Nome completo
    writeTextLeft(page, {
      x: 145,
      y: yCpf - 1.2,
      w: 575 - 145,
      h: 12,
      text: form.nomeCompleto,
      font,
      size: 9,
      padX: 6,
      clear: { insetL: 6, insetR: 4, insetT: 3, insetB: 2.2 },
    })

    // Natureza do rendimento (fixo)
    writeTextLeft(page, {
      x: 17,
      y: yCpf - 21,
      w: 575 - 17,
      h: 12,
      text: 'Aluguéis / royalties / lucros',
      font,
      size: 7,
      padX: 6,
      clear: { insetL: 4, insetR: 4, insetT: 2.6, insetB: 2.0 },
      dyText: 1.6,
      minSize: 6,
    })

    // Padrão coluna "Valores em reais"
    const xRightValores = 578
    const wValor = 110
    const hValor = 14
    const clearValor = { insetL: 8, insetR: 4, insetT: 3, insetB: 2.2 }

    // Total dos rendimentos
    writeTextRight(page, {
      xRight: xRightValores,
      y: 595.23,
      w: wValor,
      h: hValor,
      text: form.totalRendimentos,
      font,
      size: 7,
      padRight: 6,
      clear: clearValor,
    })

    // 5. IRRF
    writeTextRight(page, {
      xRight: xRightValores,
      y: 595.23 - 65,
      w: wValor,
      h: hValor,
      text: form.irrf,
      font,
      size: 7,
      padRight: 6,
      clear: clearValor,
    })

    // 4.5 Lucros e dividendos (isentos)  [mantido]
    writeTextRight(page, {
      xRight: xRightValores,
      y: 448 - 13,
      w: wValor,
      h: hValor,
      text: form.isentoLucrosDividendos,
      font,
      size: 7,
      padRight: 6,
      clear: clearValor,
    })

    // 4.6 Valores pagos ao titular/sócio de ME/EPP... [novo]
    writeTextRight(page, {
      xRight: xRightValores,
      y: 448 - 27, // ajuste fino aqui se precisar
      w: wValor,
      h: hValor,
      text: form.isentoValoresPagosME,
      font,
      size: 7,
      padRight: 6,
      clear: clearValor,
    })

    // 5.3 Outros (tributação exclusiva)
    writeTextRight(page, {
      xRight: xRightValores,
      y: 351 - 31,
      w: wValor,
      h: hValor,
      text: form.exclusivaOutros,
      font,
      size: 7,
      padRight: 6,
      clear: clearValor,
    })

    // 8. Responsável pelas Informações (Data fixa)
    writeTextLeft(page, {
      x: 248,
      y: 103,
      w: 100,
      h: 12,
      text: '27/02/2026',
      font,
      size: 7,
      padX: 6,
      clear: { insetL: 4, insetR: 4, insetT: 3, insetB: 2.2 },
    })

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const blobUrl = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = blobUrl
    a.download = `ARLETE_ALUGUEL_${(form.nomeCompleto || 'preenchido').replaceAll(' ', '_')}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(blobUrl)
  } catch (e) {
    error.value = e?.message || 'Erro ao gerar PDF.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
label {
  display: grid;
  gap: 6px;
  font-weight: 700;
}
input {
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}
button {
  padding: 10px 14px;
  border: 0;
  border-radius: 8px;
  background: #1f1b57;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
