<template>
  <div class="page">
    <header class="header">
      <h2>Migrador de XMLs (recriar estrutura)</h2>
      <p class="muted">
        Requer Chrome/Edge (File System Access API). O processo é por <b>cópia</b> (não apaga a
        origem).
      </p>
      <p v-if="!supported" class="error">
        Seu navegador não suporta <code>showDirectoryPicker</code>. Use Chrome/Edge.
      </p>
    </header>

    <section class="card">
      <div class="row">
        <button :disabled="!supported" @click="pickSource">Selecionar pasta ORIGEM</button>
        <div class="muted" v-if="sourceName">
          Origem: <b>{{ sourceName }}</b>
        </div>
      </div>

      <div v-if="companies.length" class="companies">
        <div class="companies-head">
          <b>Empresas</b>
          <span class="muted"
            >({{ selectedCompanies.size }}/{{ filteredCompanies.length }} marcadas)</span
          >

          <input v-model.trim="companyFilter" placeholder="filtrar..." class="input" />

          <button type="button" class="btn-ghost" @click="selectAllFiltered">
            Marcar filtradas
          </button>
          <button type="button" class="btn-ghost" @click="clearSelection">Limpar</button>
        </div>

        <div class="companies-list">
          <label v-for="c in filteredCompanies" :key="c" class="chk">
            <input type="checkbox" :checked="selectedCompanies.has(c)" @change="toggleCompany(c)" />
            <span class="mono">{{ c }}</span>
            <span class="muted">→</span>
            <span>{{ companyUpperFromFolder(c) }}</span>
          </label>
        </div>
      </div>

      <div class="row" style="margin-top: 14px">
        <button :disabled="!supported" @click="pickDest">Selecionar pasta DESTINO</button>
        <div class="muted" v-if="destName">
          Destino: <b>{{ destName }}</b>
        </div>
      </div>

      <div class="form">
        <label class="field">
          <span>Tipo de documento</span>
          <input v-model.trim="docType" placeholder="Ex.: NFE, NFSE, CTE" class="input" />
        </label>

        <label class="field inline">
          <input type="checkbox" v-model="includePdfs" />
          <span>Incluir PDFs (além de XMLs)</span>
        </label>

        <label class="field inline">
          <input type="checkbox" v-model="dryRun" />
          <span>Dry-run (simular, não cria nada)</span>
        </label>
      </div>

      <div class="row">
        <button :disabled="!canRun || running" @click="run">
          {{ running ? 'Processando...' : 'Iniciar migração' }}
        </button>
        <button class="btn-ghost" :disabled="running" @click="resetLog">Limpar log</button>
      </div>
    </section>

    <section class="card">
      <div class="status">
        <div><b>Status:</b> {{ status }}</div>
        <div class="muted">
          Copiados: {{ stats.copied }} | Pulados: {{ stats.skipped }} | Erros: {{ stats.errors }}
        </div>
      </div>

      <pre class="log">{{ log.join('\n') }}</pre>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const supported = typeof window !== 'undefined' && 'showDirectoryPicker' in window

const sourceHandle = ref(null)
const destHandle = ref(null)
const sourceName = ref('')
const destName = ref('')

const companies = ref([])
const selectedCompanies = ref(new Set())
const companyFilter = ref('')

const docType = ref('')
const includePdfs = ref(false)
const dryRun = ref(false)

const running = ref(false)
const status = ref('Aguardando')
const log = ref([])
const stats = ref({ copied: 0, skipped: 0, errors: 0 })

const filteredCompanies = computed(() => {
  const q = companyFilter.value.toLowerCase()
  return companies.value.filter((c) => c.toLowerCase().includes(q))
})

const canRun = computed(() => {
  return (
    supported &&
    !!sourceHandle.value &&
    !!destHandle.value &&
    !!docType.value &&
    selectedCompanies.value.size > 0
  )
})

function addLog(line) {
  log.value.unshift(`[${new Date().toLocaleTimeString()}] ${line}`)
}
function resetLog() {
  log.value = []
}

async function pickSource() {
  sourceHandle.value = await window.showDirectoryPicker({ mode: 'read' })
  sourceName.value = sourceHandle.value.name
  addLog(`Origem selecionada: ${sourceName.value}`)

  companies.value = (await listDirNames(sourceHandle.value)).sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  )
  selectedCompanies.value = new Set()
  addLog(`Pastas de empresa encontradas: ${companies.value.length}`)
}

async function pickDest() {
  destHandle.value = await window.showDirectoryPicker({ mode: 'readwrite' })
  destName.value = destHandle.value.name
  addLog(`Destino selecionado: ${destName.value}`)
}

