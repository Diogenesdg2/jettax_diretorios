<!-- src/views/MigradorNotas.vue -->
<template>
  <div class="page">
    <header class="header">
      <h2>Migrador de Notas</h2>
      <p class="muted">
        Origem pode ser <b>Diretório</b> (já descompactado) ou <b>ZIP</b>. As empresas devem estar
        em <b>NOTAS/{empresa}/...</b>. (Cópia; não apaga nada.)
      </p>
      <p v-if="!supported" class="error">
        Seu navegador não suporta <code>showDirectoryPicker</code> /
        <code>showOpenFilePicker</code>. Use Chrome/Edge.
      </p>
    </header>

    <section class="card">
      <div class="row">
        <b>Origem:</b>

        <label class="radio">
          <input type="radio" value="dir" v-model="sourceMode" :disabled="running" />
          <span>Diretório</span>
        </label>

        <label class="radio">
          <input type="radio" value="zip" v-model="sourceMode" :disabled="running" />
          <span>ZIP</span>
        </label>
      </div>

      <div class="row" style="margin-top: 10px">
        <button
          v-if="sourceMode === 'dir'"
          :disabled="!supported || running"
          @click="pickSourceDir"
        >
          Selecionar pasta (ORIGEM)
        </button>

        <button v-else :disabled="!supported || running" @click="pickZip">
          Selecionar ZIP (ORIGEM)
        </button>

        <div class="muted" v-if="sourceLabel">
          Origem: <b>{{ sourceLabel }}</b>
          <span v-if="sourceNotasLabel">
            | NOTAS: <b>{{ sourceNotasLabel }}</b></span
          >
        </div>
      </div>

      <!-- ZIP: exibir TOTAL de XMLs das empresas selecionadas -->
      <div v-if="sourceMode === 'zip' && zipMeta.loaded" class="muted" style="margin-top: 6px">
        XMLs das empresas selecionadas: <b>{{ zipSelectedXmlCount }}</b>
      </div>

      <div v-if="companies.length" class="companies">
        <div class="companies-head">
          <b>Empresas</b>
          <span class="muted"
            >({{ selectedCompanies.size }}/{{ filteredCompanies.length }} marcadas)</span
          >

          <input v-model.trim="companyFilter" placeholder="filtrar..." class="input" />

          <button type="button" class="btn-ghost" @click="selectAllFiltered" :disabled="running">
            Marcar filtradas
          </button>
          <button type="button" class="btn-ghost" @click="clearSelection" :disabled="running">
            Limpar
          </button>
        </div>

        <div class="companies-list">
          <label v-for="c in filteredCompanies" :key="c" class="chk">
            <input
              type="checkbox"
              :checked="selectedCompanies.has(c)"
              @change="toggleCompany(c)"
              :disabled="running"
            />
            <span class="mono">{{ c }}</span>
            <span class="muted">→</span>
            <span>{{ companyUpperFromFolder(c) }}</span>
          </label>
        </div>
      </div>

      <div class="row" style="margin-top: 14px">
        <button :disabled="!supported || running" @click="pickDest">
          Selecionar pasta DESTINO
        </button>
        <div class="muted" v-if="destName">
          Destino: <b>{{ destName }}</b>
        </div>
      </div>

      <div class="form">
        <label class="field">
          <span>Tipo de documento</span>
          <input
            v-model.trim="docType"
            placeholder="Ex.: NFE, NFSE, CTE"
            class="input"
            :disabled="running"
          />
        </label>

        <label class="field inline">
          <input type="checkbox" v-model="includePdfs" :disabled="running" />
          <span>Incluir PDFs (além de XMLs)</span>
        </label>

        <label class="field inline">
          <input type="checkbox" v-model="skipIfExists" :disabled="running" />
          <span>Pular se já existir no destino</span>
        </label>

        <label class="field inline">
          <input type="checkbox" v-model="dryRun" :disabled="running" />
          <span>Dry-run (simular, não cria nada)</span>
        </label>
      </div>

      <div class="row">
        <button :disabled="!canRun || running" @click="run">
          {{ running ? 'Processando...' : 'Iniciar migração' }}
        </button>

        <button class="btn-ghost" :disabled="running" @click="resetLog">Limpar log</button>

        <button
          class="btn-ghost"
          :disabled="running || skippedItems.length === 0"
          @click="downloadSkipped('csv')"
        >
          Baixar pulados (CSV)
        </button>

        <button
          class="btn-ghost"
          :disabled="running || skippedItems.length === 0"
          @click="downloadSkipped('json')"
        >
          Baixar pulados (JSON)
        </button>

        <span class="muted" v-if="skippedItems.length"
          >Relatório: <b>{{ skippedItems.length }}</b> item(ns)</span
        >
        <span class="muted" v-if="skipTruncated"
          >(limitado a <b>{{ MAX_SKIPS }}</b
          >)</span
        >
      </div>
    </section>

    <section class="card">
      <div class="status">
        <div><b>Status:</b> {{ status }}</div>
        <div class="muted">
          Copiados: {{ stats.copied }} | Pulados (sem PDFs): {{ stats.skipped }} | Erros:
          {{ stats.errors }}
        </div>

        <!-- VISUAL (pós-migração): empresas com diretórios vazios -->
        <div v-if="emptyDirCompaniesSorted.length" class="muted" style="margin-top: 6px">
          <b>Empresas com diretórios vazios (itens pulados):</b>
          {{ emptyDirCompaniesSorted.join(', ') }}
        </div>
      </div>

      <pre class="log">{{ log.join('\n') }}</pre>
    </section>

    <!-- Modal de conclusão -->
    <div v-if="showDoneModal" class="modal-backdrop" @click.self="closeDoneModal">
      <div class="modal">
        <h3>Concluído</h3>
        <p class="muted">{{ doneMessage }}</p>

        <div v-if="emptyDirCompaniesSorted.length" style="margin-top: 10px">
          <b>Empresas com diretórios vazios (itens pulados):</b>
          <ul style="margin: 8px 0 0; padding-left: 18px">
            <li v-for="c in emptyDirCompaniesSorted" :key="c">{{ c }}</li>
          </ul>
        </div>

        <div class="modal-actions">
          <button
            class="btn-ghost"
            :disabled="skippedItems.length === 0"
            @click="downloadSkipped('csv')"
          >
            Baixar pulados (CSV)
          </button>
          <button
            class="btn-ghost"
            :disabled="skippedItems.length === 0"
            @click="downloadSkipped('json')"
          >
            Baixar pulados (JSON)
          </button>
          <button @click="closeDoneModal">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import JSZip from 'jszip'

const supported =
  typeof window !== 'undefined' && 'showDirectoryPicker' in window && 'showOpenFilePicker' in window

const sourceMode = ref('dir') // "dir" | "zip"

// --- origem DIR
const sourceDirHandle = ref(null)
const sourceNotasHandle = ref(null)
const sourceDirName = ref('')
const sourceNotasName = ref('')

// --- origem ZIP
const zipName = ref('')
const zipEntries = ref([]) // [{ path, zipObj }]
const zipMeta = ref({ loaded: false, filesCount: 0, rootPrefix: 'NOTAS' })

// ZIP: contagem de XMLs por empresa + total selecionado
const zipXmlCountByCompany = ref({}) // { [companyFolder]: number }
const zipXmlTotal = ref(0)
const zipSelectedXmlCount = computed(() => {
  if (sourceMode.value !== 'zip' || !zipMeta.value.loaded) return 0
  const map = zipXmlCountByCompany.value || {}
  let sum = 0
  for (const c of selectedCompanies.value) sum += map[c] || 0
  return sum
})

// --- destino
const destHandle = ref(null)
const destName = ref('')

// --- seleção
const companies = ref([])
const selectedCompanies = ref(new Set())
const companyFilter = ref('')

const docType = ref('')
const includePdfs = ref(false)
const dryRun = ref(false)

// --- performance / re-cópia
const skipIfExists = ref(true)

// Concorrência fixa (oculta)
const concurrency = ref(10)

// --- modal conclusão
const showDoneModal = ref(false)
const doneMessage = ref('')
function closeDoneModal() {
  showDoneModal.value = false
}

// --- relatório visual: empresas com diretórios vazios (itens pulados)
const emptyDirCompanies = ref([]) // array única
const emptyDirCompaniesSorted = computed(() =>
  [...emptyDirCompanies.value].sort((a, b) => a.localeCompare(b, 'pt-BR')),
)