function toggleCompany(name) {
  const s = new Set(selectedCompanies.value)
  if (s.has(name)) s.delete(name)
  else s.add(name)
  selectedCompanies.value = s
}
function selectAllFiltered() {
  const s = new Set(selectedCompanies.value)
  for (const c of filteredCompanies.value) s.add(c)
  selectedCompanies.value = s
}
function clearSelection() {
  selectedCompanies.value = new Set()
}

function isHex24(s) {
  return /^[0-9a-f]{24}$/i.test(s)
}

function safeName(s, { upper = false } = {}) {
  let x = (s ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
  x = x.replace(/[\\/:*?"<>|]/g, ' ')
  x = x.replace(/\s+/g, ' ').trim()
  return upper ? x.toUpperCase() : x
}

function companyUpperFromFolder(folderName) {
  const parts = folderName.split('_').filter(Boolean)
  const last = parts.at(-1)
  const base = isHex24(last) ? parts.slice(0, -1) : parts
  return safeName(base.join(' '), { upper: true })
}

const isYear = (n) => /^\d{4}$/.test(n)
const isMonth = (n) => /^(0?[1-9]|1[0-2])$/.test(n)
const pad2 = (m) => (String(m).length === 1 ? `0${m}` : String(m))
const normER = (n) =>
  n?.toLowerCase() === 'emitida' ? 'Emitida' : n?.toLowerCase() === 'recebida' ? 'Recebida' : null
const normStatus = (n) =>
  n?.toLowerCase() === 'autorizada'
    ? 'Autorizada'
    : n?.toLowerCase() === 'cancelada'
      ? 'Cancelada'
      : null

async function* iterDir(dirHandle) {
  for await (const [name, handle] of dirHandle.entries()) yield { name, handle }
}

async function getDir(parent, name, create = false) {
  return await parent.getDirectoryHandle(name, { create })
}

async function listDirNames(dirHandle) {
  const out = []
  for await (const { name, handle } of iterDir(dirHandle)) {
    if (handle.kind === 'directory') out.push(name)
  }
  return out
}

async function listFiles(dirHandle) {
  const out = []
  for await (const { name, handle } of iterDir(dirHandle)) {
    if (handle.kind === 'file') out.push({ name, handle })
  }
  return out
}

async function dirExists(parent, name) {
  try {
    await parent.getDirectoryHandle(name, { create: false })
    return true
  } catch {
    return false
  }
}

async function fileExists(parentDir, fileName) {
  try {
    await parentDir.getFileHandle(fileName, { create: false })
    return true
  } catch {
    return false
  }
}

async function getUniqueFileHandle(destDir, fileName) {
  if (!(await fileExists(destDir, fileName))) {
    return await destDir.getFileHandle(fileName, { create: true })
  }
  const dot = fileName.lastIndexOf('.')
  const base = dot >= 0 ? fileName.slice(0, dot) : fileName
  const ext = dot >= 0 ? fileName.slice(dot) : ''
  let i = 1
  while (await fileExists(destDir, `${base} (${i})${ext}`)) i++
  return await destDir.getFileHandle(`${base} (${i})${ext}`, { create: true })
}

async function getDestDirHandle(parts) {
  if (dryRun.value) return null // não cria nada
  let cur = destHandle.value
  for (const p of parts) cur = await getDir(cur, p, true)
  return cur
}

async function copyFileToDest(srcFileHandle, destDirHandle, fileName) {
  if (dryRun.value) {
    stats.value.copied++
    return
  }

  const file = await srcFileHandle.getFile()
  const outHandle = await getUniqueFileHandle(destDirHandle, fileName)
  const writable = await outHandle.createWritable()
  await writable.write(file)
  await writable.close()
  stats.value.copied++
}

async function run() {
  running.value = true
  status.value = 'Iniciando...'
  stats.value = { copied: 0, skipped: 0, errors: 0 }
  log.value = []

  try {
    const DOC = safeName(docType.value, { upper: true })
    const selected = Array.from(selectedCompanies.value)

    status.value = `Processando ${selected.length} empresa(s)...`

    for (const companyFolder of selected) {
      const companyDir = await getDir(sourceHandle.value, companyFolder, false)
      const companyUpper = companyUpperFromFolder(companyFolder)

      const years = (await listDirNames(companyDir)).filter(isYear).sort()
      if (!years.length) {
        stats.value.skipped++
        addLog(`Sem anos em: ${companyFolder}`)
        continue
      }

      for (const year of years) {
        const yearDir = await getDir(companyDir, year, false)
        const months = (await listDirNames(yearDir))
          .filter(isMonth)
          .sort((a, b) => Number(a) - Number(b))

        for (const month of months) {
          const monthDir = await getDir(yearDir, month, false)
          const monthChildren = await listDirNames(monthDir)

          for (const erName of monthChildren) {
            const ER = normER(erName)
            if (!ER) continue

            const erDir = await getDir(monthDir, erName, false)

            // Pode existir: Emitida/Autorizada/xmls ... OU Emitida/xmls direto
            const erChildren = await listDirNames(erDir)
            const statuses = erChildren.map(normStatus).filter(Boolean)

            const baseParts = [companyUpper, year, pad2(month), DOC, ER]

            if (statuses.length) {
              for (const st of statuses) {
                const stDir = await getDir(erDir, st, false)

                // XMLS
                if (await dirExists(stDir, 'xmls')) {
                  const xmlSrc = await getDir(stDir, 'xmls', false)
                  const xmlFiles = await listFiles(xmlSrc)
                  const xmlDest = await getDestDirHandle([...baseParts, st, 'XMLS'])

                  for (const f of xmlFiles) {
                    try {
                      await copyFileToDest(f.handle, xmlDest, f.name)
                    } catch (e) {
                      stats.value.errors++
                      addLog(`Erro XML: ${companyUpper}/${year}/${month}/${ER}/${st}/${f.name}`)
                    }
                  }
                }

                // PDFS (opcional)
                if (includePdfs.value && (await dirExists(stDir, 'pdfs'))) {
                  const pdfSrc = await getDir(stDir, 'pdfs', false)
                  const pdfFiles = await listFiles(pdfSrc)
                  const pdfDest = await getDestDirHandle([...baseParts, st, 'PDFS'])

                  for (const f of pdfFiles) {
                    try {
                      await copyFileToDest(f.handle, pdfDest, f.name)
                    } catch (e) {
                      stats.value.errors++
                      addLog(`Erro PDF: ${companyUpper}/${year}/${month}/${ER}/${st}/${f.name}`)
                    }
                  }
                }
              }
            } else {
              // Sem status (Emitida/xmls direto)
              if (await dirExists(erDir, 'xmls')) {
                const xmlSrc = await getDir(erDir, 'xmls', false)
                const xmlFiles = await listFiles(xmlSrc)
                const xmlDest = await getDestDirHandle([...baseParts, 'XMLS'])

                for (const f of xmlFiles) {
                  try {
                    await copyFileToDest(f.handle, xmlDest, f.name)
                  } catch (e) {
                    stats.value.errors++
                    addLog(`Erro XML: ${companyUpper}/${year}/${month}/${ER}/${f.name}`)
                  }
                }
              }

              if (includePdfs.value && (await dirExists(erDir, 'pdfs'))) {
                const pdfSrc = await getDir(erDir, 'pdfs', false)
                const pdfFiles = await listFiles(pdfSrc)
                const pdfDest = await getDestDirHandle([...baseParts, 'PDFS'])

                for (const f of pdfFiles) {
                  try {
                    await copyFileToDest(f.handle, pdfDest, f.name)
                  } catch (e) {
                    stats.value.errors++
                    addLog(`Erro PDF: ${companyUpper}/${year}/${month}/${ER}/${f.name}`)
                  }
                }
              }
            }
          }
        }
      }

      addLog(`Finalizado: ${companyUpper}`)
    }

    status.value = dryRun.value ? 'Concluído (dry-run)' : 'Concluído'
    addLog(
      `Resumo: copiados=${stats.value.copied}, pulados=${stats.value.skipped}, erros=${stats.value.errors}`,
    )
  } catch (e) {
    status.value = 'Erro'
    addLog(e?.message ?? String(e))
  } finally {
    running.value = false
  }
}
</script>

<style scoped>
.page {
  max-width: 980px;
  margin: 24px auto;
  padding: 0 14px;
  font-family:
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial;
}
.header h2 {
  margin: 0 0 6px;
}
.muted {
  color: #666;
}
.error {
  color: #b00020;
}
.card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 14px;
  margin-top: 14px;
  background: #fff;
}
.row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.form {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}
.field {
  display: grid;
  gap: 6px;
}
.field.inline {
  display: flex;
  gap: 10px;
  align-items: center;
}
.input {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 360px;
}
button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #222;
  background: #222;
  color: #fff;
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-ghost {
  background: transparent;
  color: #222;
}
.companies {
  margin-top: 12px;
  border-top: 1px dashed #ddd;
  padding-top: 12px;
}
.companies-head {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.companies-list {
  margin-top: 10px;
  max-height: 260px;
  overflow: auto;
  display: grid;
  gap: 8px;
  padding-right: 6px;
}
.chk {
  display: grid;
  grid-template-columns: 18px auto 18px auto;
  gap: 10px;
  align-items: center;
}
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  font-size: 12px;
}
.status {
  display: grid;
  gap: 6px;
  margin-bottom: 10px;
}
.log {
  background: #0f0f10;
  color: #ddd;
  padding: 12px;
  border-radius: 10px;
  min-height: 220px;
  white-space: pre-wrap;
  overflow: auto;
}
</style>