// caches destino
const destDirCache = new Map() // "A/B/C" -> FileSystemDirectoryHandle
const destFilesCache = new Map() // "A/B/C" -> Set(fileNames)
const fileLocks = new Map() // "A/B/C|file.xml" -> Promise queue

const running = ref(false)
const status = ref('Aguardando')
const log = ref([])
const stats = ref({ copied: 0, skipped: 0, errors: 0 })

// --- relatório de pulados
const MAX_SKIPS = 50000
const skippedItems = ref([]) // { when, mode, reason, sourcePath, kind }
const skipTruncated = computed(() => skippedItems.value.length >= MAX_SKIPS)

const filteredCompanies = computed(() => {
  const q = companyFilter.value.toLowerCase()
  return companies.value.filter((c) => c.toLowerCase().includes(q))
})

const sourceLabel = computed(() =>
  sourceMode.value === 'dir' ? sourceDirName.value || '' : zipName.value || '',
)
const sourceNotasLabel = computed(() =>
  sourceMode.value !== 'dir' ? '' : sourceNotasName.value || '',
)

const canRun = computed(() => {
  const hasSource =
    sourceMode.value === 'dir'
      ? !!sourceNotasHandle.value
      : zipMeta.value.loaded && zipEntries.value.length > 0

  return (
    supported &&
    hasSource &&
    companies.value.length > 0 &&
    selectedCompanies.value.size > 0 &&
    !!destHandle.value &&
    !!docType.value
  )
})

watch(sourceMode, () => {
  companies.value = []
  selectedCompanies.value = new Set()
  companyFilter.value = ''

  sourceDirHandle.value = null
  sourceNotasHandle.value = null
  sourceDirName.value = ''
  sourceNotasName.value = ''

  zipName.value = ''
  zipEntries.value = []
  zipMeta.value = { loaded: false, filesCount: 0, rootPrefix: 'NOTAS' }
  zipXmlCountByCompany.value = {}
  zipXmlTotal.value = 0

  status.value = 'Aguardando'
  log.value = []
  stats.value = { copied: 0, skipped: 0, errors: 0 }
  skippedItems.value = []
  emptyDirCompanies.value = []

  destDirCache.clear()
  destFilesCache.clear()
  fileLocks.clear()

  showDoneModal.value = false
  doneMessage.value = ''
})

// -------- helpers UI/log
function addLog(line) {
  log.value.unshift(`[${new Date().toLocaleTimeString()}] ${line}`)
}
function resetLog() {
  log.value = []
}

// -------- normalização nomes/estrutura
function isHex24(s) {
  return /^[0-9a-f]{24}$/i.test(s)
}
function safeName(s, { upper = false } = {}) {
  let x = (s ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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

function extractCompanyUpperFromNotasPath(p) {
  const norm = String(p || '').replaceAll('\\', '/')
  const idx = norm.toUpperCase().indexOf('NOTAS/')
  if (idx === -1) return null
  const rest = norm.slice(idx + 'NOTAS/'.length)
  const folder = rest.split('/').filter(Boolean)[0]
  return folder ? companyUpperFromFolder(folder) : null
}

function markEmptyDirCompanyFromSourcePath(sourcePath) {
  const c = extractCompanyUpperFromNotasPath(sourcePath)
  if (!c) return
  if (!emptyDirCompanies.value.includes(c)) emptyDirCompanies.value.push(c)
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

// -------- relatório skip (não contar PDFs em stats.skipped)
function addSkip({ mode, reason, sourcePath, kind = 'other' }) {
  if (kind !== 'pdf') stats.value.skipped++ // <- NÃO conta PDFs
  if (skippedItems.value.length < MAX_SKIPS) {
    skippedItems.value.push({
      when: new Date().toISOString(),
      mode,
      reason,
      sourcePath,
      kind,
    })
  }

  // relatório visual: empresa com diretório vazio
  const r = String(reason || '').toLowerCase()
  if (r.includes('vazia') || r.includes('vazio')) {
    markEmptyDirCompanyFromSourcePath(sourcePath)
  }
}

function kindFromPath(p) {
  const l = String(p || '').toLowerCase()
  if (l.endsWith('.pdf')) return 'pdf'
  if (l.endsWith('.xml')) return 'xml'
  return 'other'
}

// -------- download relatório
function toCsvRow(values) {
  return values.map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')
}
function downloadSkipped(format = 'csv') {
  const base = `relatorio-pulados-${new Date().toISOString().replaceAll(':', '-')}`
  let blob, filename

  if (format === 'json') {
    blob = new Blob([JSON.stringify(skippedItems.value, null, 2)], { type: 'application/json' })
    filename = `${base}.json`
  } else {
    const header = toCsvRow(['when', 'mode', 'kind', 'reason', 'sourcePath'])
    const lines = skippedItems.value.map((x) =>
      toCsvRow([x.when, x.mode, x.kind, x.reason, x.sourcePath]),
    )
    blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
    filename = `${base}.csv`
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// -------- seleção empresas
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

// -------- concorrência e locks
async function parallelForEach(items, worker, conc = 4) {
  const n = Math.max(1, Math.min(16, Number(conc) || 1))
  let i = 0
  const runners = Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++
      await worker(items[idx], idx)
    }
  })
  await Promise.all(runners)
}

async function withFileLock(lockKey, fn) {
  const prev = fileLocks.get(lockKey) || Promise.resolve()
  let release
  const cur = new Promise((r) => (release = r))
  fileLocks.set(lockKey, cur)
  await prev
  try {
    return await fn()
  } finally {
    release()
    if (fileLocks.get(lockKey) === cur) fileLocks.delete(lockKey)
  }
}

// -------- FS helpers
async function* iterDir(dirHandle) {
  for await (const [name, handle] of dirHandle.entries()) yield { name, handle }
}
async function getDir(parent, name, create = false) {
  return await parent.getDirectoryHandle(name, { create })
}
async function dirExists(parent, name) {
  try {
    await parent.getDirectoryHandle(name, { create: false })
    return true
  } catch {
    return false
  }
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

// -------- destino: cache de diretórios e arquivos
function pathKey(parts) {
  return parts.join('/')
}

async function getDestDirCached(parts) {
  const key = pathKey(parts)
  if (dryRun.value) return { dir: null, key }

  const cached = destDirCache.get(key)
  if (cached) return { dir: cached, key }

  let cur = destHandle.value
  for (const p of parts) cur = await cur.getDirectoryHandle(p, { create: true })

  destDirCache.set(key, cur)
  return { dir: cur, key }
}

async function destHasFile(dirHandle, dirKey, fileName) {
  let set = destFilesCache.get(dirKey)
  if (!set) {
    set = new Set()
    destFilesCache.set(dirKey, set)
  }
  if (set.has(fileName)) return true

  try {
    await dirHandle.getFileHandle(fileName, { create: false })
    set.add(fileName)
    return true
  } catch {
    return false
  }
}

function markDestFile(dirKey, fileName) {
  let set = destFilesCache.get(dirKey)
  if (!set) {
    set = new Set()
    destFilesCache.set(dirKey, set)
  }
  set.add(fileName)
}

// -------- copiar: DIR -> destino (com checagem de "já existe")
async function copyFileToDest(srcFileHandle, destParts, fileName, sourcePathForReport, kind) {
  const k = kind || (String(fileName).toLowerCase().endsWith('.pdf') ? 'pdf' : 'xml')
  const { dir, key } = await getDestDirCached(destParts)
  const lockKey = `${key}|${fileName}`

  return await withFileLock(lockKey, async () => {
    if (!dryRun.value && skipIfExists.value) {
      const exists = await destHasFile(dir, key, fileName)
      if (exists) {
        addSkip({
          mode: 'dir',
          reason: 'Já existe no destino',
          sourcePath: sourcePathForReport,
          kind: k,
        })
        return
      }
    }

    if (dryRun.value) {
      stats.value.copied++
      return
    }

    const file = await srcFileHandle.getFile()
    const outHandle = await dir.getFileHandle(fileName, { create: true })
    const writable = await outHandle.createWritable()
    await file.stream().pipeTo(writable)

    markDestFile(key, fileName)
    stats.value.copied++
  })
}

// -------- pickers
async function pickDest() {
  destHandle.value = await window.showDirectoryPicker({ mode: 'readwrite' })
  destName.value = destHandle.value.name
  addLog(`Destino selecionado: ${destName.value}`)
}

async function pickSourceDir() {
  const dir = await window.showDirectoryPicker({ mode: 'read' })
  sourceDirHandle.value = dir
  sourceDirName.value = dir.name

  let notas = dir
  if (await dirExists(dir, 'NOTAS')) notas = await getDir(dir, 'NOTAS', false)

  sourceNotasHandle.value = notas
  sourceNotasName.value = notas === dir ? dir.name : 'NOTAS'

  addLog(`Origem (dir): ${sourceDirName.value}`)
  addLog(`Usando pasta NOTAS: ${sourceNotasName.value}`)

  companies.value = (await listDirNames(sourceNotasHandle.value)).sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  )
  selectedCompanies.value = new Set()
  addLog(`Empresas encontradas: ${companies.value.length}`)
}

// -------- ZIP helpers
function normalizeZipPath(p) {
  return (p ?? '').replace(/\\/g, '/').replace(/^\/+/, '')
}
function stripNotasPrefix(p) {
  const x = normalizeZipPath(p)
  return x.toUpperCase().startsWith('NOTAS/') ? x.slice('NOTAS/'.length) : x
}
function extLower(p) {
  const m = p.toLowerCase().match(/\.([a-z0-9]+)$/)
  return m ? m[1] : ''
}
function isXmlFile(p) {
  return extLower(p) === 'xml'
}
function isPdfFile(p) {
  return extLower(p) === 'pdf'
}
function includesSeg(pathNorm, seg) {
  return pathNorm.toLowerCase().split('/').includes(seg.toLowerCase())
}

async function pickZip() {
  const [handle] = await window.showOpenFilePicker({
    multiple: false,
    types: [{ description: 'ZIP', accept: { 'application/zip': ['.zip'] } }],
  })

  const file = await handle.getFile()
  zipName.value = file.name

  status.value = 'Lendo ZIP...'
  addLog(`ZIP selecionado: ${file.name}`)

  const zip = await JSZip.loadAsync(file)

  const entries = []
  const paths = []

  zip.forEach((relativePath, zipObj) => {
    if (zipObj.dir) return
    const p = normalizeZipPath(relativePath)
    entries.push({ path: p, zipObj })
    paths.push(p)
  })

  const hasNotas = paths.some((p) => normalizeZipPath(p).toUpperCase().startsWith('NOTAS/'))
  if (!hasNotas) throw new Error('ZIP inválido: esperado conteúdo dentro de "NOTAS/".')

  zipMeta.value = { loaded: true, filesCount: entries.length, rootPrefix: 'NOTAS' }
  zipEntries.value = entries

  // calcular XMLs por empresa (somente dentro de xmls/ e .xml)
  const counts = {}
  let total = 0
  for (const e of entries) {
    const p = normalizeZipPath(e.path)
    if (!p.toUpperCase().startsWith('NOTAS/')) continue

    const p2 = stripNotasPrefix(p)
    const parts = p2.split('/').filter(Boolean)
    const companyFolder = parts[0]
    if (!companyFolder) continue

    if (includesSeg(p, 'xmls') && isXmlFile(p)) {
      counts[companyFolder] = (counts[companyFolder] || 0) + 1
      total++
    }
  }
  zipXmlCountByCompany.value = counts
  zipXmlTotal.value = total

  const set = new Set()
  for (const e of entries) {
    const p2 = stripNotasPrefix(e.path)
    const parts = p2.split('/').filter(Boolean)
    if (parts[0]) set.add(parts[0])
  }

  companies.value = Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  selectedCompanies.value = new Set()
  companyFilter.value = ''

  status.value = 'ZIP carregado. Selecione empresas e o destino.'
  addLog(`Empresas encontradas em NOTAS/: ${companies.value.length}`)
  addLog(`Total de XMLs no ZIP (todas empresas): ${zipXmlTotal.value}`)
}

// -------- RUN (DIR)
async function runFromDir() {
  const DOC = safeName(docType.value, { upper: true })
  const selected = Array.from(selectedCompanies.value)
  status.value = `Processando ${selected.length} empresa(s) (dir)...`

  for (const companyFolder of selected) {
    const companyUpper = companyUpperFromFolder(companyFolder)

    let companyDir
    try {
      companyDir = await getDir(sourceNotasHandle.value, companyFolder, false)
    } catch {
      addSkip({
        mode: 'dir',
        reason: 'Pasta da empresa não encontrada dentro de NOTAS/',
        sourcePath: `NOTAS/${companyFolder}`,
        kind: 'other',
      })
      continue
    }

    const years = (await listDirNames(companyDir)).filter(isYear).sort()
    if (!years.length) {
      addSkip({
        mode: 'dir',
        reason: 'Empresa sem pastas de ano (YYYY)',
        sourcePath: `NOTAS/${companyFolder}`,
        kind: 'other',
      })
      continue
    }

    for (const year of years) {
      const yearDir = await getDir(companyDir, year, false)
      const months = (await listDirNames(yearDir))
        .filter(isMonth)
        .sort((a, b) => Number(a) - Number(b))
      if (!months.length) {
        addSkip({
          mode: 'dir',
          reason: 'Ano sem pastas de mês válidas (01-12)',
          sourcePath: `NOTAS/${companyFolder}/${year}`,
          kind: 'other',
        })
        continue
      }

      for (const month of months) {
        const monthDir = await getDir(yearDir, month, false)
        const monthChildren = await listDirNames(monthDir)

        const hasEmitReceb = monthChildren.some((n) => !!normER(n))
        if (!hasEmitReceb) {
          addSkip({
            mode: 'dir',
            reason: 'Mês sem "Emitida" ou "Recebida"',
            sourcePath: `NOTAS/${companyFolder}/${year}/${month}`,
            kind: 'other',
          })
          continue
        }

        for (const erName of monthChildren) {
          const ER = normER(erName)
          if (!ER) continue

          const erDir = await getDir(monthDir, erName, false)
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

                if (!xmlFiles.length) {
                  addSkip({
                    mode: 'dir',
                    reason: 'Pasta xmls vazia',
                    sourcePath: `NOTAS/${companyFolder}/${year}/${month}/${erName}/${st}/xmls`,
                    kind: 'xml',
                  })
                } else {
                  const destParts = [...baseParts, st, 'XMLS']
                  await parallelForEach(
                    xmlFiles,
                    async (f) => {
                      try {
                        await copyFileToDest(
                          f.handle,
                          destParts,
                          f.name,
                          `NOTAS/${companyFolder}/${year}/${month}/${erName}/${st}/xmls/${f.name}`,
                          'xml',
                        )
                      } catch {
                        stats.value.errors++
                        addLog(`Erro XML: ${companyUpper}/${year}/${month}/${ER}/${st}/${f.name}`)
                      }
                    },
                    concurrency.value,
                  )
                }
              } else {
                addSkip({
                  mode: 'dir',
                  reason: 'Pasta xmls não encontrada',
                  sourcePath: `NOTAS/${companyFolder}/${year}/${month}/${erName}/${st}/xmls`,
                  kind: 'xml',
                })
              }

              // PDFS
              if (includePdfs.value) {
                if (await dirExists(stDir, 'pdfs')) {
                  const pdfSrc = await getDir(stDir, 'pdfs', false)
                  const pdfFiles = await listFiles(pdfSrc)

                  if (!pdfFiles.length) {
                    addSkip({
                      mode: 'dir',
                      reason: 'Pasta pdfs vazia',
                      sourcePath: `NOTAS/${companyFolder}/${year}/${month}/${erName}/${st}/pdfs`,
                      kind: 'pdf',
                    })
                  } else {
                    const destParts = [...baseParts, st, 'PDFS']
                    await parallelForEach(
                      pdfFiles,
                      async (f) => {
                        try {
                          await copyFileToDest(
                            f.handle,
                            destParts,
                            f.name,
                            `NOTAS/${companyFolder}/${year}/${month}/${erName}/${st}/pdfs/${f.name}`,
                            'pdf',
                          )
                        } catch {
                          stats.value.errors++
                          addLog(`Erro PDF: ${companyUpper}/${year}/${month}/${ER}/${st}/${f.name}`)
                        }
                      },
                      concurrency.value,
                    )
                  }
                } else {
                  addSkip({
                    mode: 'dir',
                    reason: 'Pasta pdfs não encontrada',
                    sourcePath: `NOTAS/${companyFolder}/${year}/${month}/${erName}/${st}/pdfs`,
                    kind: 'pdf',
                  })
                }
              }
            }
          } else {
            // Sem status (Emitida/xmls direto)
            if (await dirExists(erDir, 'xmls')) {
              const xmlSrc = await getDir(erDir, 'xmls', false)
              const xmlFiles = await listFiles(xmlSrc)

              if (!xmlFiles.length) {
                addSkip({
                  mode: 'dir',
                  reason: 'Pasta xmls vazia',
                  sourcePath: `NOTAS/${companyFolder}/${year}/${month}/${erName}/xmls`,
                  kind: 'xml',
                })
              } else {
                const destParts = [...baseParts, 'XMLS']
                await parallelForEach(
                  xmlFiles,
                  async (f) => {
                    try {
                      await copyFileToDest(
                        f.handle,
                        destParts,
                        f.name,
                        `NOTAS/${companyFolder}/${year}/${month}/${erName}/xmls/${f.name}`,
                        'xml',
                      )
                    } catch {
                      stats.value.errors++
                      addLog(`Erro XML: ${companyUpper}/${year}/${month}/${ER}/${f.name}`)
                    }
                  },
                  concurrency.value,
                )
              }
            } else {
              addSkip({
                mode: 'dir',
                reason: 'Pasta xmls não encontrada',
                sourcePath: `NOTAS/${companyFolder}/${year}/${month}/${erName}/xmls`,
                kind: 'xml',
              })
            }

            if (includePdfs.value) {
              if (await dirExists(erDir, 'pdfs')) {
                const pdfSrc = await getDir(erDir, 'pdfs', false)
                const pdfFiles = await listFiles(pdfSrc)

                if (!pdfFiles.length) {
                  addSkip({
                    mode: 'dir',
                    reason: 'Pasta pdfs vazia',
                    sourcePath: `NOTAS/${companyFolder}/${year}/${month}/${erName}/pdfs`,
                    kind: 'pdf',
                  })
                } else {
                  const destParts = [...baseParts, 'PDFS']
                  await parallelForEach(
                    pdfFiles,
                    async (f) => {
                      try {
                        await copyFileToDest(
                          f.handle,
                          destParts,
                          f.name,
                          `NOTAS/${companyFolder}/${year}/${month}/${erName}/pdfs/${f.name}`,
                          'pdf',
                        )
                      } catch {
                        stats.value.errors++
                        addLog(`Erro PDF: ${companyUpper}/${year}/${month}/${ER}/${f.name}`)
                      }
                    },
                    concurrency.value,
                  )
                }
              } else {
                addSkip({
                  mode: 'dir',
                  reason: 'Pasta pdfs não encontrada',
                  sourcePath: `NOTAS/${companyFolder}/${year}/${month}/${erName}/pdfs`,
                  kind: 'pdf',
                })
              }
            }
          }
        }
      }
    }

    addLog(`Finalizado: ${companyUpper}`)
  }
}

// -------- RUN (ZIP)
function parseZipEntry(entryPath) {
  const pathNorm = normalizeZipPath(entryPath)
  if (!pathNorm.toUpperCase().startsWith('NOTAS/'))
    return { ok: false, reason: 'Fora da raiz "NOTAS/"' }

  const p = stripNotasPrefix(pathNorm)
  const parts = p.split('/').filter(Boolean)
  if (parts.length < 4) return { ok: false, reason: 'Caminho curto / estrutura incompleta' }

  const companyFolder = parts[0]

  let iYear = -1
  for (let i = 1; i < parts.length - 1; i++) {
    if (isYear(parts[i]) && isMonth(parts[i + 1])) {
      iYear = i
      break
    }
  }
  if (iYear === -1) return { ok: false, reason: 'Ano/mês inválidos ou não encontrados no caminho' }

  const year = parts[iYear]
  const month = parts[iYear + 1]

  let iER = -1
  let ER = null
  for (let i = iYear + 2; i < parts.length; i++) {
    const er = normER(parts[i])
    if (er) {
      iER = i
      ER = er
      break
    }
  }
  if (iER === -1) return { ok: false, reason: 'Não contém "Emitida" ou "Recebida"' }

  const maybeStatus = parts[iER + 1]
  const ST = normStatus(maybeStatus)

  const inXmls = includesSeg(pathNorm, 'xmls')
  const inPdfs = includesSeg(pathNorm, 'pdfs')
  const isXml = inXmls && isXmlFile(pathNorm)
  const isPdf = inPdfs && isPdfFile(pathNorm)

  if (inPdfs && !includePdfs.value && isPdfFile(pathNorm))
    return { ok: false, reason: 'PDF ignorado (opção Incluir PDFs desmarcada)' }

  if (!isXml && !isPdf) {
    if (inXmls) return { ok: false, reason: 'Dentro de xmls/, mas não é .xml' }
    if (inPdfs) return { ok: false, reason: 'Dentro de pdfs/, mas não é .pdf (ou PDFs desativado)' }
    return { ok: false, reason: 'Não está em "xmls" ou "pdfs" esperado' }
  }

  const leaf = isXml ? 'XMLS' : 'PDFS'

  const companyUpper = companyUpperFromFolder(companyFolder)
  const DOC = safeName(docType.value, { upper: true })

  const base = [companyUpper, year, pad2(month), DOC, ER]
  const destParts = ST ? [...base, ST, leaf] : [...base, leaf]

  const fileName = parts.at(-1)
  return { ok: true, destParts, fileName, kind: isXml ? 'xml' : 'pdf' }
}

async function runFromZip() {
  const selected = new Set(selectedCompanies.value)

  const tasks = []
  for (const e of zipEntries.value) {
    const p2 = stripNotasPrefix(e.path)
    const parts0 = p2.split('/').filter(Boolean)
    const companyFolder = parts0[0]
    if (!companyFolder || !selected.has(companyFolder)) continue

    const parsed = parseZipEntry(e.path)
    if (!parsed.ok) {
      addSkip({
        mode: 'zip',
        reason: parsed.reason,
        sourcePath: e.path,
        kind: kindFromPath(e.path),
      })
      continue
    }

    tasks.push({
      sourcePath: e.path,
      zipObj: e.zipObj,
      destParts: parsed.destParts,
      fileName: parsed.fileName,
      kind: parsed.kind,
    })
  }

  status.value = `Processando ${tasks.length} arquivo(s) (zip)...`

  await parallelForEach(
    tasks,
    async (t) => {
      try {
        const { dir, key } = await getDestDirCached(t.destParts)
        const lockKey = `${key}|${t.fileName}`

        await withFileLock(lockKey, async () => {
          if (!dryRun.value && skipIfExists.value) {
            const exists = await destHasFile(dir, key, t.fileName)
            if (exists) {
              addSkip({
                mode: 'zip',
                reason: 'Já existe no destino',
                sourcePath: t.sourcePath,
                kind: t.kind,
              })
              return
            }
          }

          if (dryRun.value) {
            stats.value.copied++
            return
          }

          const bytes = await t.zipObj.async('uint8array')
          const outHandle = await dir.getFileHandle(t.fileName, { create: true })
          const writable = await outHandle.createWritable()
          await writable.write(bytes)
          await writable.close()

          markDestFile(key, t.fileName)
          stats.value.copied++
        })
      } catch {
        stats.value.errors++
        addLog(`Erro extraindo: ${t.sourcePath}`)
      }
    },
    concurrency.value,
  )
}

// -------- RUN (dispatcher)
async function run() {
  running.value = true
  status.value = 'Iniciando...'
  stats.value = { copied: 0, skipped: 0, errors: 0 }
  log.value = []
  skippedItems.value = []
  emptyDirCompanies.value = []

  destDirCache.clear()
  destFilesCache.clear()
  fileLocks.clear()

  showDoneModal.value = false
  doneMessage.value = ''

  try {
    addLog(`Modo origem: ${sourceMode.value === 'dir' ? 'Diretório' : 'ZIP'}`)
    addLog(`Tipo documento: ${safeName(docType.value, { upper: true })}`)
    addLog(
      `PDFs: ${includePdfs.value ? 'SIM' : 'NÃO'} | Pular se existe: ${skipIfExists.value ? 'SIM' : 'NÃO'} | Dry-run: ${
        dryRun.value ? 'SIM' : 'NÃO'
      }`,
    )

    if (sourceMode.value === 'dir') await runFromDir()
    else await runFromZip()

    status.value = dryRun.value ? 'Concluído (dry-run)' : 'Concluído'
    const resumo = `Copiados: ${stats.value.copied} | Pulados (sem PDFs): ${stats.value.skipped} | Erros: ${stats.value.errors}`
    addLog(
      `Resumo: copiados=${stats.value.copied}, pulados(sem pdf)=${stats.value.skipped}, erros=${stats.value.errors}`,
    )

    doneMessage.value = resumo
    showDoneModal.value = true
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

.radio {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  user-select: none;
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

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 16px;
}
.modal {
  width: min(560px, 100%);
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 14px;
}
.modal h3 {
  margin: 0 0 8px;
}
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-top: 12px;
}
</style>
